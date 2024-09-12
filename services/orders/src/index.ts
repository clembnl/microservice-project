import 'reflect-metadata';
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import { OrderController } from './orderController';
import { AppDataSource } from './data-source';

const app = express();
const orderController = new OrderController();

app.use(express.json());
app.use(errorHandler);
app.use(logger);

app.get('/orders', orderController.getAllOrders.bind(orderController));
app.get('/orders/:id', orderController.getOrderById.bind(orderController));
app.post('/orders', orderController.createOrder.bind(orderController));
app.put('/orders/:id', orderController.updateOrderStatus.bind(orderController));
app.delete('/orders/:id', orderController.deleteOrder.bind(orderController));

AppDataSource.initialize()
  .then(() => {
    app.listen(3002, () => {
      console.log('Orders service is running on port 3002');
    });
  })
  .catch((error: Error) => console.log('Error during Data Source initialization', error));
