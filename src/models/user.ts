import { model, Schema } from 'mongoose';
import validator from 'validator';

export interface IUser {
  name?: string;
  about?: string;
  avatar?: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    dafault: 'Жак-Ив Кусто',
    // required: [true, 'Поле name является обязательным'],
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    dafault: 'Исследователь',
    // required: [true, 'Поле about является обязательным'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Некорректный формат ссылки',
    },
    // required: [true, 'Поле about является обязательным'],
  },
  email: {
    type: String,
    required: [true, 'Поле email является обязательным'],
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Некорректный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле password является обязательным'],
    select: false,
  },
});

export default model<IUser>('user', userSchema);
