import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors'
import router from './routes';

const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: 'http://localhost:3000'
}

const app: Application = express();
app.use(cors(corsOptions))
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('public'));

app.use(router);

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
