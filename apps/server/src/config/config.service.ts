import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor() {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      this.envConfig = dotenv.parse(fs.readFileSync(envPath));
    } else {
      this.envConfig = process.env as Record<string, string>;
    }
  }

  get(key: string, defaultValue?: string): string {
    return this.envConfig[key] ?? defaultValue ?? '';
  }

  getNumber(key: string, defaultValue = 0): number {
    const value = this.get(key);
    return value ? Number(value) : defaultValue;
  }

  getBoolean(key: string, defaultValue = false): boolean {
    const value = this.get(key);
    return value ? value === 'true' : defaultValue;
  }

  get port(): number {
    return this.getNumber('PORT', 3000);
  }

  get databaseUrl(): string {
    return this.get('DATABASE_URL', 'mysql://root:password@localhost:3306/hjh538');
  }

  get redisHost(): string {
    return this.get('REDIS_HOST', 'localhost');
  }

  get redisPort(): number {
    return this.getNumber('REDIS_PORT', 6379);
  }

  get redisPassword(): string {
    return this.get('REDIS_PASSWORD', '');
  }

  get jwtSecret(): string {
    return this.get('JWT_SECRET', 'hjh538-secret-key-dev');
  }

  get jwtExpiresIn(): string {
    return this.get('JWT_EXPIRES_IN', '7d');
  }
}
