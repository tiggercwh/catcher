"use client";

import React, {
  createRef,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import {
  createCharacter,
  rankingFetcher,
  removeCharacter,
} from "@/gameContent/utils";
import type { Character as CharacterType } from "@/gameContent/types";
import { BOAT_SIZE, SPAWN_INTERVAL } from "@/gameContent/const";
import CatchingBoat from "@/gameContent/CatchingBoat";
import Character from "@/gameContent/Character";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";

const HTTP_ENDPOINT = process.env.NEXT_PUBLIC_HTTP_API_URL;

export default function Catcher() {
  const [characters, updateCharacters] = useState<CharacterType[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [cursorXPosition, setCursorXPosition] = useState<number>(0);
  const [countDown, setCountDown] = useState<number>(10);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [seeRanking, setSeeRanking] = useState<boolean>(false);
  const { push } = useRouter();

  const catcherRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countDownRef = useRef<NodeJS.Timeout | null>(null);
  const requestRef = useRef<number | null>();
  const fieldRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const catcherBound = catcherRef.current
    ? catcherRef.current.getBoundingClientRect()
    : null;

  //Temporary solution
  const isLargeSize =
    typeof global?.window !== undefined
      ? global?.window?.innerWidth > 500
      : true;
  const scaledBoatSize = isLargeSize ? BOAT_SIZE : BOAT_SIZE / 2;

  // Game Logic

  const advanceStep = useCallback(() => {
    updateCharacters((oldCharacters: CharacterType[]) => {
      if (!fieldRef.current) return oldCharacters;
      const newCharacters = [];
      for (let character of oldCharacters) {
        const newY = character.y + character.step;
        if (newY <= fieldRef.current.offsetHeight - character.size / 2) {
          newCharacters.push({
            ...character,
            y: newY,
          });
        }
      }
      return newCharacters;
    });
    requestRef.current = requestAnimationFrame(advanceStep);
  }, [updateCharacters]);

  const spawnCharacter = useCallback(() => {
    const characterRef = createRef<HTMLDivElement>();
    updateCharacters((oldCharacters: CharacterType[]) => [
      ...oldCharacters,
      createCharacter(characterRef, isLargeSize),
    ]);
  }, [updateCharacters]);

  const resetGame = useCallback(() => {
    updateCharacters([]);
    setCountDown(60);
    setScore(0);
    setSeeRanking(false);
    setIsDialogOpen(false);
    setIsRunning(true);
  }, [
    updateCharacters,
    setCountDown,
    setScore,
    setSeeRanking,
    setIsDialogOpen,
    setIsRunning,
  ]);

  // EventHandlers

  const fieldBound = useMemo(
    () => (fieldRef.current ? fieldRef.current.getBoundingClientRect() : null),
    [fieldRef.current, global?.window?.innerWidth]
  );

  const desktopBoatMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!fieldBound) {
      return;
    }
    setCursorXPosition(() => {
      const localX = Math.min(
        e.clientX - fieldBound.left,
        fieldBound.width - scaledBoatSize
      );
      return localX;
    });
  };

  const mobileBoatMove = (e: React.TouchEvent<HTMLElement>) => {
    if (!fieldBound) {
      return;
    }
    setCursorXPosition(() => {
      const localX = Math.min(
        Math.max(e.touches[0].clientX - fieldBound.left, 0),
        fieldBound.width - scaledBoatSize
      );
      return localX;
    });
  };

  const onCharacterCatch = (index: number) => {
    setScore((prevScore) => prevScore + characters[index].pointChange);
    updateCharacters(removeCharacter(characters, index));
  };

  const onEndGameSubmit = async () => {
    if (!(nameInputRef.current && nameInputRef.current.value)) return; // need to add error handling
    const result = await trigger({
      userName: nameInputRef.current.value,
      score,
    });
    if (!error && result) setSeeRanking(true);
  };

  // Effects & hooks

  const {
    data: ranking,
    error,
    trigger,
    isMutating,
  } = useSWRMutation(`${HTTP_ENDPOINT}/submit-score`, rankingFetcher);

  useEffect(() => {
    if (isRunning && countDown === 0) {
      setIsRunning(false);
      setIsDialogOpen(true);
    }
  }, [countDown]);

  useEffect(() => {
    const clearRefs = () => {
      countDownRef.current && clearInterval(countDownRef.current);
      intervalRef.current && clearInterval(intervalRef.current);
      requestRef.current && cancelAnimationFrame(requestRef.current);
    };

    if (isRunning) {
      countDownRef.current = setInterval(() => {
        setCountDown((prevCountDown) => prevCountDown - 1);
      }, 1000);
      intervalRef.current = setInterval(spawnCharacter, SPAWN_INTERVAL);
      requestRef.current = requestAnimationFrame(advanceStep);
    } else {
      clearRefs();
    }
    return () => clearRefs();
  }, [isRunning, advanceStep, spawnCharacter]);

  // TO ADD: Pause function
  // useEffect(() => {
  //   setInterval(() => {
  //     setIsRunning((prevRunning) => !prevRunning);
  //     console.log("called");
  //   }, 3000);
  // }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full overflow-hidden">
      {seeRanking ? (
        <Dialog defaultOpen={false} open={isDialogOpen}>
          <DialogContent className="bg-black sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Your ranking is:</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-center">
                <Label htmlFor="ranking" className="">
                  {ranking}
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => resetGame()}>Play Again</Button>
              <Button onClick={() => push("/leaderboard")}>
                Go to LeaderBoard
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog defaultOpen={false} open={isDialogOpen}>
          <DialogContent className="bg-black sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>GG Well Played!</DialogTitle>
              <DialogDescription>
                Submit a unique name to see your ranking.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  ref={nameInputRef}
                  id="name"
                  className="bg-black col-span-3"
                />
              </div>
              {error && (
                <span className="w-full text-red-600">{error.message}</span>
              )}
            </div>
            <DialogFooter className="gap-2">
              <Button disabled={isMutating} onClick={onEndGameSubmit}>
                {isMutating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Please wait</span>
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
              <Button onClick={() => resetGame()}>Play Again</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <span className="text-3xl text-gray-900">Current Score: {score}</span>
      <span className="text-3xl text-gray-900">{countDown}</span>
      <div
        className="w-full min-w-[350px] h-full relative bg-gray-500 bg-opacity-30"
        onMouseMove={desktopBoatMove}
        onTouchMove={mobileBoatMove}
        ref={fieldRef}
      >
        {fieldRef.current &&
          characters.map((character, index) => {
            const x =
              ((fieldRef.current!.offsetWidth - character.size) * character.x) /
              100;
            const characterBound = character.characterRef.current
              ? character.characterRef.current.getBoundingClientRect()
              : null;
            const isOverlapping =
              catcherBound && characterBound
                ? !(
                    catcherBound.top > characterBound.bottom ||
                    catcherBound.right < characterBound.left ||
                    catcherBound.bottom < characterBound.top ||
                    catcherBound.left > characterBound.right
                  )
                : false;
            return (
              <Character
                key={`character-${index}`}
                {...character}
                x={x}
                index={index}
                isOverlapping={isOverlapping}
                onCharacterCatch={onCharacterCatch}
              />
            );
          })}
        <CatchingBoat
          catcherXPos={cursorXPosition}
          isLargeSize={isLargeSize}
          ref={catcherRef}
        />
      </div>
    </div>
  );
}
