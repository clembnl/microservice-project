import express from 'express';
import { usersRouter } from './users';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';

const app = express();
app.use(express.json());

app.use('/users', usersRouter);

app.use(errorHandler);
app.use(logger);

app.listen(3000, () => {
  console.log('Server is running on <http://localhost:3000>');
});