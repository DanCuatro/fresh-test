import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({
  url: Deno.env.get("DATABASE_URL")!, 
  authToken: Deno.env.get("DATABASE_AUTH_TOKEN")! 
});

const db = drizzle(client);
console.log({db});
(async () => {
  try {
    // Usar db.run() en lugar de executeSql
    const result = await client.execute(
      `SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`
    );
    
    // El resultado viene en result.rows[0]
    console.log(`Total de tablas en la base de datos: ${result.rows[0].count}`);
  } catch (error) {
    console.error('Error ejecutando la consulta:', error);
  } finally {
    // Es buena práctica cerrar la conexión cuando terminamos
    await client.close();
  }
})();