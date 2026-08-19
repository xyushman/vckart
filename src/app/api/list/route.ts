import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  try {
    const list = await prisma.shoppingListItem.findMany({
      where: { sessionId },
      include: { product: true }
    });

    return NextResponse.json({ list });
  } catch (error: any) {
    console.error("Error fetching list:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
