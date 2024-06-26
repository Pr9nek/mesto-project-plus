import mongoose from 'mongoose';
import validator from 'validator';

export interface ICard {
  name: string;
  link: string;
  owner: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[],
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'Поле name является обязательным'],
  },
  link: {
    type: String,
    required: [true, 'Поле about является обязательным'],
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Некорректный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

export default mongoose.model<ICard>('card', cardSchema);
