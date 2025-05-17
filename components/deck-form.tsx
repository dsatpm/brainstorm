import React, { useState } from "react";
import type { Deck } from "./deck-list";

export interface DeckFormProps {
  initial?: Partial<Deck>;
  onSubmit: (deck: Omit<Deck, "id">) => void;
  onCancel: () => void;
}

export function DeckForm({ initial, onSubmit, onCancel }: DeckFormProps) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, description } as Omit<Deck, "id">);
      }}
    >
      <div>
        <label className="block font-semibold">Deck Name</label>
        <input
          className="border rounded px-3 py-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Description</label>
        <textarea
          className="border rounded px-3 py-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Save
        </button>
        <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
