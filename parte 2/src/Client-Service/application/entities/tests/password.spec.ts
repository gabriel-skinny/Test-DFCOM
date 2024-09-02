import { Password } from '../Password';

describe('Password entity', () => {
  it('Should create a password entity', () => {
    const plainPassword = 'password';
    const password = new Password(plainPassword);

    expect(password).toBeTruthy();
  });

  it('Should hash the password', () => {
    const plainPassword = 'password';
    const password = new Password(plainPassword);

    password.hashPassword();

    expect(password.value).not.toBe(plainPassword);
  });

  it('Should return true if a password passed has the same value as the password hashed', () => {
    const plainPassword = 'password';
    const password = new Password(plainPassword);

    password.hashPassword();

    const isTheSameValueResult = password.isTheSameValue(plainPassword);

    expect(password).toBeTruthy();
    expect(isTheSameValueResult).toBeTruthy();
  });

  it('Should return false if the password passed has a different value as the password hashed', () => {
    const plainPassword = 'password';
    const password = new Password(plainPassword);

    password.hashPassword();

    const isTheSameValueResult = password.isTheSameValue('diferentValue');

    expect(password).toBeTruthy();
    expect(isTheSameValueResult).toBeFalsy();
  });
});
