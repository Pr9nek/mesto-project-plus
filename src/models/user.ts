import { model, Schema } from 'mongoose';
import validator from 'validator';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'Поле name является обязательным'],
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: [true, 'Поле about является обязательным'],
  },
  avatar: {
    type: String,
    required: [true, 'Поле about является обязательным'],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Некорректный формат ссылки',
    },
  },
});

export default model<IUser>('user', userSchema);
