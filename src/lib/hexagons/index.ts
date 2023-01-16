import { DirectionVectors } from "../../models/direction-vectors";
import { Hexagon } from "../../models/hexagon";
import { Layout } from "../../models/layout";
import { Orientation } from "../../models/orientation";
import { Point } from "../../models/point";

const DIRECTIONS: DirectionVectors = {
  bottomRight: { x: 1, y: 0, z: -1 },
  topRight: { x: 1, y: -1, z: 0 },
  top: { x: 0, y: -1, z: 0 },
  topLeft: { x: -1, y: 0, z: 1 },
  bottomLeft: { x: -1, y: 1, z: 0 },
  bottom: { x: 0, y: 1, z: -1 },
};

const DIAGONALS: DirectionVectors = {
  bottomRight: { x: 2, y: 1, z: -1 },
  topRight: { x: 1, y: -2, z: 1 },
  top: { x: -1, y: -1, z: 2 },
  topLeft: { x: -2, y: 1, z: 1 },
  bottomLeft: { x: -1, y: 2, z: 0 },
  bottom: { x: 1, y: 1, z: 2 },
};

const FLAT: Orientation = {
  f0: 3.0 / 2.0,
  f1: 0.0,
  f2: Math.sqrt(3.0) / 2.0,
  f3: Math.sqrt(3.0),
  b0: 2.0 / 3.0,
  b1: 0.0,
  b2: -1.0 / 3.0,
  b3: Math.sqrt(3.0) / 3.0,
  startAngle: 0.0,
};

export const checkValidHexagon = (hex: Hexagon): boolean => {
  return hex.center.x + hex.center.y + hex.center.z! === 0;
};

export const addHexagons = (hex1: Hexagon, hex2: Hexagon): Hexagon => {
  return {
    center: {
      x: hex1.center.x + hex2.center.x,
      y: hex1.center.y + hex2.center.y,
      z: hex1.center.z! + hex2.center.z!,
    },
  };
};

export const subtractHexagons = (hex1: Hexagon, hex2: Hexagon): Hexagon => {
  return {
    center: {
      x: hex1.center.x - hex2.center.x,
      y: hex1.center.y - hex2.center.y,
      z: hex1.center.z! - hex2.center.z!,
    },
  };
};

export const scaleHexagons = (hex1: Hexagon, hex2: Hexagon): Hexagon => {
  return {
    center: {
      x: hex1.center.x * hex2.center.x,
      y: hex1.center.y * hex2.center.y,
      z: hex1.center.z! * hex2.center.z!,
    },
  };
};

export const rotateLeft = (hex: Hexagon): Hexagon => {
  return {
    center: {
      x: -hex.center.z!,
      y: -hex.center.x,
      z: -hex.center.y,
    },
  };
};

export const rotateRight = (hex: Hexagon): Hexagon => {
  return {
    center: {
      x: -hex.center.y,
      y: -hex.center.z!,
      z: -hex.center.x,
    },
  };
};

export const createNeighbor = (
  hex: Hexagon,
  direction: keyof DirectionVectors,
  diagonal: boolean = false
): Hexagon => {
  if (diagonal) {
    return addHexagons(hex, {
      center: {
        x: DIAGONALS[direction].x,
        y: DIAGONALS[direction].y,
        z: DIAGONALS[direction].z,
      },
    });
  }

  return addHexagons(hex, {
    center: {
      x: DIRECTIONS[direction].x,
      y: DIRECTIONS[direction].y,
      z: DIRECTIONS[direction].z,
    },
  });
};

export const getLen = (hex: Hexagon): number => {
  return (
    (Math.abs(hex.center.x) +
      Math.abs(hex.center.y) +
      Math.abs(hex.center.z!)) /
    2
  );
};

export const getDistance = (hex1: Hexagon, hex2: Hexagon) => {
  return getLen(subtractHexagons(hex1, hex2));
};

export const round = (hex: Hexagon): Hexagon => {
  const { x, y, z } = hex.center;
  let xRound = Math.round(x),
    yRound = Math.round(y),
    zRound = Math.round(z!);
  const xDiff = Math.abs(xRound - x),
    yDiff = Math.abs(yRound - y),
    zDiff = Math.abs(zRound - z!);

  if (xDiff > yDiff && xDiff > zDiff) xRound = -yRound - zRound;
  else if (yDiff > zDiff) yRound = -xRound - zRound;
  else zRound = -xRound - yRound;

  return {
    center: {
      x: xRound,
      y: yRound,
      z: zRound,
    },
  };
};

export const lerp = (hex1: Hexagon, hex2: Hexagon, t: number): Hexagon => {
  return {
    center: {
      x: hex1.center.x * (1 - t) + hex2.center.x * t,
      y: hex1.center.y * (1 - t) + hex2.center.y * t,
      z: hex1.center.z! * (1 - t) + hex2.center.z! * t,
    },
  };
};

export const lineDraw = (hex1: Hexagon, hex2: Hexagon) => {
  const distance = getDistance(hex1, hex2);
  const hexOneNudge: Hexagon = {
    center: {
      x: hex1.center.x + 1e-6,
      y: hex1.center.y + 1e-6,
      z: hex1.center.z!! + 2e-6,
    },
  };
  const hexTwoNudge: Hexagon = {
    center: {
      x: hex2.center.x + 1e-6,
      y: hex2.center.y + 1e-6,
      z: hex2.center.z! + 2e-6,
    },
  };
  const results: Hexagon[] = [];
  const step = 1.0 / Math.max(distance, 1);

  for (let i = 0; i < distance + 1; i++) {
    results.push(round(lerp(hexOneNudge, hexTwoNudge, step * i)));
  }

  return [...results];
};

export const hexToPixel = (hex: Hexagon, layout: Layout): Point => {
  const orientation = { ...layout.orientation };
  const x =
    (orientation.f0 * hex.center.x + orientation.f1 * hex.center.y) *
    layout.size.x;
  const y =
    (orientation.f2 * hex.center.x + orientation.f3 * hex.center.y) *
    layout.size.y;

  return { x, y };
};

export const pixelToHex = (point: Point, layout: Layout) => {
  const mappedPoint: Point = {
    x: (point.x - layout.origin.x) / layout.size.x,
    y: (point.y - layout.origin.y) / layout.size.y,
  };
  const 
};
