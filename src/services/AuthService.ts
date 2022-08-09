import { Service } from 'typedi';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import { Payload } from '../shared/types/auth.types';

@Service()
export default class AuthService {
  public comparePasswords(password: string, confirmPassword: string): boolean {
    const passwordFields = password.split('$');
    const salt = passwordFields[0];
    const hash = crypto.createHmac('sha512', salt).update(confirmPassword).digest('base64');

    return hash === passwordFields[1];
  }

  public generateToken(user: Payload): { accessToken: string, refreshToken: string } {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' });

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '3h' });

    return { accessToken, refreshToken };
  }

  public generatePassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.createHmac('sha512', salt).update(password).digest('base64');
    return salt + '$' + hash;
  }
}
