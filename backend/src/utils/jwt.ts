import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';

export const signToken = (id: string, secret: string, expiresIn: string) => {
  return jwt.sign({ id, jti: crypto.randomUUID() }, secret, {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as { id: string; jti: string; iat: number; exp: number };
};