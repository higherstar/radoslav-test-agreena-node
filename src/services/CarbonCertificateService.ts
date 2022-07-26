import { Service } from 'typedi';
import { getRepository, IsNull } from 'typeorm';

import { CarbonCertificates } from '../entities/CarbonCertificates';
import { CertificateStatus } from '../shared/constants/global.constants';
import { Users } from '../entities/Users';

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

  public async getOwnedList(ownerId: number) {
    const repository = getRepository(CarbonCertificates);
    return await repository.find({
      where: {
        user: ownerId,
      }
    });
  }

  public async transfer(id: number, ownerId: number) {
    const repository = getRepository(CarbonCertificates);
    const certificate = await repository.findOne(id);
    certificate.user = await getRepository(Users).findOne(ownerId);
    certificate.status = CertificateStatus.TRANSFERRED;
    return certificate.save();
  }
}
