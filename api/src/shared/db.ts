/**
 * Supabase Postgres — service_role only. All access via this pool.
 * RLS disabled on all tables.
 * Set DATABASE_URL to the Postgres connection URI (Supabase: Project Settings → Database → Connection string, Session mode).
 */

import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required (Postgres connection URI)');
}

export const pool = new pg.Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
});
