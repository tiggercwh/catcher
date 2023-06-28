"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex bg-homepage min-h-screen items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center">
        <span className="mb-16">Catcher Game</span>
        <div className="flex w-full flex-row items-center justify-center gap-16">
          <Link href="/catchergame">Start Game</Link>
          <Link href="/leaderboard">LeaderBoard</Link>
        </div>
      </div>
    </main>
  );
}
