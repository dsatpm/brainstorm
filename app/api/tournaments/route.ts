import { NextResponse } from "next/server";

// Mock data for demonstration; replace with real tournament integration as needed
const tournaments = [
  { id: "1", name: "Paupergeddon Milan", date: "2025-04-20" },
  { id: "2", name: "MTGO Pauper Challenge", date: "2025-04-27" },
  { id: "3", name: "Local Pauper FNM", date: "2025-05-01" },
];

export async function GET() {
  return NextResponse.json(tournaments);
}
