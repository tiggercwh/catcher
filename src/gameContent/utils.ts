import {
  PLUS_POINT,
  MINUS_POINT,
  COLORS,
  SIZES,
  PLUSIMAGE_LENGTH,
  MINUSIMAGE_LENGTH,
  MIN_STEP,
  MAX_STEP,
} from "./const";

import type { Character } from "./types";

export const createCharacter = (
  ref: React.RefObject<HTMLDivElement>
): Character => {
  function randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  // pick random color and size
  const color = COLORS[randomIntFromInterval(0, COLORS.length - 1)];
  const size = SIZES[randomIntFromInterval(0, SIZES.length - 1)];
  const step = randomIntFromInterval(MIN_STEP, MAX_STEP);
  const isPlusScore = Math.random() < 0.7;
  const imagePrefix = isPlusScore ? "p" : "e";
  const imageLength = isPlusScore ? PLUSIMAGE_LENGTH : MINUSIMAGE_LENGTH;
  const imageSuffix = randomIntFromInterval(1, imageLength);
  const image = `${imagePrefix}${imageSuffix}.png`;
  const pointChange = isPlusScore ? PLUS_POINT : MINUS_POINT;
  const x = randomIntFromInterval(0, 100);

  return {
    color,
    characterRef: ref,
    image,
    pointChange,
    size,
    step,
    x,
    y: 0,
  };
};

export const removeCharacter = (characters: Character[], index: number) => {
  const newCharacters = [...characters];
  newCharacters.splice(index, 1);
  return newCharacters;
};

export const rankingFetcher = (
  url: string,
  { arg }: { arg: { userName: string; score: number } }
) =>
  fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(arg),
  }).then((res) => {
    // TODO: can handle error better
    if (res.status !== 201)
      throw new Error(
        "Error submitting score. You may try to submit with another name."
      );
    return res.json();
  });
