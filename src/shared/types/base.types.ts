import { Request } from 'express';

import { Payload } from './auth.types';

export interface IRequest extends Request {
  user: Payload;
}
