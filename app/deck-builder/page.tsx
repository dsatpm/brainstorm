"use client";
import { useEffect, useState } from "react";
import { searchPauperCards } from "../../lib/scryfall";
import Image from "next/image";

interface Card {
  id: string;
  name: string;
  image_uris?: { normal: string };
  card_faces?: Array<{ image_uris?: { normal: string } }>;
  type_line?: string;
}

interface DeckEntry {
  card: Card;
  quantity: number;
}

export default function DeckBuilder() {
  const [available, setAvailable] = useState<Card[]>([]);
  const [deck, setDeck] = useState<DeckEntry[]>([]);
  const [search, setSearch] = useState("");
  const [dragged, setDragged] = useState<Card | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    fetchCards();
  }, []);

  async function fetchCards() {
    // For demo, fetch all red creatures
    const cards = await searchPauperCards({ color: "red", type: "creature" });
    setAvailable(cards);
  }

  function handleDragStart(card: Card) {
    setDragged(card);
  }

  function handleDrop() {
    if (!dragged) return;
    setDeck((prev) => {
      const idx = prev.findIndex((e) => e.card.id === dragged.id);
      if (idx !== -1) {
        // Max 4 copies except lands
        const isLand = dragged.type_line?.toLowerCase().includes("land");
        const max = isLand ? 99 : 4;
        if (prev[idx].quantity < max) {
          const updated = [...prev];
          updated[idx].quantity += 1;
          return updated;
        }
        return prev;
      }
      return [...prev, { card: dragged, quantity: 1 }];
    });
    setDragged(null);
  }

  function handleRemove(cardId: string) {
    setDeck((prev) => prev.filter((e) => e.card.id !== cardId));
  }

  function handleQuantity(cardId: string, delta: number) {
    setDeck((prev) =>
      prev.map((e) =>
        e.card.id === cardId
          ? {
              ...e,
              quantity: Math.max(
                1,
                e.quantity + delta,
                e.card.type_line?.toLowerCase().includes("land")
                  ? 1
                  : Math.min(e.quantity + delta, 4)
              ),
            }
          : e
      )
    );
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Deck Builder</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Card Pool */}
        <section className="flex-1">
          <h2 className="font-semibold mb-2">Available Cards</h2>
          <input
            className="border rounded px-3 py-2 w-full mb-2"
            placeholder="Search cards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {available
              .filter((c) =>
                c.name.toLowerCase().includes(search.toLowerCase())
              )
              .slice(0, visibleCount)
              .map((card) => {
                const image =
                  card.image_uris?.normal ||
                  card.card_faces?.[0]?.image_uris?.normal;
                return (
                  <div
                    key={card.id}
                    className="rounded p-2 cursor-grab"
                    draggable
                    onDragStart={() => handleDragStart(card)}
                  >
                    <div className="relative w-full aspect-[3/4] mb-2">
                      {image && (
                        <Image
                          src={image}
                          alt={card.name}
                          fill
                          className="mx-auto rounded"
                        />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-center mt-1">
                      {card.name}
                    </div>
                  </div>
                );
              })}
          </div>

          {visibleCount <
            available.filter((c) =>
              c.name.toLowerCase().includes(search.toLowerCase())
            ).length && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 20)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                See More
              </button>
            </div>
          )}
        </section>
        {/* Deck Area */}
        <section
          className="flex-1 border rounded p-4 min-h-[300px] bg-gray-50"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <h2 className="font-semibold text-black mb-2">Your Deck</h2>
          {deck.length === 0 && (
            <div className="text-gray-400">
              Drag cards here to add to your deck.
            </div>
          )}
          <ul className="space-y-2">
            {deck.map((entry) => (
              <li key={entry.card.id} className="flex items-center gap-2">
                <span className="font-mono text-gray-800 w-6 text-right">
                  {entry.quantity}x
                </span>
                <span className="flex-1 text-gray-900">{entry.card.name}</span>
                <button
                  className="bg-red-700 px-2 rounded"
                  onClick={() => handleQuantity(entry.card.id, -1)}
                  disabled={entry.quantity <= 1}
                >
                  -
                </button>
                <button
                  className="bg-green-700 px-2 rounded"
                  onClick={() => handleQuantity(entry.card.id, 1)}
                  disabled={
                    !entry.card.type_line?.toLowerCase().includes("land") &&
                    entry.quantity >= 4
                  }
                >
                  +
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleRemove(entry.card.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
