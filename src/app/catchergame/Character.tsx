import React, { use, useEffect } from "react";
import Image from "next/image";

const Character = (props) => {
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
      <Image src={require(`../../assets/${image}`)} alt="game-image" />
    </div>
  );
};

export default Character;
