import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import GoodGuyOne from "@/assets/p1.png";
import GoodGuyTwo from "@/assets/p2.png";
import GoodGuyThree from "@/assets/p3.png";
import GoodGuyFour from "@/assets/p4.png";
import BadGuyOne from "@/assets/e1.png";
import BadGuyTwo from "@/assets/e2.png";

export default function Home() {
  return (
    <main className="flex bg-homepage min-h-screen items-center justify-center bg-cover">
      <div className="flex w-full flex-col items-center justify-center gap-16 sm:gap-32">
        <span className="text-6xl mb-16 text-center">Catcher Game</span>
        <div className="flex flex-col bg-gray-900 bg-opacity-50 px-4 py-16 min-w-[350px]">
          <span className="text-3xl font-bold text-center mb-6">RULE:</span>
          <div className="grid grid-cols-2 sm:grid-cols-1">
            <div className="flex flex-col items-center sm:flex-row w-full col-span-1 bg-green-300 bg-opacity-60">
              <span className="text-lg text-gray-700 font-bold">
                Catch these!
              </span>
              <Image
                alt="gameImage"
                src={GoodGuyOne}
                className="max-w-[150px]"
              />
              <Image
                alt="gameImage"
                src={GoodGuyTwo}
                className="max-w-[150px]"
              />
              <Image
                alt="gameImage"
                src={GoodGuyThree}
                className="max-w-[150px]"
              />
              <Image
                alt="gameImage"
                src={GoodGuyFour}
                className="max-w-[150px]"
              />
            </div>
            <div className="flex flex-col items-center sm:flex-row w-full col-span-1 bg-red-400 bg-opacity-60">
              <span className="text-lg text-gray-700 font-bold">
                Dodge these!
              </span>
              <Image
                alt="gameImage"
                src={BadGuyOne}
                className="max-w-[150px]"
              />
              <Image
                alt="gameImage"
                src={BadGuyTwo}
                className="max-w-[150px]"
              />
            </div>
            {/* <p className="text-center text-3xl max-w-xl min-w-[350px]">
            You have 60s, <br />
            catch your friends, <br />
            avoid all the enemies, <br />
            That simple!
          </p> */}
          </div>
        </div>

        <div className="flex w-full flex-col sm:flex-row items-center justify-center gap-16">
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
