import { NotFoundError } from 'src/application/errors/notFound';
import { WrongValueError } from 'src/application/errors/wrongValue';
import { JwtMock } from 'src/application/services/jwtMock';
import { InMemoryUserRepository } from '../../../repositories/inMemoryUserRepository';
import { LoginUseCase } from '../login';
import { makeUser } from './factories/makeUser';

const makeSut = () => {
  const userRepository = new InMemoryUserRepository();
  const jwtService = new JwtMock();
  const loginUseCase = new LoginUseCase(userRepository, jwtService);

  return { userRepository, loginUseCase, jwtService };
};

describe('Login user use case', () => {
  it('A user should login with the rigth credentials', async () => {
    const { userRepository, loginUseCase } = makeSut();

    const plainPassword = 'plainPassword';
    const userRegistred = makeUser({ password: plainPassword });
    userRegistred.password_hash.hashPassword();
    await userRepository.save(userRegistred);

    const response = await loginUseCase.execute({
      email: userRegistred.email,
      password: plainPassword,
    });

    expect(response.token).toBeTruthy();
  });

  it('Should throw an NotFoundError if a user does not exists with that email', async () => {
    const { loginUseCase } = makeSut();

    const loginUseCasePromise = loginUseCase.execute({
      email: 'nonExistingEmail@gmail.com',
      password: 'password',
    });

    expect(loginUseCasePromise).rejects.toStrictEqual(
      new NotFoundError('User not found with that email'),
    );
  });

  it('Should throw an error if a user tries to login with the wrong password', async () => {
    const { userRepository, loginUseCase } = makeSut();

    const plainPassword = 'plainPassword';
    const userRegistred = makeUser({ password: plainPassword });
    userRegistred.password_hash.hashPassword();
    await userRepository.save(userRegistred);

    const loginUseCasePromise = loginUseCase.execute({
      email: userRegistred.email,
      password: 'wrongPassword',
    });

    expect(loginUseCasePromise).rejects.toStrictEqual(
      new WrongValueError('Password does not match'),
    );
  });
});
