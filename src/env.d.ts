/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly TURSO_DATABASE_URL: string;
  readonly TURSO_AUTH_TOKEN?: string;
  readonly ADMIN_USER: string;
  readonly ADMIN_PASSWORD: string;
  readonly SESSION_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
