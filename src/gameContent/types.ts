export type Character = {
  color: string;
  characterRef: React.RefObject<HTMLDivElement>;
  image: string;
  pointChange: number;
  size: number;
  step: number;
  x: number;
  y: number;
};
