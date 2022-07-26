import {MigrationInterface, QueryRunner} from "typeorm";
import crypto from "crypto";
import {Users} from "../entities/Users";
import {CarbonCertificates} from "../entities/CarbonCertificates";
import {CertificateStatus} from "../shared/constants/global.constants";

export class seed1658854921278 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const certificateRepository = queryRunner.connection.getRepository(CarbonCertificates);
        const userRepository = queryRunner.connection.getRepository(Users);
        const owners: Users[] = [];

        const salt = crypto.randomBytes(16).toString('base64');
        const hash = crypto.createHmac('sha512', salt).update('test12345!').digest('base64');

        const password = salt + '$' + hash;

        for (let i = 0; i < 10; i ++) {
            const demoUser: Partial<Users> = {
                email: i === 0 ? 'goldbyol@email.com' : `demo_${i}@email.com`,
                password,
            };
            const createdUser = await userRepository.save(demoUser);
            owners.push(createdUser);
        }

        for (let i = 0; i < 100; i ++) {
            const certificate: Partial<CarbonCertificates> = {
                country: 'Italy',
            };

            if (i < 5) {
                certificate.user = owners[i];
                certificate.status = CertificateStatus.OWNED;
            }

            await certificateRepository.save(certificate);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
