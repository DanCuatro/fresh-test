export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type CellType = 0 | 1 | 2 | 3; // 0: vacío, 1: muro, 2: comida, 3: bomba

export interface Position {
  x: number;
  y: number;
}

export const createEmptyBoard = (size: number, includeWalls: boolean): CellType[][] => {
  const board = Array(size).fill(null).map(() => Array(size).fill(0));
  
  if (includeWalls) {
    // Generar muros aleatorios (10% del tablero)
    const wallCount = Math.floor((size * size) * 0.1);
    for (let i = 0; i < wallCount; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * size);
        y = Math.floor(Math.random() * size);
      } while (
        board[y][x] !== 0 || 
        // Evitar posición inicial y área cercana
        (Math.abs(x - 10) < 2 && Math.abs(y - 10) < 2)
      );
      board[y][x] = 1;
    }
  }
  
  return board;
};

export const generateItem = (
  size: number, 
  snake: Position[], 
  board: CellType[][], 
  type: CellType
): Position => {
  let position: Position;
  do {
    position = {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size)
    };
  } while (
    snake.some(segment => segment.x === position.x && segment.y === position.y) ||
    board[position.y][position.x] !== 0
  );
  
  return position;
};

export const checkCollision = (head: Position, size: number, board: CellType[][]): boolean => {
  return (
    head.x < 0 || 
    head.x >= size || 
    head.y < 0 || 
    head.y >= size ||
    board[head.y][head.x] === 1 // Colisión con muro
  );
};

export const checkSelfCollision = (head: Position, body: Position[]): boolean => {
  return body.some(segment => segment.x === head.x && segment.y === head.y);
}; 