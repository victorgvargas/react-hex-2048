import { Orientation } from "./orientation";
import { Point } from "./point";

export interface Layout {
  orientation: Orientation;
  size: Point;
  origin: Point;
}
