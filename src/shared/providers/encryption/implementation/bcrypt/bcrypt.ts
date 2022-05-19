import { Encryption } from '../../contracts/encryption';
import { hash, compare } from 'bcryptjs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Bcrypt implements Encryption {
  hash(value: string): Promise<string> {
    const saltOrRounds = 10;
    return hash(value, saltOrRounds);
  }
  compare(value: string, hash: string): Promise<boolean> {
    return compare(value, hash);
  }
}
