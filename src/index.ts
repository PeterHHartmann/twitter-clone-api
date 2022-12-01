import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes';

const PORT = process.env.PORT || 8000;
const app: Application = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  })
);
app.use(express.json());
app.use(morgan('tiny'));
app.use(router);
app.use('/public', express.static('public'))

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
