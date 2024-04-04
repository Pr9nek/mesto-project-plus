import { NextFunction, Request, Response } from 'express';

interface IError extends Error {
  statusCode: number;
}

const errorHandler = ((err: IError, req: Request, res: Response, next: NextFunction) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

export default errorHandler;
