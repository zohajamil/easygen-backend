import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function validatePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
