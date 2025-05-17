
## 1. Connection & Configuration

```js
const { MongoClient, ObjectId } = require('mongodb');

// 1. Load URI from environment
const uri = process.env.MONGODB_URI;

// 2. Create client and connect
const client = new MongoClient(uri);
await client.connect();
const db = client.db('mtg-deck-builder');
```

- Enable `strict` mode in your driver configuration.
- Use TLS/SSL and credential storage via environment variables.

## 2. Collection Structure

| Collection | Purpose                                  | Unique Key    |
|------------|------------------------------------------|---------------|
| `users`    | Player profiles and preferences         | `email`       |
| `cards`    | Reference card metadata (fetched from API) | `cardId`    |
| `decks`    | User-created decks                       | composite: `userId` + `deckName` |
| `entries`  | Card instances within decks             | `deckId` + `cardId` |


### Sample Schemas

```js
// users
{
  _id: ObjectId,
  email: string,
  username: string,
  createdAt: Date
}

// decks
{
  _id: ObjectId,
  userId: ObjectId,
  deckName: string,
  format: string,       // e.g., 'Standard', 'Commander'
  createdAt: Date
}

// entries
{
  _id: ObjectId,
  deckId: ObjectId,
  cardId: string,
  quantity: number
}
```

## 3. Indexing Recommendations

```js
await db.collection('users').createIndex({ email: 1 }, { unique: true });
await db.collection('decks').createIndex({ userId: 1 });
await db.collection('entries').createIndex({ deckId: 1 });
```

- Use compound indexes for common queries.
- Consider TTL indexes on session or temporary collections.

## 4. Common Operations

### Create a New Deck
```js
await db.collection('decks').insertOne({
  userId: user._id,
  deckName: 'Gruul Aggro',
  format: 'Standard',
  createdAt: new Date()
});
```

### Add Card to Deck
```js
await db.collection('entries').updateOne(
  { deckId, cardId },
  { $inc: { quantity: 1 } },
  { upsert: true }
);
```

### List All Decks for a User
```js
const decks = await db.collection('decks')
  .find({ userId: user._id })
  .project({ _id: 0, deckName: 1, format: 1 })
  .toArray();
```

### Fetch Deck Contents
```js
const contents = await db.collection('entries').aggregate([
  { $match: { deckId } },
  { $lookup: {
      from: 'cards',
      localField: 'cardId',
      foreignField: 'cardId',
      as: 'cardDetails'
    }
  },
  { $unwind: '$cardDetails' }
]).toArray();
```

## 5. Validation & Transactions

- Use JSON Schema validation in MongoDB for decks and entries.
- Wrap multi-document updates (e.g., cloning decks) in transactions:
```js
const session = client.startSession();
await session.withTransaction(async () => {
  // insert deck, then entries
});
```

---

*Keep this guide handy to streamline MongoDB integration in your MTG deck builder!*

