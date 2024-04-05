import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getMe,
} from '../controllers/users';
import { validateUserId, validateUpdateUserBody, validateUpdateUserAvatar } from '../validators';

const userRouter = Router();

userRouter.get('/me', getMe);
userRouter.get('/', getUsers);
userRouter.get('/:userId', validateUserId, getUserById);
userRouter.patch('/me', validateUpdateUserBody, updateUser);
userRouter.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

export default userRouter;
