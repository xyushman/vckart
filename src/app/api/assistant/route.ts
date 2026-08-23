import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// The schema returned by Gemini representing the updated conversation state
const stateSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    intent: {
      type: SchemaType.STRING,
      description: "One of: PRODUCT_SEARCH, FILTER_UPDATE, SELECT_PRODUCT, ADD_TO_LIST, UNKNOWN"
    },
    category: { type: SchemaType.STRING, nullable: true },
    searchQuery: { type: SchemaType.STRING, nullable: true },
    filters: {
      type: SchemaType.OBJECT,
      properties: {
        brand: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, nullable: true },
        maxPrice: { type: SchemaType.NUMBER, nullable: true },
        type: { type: SchemaType.STRING, nullable: true },
        size: { type: SchemaType.STRING, nullable: true }
      },
      nullable: true
    },
    quantity: { type: SchemaType.INTEGER, nullable: true },
    unit: { type: SchemaType.STRING, nullable: true },
    sort: { type: SchemaType.STRING, description: "price_asc, price_desc, relevance", nullable: true },
    selectedProductId: { type: SchemaType.NUMBER, description: "ID of the product if the user explicitly selected one from the current results", nullable: true },
    replyMessage: {
      type: SchemaType.STRING,
      description: "Conversational response (e.g., 'I found 8 options. What would you like to refine?'). MUST be in the user's language."
    },
    awaitingInput: { type: SchemaType.BOOLEAN, description: "True if waiting for user to select or refine." }
  },
  required: ["intent", "replyMessage", "awaitingInput"]
};

export async function POST(req: Request) {
  try {
    const { transcript, sessionId } = await req.json();

    if (!transcript || !sessionId) {
      return NextResponse.json({ error: 'Missing transcript or sessionId' }, { status: 400 });
    }

    if (!genAI) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    // Load existing session state
    let session = await prisma.conversationSession.findUnique({ where: { sessionId } });
    if (!session) {
      session = await prisma.conversationSession.create({
        data: { sessionId, state: {} }
      });
    }

    const currentState = session.state as any;

    // Ask Gemini to understand context and update state
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json', responseSchema: stateSchema }
    });

    const prompt = `
You are a Multi-Turn Conversational Shopping Assistant.
Merge the user's new utterance with their existing conversation state.

Existing State: ${JSON.stringify(currentState)}
User's New Utterance: "${transcript}"

Rules:
1. If they say "I need sugar", set intent=PRODUCT_SEARCH, searchQuery="sugar".
2. If they say "Under 250", KEEP existing searchQuery="sugar" and add filters.maxPrice=250.
3. If they say "Choose the first one", set intent=SELECT_PRODUCT and infer selectedProductId from context if possible (leave null if unknown, the UI handles index selection natively but API can try).
4. If they say "Add it", set intent=ADD_TO_LIST.
5. You MUST respond conversationally in 'replyMessage' (e.g., "I found some options. Want to filter by brand?").
6. If they ask to search, DO NOT automatically select or add. Just search and wait.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    let parsedState;
    try {
      parsedState = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    // Merge state (Keep existing query if not overridden)
    const newState = {
      ...currentState,
      ...parsedState,
      filters: { ...(currentState.filters || {}), ...(parsedState.filters || {}) }
    };

    let searchResults: any[] = [];
    let finalMessage = parsedState.replyMessage;

    // Execute Actions based on Intent
    if (newState.intent === 'PRODUCT_SEARCH' || newState.intent === 'FILTER_UPDATE') {
      const searchWhere: any = {};
      if (newState.searchQuery) searchWhere.name = { contains: newState.searchQuery, mode: 'insensitive' };
      if (newState.filters?.maxPrice) searchWhere.price = { lte: newState.filters.maxPrice };
      
      // Dynamic JSON attribute filtering (PostgreSQL JSON path queries are complex, we'll do simple filtering in memory for MVP)
      let rawResults = await prisma.product.findMany({ 
        where: searchWhere,
        take: 50 
      });

      // Filter by dynamic JSON attributes (e.g., brand, type, size)
      if (newState.filters) {
        if (newState.filters.brand?.length > 0) {
          rawResults = rawResults.filter(p => {
            const attrs = p.attributes as any;
            return attrs && attrs.brand && newState.filters.brand.some((b:string) => attrs.brand.toLowerCase().includes(b.toLowerCase()));
          });
        }
        if (newState.filters.type) {
          rawResults = rawResults.filter(p => {
            const attrs = p.attributes as any;
            return attrs && attrs.type && attrs.type.toLowerCase().includes(newState.filters.type.toLowerCase());
          });
        }
      }

      // Sort
      if (newState.sort === 'price_asc') rawResults.sort((a, b) => a.price - b.price);
      if (newState.sort === 'price_desc') rawResults.sort((a, b) => b.price - a.price);

      searchResults = rawResults.slice(0, 10);
      
      // Update message if Gemini didn't know the exact count
      if (!finalMessage.includes(searchResults.length.toString())) {
         finalMessage = `I found ${searchResults.length} options for ${newState.searchQuery || 'that'}. ${searchResults.length > 0 ? 'Would you like to refine by brand or price?' : ''}`;
      }
      
      newState.currentResults = searchResults;
    }

    if (newState.intent === 'ADD_TO_LIST' || newState.intent === 'SELECT_PRODUCT') {
       // Logic to add to DB list
       // For this MVP step, we will rely on the UI passing the exact productId in a separate call if needed,
       // or we add the first result if selectedProductId is null
       let prodId = newState.selectedProductId;
       if (!prodId && currentState.currentResults?.length > 0) {
          prodId = currentState.currentResults[0].id;
       }

       if (prodId) {
         const matchedProduct = await prisma.product.findUnique({ where: { id: Number(prodId) } });
         if (matchedProduct) {
            await prisma.shoppingListItem.create({
              data: {
                sessionId,
                productId: matchedProduct.id,
                rawProductName: matchedProduct.name,
                category: matchedProduct.category || 'Uncategorized',
                quantity: newState.quantity || 1,
                unit: newState.unit || 'item'
              }
            });
            finalMessage = `Added ${matchedProduct.name} to your list.`;
            // Clear search state after adding
            newState.searchQuery = null;
            newState.filters = {};
            newState.currentResults = [];
         }
       }
    }

    // Save updated state
    await prisma.conversationSession.update({
      where: { sessionId },
      data: { state: newState }
    });

    // Save Message to History
    await prisma.conversationMessage.create({
      data: { sessionId, role: 'user', message: transcript }
    });
    await prisma.conversationMessage.create({
      data: { sessionId, role: 'assistant', message: finalMessage, intent: newState.intent, metadata: newState }
    });

    return NextResponse.json({ 
      action: newState.intent, 
      message: finalMessage, 
      state: newState,
      results: searchResults 
    });

  } catch (error: any) {
    console.error("Error processing conversation:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
