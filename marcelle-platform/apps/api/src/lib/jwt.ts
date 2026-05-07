import jwt from 'jsonwebtoken'
import type { TokenPayload } from '@marcelle/types'

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'dev-secret-change-in-production'
const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] ?? '7d'
const REFRESH_EXPIRES_IN = '30d'

export function signAccessToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions)
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN } as jwt.SignOptions)
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload
}
