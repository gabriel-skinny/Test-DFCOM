import { IUserProps, User } from 'Client-Service/src/application/entities/User';

export const makeUser = (props?: Partial<IUserProps>) => {
  return new User({
    name: 'Nome',
    email: 'email@gmail.com',
    password: 'plain_password',
    ...props,
  });
};
