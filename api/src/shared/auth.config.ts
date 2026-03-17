/**
 * JWT and refresh cookie config — TechSpec 2.3
 */

export const JWT_CONFIG = {
  accessTokenTTL: '15m',
  refreshTokenTTL: '7d',
  algorithm: 'HS256' as const,
  get secret(): string {
    const s = process.env.JWT_SECRET;
    if (!s || s.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');
    return s;
  },
};

export const REFRESH_COOKIE_CONFIG = {
  name: 'fw_refresh',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60, // 7 days
  path: '/api/v1/auth',
};
