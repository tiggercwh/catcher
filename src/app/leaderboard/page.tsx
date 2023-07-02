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
import { Loader2 } from "lucide-react";

type Participant = {
  username: string;
  score: number;
};

const HTTP_ENDPOINT = process.env.NEXT_PUBLIC_HTTP_API_URL;
const WS_ENDPOINT = process.env.NEXT_PUBLIC_WS_API_URL;

export default function LeaderBoard() {
  const { data: initialData, error: initialError } = useSWR(
    `${HTTP_ENDPOINT}/top-scores`,
    (url) => {
      return fetch(url).then((res) => {
        if (res.status !== 200) throw new Error("Error fetching data");
        return res.json();
      });
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: liveData, error: socketError } = useSWRSubscription(
    `${WS_ENDPOINT}/scores`,
    (key, { next }) => {
      const socket = new WebSocket(key as string | URL);
      socket.addEventListener("message", (event) => next(null, event.data));
      socket.addEventListener("error", (event) => next(event));
      return () => socket.close();
    }
  );

  const toMapData = liveData
    ? JSON.parse(liveData)
    : (initialData as Participant[] | undefined);

  const error = initialError || socketError;

  if (error) return <div>Error in fetching data, attempting to refetch...</div>;
  if (!toMapData) return <Loader2 className="animate-spin" />;
  return (
    <div className="flex flex-col w-1/2 min-w-[400px] h-full justify-center items-center">
      <span className="text-3xl">LeaderBoard</span>
      <Table>
        <TableHeader>
          <TableRow className="bg-sky-950 sticky top-0 z-20">
            <TableHead className="w-[100px]">Ranking</TableHead>
            <TableHead className="">User</TableHead>
            <TableHead className="w-[100px] text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="overflow-scroll z-10">
          {toMapData.length > 0 &&
            toMapData.map((parti: Participant, index: number) => (
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
