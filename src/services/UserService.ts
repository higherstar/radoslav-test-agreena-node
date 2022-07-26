import { Service } from 'typedi';
import { getRepository } from 'typeorm';

import { Users } from '../entities/Users';

@Service()
export default class UserService {
  public async createUser(createUserData: Partial<Users>): Promise<Users> {
    const userRepository = getRepository(Users);

    return await userRepository.save(createUserData);
  }

  public async findByEmail(email: string): Promise<Users> {
    return await getRepository(Users).findOne({
      where: { email: email },
    });
  }
}
