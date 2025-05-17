"use client";
import { useEffect, useState } from "react";
import { DeckList, Deck } from "../../components/deck-list";
import { DeckForm } from "../../components/deck-form";
import axios from "axios";

export default function Dashboard() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [editing, setEditing] = useState<Deck | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Deck | null>(null);

  useEffect(() => {
    fetchDecks();
  }, []);

  async function fetchDecks() {
    const res = await axios.get("/api/decks");
    setDecks(res.data);
  }

  async function handleCreate(deck: Omit<Deck, "id">) {
    // For demo, just add locally; replace with POST to API
    const newDeck = { ...deck, id: Date.now().toString() };
    setDecks((prev) => [...prev, newDeck]);
    setShowForm(false);
  }

  async function handleEdit(deck: Deck) {
    setEditing(deck);
    setShowForm(true);
  }

  async function handleUpdate(deck: Omit<Deck, "id">) {
    if (!editing) return;
    setDecks((prev) => prev.map((d) => (d.id === editing.id ? { ...d, ...deck } : d)));
    setEditing(null);
    setShowForm(false);
  }

  async function handleDelete(deckId: string) {
    setDecks((prev) => prev.filter((d) => d.id !== deckId));
  }

  function handleSelect(deck: Deck) {
    setSelected(deck);
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="mb-4 flex justify-between items-center">
        <span className="font-semibold">Your Decks</span>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          New Deck
        </button>
      </div>
      {showForm && (
        <DeckForm
          initial={editing || undefined}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={() => {
            setEditing(null);
            setShowForm(false);
          }}
        />
      )}
      <DeckList decks={decks} onEdit={handleEdit} onDelete={handleDelete} onSelect={handleSelect} />
      {selected && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <div className="font-bold">Selected Deck:</div>
          <div>{selected.name}</div>
          <div className="text-sm text-gray-500">{selected.description}</div>
        </div>
      )}
    </main>
  );
}