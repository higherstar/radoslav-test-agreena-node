import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import UserService from '../services/UserService';
import AuthService from '../services/AuthService';
import { handleError } from '../shared/utils/error';
import { Users } from '../entities/Users';
import { IRequest } from '../shared/types/base.types';
import { Payload } from '../shared/types/auth.types';
import { ResponseStatus } from '../shared/constants/global.constants';
import {
  EMAIL_EXIST,
  EXPIRED_JWT,
  INVALID_JWT,
  INVALID_REFRESH_TOKEN,
  REGISTERED,
  WRONG_EMAIL_PASSWORD,
} from '../shared/constants/message.constants';

export class AuthController {
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  public verifyJWT = (req: IRequest, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization.split(' ');

    if (authorization[0] !== 'Bearer') {
      return res.status(401).send({ message: INVALID_JWT });
    } else {
      try {
        req.user = jwt.verify(authorization[1], process.env.JWT_SECRET) as Payload;
        return next();
      } catch (error) {
        return handleError(res, 401, EXPIRED_JWT, ResponseStatus.EXPIRED_JWT);
      }
    }
  };

  public login = async (req: IRequest, res: Response) => {
    const { email, password } = req.body;
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return res.status(404).send({
        status: ResponseStatus.INVALID_EMAIL_PASSWORD,
        message: WRONG_EMAIL_PASSWORD,
      });
    } else {
      if (this.authService.comparePasswords(user.password, password)) {
        const tokens = this.authService.generateToken({ id: user.id, email: user.email });
        return res.status(200).send(tokens);
      } else {
        return handleError(res, 400, WRONG_EMAIL_PASSWORD, ResponseStatus.INVALID_EMAIL_PASSWORD);
      }
    }
  };

  public register = async (req: IRequest, res: Response) => {
    try {
      const { email, password } = req.body;
      const exist = await this.userService.findByEmail(email);

      if (exist) {
        return handleError(res, 400, EMAIL_EXIST, ResponseStatus.FAILED);
      }

      const user: Partial<Users> = {
        email: email,
        password: this.authService.generatePassword(password),
      };
      await this.userService.createUser(user);
      return res.status(201).send({
        status: ResponseStatus.SUCCESS,
        message: REGISTERED,
      });
    } catch (error) {
      return handleError(res, 400, error, ResponseStatus.FAILED);
    }
  };

  public refresh = async (req: IRequest, res: Response) => {
    try {
      const user = jwt.verify(req.body.refreshToken, process.env.JWT_SECRET) as Payload;
      const tokens = this.authService.generateToken(user);
      return res.status(200).send(tokens);
    } catch (error) {
      return  handleError(res, 400, INVALID_REFRESH_TOKEN, ResponseStatus.FAILED);
    }
  }
}

export const authController = new AuthController();
