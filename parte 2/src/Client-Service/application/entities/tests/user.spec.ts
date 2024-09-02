import { User } from '../User';

describe('User entity', () => {
  it('Should create a user entity', () => {
    const user = new User({
      email: 'email@gmail.com',
      name: 'name',
      password: ' plain_password',
    });

    expect(user).toBeTruthy();
  });
});
