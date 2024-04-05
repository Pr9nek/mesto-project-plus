import 'dotenv/config';
import { errors } from 'celebrate';
import express from 'express';
import mongoose from 'mongoose';
import { requestLogger, errorLogger } from './middlewares/logger';
import router from './routes/index';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import errorHandler from './middlewares/error';
import { validateUserBody, validateAuthLogin } from './validators';

const { PORT, MONGO_URL = '' } = process.env;
const app = express();

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URL);

app.use(requestLogger); // подключаем логер запросов

app.post('/signin', validateAuthLogin, login);
app.post('/signup', validateUserBody, createUser);

app.use(auth);
app.use(router);

app.use(errorLogger); // подключаем логер ошибок
app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
