import { hashPassword, verifyPassword } from './password';

describe('password helpers', () => {
  it('hashes and verifies a password without storing it in clear text', async () => {
    const password = 'TeeketDemo123!';
    const passwordHash = await hashPassword(password);

    expect(passwordHash).not.toContain(password);
    await expect(verifyPassword(password, passwordHash)).resolves.toBe(true);
    await expect(verifyPassword('wrong-password', passwordHash)).resolves.toBe(false);
  });
});
