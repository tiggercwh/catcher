"use client";

import React from "react";
import useSWR from "swr";
import useSWRSubscription from "swr/subscription";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import mockParticipants from "./MOCK_DATA.json";

const participants = mockParticipants;

export default function LeaderBoard() {
  const { data: initialData, initialError } = useSWR(
    "http://127.0.0.1:3001/",
    (url) => {
      return fetch(url).then((res) => res.json());
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: liveData, socketError } = useSWRSubscription(
    "ws://127.0.0.1:3001/scores",
    (key, { next }) => {
      const socket = new WebSocket(key);
      socket.addEventListener("message", (event) => next(null, event.data));
      socket.addEventListener("error", (event) => next(event.error));
      return () => socket.close();
    }
  );

  const toMapData = liveData ? JSON.parse(liveData) : initialData;

  return (
    <div className="flex flex-col w-1/2 h-full justify-center items-center">
      <span className="text-3xl">LeaderBoard</span>
      <Table>
        <TableHeader>
          <TableRow className="bg-sky-950 sticky top-0 z-20">
            <TableHead className="w-[100px]">Ranking</TableHead>
            <TableHead className="w-[100px]">User</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-scroll z-10">
          {toMapData &&
            toMapData.map((parti, index) => (
              <TableRow key={parti.username}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{parti.username}</TableCell>
                <TableCell className="text-right">{parti.score}</TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableCaption>Not a good sign if you are reading this...</TableCaption>
      </Table>
    </div>
  );
}
