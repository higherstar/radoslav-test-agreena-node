import { getRepository } from 'typeorm';

import { CarbonCertificates } from '../../src/entities/CarbonCertificates';
import { Users } from '../../src/entities/Users';

const CertificateFactory = async (user?: Users): Promise<CarbonCertificates> => {
    const certificate: Partial<CarbonCertificates> = {
        country: 'Italy',
    };

    if (user) {
        certificate.user = user;
    }

    return await getRepository(CarbonCertificates).save(certificate);
};

export default CertificateFactory;
