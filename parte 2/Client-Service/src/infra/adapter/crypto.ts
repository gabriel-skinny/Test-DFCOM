import * as bcrypt from 'bcrypt';

export class CryptoAdapter {
  hash(value: string, saltOrRounds: number): string {
    return bcrypt.hashSync(value, saltOrRounds);
  }

  compare({
    compareValue,
    hashedValue,
  }: {
    compareValue: string;
    hashedValue: string;
  }) {
    return bcrypt.compareSync(compareValue, hashedValue);
  }
}
