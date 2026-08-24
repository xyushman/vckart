/* eslint-disable @typescript-eslint/no-explicit-any */
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
      description: "One of: PRODUCT_SEARCH, FILTER_UPDATE, SELECT_PRODUCT, ADD_TO_LIST, COMPARE_PRODUCTS, CLARIFICATION_REQUIRED, SUGGEST_ADDITIONS, UNKNOWN"
    },
    category: { type: SchemaType.STRING, nullable: true },
    searchQuery: { type: SchemaType.STRING, nullable: true },
    filters: {
      type: SchemaType.OBJECT,
      properties: {
        brand: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, nullable: true },
        maxPrice: { type: SchemaType.NUMBER, nullable: true },
        type: { type: SchemaType.STRING, nullable: true },
        size: { type: SchemaType.STRING, nullable: true },
        color: { type: SchemaType.STRING, nullable: true }
      },
      nullable: true
    },
    quantity: { type: SchemaType.INTEGER, nullable: true },
    unit: { type: SchemaType.STRING, nullable: true },
    sort: { type: SchemaType.STRING, description: "price_asc, price_desc, best_value, relevance", nullable: true },
    selectedProductId: { type: SchemaType.NUMBER, description: "ID of the product if the user explicitly selected one from the current results", nullable: true },
    clarificationOptions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "If intent is CLARIFICATION_REQUIRED, provide a short list of options the user can tap (e.g. ['Under ₹500', '₹500-₹1000'] or ['Red', 'Blue'])",
      nullable: true
    },
    suggestedItems: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "If intent is SUGGEST_ADDITIONS, list items to suggest.",
      nullable: true
    },
    replyMessage: {
      type: SchemaType.STRING,
      description: "Conversational response (e.g., 'I found 8 options. Do you have a color preference?'). MUST be in the user's language."
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

    const currentState = session.state as Record<string, any>;

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
1. If the user's query is broad (e.g., "Find me shoes"), set intent=CLARIFICATION_REQUIRED and ask a clarifying question in 'replyMessage' (e.g., "What kind of shoes? Running or casual?"). Set 'clarificationOptions' to a list of likely choices.
2. If they ask to "compare the top two", set intent=COMPARE_PRODUCTS.
3. If they ask for the "best one" or "best value", set sort="best_value".
4. If they say "Add it", set intent=ADD_TO_LIST.
5. If they say "I'm making pasta", set intent=SUGGEST_ADDITIONS and suggest missing ingredients in 'suggestedItems'.
6. ALWAYS respond conversationally in 'replyMessage' in the user's language (Multilingual support).
7. If intent is CLARIFICATION_REQUIRED, you must provide 'clarificationOptions'.
    `;

    let text;
    try {
      const result = await model.generateContent(prompt);
      text = result.response.text();
    } catch (e: any) {
      if (e.message?.includes('429') || e.message?.includes('quota') || e.message?.includes('exceeded')) {
        // --- Fallback NLP Engine (Regex Heuristics) ---
        // If Gemini fails, we gracefully degrade to local regex pattern matching
        const lowerText = transcript.toLowerCase();
        let fallbackIntent = "PRODUCT_SEARCH";
        let fallbackQuery = transcript;
        let fallbackMessage = "I'm operating in offline mode due to high traffic, but here is what I found.";
        
        if (lowerText.includes('add')) {
          fallbackIntent = "ADD_TO_LIST";
          fallbackMessage = "I'm in offline mode due to high traffic, but I've added that to your list!";
        } else if (lowerText.includes('compare')) {
          fallbackIntent = "COMPARE_PRODUCTS";
          fallbackMessage = "Here is a quick comparison for you (Offline Mode).";
        }
        
        // Basic entity extraction
        const priceMatch = lowerText.match(/under (\d+)/);
        let maxPrice = null;
        if (priceMatch) {
           maxPrice = parseInt(priceMatch[1]);
           fallbackQuery = fallbackQuery.replace(priceMatch[0], '').trim();
        }

        // Clean up text
        fallbackQuery = fallbackQuery.replace(/^(add|show me|find|search for|i need|looking for)\s+a?\s*/i, '').trim();

        text = JSON.stringify({
          intent: fallbackIntent,
          searchQuery: fallbackQuery,
          filters: maxPrice ? { maxPrice } : {},
          replyMessage: fallbackMessage,
          awaitingInput: false
        });
      } else {
        throw e;
      }
    }
    let parsedState;
    try {
      parsedState = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    // Merge state (Keep existing query if not overridden)
    const newState = {
      ...currentState,
      ...parsedState,
      filters: { ...(currentState.filters || {}), ...(parsedState.filters || {}) }
    };

    let searchResults: Record<string, any>[] = [];
    let finalMessage = parsedState.replyMessage;

    // Execute Actions based on Intent
    if (['PRODUCT_SEARCH', 'FILTER_UPDATE', 'CLARIFICATION_REQUIRED', 'COMPARE_PRODUCTS'].includes(newState.intent)) {
      const searchWhere: Record<string, any> = {};
      if (newState.searchQuery) searchWhere.name = { contains: newState.searchQuery, mode: 'insensitive' };
      if (newState.filters?.maxPrice) searchWhere.price = { lte: newState.filters.maxPrice };
      
      // Fetch products including StoreListings for cross-store capability
      let rawResults = await prisma.product.findMany({ 
        where: searchWhere,
        include: { StoreListings: true },
        take: 50 
      });

      // Filter by dynamic JSON attributes (e.g., brand, type, size)
      if (newState.filters) {
        if (newState.filters.brand?.length > 0) {
          rawResults = rawResults.filter(p => {
            const attrs = p.attributes as Record<string, any>;
            return attrs && attrs.brand && newState.filters.brand.some((b:string) => attrs.brand.toLowerCase().includes(b.toLowerCase()));
          });
        }
        if (newState.filters.type) {
          rawResults = rawResults.filter(p => {
            const attrs = p.attributes as Record<string, any>;
            return attrs && attrs.type && attrs.type.toLowerCase().includes(newState.filters.type.toLowerCase());
          });
        }
      }

      // Sort
      if (newState.sort === 'price_asc') rawResults.sort((a, b) => a.price - b.price);
      if (newState.sort === 'price_desc') rawResults.sort((a, b) => b.price - a.price);
      if (newState.sort === 'best_value') {
         // Best Value Intelligence Algorithm: (Rating * 10) - (Price / 100) + (ReviewCount / 1000)
         rawResults.sort((a, b) => {
            const scoreA = ((a.rating || 3) * 10) - (a.price / 100) + ((a.reviewCount || 0) / 1000);
            const scoreB = ((b.rating || 3) * 10) - (b.price / 100) + ((b.reviewCount || 0) / 1000);
            return scoreB - scoreA;
         });
      }

      searchResults = rawResults.slice(0, 10);
      
      // Only append search count if we are actually searching/filtering, not just clarifying vaguely
      if (newState.intent !== 'CLARIFICATION_REQUIRED' && !finalMessage.includes(searchResults.length.toString())) {
         finalMessage = `I found ${searchResults.length} options for ${newState.searchQuery || 'that'}. ${searchResults.length > 0 ? 'Would you like to refine your search?' : ''}`;
      }
      
      newState.currentResults = searchResults;
    }

    if (newState.intent === 'ADD_TO_LIST' || newState.intent === 'SELECT_PRODUCT') {
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
         }
       } else if (newState.searchQuery || transcript.toLowerCase().includes('add')) {
          // Robust Fallback: Add raw arbitrary items to list if no specific product was matched
          const rawName = newState.searchQuery || transcript.replace(/add/i, '').trim();
          await prisma.shoppingListItem.create({
              data: {
                sessionId,
                rawProductName: rawName,
                category: 'Added Manually',
                quantity: newState.quantity || 1,
                unit: newState.unit || 'item'
              }
          });
          finalMessage = `Added ${rawName} to your list.`;
       }
       
       // Clear search state after adding
       newState.searchQuery = null;
       newState.filters = {};
       newState.currentResults = [];
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

  } catch (error: unknown) {
    console.error("Error processing conversation:", error);
    return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 });
  }
}
