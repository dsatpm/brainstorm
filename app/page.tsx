import Image from "next/image";
import { searchPauperCards } from "../lib/scryfall";

interface Card {
  id: string;
  name: string;
  type_line: string;
  mana_cost: string;
  image_uris: {
    png: string;
    normal: string;
    small: string;
    large: string;
  };
}

interface Deck {
  id: string;
  name: string;
  description: string;
}

interface NewsItem {
  id: string;
  title: string;
  link: string;
}

interface Tournament {
  id: string;
  name: string;
  date: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function fetchDecks(): Promise<Deck[]> {
  const res = await fetch(`${baseUrl}/api/decks`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch decks");
  return res.json();
}

async function fetchNews(): Promise<NewsItem[]> {
  const res = await fetch(`${baseUrl}/api/news`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
}

async function fetchTournaments(): Promise<Tournament[]> {
  const res = await fetch(`${baseUrl}/api/tournaments`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch tournaments");
  return res.json();
}

async function fetchCards(): Promise<Card[]> {
  return await searchPauperCards({ color: "red", type: "creature", cmc: 2 });
}

export default async function Home() {
  const [decks, news, tournaments] = await Promise.all([
    fetchDecks(),
    fetchNews(),
    fetchTournaments(),
  ]);
  const cards = await fetchCards();

  return (
    <main className="p-6 space-y-12">
      {/* Newest Decks Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Newest Decks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {decks.map((deck) => (
            <div key={deck.id} className="p-4 border rounded shadow">
              <h3 className="font-bold">{deck.name}</h3>
              <p>{deck.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Pauper News Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Latest Pauper News</h2>
        <ul className="list-disc pl-6">
          {news.map((item) => (
            <li key={item.id}>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Tournament Results Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Tournament Results</h2>
        <div className="space-y-2">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="p-4 border rounded shadow">
              <h3 className="font-bold">{tournament.name}</h3>
              <p>{tournament.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pauper Cards Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Pauper Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card: Card) => (
            <div key={card.id} className="p-4 rounded shadow">
              {card.image_uris && (
                <div className="relative w-full aspect-[3/4] mb-2">
                  <Image
                    src={card.image_uris.png}
                    alt={card.name}
                    fill
                    className="object-contain rounded"
                  />
                </div>
              )}
              <p className="text-sm text-gray-500">{card.type_line}</p>
              <p className="text-sm text-gray-500">{card.mana_cost}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
