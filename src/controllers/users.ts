import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import User from '../models/user';
import { SOLT_ROUND } from '../constants';
import AuthenticationError from '../errors/authentication_error';
import BadRequestError from '../errors/badrequest_error';
import NotFoundError from '../errors/notfound_error';
import ConflictError from '../errors/conflict_error';
import generateToken from '../utils/jwt';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id).orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    });
    return res.send(user);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Пользователь по указанному _id не найден'));
    }
    return next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      throw new NotFoundError('Пользователя с переданным ID нет в базе');
    });
    return res.send(user);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Невалидный идентификатор'));
    }
    return next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;
    const hash = await bcrypt.hash(password, SOLT_ROUND);
    const newUser = new User({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    return res.status(constants.HTTP_STATUS_CREATED).send(await newUser.save());
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Некорректные данные пользователя'));
    }
    if (error instanceof Error && error.message.startsWith('E11000')) {
      return next(new ConflictError('Конфликт создания сущности в БД'));
    }
    return next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
      .orFail(() => {
        throw new NotFoundError('Пользователя с переданным ID нет в базе');
      });
    return res.send(user);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Некорректные данные для обновления профиля'));
    }
    return next(error);
  }
};

export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      avatar,
      {
        new: true,
        runValidators: true,
      },
    )
      .orFail(() => {
        throw new NotFoundError('Пользователя с переданным ID нет в базе');
      });
    return res.send(user);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return (new BadRequestError('Некорректные данные аватара профиля'));
    }
    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body || {};
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthenticationError('Неправильные почта или пароль');
    }
    const matched = await bcrypt.compare(password, user!.password);
    if (!matched) {
      throw new AuthenticationError('Неправильные почта или пароль');
    }
    const token = generateToken({ _id: user?._id });

    return res
      .status(200)
      .send({ data: { _id: user?._id }, token });
  } catch (error) {
    return next(error);
  }
};
