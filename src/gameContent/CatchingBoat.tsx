import { forwardRef } from "react";
import Image from "next/image";
import { BOAT_SIZE } from "./const";

interface CatchingBoatProps {
  catcherXPos: number;
  isLargeSize: boolean;
}

const CatchingBoat = forwardRef(function CatchingBoat(
  props: CatchingBoatProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { catcherXPos, isLargeSize } = props;
  const xPos = `${catcherXPos}px`;
  const scaledSize = isLargeSize ? BOAT_SIZE : BOAT_SIZE / 2;
  const boatStyle = {
    height: `${scaledSize}px`,
    width: `${scaledSize}px`,
    bottom: `${scaledSize / 4}px`,
    left: xPos,
  };
  return (
    <div ref={ref} className={`absolute`} style={boatStyle}>
      <Image src={require("@/assets/boat.png")} alt="game-image" />
    </div>
  );
});

export default CatchingBoat;
