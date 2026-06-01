import { createAccessToken, createOpaqueToken, hashOpaqueToken, verifyAccessToken } from './token';

describe('token helpers', () => {
  const secret = 'test_secret_with_at_least_32_characters';

  it('creates and verifies a signed access token', () => {
    const token = createAccessToken({ id: 'user-a', email: 'user@example.test' }, secret, 60);

    expect(verifyAccessToken(token, secret)).toEqual(
      expect.objectContaining({ sub: 'user-a', email: 'user@example.test' }),
    );
  });

  it('rejects a modified or expired access token', () => {
    const token = createAccessToken({ id: 'user-a', email: 'user@example.test' }, secret, -1);

    expect(verifyAccessToken(`${token}modified`, secret)).toBeUndefined();
    expect(verifyAccessToken(token, secret)).toBeUndefined();
  });

  it('hashes opaque tokens before persistence', () => {
    const token = createOpaqueToken();

    expect(hashOpaqueToken(token)).not.toBe(token);
    expect(hashOpaqueToken(token)).toHaveLength(64);
  });
});
