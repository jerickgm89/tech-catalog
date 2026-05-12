import type { APIRoute } from 'astro';
import Database from 'better-sqlite3';
import path from 'node:path';

export const prerender = false;

const dbPath = path.resolve(process.cwd(), 'orders.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombres TEXT NOT NULL,
    apellidos TEXT NOT NULL,
    dni TEXT NOT NULL,
    direccion TEXT NOT NULL,
    producto TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const insertOrder = db.prepare(`
  INSERT INTO orders (nombres, apellidos, dni, direccion, producto)
  VALUES (@nombres, @apellidos, @dni, @direccion, @producto)
`);

interface OrderPayload {
  nombres?: unknown;
  apellidos?: unknown;
  dni?: unknown;
  direccion?: unknown;
  producto?: unknown;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const POST: APIRoute = async ({ request }) => {
  let body: OrderPayload;

  try {
    body = (await request.json()) as OrderPayload;
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'JSON inválido' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const { nombres, apellidos, dni, direccion, producto } = body;

  if (
    !isNonEmptyString(nombres) ||
    !isNonEmptyString(apellidos) ||
    !isNonEmptyString(dni) ||
    !isNonEmptyString(direccion) ||
    !isNonEmptyString(producto)
  ) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Todos los campos son obligatorios',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (!/^\d{8}$/.test(dni.trim())) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'El DNI debe contener exactamente 8 dígitos',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    const result = insertOrder.run({
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      dni: dni.trim(),
      direccion: direccion.trim(),
      producto: producto.trim(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        orderId: Number(result.lastInsertRowid),
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('Error guardando pedido:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'No se pudo registrar el pedido',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
