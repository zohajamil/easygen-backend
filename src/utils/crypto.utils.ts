import * as crypto from 'crypto';

export function encryptPayload(payload: object, encryptionKey: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey),
    iv,
  );
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Return in format iv:encrypted payload to decrypt later
  return iv.toString('hex') + ':' + encrypted;
}

export function decryptPayload(
  encryptedData: string,
  encryptionKey: string,
): object | null {
  const [ivHex, encrypted] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey),
    iv,
  );
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  try {
    return JSON.parse(decrypted);
  } catch {
    return null;
  }
}
