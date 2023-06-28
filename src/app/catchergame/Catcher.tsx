import { forwardRef } from "react";
import Image from "next/image";

const CatchingBoat = forwardRef(function CatchingBoat(props, ref) {
  const { catcherXPos } = props;
  // const xPos = catcherXPos ? `${catcherXPos}px` : "50%";
  const xPos = `${catcherXPos}px`;
  const boatStyle = {
    height: `80px`,
    width: `80px`,
    bottom: `0px`,
    left: xPos,
  };
  return (
    <div ref={ref} className={`absolute`} style={boatStyle}>
      <Image src={require("../../assets/boat.png")} alt="game-image" />
    </div>
  );
});

export default CatchingBoat;
