import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { GoogleGenerativeAI, Schema, SchemaType } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const intentSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    intent: {
      type: SchemaType.STRING,
      description: "One of: ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY, VIEW_LIST, CLEAR_LIST, SEARCH_PRODUCT, GET_RECOMMENDATIONS, UNKNOWN",
    },
    product: {
      type: SchemaType.STRING,
      description: "The name of the product",
      nullable: true
    },
    quantity: {
      type: SchemaType.INTEGER,
      description: "The quantity of the product",
      nullable: true
    },
    unit: {
      type: SchemaType.STRING,
      description: "The unit of the product (e.g., liter, bottle, kg)",
      nullable: true
    },
    attributes: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Attributes like 'organic', 'unsweetened'",
      nullable: true
    },
    maxPrice: {
      type: SchemaType.NUMBER,
      description: "Maximum price constraint if mentioned",
      nullable: true
    }
  },
  required: ["intent"],
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

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: intentSchema,
      }
    });

    const prompt = `
You are a Voice Command Shopping Assistant.
Parse the following user voice transcript into a structured JSON intent.
Transcript: "${transcript}"

Normalize units to singular standard forms (e.g., 'bottles' -> 'bottle', 'kgs' -> 'kg').
If the intent is not clear, return UNKNOWN.
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

    const { intent, product, quantity, unit } = parsedIntent;
    let message = 'Command not understood.';
    let actionTaken = intent;

    switch (intent) {
      case 'ADD_ITEM':
        if (!product) {
          message = 'What product do you want to add?';
          break;
        }
        // Match product in DB (simple substring match)
        const matchedProduct = await prisma.product.findFirst({
          where: { name: { contains: product } }
        });

        await prisma.shoppingListItem.create({
          data: {
            sessionId,
            productId: matchedProduct?.id || null,
            rawProductName: product,
            quantity: quantity || 1,
            unit: unit || 'item'
          }
        });
        message = `Added ${quantity || 1} ${unit || ''} ${product} to your list.`;
        break;

      case 'REMOVE_ITEM':
        if (!product) {
          message = 'What product do you want to remove?';
          break;
        }
        // Find latest matching item
        const itemToRemove = await prisma.shoppingListItem.findFirst({
          where: { sessionId, rawProductName: { contains: product } },
          orderBy: { createdAt: 'desc' }
        });
        if (itemToRemove) {
          await prisma.shoppingListItem.delete({ where: { id: itemToRemove.id } });
          message = `Removed ${product} from your list.`;
        } else {
          message = `I couldn't find ${product} on your list.`;
        }
        break;

      case 'CLEAR_LIST':
        await prisma.shoppingListItem.deleteMany({ where: { sessionId } });
        message = 'Cleared your shopping list.';
        break;

      case 'SEARCH_PRODUCT':
      case 'GET_RECOMMENDATIONS':
      case 'VIEW_LIST':
      case 'UPDATE_QUANTITY':
      case 'UNKNOWN':
      default:
        message = `Received intent ${intent}, but it is not fully implemented yet in MVP.`;
        break;
    }

    // Return the updated list alongside the message
    const updatedList = await prisma.shoppingListItem.findMany({
      where: { sessionId },
      include: { product: true }
    });

    return NextResponse.json({ action: actionTaken, message, list: updatedList });

  } catch (error: any) {
    console.error("Error processing voice command:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
