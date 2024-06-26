import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import AuthenticationError from '../errors/authentication_error';

interface UserPayload {
  _id: ObjectId;
}

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthenticationError('Отсутствует авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'dev_secret') as UserPayload;
  } catch (err) {
    throw new AuthenticationError('Отсутствует авторизация');
  }
  req.user = payload;
  return next();
};
