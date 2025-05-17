import { NextResponse } from "next/server";

const SCRYFALL_BASE_URL = "https://api.scryfall.com/cards/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const color = searchParams.get("color") || "";
  const type = searchParams.get("type") || "";
  const cmc = searchParams.get("cmc") || "";

  const query = `legal:paper+format:pauper+rarity:common${color ? "+color:" + color : ""}${type ? "+type:" + type : ""}${cmc ? "+cmc:" + cmc : ""}`;
  const url = `${SCRYFALL_BASE_URL}?q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        return NextResponse.json({ error: "Rate limit exceeded", retryAfter }, { status: 429 });
      }
      return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}