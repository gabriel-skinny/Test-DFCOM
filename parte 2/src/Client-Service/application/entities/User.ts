import { randomUUID } from 'crypto';
import { Password } from './Password';

export interface IUserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class User {
  readonly id: string;
  public name: string;
  public email: string;
  readonly password_hash: Password;
  readonly createdAt: Date;
  public updatedAt?: Date;
  public deletedAt?: Date;

  constructor(props: IUserProps) {
    this.id = props.id || randomUUID();
    this.name = props.name;
    this.email = props.email;
    this.password_hash = new Password(props.password);
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }
}
