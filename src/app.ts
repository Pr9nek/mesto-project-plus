import { log } from "console";
import "dotenv/config";
import express from 'express';
import mongoose from 'mongoose';
import userRouter from "./routes/users";

const { PORT, MONGO_URL = "" } = process.env;
const app = express();

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URL);

app.use('/users', userRouter);


app.listen(PORT, () => {

  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})
