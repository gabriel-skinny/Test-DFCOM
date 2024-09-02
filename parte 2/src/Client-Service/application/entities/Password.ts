import { CryptoAdapter } from '../../infra/adapter/crypto';
import { PASSWORD_SALT } from '../constants/password';

export class Password {
  private _password: string;
  private cryptoAdapter: CryptoAdapter;

  constructor(value: string) {
    this.cryptoAdapter = new CryptoAdapter();
    this._password = value;
  }

  get value() {
    return this._password;
  }

  public hashPassword() {
    this._password = this.cryptoAdapter.hash(this._password, PASSWORD_SALT);
  }

  public isTheSameValue(plainValue: string) {
    return this.cryptoAdapter.compare({
      compareValue: plainValue,
      hashedValue: this._password,
    });
  }
}
