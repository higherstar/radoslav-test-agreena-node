import crypto from 'crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { Users } from '../entities/Users';

export class user1652054021816 implements MigrationInterface {
  name = 'userMigration';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.connection.getRepository(Users);

    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.createHmac('sha512', salt).update('test12345!').digest('base64');

    const password = salt + '$' + hash;
    const demoUser: Partial<Users> = {
      email: 'demo@email.com',
      password,
    };

    await userRepository.save(demoUser);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
