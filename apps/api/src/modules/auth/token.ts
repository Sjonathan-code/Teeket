import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

interface AccessTokenPayload {
  sub: string;
  email: string;
  exp: number;
}

function encode(value: object): string {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function sign(value: string, secret: string): string {
  return createHmac('sha256', secret).update(value).digest('base64url');
}

export function createAccessToken(
  user: { id: string; email: string },
  secret: string,
  ttlSeconds: number,
): string {
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const payload = encode({
    sub: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  });
  const value = `${header}.${payload}`;

  return `${value}.${sign(value, secret)}`;
}

export function verifyAccessToken(token: string, secret: string): AccessTokenPayload | undefined {
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) {
    return undefined;
  }

  const expectedSignature = sign(`${header}.${payload}`, secret);
  const signatureBuffer = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedSignatureBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
  ) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    ) as Partial<AccessTokenPayload>;
    if (
      !parsed.sub ||
      !parsed.email ||
      !parsed.exp ||
      parsed.exp <= Math.floor(Date.now() / 1000)
    ) {
      return undefined;
    }

    return parsed as AccessTokenPayload;
  } catch {
    return undefined;
  }
}

export function createOpaqueToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashOpaqueToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
