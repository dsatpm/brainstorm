// app/api/entries/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import type { DeckEntry } from '@/types/entry';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { deckId, cardId, quantity } = await req.json();

  if (!deckId || !cardId || typeof quantity !== 'number') {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }

  const { db } = await connectToDatabase();
  const result = await db.collection<DeckEntry>('entries').updateOne(
    {
      deckId: new ObjectId(deckId),
      cardId
    },
    {
      $set: { quantity },
    },
    { upsert: true }
  );

  return NextResponse.json({ updated: result.modifiedCount > 0, upserted: result.upsertedId });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const deckId = searchParams.get('deckId');
  if (!deckId) {
    return NextResponse.json({ error: 'Missing deckId' }, { status: 400 });
  }

  const { db } = await connectToDatabase();

  const entries = await db.collection('entries').aggregate([
    { $match: { deckId: new ObjectId(deckId) } },
    {
      $lookup: {
        from: 'cards',
        localField: 'cardId',
        foreignField: 'cardId',
        as: 'cardDetails'
      }
    },
    { $unwind: '$cardDetails' }
  ]).toArray();

  return NextResponse.json(entries);
}