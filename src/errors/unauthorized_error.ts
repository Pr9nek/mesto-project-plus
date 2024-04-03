import { UNAUTHORIZED_ERROR } from '../constants';

class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}

export default UnauthorizedError;
