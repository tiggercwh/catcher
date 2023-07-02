import React, { useEffect } from "react";
import Image from "next/image";
import { Character as CharacterType } from "@/gameContent/types";
interface CharacterProps extends CharacterType {
  index: number;
  isOverlapping: boolean;
  onCharacterCatch: (index: number) => void;
}

const Character = (props: CharacterProps) => {
  const {
    color,
    characterRef,
    x,
    y,
    size,
    index,
    image,
    isOverlapping,
    onCharacterCatch,
  } = props;

  const characterStyle = {
    width: `${size}px`,
    left: `${x}px`,
    top: `${y}px`,
  };

  useEffect(() => {
    if (isOverlapping) {
      onCharacterCatch(index);
    }
  }, [isOverlapping]);

  return (
    <div
      ref={characterRef}
      className="absolute"
      style={{
        ...characterStyle,
      }}
    >
      <Image src={require(`@/assets/${image}`)} alt="game-image" />
    </div>
  );
};

export default Character;
