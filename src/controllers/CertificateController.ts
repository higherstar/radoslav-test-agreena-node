import { Request, Response, NextFunction } from 'express';

import CarbonCertificateService from '../services/CarbonCertificateService';

export class CertificateController {
  private carbonCertificateService: CarbonCertificateService;

  constructor() {
    this.carbonCertificateService = new CarbonCertificateService();
  }

  public getAvailableList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = this.carbonCertificateService.getAvailableList();

      res.json(data);
    } catch (err) {
      next(err);
    }
  };

  public getOwnedList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = this.carbonCertificateService.getOwnedList();
      res.json(data)
    } catch (err) {
      next (err);
    }
  }
}

export const certificateController = new CertificateController();
