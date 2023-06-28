"use client";

import React, {
  createRef,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { createCharacter, rankingFetcher, removeCharacter } from "./utils";
import { SPEED_STEP, SPAWN_INTERVAL } from "./const";
import CatchingBoat from "./Catcher";
import Character from "./Character";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";

export default function Catcher() {
  const [characters, updateCharacters] = useState([]);
  const [charactersRef, setCharactersRef] = useState([]);
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(10);
  const [score, setScore] = useState(0);
  const [cursorXPosition, setCursorXPosition] = useState(0);
  const [reserveBounds, setBounds] = useState(null);
  const [countDown, setCountDown] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [seeRanking, setSeeRanking] = useState(false);
  const { push } = useRouter();

  const catcherRef = useRef();
  const requestRef = useRef();
  const intervalRef = useRef();
  const countDownRef = useRef();
  const fieldRef = useRef();
  const nameInputRef = useRef();

  const catcherBound = catcherRef.current
    ? catcherRef.current.getBoundingClientRect()
    : null;

  const boatMove = (e) => {
    if (!reserveBounds) {
      const bounds = e.target.getBoundingClientRect();
      setBounds(bounds);
      return;
    }
    setCursorXPosition(() => {
      const localX = e.clientX - reserveBounds.left;
      return localX;
    });
  };

  const advanceStep = useCallback(() => {
    updateCharacters((oldCharacters) => {
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
  }, [speed, updateCharacters]);

  const spawnCharacter = useCallback(() => {
    const characterRef = createRef();
    updateCharacters((oldCharacters) => [
      ...oldCharacters,
      createCharacter(characterRef),
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

  const onCharacterCatch = (index) => {
    setScore((prevScore) => prevScore + characters[index].pointChange);
    updateCharacters(removeCharacter(characters, index));
  };

  const onEndGameSubmit = async () => {
    const result = await trigger({
      userName: nameInputRef.current.value,
      score,
    });
    if (!error && result) setSeeRanking(true);
  };

  const {
    data: rankingData,
    error,
    trigger,
    isMutating,
  } = useSWRMutation("http://localhost:3001/submit-score", rankingFetcher);

  useEffect(() => {
    if (isRunning && countDown === 0) {
      setIsRunning(false);
      setIsDialogOpen(true);
    }
  }, [countDown]);

  useEffect(() => {
    console.log("Here!");
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

  const ranking = rankingData?.[0]?.rank;

  // Test pause
  // useEffect(() => {
  //   setInterval(() => {
  //     setIsRunning((prevRunning) => !prevRunning);
  //     console.log("called");
  //   }, 3000);
  // }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full">
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
            </div>
            <DialogFooter>
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

      <span className="text-3xl">{countDown}</span>
      <div
        className="w-full h-full relative bg-gray-500"
        onMouseMove={boatMove}
        ref={fieldRef}
      >
        {characters.map((character, index) => {
          const x =
            ((fieldRef.current.offsetWidth - character.size) * character.x) /
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
        <CatchingBoat catcherXPos={cursorXPosition} ref={catcherRef} />
      </div>
    </div>
  );
}
