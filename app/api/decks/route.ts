import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';
import type { Deck } from '@/types/deck';

// GET /api/decks - Get all decks for the current user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { db } = await connectToDatabase();

  const user = await db.collection('users').findOne({ email: session.user.email });
  if (!user) return NextResponse.json([], { status: 200 });

  const decks = await db.collection<Deck>('decks')
    .find({ userId: user._id.toString() })
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(decks);
}

// POST /api/decks - Create a new deck
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { db } = await connectToDatabase();
  const user = await db.collection('users').findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { deckName, format } = await req.json();

  if (!deckName || !format) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newDeck: Deck = {
    userId: user._id.toString(),
    deckName,
    format,
    createdAt: new Date()
  };

  const result = await db.collection('decks').insertOne(newDeck);
  return NextResponse.json({ ...newDeck, _id: result.insertedId });
}
