import { Request, Response } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import User from '../models/user';
import { VALIDATION_ERROR, DATA_NOT_FOUND } from '../constants';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      const error = new Error('Пользователя с переданным ID нет в базе');
      error.name = 'NotFoundError';
      return error;
    });
    return res.send(user);
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res
        .status(DATA_NOT_FOUND)
        .send({ message: error.message });
    }
    if (error instanceof MongooseError.CastError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Невалидный идентификатор' });
    }
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на сервера' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    return res.status(constants.HTTP_STATUS_CREATED).send(await newUser.save());
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: error.message });
    }
    if (error instanceof Error && error.message.startsWith('E11000')) {
      return res
        .status(constants.HTTP_STATUS_CONFLICT)
        .send({ message: 'Конфликт создания сущности в БД' });
    }
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на сервера' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    // const { userId } = req.params;
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
        const error = new Error('Пользователя с переданным ID нет в базе');
        error.name = 'NotFoundError';
        return error;
      });
    return res.send(user);
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res
        .status(DATA_NOT_FOUND)
        .send({ message: error.message });
    }
    if (error instanceof MongooseError.ValidationError) {
      return res
        .status(VALIDATION_ERROR)
        .send({ message: 'Некорректные данные для обновления профиля' });
    }

    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на сервере' });
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    // const { userId } = req.params;
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
        const error = new Error('Пользователя с переданным ID нет в базе');
        error.name = 'NotFoundError';
        return error;
      });
    return res.send(user);
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res
        .status(DATA_NOT_FOUND)
        .send({ message: error.message });
    }
    if (error instanceof MongooseError.ValidationError) {
      return res
        .status(VALIDATION_ERROR)
        .send({ message: 'Некорректные данные аватара профиля' });
    }
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на сервере' });
  }
};
