// import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const DISPLAY_SIZE = 25;
const DISPLAY_GRID: string[][] = Array.from({ length: DISPLAY_SIZE }, () => {
  return new Array(DISPLAY_SIZE).fill("");
});

const Game = () => {
  const [snakeBody, setSnakeBody] = useState<number[][]>([[9, 9]]);
  const [score, setScore] = useState(0);
  const [apple, setApple] = useState([3, 3]);
  const changePos = { x: -1, y: 0 };

  useEffect(() => {
    const update = () => {
      setSnakeBody((prev) => {
        const [headX, headY] = prev[0];

        if (
          headX === DISPLAY_SIZE ||
          headY === DISPLAY_SIZE ||
          headY === -1 ||
          headX === -1
        ) {
          setScore(0);
          return [[9, 9]];
        }

        const newHead = [headX + changePos.x, headY + changePos.y];

        if (headX === apple[0] && headY === apple[1]) {
          setScore((prev) => prev + 1);

          return [newHead, ...prev];
        }

        return [newHead, ...prev.filter((c, i) => i !== prev.length - 1)];
      });
    };

    const clock = setInterval(() => {
      update();
    }, 200);

    document.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "ArrowRight":
          console.log("Move Right");
          changePos.x = 1;
          changePos.y = 0;
          break;

        case "ArrowLeft":
          console.log("Move Left");
          changePos.x = -1;
          changePos.y = 0;
          break;

        case "ArrowUp":
          console.log("Move Up");
          changePos.y = -1;
          changePos.x = 0;
          break;

        case "ArrowDown":
          console.log("Move Down");
          changePos.x = 0;
          changePos.y = 1;
          break;
      }
    });

    return () => {
      clearInterval(clock);
    };
  }, []);

  const isSnakeBody = (x: number, y: number) => {
    return snakeBody.some(([a, b]) => a === x && b === y);
  };

  const isApple = (r: number, c: number) => {
    return apple[0] === c && apple[1] === r;
  };

  return (
    <div className="w-full h-screen bg-background grid place-content-center">
      <h1>{score}</h1>
      <div className={`w-100 h-100 border-2 grid grid-rows-25 grid-cols-25`}>
        {DISPLAY_GRID.map((rows, r) => {
          return rows.map((cell, c) => {
            return (
              <div
                key={r * DISPLAY_SIZE + c}
                className={cn(
                  isApple(r, c) && "bg-red-400",
                  isSnakeBody(c, r) && "bg-green-400",
                )}
              >
                {cell}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export default Game;
