/**
 * Shared types — user on request after auth
 */

export interface UserRow {
  id: string;
  anonymous_id: string | null;
  is_anonymous: boolean;
  email: string | null;
  claimed_at: string | null;
  created_at: string;
  deleted_at: string | null;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserRow;
  }
}
