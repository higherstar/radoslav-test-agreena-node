import request from 'supertest';

import app from '../../src/app';
import { connect } from '../../src/typeorm';
import UserFactory from '../factories/user.factory';
import CertificateFactory from "../factories/certificate.factory";
import {CertificateStatus} from "../../src/shared/constants/global.constants";

let token;

beforeAll(async () => {
    await connect();
});

describe('Certificate API', () => {
    beforeEach(async () => {
        const user = await UserFactory();
        const actual = await request(app)
          .post('/api/auth/signin')
          .send({ email: user.email, password: 'test12345!'});
        token = actual.body.accessToken;
    });

    it('Get allowed list', async () => {
        const certificate = await CertificateFactory();

        const actual = await request(app)
          .get(`/api/certificate/allowed-list`)
          .set('authorization', `Bearer ${token}`)
          .send();
        expect(actual.status).toBe(200);
    });

    it('Get owned list', async () => {
        const certificate = await CertificateFactory();

        const actual = await request(app)
          .get(`/api/certificate/owned-list`)
          .set('authorization', `Bearer ${token}`)
          .send();
        expect(actual.status).toBe(200);
    });

    it('Transfer certificate', async () => {
        const user = await UserFactory();
        const newUser = await UserFactory();
        const certificate = await CertificateFactory(user);

        const authResponse = await request(app)
          .post('/api/auth/signin')
          .send({ email: user.email, password: 'test12345!'});
        token = authResponse.body.accessToken;

        const actual = await request(app)
          .post(`/api/certificate/transfer/${certificate.id}?userId=${newUser.id}`)
          .set('authorization', `Bearer ${authResponse.body.accessToken}`)
          .send();
        expect(actual.status).toBe(200);
        expect(actual.body.id).toBe(certificate.id);
        expect(actual.body.status).toBe(CertificateStatus.TRANSFERRED);
    });
});
