import { Service } from 'typedi';
import { getRepository, IsNull } from 'typeorm';

import { CarbonCertificates } from '../entities/CarbonCertificates';
import { Users } from '../entities/Users';
import { CertificateStatus } from '../shared/constants/global.constants';

@Service()
export default class CarbonCertificateService {
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

  public async transfer(id: number, ownerId: number, currentUserId: number) {
    const repository = getRepository(CarbonCertificates);

    const certificate = await repository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!certificate || !certificate.user || certificate.user.id !== currentUserId) {
      return Promise.reject();
    }

    const owner = await getRepository(Users).findOne(ownerId);

    if (!owner || ownerId === currentUserId) {
      return Promise.reject();
    }

    certificate.user = await getRepository(Users).findOne(ownerId);
    certificate.status = CertificateStatus.TRANSFERRED;
    return certificate.save();
  }
}
