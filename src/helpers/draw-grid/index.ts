import { DirectionVectors } from "../../models/direction-vectors";
import { Point } from "../../models/point";
import { drawHexagon } from "../draw-hexagon";

const AXIAL_DIRECTION_VECTORS: DirectionVectors = {
  bottomRight: { q: 1, r: 0, s: -1 },
  topRight: { q: 1, r: -1, s: 0 },
  top: { q: 0, r: -1, s: 1 },
  topLeft: { q: -1, r: 0, s: 1 },
  bottomLeft: { q: -1, r: 1, s: 0 },
  bottom: { q: 0, r: 1, s: 1 },
};

const cubeAdd = (hexCoords: Point, vector: Point): Point => {
  return {
    q: hexCoords.q + vector.q,
    r: hexCoords.r + vector.r,
    s: hexCoords.s + vector.s,
  };
};

const cubeNeighbor = (cube: Point, direction: Point): Point => {
  return cubeAdd(cube, direction);
};

export const drawGrid = (
  center: Point,
  context: CanvasRenderingContext2D
): void => {
  drawHexagon({ center, radius: 50, angle: (2 * Math.PI) / 6 }, context);

  for (const iterator in AXIAL_DIRECTION_VECTORS) {
    drawHexagon(
      {
        center: cubeNeighbor(
          center,
          AXIAL_DIRECTION_VECTORS[iterator as keyof DirectionVectors]
        ),
        radius: 50,
        angle: (2 * Math.PI) / 6,
      },
      context
    );
  }
};
