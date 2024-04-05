import { Router } from 'express';
import {
  getCards,
  delCardById,
  createCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { validateCardId, validateCardBody, validateLikeParams } from '../validators';

const cardRouter = Router();

cardRouter.get('/', getCards);
cardRouter.delete('/:cardId', validateCardId, delCardById);
cardRouter.post('/', validateCardBody, createCard);
cardRouter.put('/:cardId/likes', validateLikeParams, likeCard);
cardRouter.delete('/:cardId/likes', validateLikeParams, dislikeCard);

export default cardRouter;
