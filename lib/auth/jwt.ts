import jwt from 'jsonwebtoken';

const SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-this';

export interface JWTPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Token decode failed:', error);
    return null;
  }
}
