import { Service } from 'typedi';
import { getRepository, IsNull, Not } from 'typeorm';

import { CarbonCertificates } from '../entities/CarbonCertificates';

@Service()
export default class CarbonCertificateService {
  public async create(createData: Partial<CarbonCertificates>): Promise<CarbonCertificates> {
    const repository = getRepository(CarbonCertificates);

    return await repository.save(createData);
  }

  public async getAvailableList() {
    const repository = getRepository(CarbonCertificates);
    return await repository.find({
      where: {
        user: IsNull(),
      }
    });
  }

  public async getOwnedList() {
    const repository = getRepository(CarbonCertificates);
    return await repository.find({
      where: {
        user: Not(IsNull()),
      }
    });
  }
}
