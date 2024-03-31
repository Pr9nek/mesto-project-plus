import { log } from 'console';
import 'dotenv/config';
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import router from './routes/index';

const { PORT, MONGO_URL = '' } = process.env;
const app = express();

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URL);

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '660660fa84f0a2fb04b07544',
  };
  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
