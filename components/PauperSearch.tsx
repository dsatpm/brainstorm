'use client'

import { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'

interface Card {
  id: string;
  name: string;
  image_uris?: {
    normal: string;
  };
  card_faces?: Array<{
    image_uris?: {
      normal: string;
    };
  }>;
}

export default function PauperSearch() {
  const [query, setQuery] = useState('')
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Use the unified /api/cards endpoint
      const res = await axios.get('/api/cards', {
        params: { name: query },
      });
      // Scryfall API returns { data: Card[] }
      setCards(res.data.data || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input
          className="border rounded px-4 py-2 w-full"
          placeholder="Search for any Pauper-legal card..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {loading && <p>Searching...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => {
          const image =
            card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal

          return (
            <div key={card.id} className="text-center">
              {image && (
                <Image
                  src={image}
                  alt={card.name}
                  width={223} // Scryfall normal size
                  height={310}
                  className="rounded shadow-md mx-auto"
                />
              )}
              <p className="mt-2 font-semibold">{card.name}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
