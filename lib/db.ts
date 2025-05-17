// lib/db.ts
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = 'mtg-deck-builder';

let client: MongoClient;
let db: Db;

// Use globalThis to preserve the connection in dev mode
declare global {
  let _mongoClient: MongoClient | undefined;
}

export const connectToDatabase = async () => {
  if (!global._mongoClient) {
    client = new MongoClient(uri);
    await client.connect();
    global._mongoClient = client;
  } else {
    client = global._mongoClient;
  }

  db = client.db(dbName);
  return { client, db };
};
