import { NextFunction, Response } from 'express';

import { authController } from '../controllers/AuthController';
import { IRequest } from '../shared/types/base.types';
import { ResponseStatus } from '../shared/constants/global.constants';
import { NOT_ALLOWED } from '../shared/constants/message.constants';
import { handleError } from '../shared/utils/error';

export const authenticate = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers as any;

    if (authorization) {
      return authController.verifyJWT(req, res, next);
    } else {
      return handleError(res, 401, NOT_ALLOWED, ResponseStatus.FAILED);
    }
  } catch (e) {
    next(e);
  }
};