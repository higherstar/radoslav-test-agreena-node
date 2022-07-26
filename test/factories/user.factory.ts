import { getRepository } from 'typeorm';
import crypto from 'crypto';
import faker from 'faker';

import { Users } from '../../src/entities/Users';

const UserFactory = async (): Promise<Users> => {
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.createHmac('sha512', salt).update('test12345!').digest('base64');

    const user: Partial<Users> = {
        email: faker.internet.email(),
        password: salt + '$' + hash,
    };
    return await getRepository(Users).save(user);
};

export default UserFactory;
