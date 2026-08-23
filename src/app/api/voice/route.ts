/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const actionSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    intent: {
      type: SchemaType.STRING,
      description: "One of: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, CLEAR_LIST, SEARCH_PRODUCT, UNKNOWN",
    },
    product: { type: SchemaType.STRING, description: "The name of the product", nullable: true },
    quantity: { type: SchemaType.INTEGER, description: "The quantity of the product", nullable: true },
    unit: { type: SchemaType.STRING, description: "The unit of the product (e.g., liter, bottle, kg)", nullable: true },
    attributes: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Attributes like 'organic', 'unsweetened'", nullable: true },
    maxPrice: { type: SchemaType.NUMBER, description: "Maximum price constraint if mentioned", nullable: true },
    category: { type: SchemaType.STRING, description: "The supermarket aisle/category of the product (e.g., 'Produce', 'Dairy').", nullable: true },
  },
  required: ["intent"],
};

const intentSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    actions: {
      type: SchemaType.ARRAY,
      items: actionSchema,
      description: "An array of independent actions extracted from the user's voice command. Supports multiple distinct intents in one sentence (e.g., 'Add milk and remove apples' = 2 actions)."
    },
    suggestions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "A list of 3-4 smart product suggestions or substitutes based on their current shopping list and this command.",
      nullable: true
    },
    replyMessage: {
      type: SchemaType.STRING,
      description: "A natural, conversational response confirming all actions (e.g., 'Added 2 milks and removed apples'). MUST be in the EXACT SAME LANGUAGE as the user's transcript."
    },
    requiresConfirmation: {
      type: SchemaType.BOOLEAN,
      description: "Set to true ONLY IF the user wants to CLEAR their entire list, to ensure we ask for confirmation first.",
      nullable: true
    }
  },
  required: ["actions", "replyMessage"],
};

export async function POST(req: Request) {
  try {
    const { transcript, sessionId, currentList = [], isConfirmed = false } = await req.json();

    if (!transcript || !sessionId) {
      return NextResponse.json({ error: 'Missing transcript or sessionId' }, { status: 400 });
    }

    if (!genAI) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: intentSchema,
      }
    });

    const prompt = `
You are a Voice Command Shopping Assistant.
Parse the following user voice transcript into a structured JSON array of actions.
Transcript: "${transcript}"

Current items in their shopping list: [${currentList.join(', ')}]
Is user confirming a destructive action? ${isConfirmed}

Instructions:
1. Parse the transcript into one or more discrete actions. For example, "Add milk and remove eggs" -> [{intent: 'ADD_ITEM'}, {intent: 'REMOVE_ITEM'}].
2. Normalize units to singular standard forms.
3. If intent is ADD_ITEM, infer the likely supermarket 'category'.
4. Provide 3-4 smart 'suggestions' for the user based on their command (e.g., seasonal items, smart substitutes like Almond Milk).
5. Generate 'replyMessage' in the EXACT language used in the transcript.
6. If the user asks to CLEAR or DELETE EVERYTHING, set 'requiresConfirmation' to true, unless 'isConfirmed' is true.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    let parsedIntent;
    try {
      parsedIntent = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse LLM response:", text);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const { actions, suggestions, replyMessage, requiresConfirmation } = parsedIntent;
    
    if (requiresConfirmation && !isConfirmed) {
      return NextResponse.json({
        action: 'REQUIRES_CONFIRMATION',
        message: replyMessage || 'Are you sure you want to do this?',
        list: [],
        suggestions: [],
        searchResults: []
      });
    }

    let searchResults: any[] = [];
    const mainIntent = actions.length > 0 ? actions[0].intent : 'UNKNOWN';

    // Process all actions sequentially
    for (const action of actions) {
      const { intent, product, quantity, unit, category, maxPrice } = action;

      switch (intent) {
        case 'ADD_ITEM':
          if (!product) break;
          const matchedProduct = await prisma.product.findFirst({
            where: { name: { contains: product } }
          });
          await prisma.shoppingListItem.create({
            data: {
              sessionId,
              productId: matchedProduct?.id || null,
              rawProductName: product,
              category: category || 'Uncategorized',
              quantity: quantity || 1,
              unit: unit || 'item'
            }
          });
          break;

        case 'REMOVE_ITEM':
          if (!product) break;
          const itemToRemove = await prisma.shoppingListItem.findFirst({
            where: { sessionId, rawProductName: { contains: product } },
            orderBy: { createdAt: 'desc' }
          });
          if (itemToRemove) {
            await prisma.shoppingListItem.delete({ where: { id: itemToRemove.id } });
          }
          break;

        case 'UPDATE_QUANTITY':
          if (!product || !quantity) break;
          const itemToUpdate = await prisma.shoppingListItem.findFirst({
            where: { sessionId, rawProductName: { contains: product } },
            orderBy: { createdAt: 'desc' }
          });
          if (itemToUpdate) {
            await prisma.shoppingListItem.update({
              where: { id: itemToUpdate.id },
              data: { quantity }
            });
          }
          break;

        case 'CLEAR_LIST':
          await prisma.shoppingListItem.deleteMany({ where: { sessionId } });
          break;

        case 'SEARCH_PRODUCT':
          const searchWhere: any = {};
          if (product) searchWhere.name = { contains: product };
          if (maxPrice) searchWhere.price = { lte: maxPrice };
          searchResults = await prisma.product.findMany({ 
            where: searchWhere,
            take: 10
          });
          break;
      }
    }

    const updatedList = await prisma.shoppingListItem.findMany({
      where: { sessionId },
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ 
      action: mainIntent, 
      message: replyMessage || 'Command processed.', 
      list: updatedList, 
      suggestions: suggestions || [],
      searchResults 
    });

  } catch (error: any) {
    console.error("Error processing voice command:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
