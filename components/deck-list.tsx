import React from "react";

export interface Deck {
  id: string;
  name: string;
  description: string;
}

export interface DeckListProps {
  decks: Deck[];
  onEdit: (deck: Deck) => void;
  onDelete: (deckId: string) => void;
  onSelect: (deck: Deck) => void;
}

export function DeckList({ decks, onEdit, onDelete, onSelect }: DeckListProps) {
  return (
    <div className="space-y-2">
      {decks.map((deck) => (
        <div key={deck.id} className="flex items-center border rounded p-4 justify-between">
          <div className="flex-1 cursor-pointer" onClick={() => onSelect(deck)}>
            <div className="font-bold">{deck.name}</div>
            <div className="text-sm text-gray-500">{deck.description}</div>
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={() => onEdit(deck)}>
              Edit
            </button>
            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => onDelete(deck.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
