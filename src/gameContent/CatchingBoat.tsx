import { forwardRef } from "react";
import Image from "next/image";
import { BOAT_SIZE } from "./const";

interface CatchingBoatProps {
  catcherXPos: number;
}

const CatchingBoat = forwardRef(function CatchingBoat(
  props: CatchingBoatProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { catcherXPos } = props;
  const xPos = `${catcherXPos}px`;
  const boatStyle = {
    height: `${BOAT_SIZE}px`,
    width: `${BOAT_SIZE}px`,
    bottom: `0px`,
    left: xPos,
  };
  return (
    <div ref={ref} className={`absolute`} style={boatStyle}>
      <Image src={require("@/assets/boat.png")} alt="game-image" />
    </div>
  );
});

export default CatchingBoat;
