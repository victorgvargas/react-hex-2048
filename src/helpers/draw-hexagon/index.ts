import { Hexagon } from "../../models/hexagon";

export const drawHexagon = (
  { center, radius, angle = (2 * Math.PI) / 6 }: Hexagon,
  ctx: CanvasRenderingContext2D
): void => {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    ctx.lineTo(
      center.q + radius * Math.cos(angle * i),
      center.r + radius * Math.sin(angle * i)
    );
  }
  ctx.closePath();
  ctx.stroke();
};
