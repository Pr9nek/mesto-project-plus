import { Request, Response, NextFunction } from 'express';
import { constants } from 'http2';
import { Error as MongooseError } from 'mongoose';
import Card from '../models/card';
import ForbiddenError from '../errors/forbidden_error';
import NotFoundError from '../errors/notfound_error';
import BadRequestError from '../errors/badrequest_error';

export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return next(error);
  }
};

export const delCardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).orFail(() => {
      throw new NotFoundError('Карточки с переданным ID нет в базе');
    });
    if (req.user?._id !== card?.owner.toString()) {
      throw new ForbiddenError('Можно удалять только свои карточки');
    }
    await card.delete();
    return res.send({ message: 'Карточка удалена' });
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Невалидный идентификатор'));
    }
    return next(error);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const newCard = new Card({ name, link, owner: req.user?._id });
    return res.status(constants.HTTP_STATUS_CREATED).send(await newCard.save());
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError('Некорректные данные карты'));
    }
    return next(error);
  }
};

export const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .orFail(() => {
        throw new NotFoundError('Карточки с переданным ID нет в базе');
      });
    return res.send(card);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Невалидный идентификатор'));
    }
    return next(error);
  }
};

export const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .orFail(() => {
        throw new NotFoundError('Карточки с переданным ID нет в базе');
      });
    return res.send(card);
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Невалидный идентификатор'));
    }
    return next(error);
  }
};
