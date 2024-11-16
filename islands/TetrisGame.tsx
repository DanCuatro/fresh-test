import { useState, useEffect } from "preact/hooks";
import { TETROMINOS, type Tetromino } from "../utils/tetris.ts";
import { checkCollision, createEmptyBoard, rotatePiece, generateRandomTetromino } from "../utils/tetris.ts";

export default function TetrisGame() {
  const [board, setBoard] = useState<number[][]>(createEmptyBoard(20, 10));
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null);
  const [nextPieces, setNextPieces] = useState<Tetromino[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateNextPieces = () => {
    return Array(4).fill(null).map(() => generateRandomTetromino());
  };

  const startGame = () => {
    setBoard(createEmptyBoard(20, 10));
    const pieces = generateNextPieces();
    setCurrentPiece(generateRandomTetromino());
    setNextPieces(pieces);
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
  };

  const dropPiece = () => {
    if (!currentPiece || nextPieces.length === 0) return;
    const newPosition = { ...currentPiece.position, y: currentPiece.position.y + 1 };
    const updatedPiece = { ...currentPiece, position: newPosition };

    if (!checkCollision(board, updatedPiece)) {
      setCurrentPiece(updatedPiece);
    } else {
      // Pieza llegó al fondo o colisionó
      if (currentPiece.position.y < 1) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }
      
      // Fusionar pieza con el tablero
      const newBoard = board.map(row => [...row]);
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const boardY = y + currentPiece.position.y;
            const boardX = x + currentPiece.position.x;
            if (boardY >= 0) {
              newBoard[boardY][boardX] = 1;
            }
          }
        });
      });

      // Verificar líneas completas
      let linesCleared = 0;
      for (let y = newBoard.length - 1; y >= 0; y--) {
        if (newBoard[y].every(cell => cell === 1)) {
          newBoard.splice(y, 1);
          newBoard.unshift(Array(10).fill(0));
          linesCleared++;
          y++;
        }
      }

      if (linesCleared > 0) {
        setScore(prev => prev + (linesCleared * 100));
      }

      setBoard(newBoard);
      // Usar la primera pieza de nextPieces como currentPiece
      setCurrentPiece(nextPieces[0]);
      // Remover la primera pieza y agregar una nueva al final
      setNextPieces(prev => [...prev.slice(1), generateRandomTetromino()]);
    }
  };

  const movePlayer = (dir: number) => {
    if (!currentPiece) return;
    const newPosition = { ...currentPiece.position, x: currentPiece.position.x + dir };
    const updatedPiece = { ...currentPiece, position: newPosition };
    
    if (!checkCollision(board, updatedPiece)) {
      setCurrentPiece(updatedPiece);
    }
  };

  const rotatePieceHandler = () => {
    if (!currentPiece) return;
    const rotated = { 
      ...currentPiece, 
      shape: rotatePiece(currentPiece.shape)
    };
    if (!checkCollision(board, rotated)) {
      setCurrentPiece(rotated);
    }
  };

  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(() => {
      dropPiece();
    }, 1000);

    return () => clearInterval(gameLoop);
  }, [currentPiece, board, isPlaying]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          movePlayer(-1);
          break;
        case 'ArrowRight':
          movePlayer(1);
          break;
        case 'ArrowDown':
          dropPiece();
          break;
        case 'ArrowUp':
          rotatePieceHandler();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPiece, board, isPlaying, gameOver]);

  return (
    <div class="flex gap-8">
      <div class="grid grid-cols-10 gap-px bg-gray-700">
        {board.map((row, i) => 
          row.map((cell, j) => {
            let isActivePiece = false;
            let pieceColor = '';
            if (currentPiece) {
              const pieceY = i - currentPiece.position.y;
              const pieceX = j - currentPiece.position.x;
              if (
                pieceY >= 0 && 
                pieceY < currentPiece.shape.length && 
                pieceX >= 0 && 
                pieceX < currentPiece.shape[0].length
              ) {
                isActivePiece = currentPiece.shape[pieceY][pieceX] === 1;
                pieceColor = currentPiece.color;
              }
            }
            return (
              <div 
                key={`${i}-${j}`}
                style={{
                  backgroundColor: isActivePiece ? pieceColor : cell ? '#4B5563' : '#1F2937'
                }}
                class="w-8 h-8"
              />
            );
          })
        )}
      </div>
      <div>
        <div class="mb-4">
          <h3 class="text-xl mb-2">Siguientes Piezas:</h3>
          <div class="space-y-2">
            {nextPieces.map((piece, pieceIndex) => {
              const maxSize = Math.max(
                piece.shape.length,
                piece.shape[0].length
              );
              
              return (
                <div 
                  key={pieceIndex} 
                  class="bg-gray-800 p-3 rounded flex items-center"
                >
                  <span class="text-sm mr-2 w-6">{pieceIndex + 1}.</span>
                  <div 
                    class="grid gap-px bg-gray-700"
                    style={{
                      gridTemplateColumns: `repeat(${maxSize}, 1fr)`,
                      width: `${maxSize * 20}px`
                    }}
                  >
                    {piece.shape.map((row, i) => 
                      row.map((cell, j) => (
                        <div
                          key={`preview-${pieceIndex}-${i}-${j}`}
                          style={{
                            backgroundColor: cell ? piece.color : 'transparent'
                          }}
                          class="w-5 h-5"
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <p class="text-2xl">Score: {score}</p>
        {gameOver && <p class="text-red-500">¡Juego Terminado!</p>}
        <button 
          onClick={startGame}
          class="mt-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
        >
          {isPlaying ? 'Reiniciar' : 'Iniciar Juego'}
        </button>
      </div>
    </div>
  );
} 