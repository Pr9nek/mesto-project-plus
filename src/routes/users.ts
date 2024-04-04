import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getMe,
} from '../controllers/users';

const userRouter = Router();

userRouter.get('/me', getMe);
userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;
