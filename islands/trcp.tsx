import { trpc } from "@/trpc.client.ts";

export function MyIsland() {
  const handleClick = async () => {
    const result = await trpc.greeting.query({name: "Usuario"});
    console.log(result); // Mostrará "¡Hola Usuario!"
  };

  return (
    <button onClick={handleClick}>
      Saludar
    </button>
  );
}