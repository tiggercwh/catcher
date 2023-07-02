import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex bg-homepage min-h-screen items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center gap-32">
        <span className="text-6xl mb-16">Catcher Game</span>
        <div className="bg-gray-900 bg-opacity-50 px-4 py-16">
          <p className="text-center text-3xl">
            You have 60s, <br />
            catch your friends, <br />
            avoid all the enemies, <br />
            That simple!
          </p>
        </div>
        <div className="flex w-full flex-row items-center justify-center gap-16">
          <Button className="p-8">
            <Link href="/catchergame" className="text-3xl">
              Play
            </Link>
          </Button>
          <Button className="p-8">
            <Link href="/leaderboard" className="text-3xl">
              Leaderboard
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
