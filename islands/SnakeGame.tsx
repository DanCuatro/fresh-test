import { useState, useEffect } from "preact/hooks";
import { Direction, Position, CellType, createEmptyBoard, generateItem, checkCollision, checkSelfCollision } from "../utils/snake.ts";

const BOARD_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 }
];
const GAME_SPEED = 150;
const BOMB_INTERVAL = 5000;

export default function SnakeGame() {
  const [board, setBoard] = useState<CellType[][]>(createEmptyBoard(BOARD_SIZE, false));
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>('UP');
  const [food, setFood] = useState<Position>(generateItem(BOARD_SIZE, INITIAL_SNAKE, board, 2));
  const [bombs, setBombs] = useState<Position[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bombsEnabled, setBombsEnabled] = useState(false);
  const [wallsEnabled, setWallsEnabled] = useState(false);

  const addBomb = () => {
    if (bombs.length < 5) { // Máximo 5 bombas en el tablero
      const newBomb = generateItem(BOARD_SIZE, snake, board, 3);
      setBombs(prev => [...prev, newBomb]);
    }
  };

  const moveSnake = () => {
    if (!isPlaying || gameOver) return;

    const head = { ...snake[0] };
    switch (direction) {
      case 'UP':
        head.y--;
        break;
      case 'DOWN':
        head.y++;
        break;
      case 'LEFT':
        head.x--;
        break;
      case 'RIGHT':
        head.x++;
        break;
    }

    // Verificar colisiones
    if (checkCollision(head, BOARD_SIZE, board) || checkSelfCollision(head, snake.slice(1))) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    // Verificar colisión con bomba
    if (bombs.some(bomb => bomb.x === head.x && bomb.y === head.y)) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    const newSnake = [head, ...snake];
    
    // Verificar si comió la comida
    if (head.x === food.x && head.y === food.y) {
      setScore(prev => prev + 10);
      setFood(generateItem(BOARD_SIZE, newSnake, board, 2));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const startGame = () => {
    const newBoard = createEmptyBoard(BOARD_SIZE, wallsEnabled);
    setBoard(newBoard);
    setSnake(INITIAL_SNAKE);
    setDirection('UP');
    setFood(generateItem(BOARD_SIZE, INITIAL_SNAKE, newBoard, 2));
    setBombs([]);
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  // Game Loop
  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [snake, direction, isPlaying]);

  // Bomb Generator - Modificado para considerar bombsEnabled
  useEffect(() => {
    if (!isPlaying || !bombsEnabled) return;

    const bombLoop = setInterval(addBomb, BOMB_INTERVAL);
    return () => clearInterval(bombLoop);
  }, [isPlaying, bombs, bombsEnabled]);

  // Keyboard Controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, isPlaying, gameOver]);

  return (
    <div class="flex gap-8">
      <div>
        <div class="grid gap-px bg-gray-700 mb-4" 
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
            width: `${BOARD_SIZE * 20}px`
          }}
        >
          {board.map((row, i) => 
            row.map((cell, j) => {
              const isSnake = snake.some(segment => segment.x === j && segment.y === i);
              const isFood = food.x === j && food.y === i;
              const isBomb = bombs.some(bomb => bomb.x === j && bomb.y === i);
              const isWall = cell === 1;
              
              return (
                <div 
                  key={`${i}-${j}`}
                  class={`w-5 h-5 ${
                    isWall 
                      ? 'bg-gray-500'
                      : isSnake 
                        ? 'bg-green-500' 
                        : isFood 
                          ? 'bg-red-500'
                          : isBomb
                            ? 'bg-yellow-500'
                            : 'bg-gray-800'
                  }`}
                />
              );
            })
          )}
        </div>
        <div class="flex gap-4">
          <label class="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={bombsEnabled}
              onChange={(e) => {
                setBombsEnabled(e.currentTarget.checked);
                if (!e.currentTarget.checked) {
                  setBombs([]); // Limpiar bombas si se desactivan
                }
              }}
              disabled={isPlaying}
              class="form-checkbox h-4 w-4 text-blue-600"
            />
            <span>Bombas</span>
          </label>
          <label class="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={wallsEnabled}
              onChange={(e) => {
                setWallsEnabled(e.currentTarget.checked);
                if (isPlaying) {
                  // Reiniciar juego si se cambia durante el juego
                  const newBoard = createEmptyBoard(BOARD_SIZE, e.currentTarget.checked);
                  setBoard(newBoard);
                  setSnake(INITIAL_SNAKE);
                  setFood(generateItem(BOARD_SIZE, INITIAL_SNAKE, newBoard, 2));
                }
              }}
              disabled={isPlaying}
              class="form-checkbox h-4 w-4 text-blue-600"
            />
            <span>Muros</span>
          </label>
        </div>
      </div>
      <div>
        <p class="text-2xl mb-4">Score: {score}</p>
        {gameOver && <p class="text-red-500 mb-4">¡Juego Terminado!</p>}
        <button 
          onClick={startGame}
          class="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          {isPlaying ? 'Reiniciar' : 'Iniciar Juego'}
        </button>
        <div class="mt-4">
          <h3 class="text-lg mb-2">Leyenda:</h3>
          <div class="space-y-2">
            <div class="flex items-center">
              <div class="w-4 h-4 bg-green-500 mr-2"></div>
              <span>Serpiente</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 bg-red-500 mr-2"></div>
              <span>Comida</span>
            </div>
            {bombsEnabled && (
              <div class="flex items-center">
                <div class="w-4 h-4 bg-yellow-500 mr-2"></div>
                <span>Bomba</span>
              </div>
            )}
            {wallsEnabled && (
              <div class="flex items-center">
                <div class="w-4 h-4 bg-gray-500 mr-2"></div>
                <span>Muro</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 