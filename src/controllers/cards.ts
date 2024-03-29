import { Request, Response } from "express";
import { constants } from "http2";
import { Error as MongooseError } from "mongoose";
import Card from "../models/card";
import ForbiddenError from "../errors/forbidden_error";

export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: "Ошибка на стороне сервера" });
  }
};

export const delCardById = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).orFail(() => {
      const error = new Error("Карточки с переданным ID нет в базе");
      error.name = "NotFoundError";
      return error;
    });

    if (req.user?._id !== card?.owner.toString()) {
      throw new ForbiddenError("Можно удалять только свои карточки");
    }
    await card.delete();
    return res.send({ message: 'Карточка удалена' });

  } catch (error) {
    if (error instanceof Error && error.name === "NotFoundError") {
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: error.message });
    }

    if (error instanceof MongooseError.CastError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: "Невалидный идентификатор" });
    }

    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: "Ошибка на сервера" });
  }
};


export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const newCard = new Card({ name, link, owner: req.user?._id });
    return res.status(constants.HTTP_STATUS_CREATED).send(await newCard.save());

  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: error.message });
    }

    if (error instanceof Error && error.message.startsWith("E11000")) {
      return res
        .status(constants.HTTP_STATUS_CONFLICT)
        .send({ message: "Конфликт создания сущности в БД" });
    }

    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: "Ошибка на сервера" });
  }
};

export const likeCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }).orFail(() => {
        const error = new Error("Карточки с переданным ID нет в базе");
        error.name = "NotFoundError";
        return error;
      });

    return res.send(card);

  } catch (error) {
    if (error instanceof Error && error.name === "NotFoundError") {
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: error.message });
    }

    if (error instanceof MongooseError.CastError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: "Невалидный идентификатор" });
    }

    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: "Ошибка на сервера" });
  }
};

export const dislikeCard = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findByIdAndUpdate(cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true })
      .orFail(() => {
      const error = new Error("Карточки с переданным ID нет в базе");
      error.name = "NotFoundError";
      return error;
    });
    // if (!card) {
    //   res.send({ message: 'Карточка по указанному _id не найдена' })
    // }

    return res.send(card);

  } catch (error) {
    if (error instanceof Error && error.name === "NotFoundError") {
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: error.message });
    }

    if (error instanceof MongooseError.CastError) {
      return res
        .status(constants.HTTP_STATUS_BAD_REQUEST)
        .send({ message: "Невалидный идентификатор" });
    }

    return res
      .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: "Ошибка на сервера" });
  }
};