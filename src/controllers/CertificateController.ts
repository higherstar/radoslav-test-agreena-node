import { Request, Response, NextFunction } from 'express';

import CarbonCertificateService from '../services/CarbonCertificateService';
import { handleError } from '../shared/utils/error';
import { IRequest } from '../shared/types/base.types';
import { ResponseStatus } from '../shared/constants/global.constants';

export class CertificateController {
  private carbonCertificateService: CarbonCertificateService;

  constructor() {
    this.carbonCertificateService = new CarbonCertificateService();
  }

  public getAvailableList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.carbonCertificateService.getAvailableList();
      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  public getOwnedList = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.carbonCertificateService.getOwnedList(req.user.id);
      res.json(data)
    } catch (err) {
      next (err);
    }
  };

  public transfer = async (req: IRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { userId } = req.query;
      const data = await this.carbonCertificateService.transfer(+id, +userId, req.user.id);
      return res.json(data)
    } catch (err) {
      return handleError(res, 400, null, ResponseStatus.FAILED);
    }
  }
}

export const certificateController = new CertificateController();
