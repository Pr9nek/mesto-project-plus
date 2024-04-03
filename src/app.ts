import { log } from 'console';
import 'dotenv/config';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import router from './routes/index';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';

const { PORT, MONGO_URL = '' } = process.env;
const app = express();

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URL);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
