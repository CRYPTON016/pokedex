import type { Config } from 'drizzle-kit';

// The installed drizzle-kit types may not include some environment-specific
// properties (for example `dialect` or custom `dbCredentials`). Create a
// permissive local type that extends the published `Config` so TypeScript
// accepts the configuration object while preserving the upstream shape.
type LooseConfig = Config & {
  dialect?: string;
  dbCredentials?: Record<string, any>;
};

// Some versions of drizzle-kit may not export `defineConfig`.
// Use a plain object and type-assert to LooseConfig to avoid import/typing errors.
const dbConfig: LooseConfig = {
  schema: './src/db/schema.ts',
  out: './drizzle',
  // Optional runtime/backend dialect (kept for tooling that expects it)
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} as LooseConfig;

export default dbConfig;