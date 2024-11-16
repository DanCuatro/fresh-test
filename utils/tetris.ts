export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Tetromino {
  shape: number[][];
  color: string;
  position: { x: number; y: number };
}

export const TETROMINOS = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: '#00f0f0'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#f0f000'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: '#a000f0'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: '#00f000'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: '#f00000'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: '#0000f0'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: '#f0a000'
  }
};

export const createEmptyBoard = (rows: number, cols: number): number[][] => {
  return Array(rows).fill(null).map(() => Array(cols).fill(0));
};

export const checkCollision = (
  board: number[][],
  piece: { shape: number[][], position: { x: number, y: number } }
): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newY = y + piece.position.y;
        const newX = x + piece.position.x;
        
        if (
          newX < 0 || 
          newX >= board[0].length ||
          newY >= board.length ||
          (newY >= 0 && board[newY][newX])
        ) {
          return true;
        }
      }
    }
  }
  return false;
};

export const rotatePiece = (piece: number[][]): number[][] => {
  const newPiece = piece[0].map((_, index) =>
    piece.map(row => row[index]).reverse()
  );
  return newPiece;
};

export const generateRandomTetromino = (): Tetromino => {
  const types = Object.keys(TETROMINOS) as TetrominoType[];
  const randomType = types[Math.floor(Math.random() * types.length)];
  const tetromino = TETROMINOS[randomType];
  
  return {
    shape: tetromino.shape,
    color: tetromino.color,
    position: { x: 4, y: 0 } // Comienza en el centro superior
  };
}; 