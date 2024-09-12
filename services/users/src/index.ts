import mongoose from 'mongoose';
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import { UserController } from './userController';

mongoose.connect('mongodb://mongo-users:27017/users_db').then(() => {
  console.log('Connected to MongoDB for Users service');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

const app = express();
const userController = new UserController();

app.use(express.json());
app.use(errorHandler);
app.use(logger);

app.get('/users', userController.getAllUsers.bind(userController));
app.get('/users/:id', userController.getUserById.bind(userController));
app.post('/users', userController.createUser.bind(userController));
app.put('/users/:id', userController.updateUser.bind(userController));
app.put('/users/:id/orders', userController.addOrderToUser.bind(userController));
app.delete('/users/:id', userController.deleteUser.bind(userController));

app.listen(3001, () => {
  console.log('Users service is running on port 3001');
});