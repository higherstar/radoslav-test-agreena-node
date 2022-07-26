import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import UserService from '../services/UserService';
import { IRequest } from '../shared/types/base.types';
import { Payload } from '../shared/types/auth.types';
import {
  EMAIL_EXIST,
  EXPIRED_JWT,
  INVALID_JWT,
  INVALID_REFRESH_TOKEN,
  NOT_FOUND_USER,
  REGISTERED,
  WRONG_EMAIL_PASSWORD
} from '../shared/constants/message.constants';
import { ResponseStatus } from '../shared/constants/global.constants';
import { Users } from '../entities/Users';
import { handleError } from '../shared/utils/error';

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  private comparePasswords = (password, confirm) => {
    const passwordFields = password.split('$');
    const salt = passwordFields[0];
    const hash = crypto.createHmac('sha512', salt).update(confirm).digest('base64');

    return hash === passwordFields[1];
  };

  private generateToken = async (user: Payload) => {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' });

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '3h' });

    return { accessToken, refreshToken };
  };

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

  public fetchMe = async (req: IRequest, res: Response) => {
    const me = await this.userService.findByEmail(req.user.email);

    if (me) {
      res.status(200).send({
        status: ResponseStatus.SUCCESS,
        data: me,
      });
    } else {
      res.status(200).send({
        status: ResponseStatus.FAILED,
        message: NOT_FOUND_USER,
      });
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
      if (this.comparePasswords(user.password, password)) {
        const tokens = await this.generateToken({ id: user.id, email: user.email });

        res.status(200).send(tokens);
      } else {
        return res.status(400).send({
          status: ResponseStatus.INVALID_EMAIL_PASSWORD,
          message: WRONG_EMAIL_PASSWORD,
        });
      }
    }
  };

  public register = async (req: IRequest, res: Response) => {
    try {
      const { email, password } = req.body;

      const exist = await this.userService.findByEmail(email);

      if (exist) {
        return res.status(400).send({ message: EMAIL_EXIST });
      }

      const salt = crypto.randomBytes(16).toString('base64');
      const hash = crypto.createHmac('sha512', salt).update(password).digest('base64');

      const user: Partial<Users> = {
        email: email,
        password: salt + '$' + hash,
      };

      await this.userService.createUser(user);

      res.status(201).send({
        status: ResponseStatus.SUCCESS,
        message: REGISTERED,
      });
    } catch (error) {
      res.status(400).send({ error: error });
    }
  };

  public refresh = async (req: IRequest, res: Response) => {
    try {
      const user = jwt.verify(req.body.refreshToken, process.env.JWT_SECRET) as Payload;

      const tokens = await this.generateToken(user);

      return res.status(200).send(tokens);
    } catch (error) {
      return res.status(400).send({ message: INVALID_REFRESH_TOKEN });
    }
  }
}

export const authController = new AuthController();
