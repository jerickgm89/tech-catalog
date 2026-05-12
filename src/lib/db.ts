import { createClient, type Client } from '@libsql/client';

let client: Client | null = null;
let initialized = false;

function getEnv(key: string): string | undefined {
  const fromImport = (import.meta.env as Record<string, string | undefined>)[key];
  if (fromImport !== undefined) return fromImport;
  return process.env[key];
}

export function getDb(): Client {
  if (client) return client;

  const url = getEnv('TURSO_DATABASE_URL');
  const authToken = getEnv('TURSO_AUTH_TOKEN');

  if (!url) {
    throw new Error(
      'Falta TURSO_DATABASE_URL. Configura las variables de entorno antes de usar la base de datos.',
    );
  }

  client = createClient({ url, authToken });
  return client;
}

export async function ensureSchema(): Promise<void> {
  if (initialized) return;
  const db = getDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      telefono TEXT NOT NULL,
      direccion TEXT NOT NULL,
      producto TEXT NOT NULL,
      notas TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  initialized = true;
}

export interface Pedido {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  producto: string;
  notas: string | null;
  created_at: string;
}

export async function insertPedido(input: {
  nombre: string;
  telefono: string;
  direccion: string;
  producto: string;
  notas: string | null;
}): Promise<number> {
  await ensureSchema();
  const db = getDb();
  const result = await db.execute({
    sql: `INSERT INTO pedidos (nombre, telefono, direccion, producto, notas)
          VALUES (?, ?, ?, ?, ?)`,
    args: [
      input.nombre,
      input.telefono,
      input.direccion,
      input.producto,
      input.notas,
    ],
  });
  return Number(result.lastInsertRowid ?? 0);
}

export async function listPedidos(): Promise<Pedido[]> {
  await ensureSchema();
  const db = getDb();
  const result = await db.execute(
    `SELECT id, nombre, telefono, direccion, producto, notas, created_at
     FROM pedidos ORDER BY id DESC`,
  );
  return result.rows.map((row) => ({
    id: Number(row.id),
    nombre: String(row.nombre),
    telefono: String(row.telefono),
    direccion: String(row.direccion),
    producto: String(row.producto),
    notas: row.notas === null ? null : String(row.notas),
    created_at: String(row.created_at),
  }));
}
