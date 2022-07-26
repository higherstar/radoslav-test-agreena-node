import { NextFunction, Response } from 'express';

import { authController } from '../controllers/AuthController';
import { IRequest } from '../shared/types/base.types';
import { ResponseStatus } from '../shared/constants/global.constants';
import { NOT_ALLOWED_MODIFY } from '../shared/constants/message.constants';

export const authenticate = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers as any;

    if (authorization) {
      return authController.verifyJWT(req, res, next);
    } else {
      return res.status(401).send({
        status: ResponseStatus.FAILED,
        message: NOT_ALLOWED_MODIFY,
      });
    }
  } catch (e) {
    next(e);
  }
};