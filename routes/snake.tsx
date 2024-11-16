import SnakeGame from "../islands/SnakeGame.tsx";

export default function Snake() {
  return (
    <div class="min-h-screen bg-gray-900 text-white p-8">
      <h1 class="text-4xl mb-8">Snake</h1>
      <SnakeGame />
    </div>
  );
} 