import React, { useEffect, useRef } from "react";
import { drawGrid } from "../../helpers/draw-grid";

export const App: React.FC = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    const context = canvas!.getContext("2d");

    drawGrid(
      {
        q: 500,
        r: 500,
        s: 500,
      },
      context!
    );
  });

  return (
    <canvas
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ margin: "0 auto", display: "block" }}
      ref={canvasRef}
    />
  );
};
