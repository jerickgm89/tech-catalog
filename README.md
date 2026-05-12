# TechCatalog

Catálogo de laptops construido con **Astro + Tailwind CSS** que registra pedidos en **SQLite** y redirige a **WhatsApp** para coordinar la entrega.

## Stack

- Astro 4 (modo `server` con adaptador Node)
- Tailwind CSS 3
- better-sqlite3 (persistencia local en `orders.db`)
- JavaScript vanilla para el modal

## Requisitos

- Node.js 18.17+ o 20+
- npm (o pnpm/yarn equivalente)

## Instalación

```bash
cd tech-catalog
npm install
```

> `better-sqlite3` compila bindings nativos durante `npm install`. En macOS basta con tener Xcode Command Line Tools instalado (`xcode-select --install`).

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321).

## Producción

```bash
npm run build
npm run preview
```

El build genera un servidor Node en `dist/server/entry.mjs`.

## Estructura

```
tech-catalog/
├── src/
│   ├── components/
│   │   ├── OrderModal.astro     # Modal + lógica de envío
│   │   └── ProductCard.astro    # Tarjeta de producto
│   ├── data/
│   │   └── products.ts          # Catálogo hardcoded (6 laptops)
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── api/
│   │   │   └── orders.ts        # POST /api/orders -> SQLite
│   │   └── index.astro
│   └── styles/global.css
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## API

### `POST /api/orders`

Body JSON:

```json
{
  "nombres": "Juan Carlos",
  "apellidos": "Pérez Quispe",
  "dni": "12345678",
  "direccion": "Av. Principal 123, Lima",
  "producto": "MacBook Air M2"
}
```

Respuesta exitosa (`201`):

```json
{ "success": true, "orderId": 1 }
```

Errores: `400` (datos inválidos) o `500` (fallo guardando).

## Base de datos

El archivo `orders.db` se crea automáticamente en la raíz del proyecto la primera vez que arranca el servidor. Tabla:

```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombres TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  dni TEXT NOT NULL,
  direccion TEXT NOT NULL,
  producto TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Flujo de pedido

1. Usuario pulsa **Comprar ahora** en una tarjeta.
2. Se abre el modal con el nombre del producto en el encabezado.
3. Al confirmar, el frontend valida y hace `POST /api/orders`.
4. Si el backend responde OK, se abre WhatsApp en una nueva pestaña con el mensaje precompletado:

```
https://wa.me/51936114196?text=Hola!%20Quiero%20coordinar%20mi%20pedido%20de%20...
```
