"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function SessionNav() {
  const { data: session } = useSession();

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <Link href="/" className="text-lg font-bold">
        Brainstorm
      </Link>
      <div>
        {session ? (
          <>
            <span className="mr-4">Welcome, {session.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn()}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}