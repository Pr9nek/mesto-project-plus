import { Request, Response, Router } from 'express';
import { constants } from 'http2';
import userRouter from './users';
import cardRouter from './cards';

const router = Router();
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/*', (req: Request, res: Response) => {
  res.status(constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Этой страницы не существует' });
});

export default router;
