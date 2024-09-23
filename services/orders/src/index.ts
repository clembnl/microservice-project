import 'reflect-metadata';
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import { OrderController } from './orderController';
import { AppDataSource } from './data-source';
// import { KafkaStreams }from 'kafka-streams';

// const kafkaStreamsConfig = {
//   noptions: {
//     'metadata.broker.list': 'kafka:9092',
//     'group.id': 'order-stream-group',
//     'client.id': 'order-stream',
//     'enable.auto.commit': false,
//   },
// };

// const kafkaStreams = new KafkaStreams(kafkaStreamsConfig);
// const orderStream = kafkaStreams.getKStream('order-created');

// // Aggregate orders by status
// orderStream
//   .mapJSONConvenience() // Assuming you're working with JSON messages
//   .countByKey('status', 'orderCount') // Group by status and count orders
//   .map((keyValue) => JSON.stringify(keyValue))  // Serialize the key-value pairs
//   .to('order-analytics', 1); // Output results to a new topic

// orderStream.start(); // Start the stream processing

// Express app setup
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
