import type { APIRoute } from 'astro';
import { insertPedido } from '../../lib/db';

export const prerender = false;

interface ItemPayload {
  producto?: unknown;
  cantidad?: unknown;
}

interface PedidoPayload {
  nombre?: unknown;
  telefono?: unknown;
  direccion?: unknown;
  notas?: unknown;
  items?: unknown;
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

  const { nombre, telefono, direccion, notas, items } = body;

  if (
    !isNonEmptyString(nombre) ||
    !isNonEmptyString(telefono) ||
    !isNonEmptyString(direccion)
  ) {
    return json(400, {
      success: false,
      error: 'Nombre, teléfono y dirección son obligatorios',
    });
  }

  if (!/^[0-9+\s()-]{6,20}$/.test(telefono.trim())) {
    return json(400, { success: false, error: 'Teléfono inválido' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return json(400, {
      success: false,
      error: 'Debes incluir al menos un producto',
    });
  }

  const cleanItems: { producto: string; cantidad: number }[] = [];
  for (const raw of items) {
    const item = raw as ItemPayload;
    if (!isNonEmptyString(item?.producto)) {
      return json(400, { success: false, error: 'Producto inválido' });
    }
    const qty = Number(item.cantidad);
    if (!Number.isFinite(qty) || qty < 1 || qty > 999) {
      return json(400, {
        success: false,
        error: `Cantidad inválida para ${item.producto}`,
      });
    }
    cleanItems.push({
      producto: item.producto.trim(),
      cantidad: Math.floor(qty),
    });
  }

  const productoSummary = cleanItems
    .map((i) => `${i.producto} x${i.cantidad}`)
    .join(', ');
  const cantidadTotal = cleanItems.reduce((sum, i) => sum + i.cantidad, 0);

  const notasClean =
    typeof notas === 'string' && notas.trim().length > 0 ? notas.trim() : null;

  try {
    const id = await insertPedido({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim(),
      producto: productoSummary,
      cantidad: cantidadTotal,
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
