# TechCatalog

Catálogo estático de laptops construido con **Astro + Tailwind CSS**. El formulario de pedido no usa base de datos: los datos llenados se envían directamente al **WhatsApp** del vendedor con un mensaje preformateado.

## Stack

- Astro 4 (modo `static`)
- Tailwind CSS 3
- JavaScript vanilla para el modal

## Requisitos

- Node.js 18.17+ o 20+
- npm (o pnpm/yarn equivalente)

## Instalación

```bash
cd tech-catalog
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321).

## Build local

```bash
npm run build
npm run preview
```

El build genera `dist/` con HTML/CSS/JS puro, listo para cualquier CDN.

## Despliegue en Vercel

Vercel autodetecta proyectos Astro estáticos. Tienes dos rutas:

### Opción A — Desde la web (recomendada)

1. Sube el repo a GitHub/GitLab/Bitbucket.
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio.
3. Vercel detecta Astro automáticamente:
   - **Framework Preset:** Astro
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Pulsa **Deploy**.

### Opción B — Desde la terminal

```bash
npm i -g vercel
vercel        # primera vez: te guía para enlazar el proyecto
vercel --prod # despliegue a producción
```

No hay variables de entorno que configurar.

## Estructura

```
tech-catalog/
├── src/
│   ├── components/
│   │   ├── OrderModal.astro     # Modal + envío a WhatsApp
│   │   └── ProductCard.astro    # Tarjeta de producto
│   ├── data/
│   │   └── products.ts          # Catálogo hardcoded (6 laptops)
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/global.css
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## Flujo de pedido

1. Usuario pulsa **Comprar ahora** en una tarjeta.
2. Se abre el modal con el nombre del producto en el encabezado.
3. Al confirmar, el frontend valida (DNI de 8 dígitos, campos obligatorios) y construye el mensaje de WhatsApp.
4. Se abre `https://wa.me/51936114196?text=...` en una nueva pestaña con todos los datos del formulario precargados:

```
¡Hola! Quiero coordinar mi pedido:

*Producto:* MacBook Air M2
*Nombres:* Juan Carlos
*Apellidos:* Pérez Quispe
*DNI:* 12345678
*Dirección de entrega:* Av. Principal 123, Lima
```

## Cambiar el número de WhatsApp

Edita la constante `WHATSAPP_NUMBER` en `src/components/OrderModal.astro` (frontmatter) y el `href` del footer en `src/pages/index.astro`.
