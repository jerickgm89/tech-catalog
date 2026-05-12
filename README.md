# TechCatalog

Catálogo de laptops construido con **Astro + Tailwind CSS**. Tres flujos:

1. **Pedir ahora 🛒** — botón por tarjeta que abre WhatsApp con un mensaje predefinido (`Hola, quiero pedir: [nombre] [precio]`).
2. **Hacer pedido 🍰** — botón flotante en la home que abre un formulario completo (nombre, teléfono, dirección, producto, notas) y guarda en **Turso (libSQL)**.
3. **/admin** — panel protegido con login (usuario + contraseña) para visualizar los pedidos.

Las tarjetas marcadas como **no disponibles** ocultan el botón y muestran *“😔 Agotado por el momento”* en gris.

## Stack

- Astro 4 (modo `server` con adaptador `@astrojs/vercel`)
- Tailwind CSS 3
- Turso / libSQL (`@libsql/client`) para persistir pedidos
- Cookie firmada HMAC-SHA256 para la sesión del admin (sin librerías externas)

## Requisitos

- Node.js 18.17+ o 20+
- Cuenta en [Turso](https://turso.tech) (free tier OK)
- Cuenta en [Vercel](https://vercel.com) para el deploy

## Configuración inicial

### 1. Clonar e instalar

```bash
cd tech-catalog
npm install
cp .env.example .env
```

### 2. Crear la base de datos en Turso

```bash
# Instala el CLI una sola vez
brew install tursodatabase/tap/turso     # macOS
# o: curl -sSfL https://get.tur.so/install.sh | bash

turso auth signup     # o `turso auth login` si ya tienes cuenta
turso db create tech-catalog
turso db show tech-catalog --url        # copia esta URL
turso db tokens create tech-catalog      # copia este token
```

Pega ambos valores en `.env`:

```env
TURSO_DATABASE_URL=libsql://tech-catalog-xxxxx.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOi...
```

> La tabla `pedidos` se crea automáticamente la primera vez que un cliente envía el formulario.

### 3. Configurar el admin

En `.env`:

```env
ADMIN_USER=admin
ADMIN_PASSWORD=la-clave-que-quieras
SESSION_SECRET=$(openssl rand -base64 48)   # pega el resultado aquí
```

### 4. Desarrollo

```bash
npm run dev
```

- Catálogo: [http://localhost:4321](http://localhost:4321)
- Admin: [http://localhost:4321/admin](http://localhost:4321/admin)

## Despliegue en Vercel

1. Sube el repo a GitHub.
2. En [vercel.com/new](https://vercel.com/new) importa el repositorio.
3. Vercel autodetecta Astro. **No modifiques** los comandos.
4. En **Environment Variables** añade las mismas cuatro variables (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `ADMIN_USER`, `ADMIN_PASSWORD`, `SESSION_SECRET`).
5. Click **Deploy**.

Cualquier push a `main` redeplega automáticamente.

## Estructura

```
tech-catalog/
├── src/
│   ├── components/
│   │   ├── OrderModal.astro       # Botón flotante 🍰 + form completo (RETO 3)
│   │   └── ProductCard.astro      # Tarjeta + botón 🛒 / texto Agotado (RETO 1+2)
│   ├── data/products.ts           # Catálogo hardcoded con campo `disponible`
│   ├── layouts/Layout.astro
│   ├── lib/
│   │   ├── auth.ts                # HMAC, cookie firmada, checkCredentials
│   │   └── db.ts                  # Cliente Turso + helpers para `pedidos`
│   ├── pages/
│   │   ├── index.astro            # Home (prerender)
│   │   ├── admin/
│   │   │   ├── index.astro        # Listado de pedidos (protegido)
│   │   │   └── login.astro
│   │   └── api/
│   │       ├── pedidos.ts         # POST → guarda en Turso
│   │       └── auth/
│   │           ├── login.ts
│   │           └── logout.ts
│   └── styles/global.css
├── astro.config.mjs               # output: 'server' + adapter Vercel
├── tailwind.config.mjs
└── package.json
```

## Flujos

### RETO 1 — Pedir ahora 🛒
Click en el botón → abre `https://wa.me/51999999999?text=Hola,%20quiero%20pedir:%20<producto>%20<precio>` en nueva pestaña.

### RETO 2 — Visibilidad
Cuando `product.disponible === false`, la tarjeta:
- aplica `grayscale` a la imagen,
- añade un badge **“Agotado”** sobre la imagen,
- reemplaza el botón por el texto **“😔 Agotado por el momento”** en gris (`text-gray-400`).

### RETO 3 — Hacer pedido 🍰
Botón flotante (esquina inferior derecha) → abre modal con:
- Nombre del cliente
- Teléfono
- Dirección de entrega
- Producto (selector con los 6 ítems del catálogo)
- Notas (opcional — “sin azúcar”, “con dedicatoria”, etc.)

Al confirmar hace `POST /api/pedidos` → guarda en la tabla `pedidos` de Turso → muestra mensaje de éxito con el ID.

### Admin

- `/admin/login` — formulario de usuario/contraseña.
- `/admin` — listado de pedidos (más recientes primero), con teléfono clickeable como enlace `tel:`. Botón **Cerrar sesión** en el header.

Sesión: cookie HTTP-only `tc_session` con payload `{ u, exp }` firmado con `SESSION_SECRET`. Dura 8 horas.

## Esquema de la tabla

```sql
CREATE TABLE pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  direccion TEXT NOT NULL,
  producto TEXT NOT NULL,
  notas TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Notas

- Si cambias `SESSION_SECRET` en producción, todas las sesiones activas se invalidan.
- Para revisar los pedidos desde la terminal: `turso db shell tech-catalog "SELECT * FROM pedidos;"`.
- Para cambiar el número de WhatsApp edita `WHATSAPP_NUMBER` en `src/components/ProductCard.astro`.
