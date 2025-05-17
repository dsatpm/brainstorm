import { NextResponse } from "next/server";

// Mock data for demonstration; replace with real news integration as needed
const news = [
  { id: "1", title: "Pauper Banned & Restricted Update", link: "https://magic.wizards.com/en/news/announcements/pauper-banned-update" },
  { id: "2", title: "Top 8 Pauper Decks of the Month", link: "https://www.mtggoldfish.com/articles/top-8-pauper-decks" },
  { id: "3", title: "Pauper Format Panel Q&A", link: "https://www.channelfireball.com/article/pauper-panel-qa" },
];

export async function GET() {
  return NextResponse.json(news);
}
