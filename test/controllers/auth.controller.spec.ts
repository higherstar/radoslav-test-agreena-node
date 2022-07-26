import request from 'supertest';

import app from '../../src/app';
import { connect } from '../../src/typeorm';
import UserFactory from '../factories/user.factory';

beforeAll(async () => {
    await connect();
});

describe('Auth API', () => {
    it('Sign in successfully.', async () => {
        const user = await UserFactory();
        const actual = await request(app)
            .post('/api/auth/signin')
            .send({ email: user.email, password: 'test12345!'});
        expect(actual.status).toBe(200);
    });

    it('Sign in failed.', async () => {
        const actual = await request(app)
          .post('/api/auth/signin')
          .send({ email: 'invalid', password: 'invalid'});
        expect(actual.status).toBe(404);
    });
});
