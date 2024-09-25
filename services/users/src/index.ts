import mongoose from 'mongoose';
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import { UserController } from './userController';
//import { consumeOrderCreatedEvent } from './kafka/kafkaConsumer'; // Kafka Consumer logic

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
app.delete('/users/:id', userController.deleteUser.bind(userController));

app.listen(3001, () => {
  console.log('Users service is running on port 3001');

  // Start Kafka consumer here after the service has started
  // consumeOrderCreatedEvent().catch((err: Error) => {
  //   console.error('Error starting Kafka consumer:', err);
  // });
});