import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { decryptPayload, encryptPayload } from 'src/utils/crypto.utils';

@Injectable()
export class AuthService {
  private readonly encryptionKey: string;

  constructor(private config: ConfigService) {
    this.encryptionKey = this.config.get('ENCRYPTION_KEY');
  }

  generateToken(userId: string) {
    const payload = { userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 }; // Adding expiration time (1 hour)
    return encryptPayload(payload, this.encryptionKey);
  }

  validateToken(encryptedToken: string) {
    const payload = decryptPayload(encryptedToken, this.encryptionKey);
    if (!payload) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return (payload as any).exp > currentTime;
  }
}
