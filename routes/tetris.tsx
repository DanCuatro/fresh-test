import TetrisGame from "../islands/TetrisGame.tsx";

export default function Tetris() {
  return (
    <div class="min-h-screen bg-gray-900 text-white p-8">
      <h1 class="text-4xl mb-8">Tetris</h1>
      <TetrisGame />
    </div>
  );
} 