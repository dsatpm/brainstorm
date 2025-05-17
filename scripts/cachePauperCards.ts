import { connectToDatabase } from '../lib/db.js';
import axios from 'axios';

const SCRYFALL_BULK_ENDPOINT = 'https://api.scryfall.com/bulk-data';

async function fetchBulkCardUrl(): Promise<string> {
  const res = await axios.get(SCRYFALL_BULK_ENDPOINT);
  const bulk = res.data.data.find((d: any) => d.type === 'default_cards');
  return bulk.download_uri;
}

async function cachePauperCards() {
  const { db } = await connectToDatabase();
  const url = await fetchBulkCardUrl();

  const res = await axios.get(url);
  const allCards = res.data;

  const pauperCommons = allCards.filter(
    (card: any) =>
      card.rarity === 'common' && card.legalities?.pauper === 'legal'
  ).map((card: any) => ({
    cardId: card.id,
    name: card.name,
    manaCost: card.mana_cost,
    typeLine: card.type_line,
    oracleText: card.oracle_text,
    setName: card.set_name,
    rarity: card.rarity,
    legalities: card.legalities,
    prices: card.prices,
    imageUris: card.image_uris,
  }));

  await db.collection('cards').deleteMany({});
  await db.collection('cards').insertMany(pauperCommons);

  console.log(`✅ Cached ${pauperCommons.length} Pauper commons`);
}

cachePauperCards().catch(console.error);
