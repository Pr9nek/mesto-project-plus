import {
  Request, Response, Router, NextFunction,
} from 'express';
import { constants } from 'http2';
import userRouter from './users';
import cardRouter from './cards';

const router = Router();
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error('Not Found');
  (err as any).status = constants.HTTP_STATUS_NOT_FOUND;
  next(err);
});

export default router;
