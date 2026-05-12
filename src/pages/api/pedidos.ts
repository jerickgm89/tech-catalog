import type { APIRoute } from 'astro';
import { insertPedido } from '../../lib/db';

export const prerender = false;

interface PedidoPayload {
  nombre?: unknown;
  telefono?: unknown;
  direccion?: unknown;
  producto?: unknown;
  notas?: unknown;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request }) => {
  let body: PedidoPayload;

  try {
    body = (await request.json()) as PedidoPayload;
  } catch {
    return json(400, { success: false, error: 'JSON inválido' });
  }

  const { nombre, telefono, direccion, producto, notas } = body;

  if (
    !isNonEmptyString(nombre) ||
    !isNonEmptyString(telefono) ||
    !isNonEmptyString(direccion) ||
    !isNonEmptyString(producto)
  ) {
    return json(400, {
      success: false,
      error: 'Nombre, teléfono, dirección y producto son obligatorios',
    });
  }

  if (!/^[0-9+\s()-]{6,20}$/.test(telefono.trim())) {
    return json(400, {
      success: false,
      error: 'Teléfono inválido',
    });
  }

  const notasClean =
    typeof notas === 'string' && notas.trim().length > 0 ? notas.trim() : null;

  try {
    const id = await insertPedido({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      producto: producto.trim(),
      notas: notasClean,
    });
    return json(201, { success: true, pedidoId: id });
  } catch (err) {
    console.error('Error guardando pedido:', err);
    return json(500, {
      success: false,
      error: 'No se pudo registrar el pedido',
    });
  }
};
