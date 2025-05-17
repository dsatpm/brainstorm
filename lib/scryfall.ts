import axios from 'axios'

const SCRYFALL_BASE = 'https://api.scryfall.com'

export interface CardSearchParams {
  name?: string;
  color?: string;
  type?: string;
  cmc?: number | string;
}

/**
 * Builds a Scryfall query string for Pauper-legal cards with optional filters.
 */
function buildPauperQuery(params: CardSearchParams): string {
  let query = 'legal:paper format:pauper rarity:common';
  if (params.color) query += ` color:${params.color}`;
  if (params.type) query += ` type:${params.type}`;
  if (params.cmc !== undefined) query += ` cmc:${params.cmc}`;
  if (params.name) query += ` ${params.name}`;
  return query;
}

/**
 * Search Pauper-legal cards using Scryfall API with optional filters.
 */
export const searchPauperCards = async (params: CardSearchParams) => {
  const query = buildPauperQuery(params);
  const url = `${SCRYFALL_BASE}/cards/search?q=${encodeURIComponent(query)}`;
  const response = await axios.get(url);
  return response.data.data;
};
