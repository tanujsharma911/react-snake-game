// import { Button } from "@/components/ui/button";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowBigLeft,
  ArrowBigRight,
  ArrowBigUp,
  ArrowBigDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TICK_SPEED = 150;
const DISPLAY_SIZE = 25;
const DISPLAY_GRID: string[][] = Array.from({ length: DISPLAY_SIZE }, () => {
  return new Array(DISPLAY_SIZE).fill("");
});
const DEFAULT_SNAKE = [
  [9, 9],
  [8, 9],
];

const Game = () => {
  /* ------------------------------- STATES ------------------------------- */
  const [snakeBody, setSnakeBody] = useState<number[][]>(DEFAULT_SNAKE);
  const [score, setScore] = useState(0);

  const changePos = { x: -1, y: 0 };
  const movementDir = useRef<string>("left");

  const [appleState, setAppleState] = useState<number[]>([3, 3]);
  const appleRef = useRef<number[] | null>([3, 3]);

  const upBtnRef = useRef<HTMLButtonElement | null>(null);
  const leftBtnRef = useRef<HTMLButtonElement | null>(null);
  const rightBtnRef = useRef<HTMLButtonElement | null>(null);
  const bottomBtnRef = useRef<HTMLButtonElement | null>(null);

  /* ------------------------------- HELPER FUNC ------------------------------- */
  const isSnakeBody = (x: number, y: number) => {
    return snakeBody.some(([a, b]) => a === x && b === y);
  };

  const isApple = (x: number, y: number) => {
    if (appleState === null) return false;

    return appleState[0] === x && appleState[1] === y;
  };

  const insideGrid = (x: number, y: number) => {
    if (x < DISPLAY_SIZE && 0 <= x && y < DISPLAY_SIZE && 0 <= y) return true;

    return false;
  };

  /* ------------------------------- UPDATE LOOP ------------------------------- */
  useEffect(() => {
    if (
      !upBtnRef.current ||
      !bottomBtnRef.current ||
      !leftBtnRef.current ||
      !rightBtnRef.current
    )
      return;

    const handleKeyDown = (e?: KeyboardEvent | null, btnPressed?: string) => {
      const moveTo = e?.code || btnPressed;
      switch (moveTo) {
        case "ArrowRight":
          if (movementDir.current === "left") break;
          changePos.x = 1;
          changePos.y = 0;
          movementDir.current = "right";
          break;

        case "ArrowLeft":
          if (movementDir.current === "right") break;
          changePos.x = -1;
          changePos.y = 0;
          movementDir.current = "left";
          break;

        case "ArrowUp":
          if (movementDir.current === "down") break;
          changePos.y = -1;
          changePos.x = 0;
          movementDir.current = "up";
          break;

        case "ArrowDown":
          if (movementDir.current === "up") break;
          changePos.x = 0;
          changePos.y = 1;
          movementDir.current = "down";
          break;
      }
    };

    const generateApple = () => {
      const randomX = Math.floor(Math.random() * DISPLAY_SIZE);
      const randomY = Math.floor(Math.random() * DISPLAY_SIZE);

      appleRef.current = [randomX, randomY];
      setAppleState([randomX, randomY]);
    };

    const gameOver = () => {
      setScore(0);
      generateApple();
    };

    const update = () => {
      setSnakeBody((prevSnakeBodyArray) => {
        const snakeBodyArray = prevSnakeBodyArray.map((arr) => [...arr]);
        const oldHead = snakeBodyArray[0];

        const newHead = [oldHead[0] + changePos.x, oldHead[1] + changePos.y];

        const collideItself = snakeBodyArray.some(
          (body, i) =>
            body[0] === newHead[0] && body[1] === newHead[1] && i !== 1,
        );

        const isGameOver = collideItself || !insideGrid(newHead[0], newHead[1]);

        if (isGameOver) {
          gameOver();
          return DEFAULT_SNAKE;
        }

        snakeBodyArray.unshift(newHead); // Move ahead

        if (
          appleRef.current !== null &&
          appleRef.current[0] === newHead[0] &&
          appleRef.current[1] === newHead[1]
        ) {
          setScore((prev) => prev + 1);
          generateApple();
        } else {
          snakeBodyArray.pop(); // Remove tail
        }

        return snakeBodyArray;
      });
    };

    const clock = setInterval(() => {
      update();
    }, TICK_SPEED);

    document.addEventListener("keydown", handleKeyDown);

    upBtnRef.current.addEventListener("click", () =>
      handleKeyDown(null, "ArrowUp"),
    );
    bottomBtnRef.current.addEventListener("click", () =>
      handleKeyDown(null, "ArrowDown"),
    );
    rightBtnRef.current.addEventListener("click", () =>
      handleKeyDown(null, "ArrowRight"),
    );
    leftBtnRef.current.addEventListener("click", () =>
      handleKeyDown(null, "ArrowLeft"),
    );

    return () => {
      clearInterval(clock);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [appleRef, movementDir]);

  return (
    <div className="w-full h-screen bg-background flex flex-col items-center pt-10 gap-5">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        <span className="opacity-60">Score: </span> {score}
      </h1>
      <div
        className={`w-80 md:w-90 lg:w-100 aspect-square border-2 grid grid-rows-25 grid-cols-25`}
      >
        {DISPLAY_GRID.map((rows, y) => {
          return rows.map((cell, x) => {
            return (
              <div
                key={y * DISPLAY_SIZE + x}
                className={cn(
                  isApple(x, y) &&
                    "bg-red-400 shadow-[0_0_5px_oklch(0.40 0.13 26)]",
                  isSnakeBody(x, y) && "bg-green-400",
                )}
              >
                {cell}
              </div>
            );
          });
        })}
      </div>
      <div className="grid grid-cols-3 grid-rows-3 w-60 h-50">
        <Button
          className="col-start-2 h-full"
          variant={"secondary"}
          ref={upBtnRef}
        >
          <ArrowBigUp />
        </Button>
        <Button
          className="row-start-2 h-full"
          variant={"secondary"}
          ref={leftBtnRef}
        >
          <ArrowBigLeft />
        </Button>
        <Button
          className="row-start-2 col-start-3 h-full"
          variant={"secondary"}
          ref={rightBtnRef}
        >
          <ArrowBigRight />
        </Button>
        <Button
          className="row-start-3 col-start-2 h-full"
          variant={"secondary"}
          ref={bottomBtnRef}
        >
          <ArrowBigDown />
        </Button>
      </div>
      <p className="opacity-60">
        Developed by{" "}
        <a href="https:github.com/tanujsharma911" className="underline">
          Tanuj Sharma
        </a>
      </p>
    </div>
  );
};

export default Game;
