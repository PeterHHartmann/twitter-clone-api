import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes';
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 8000;
const app: Application = express();

app.use(cookieParser())
app.use(express.json());
app.use(morgan('tiny'));
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  })
);

app.use(router);

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
