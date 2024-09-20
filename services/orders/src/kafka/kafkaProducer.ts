import { Kafka, CompressionTypes } from 'kafkajs';
import { OrderEntity } from '../orderEntity';


const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();
// {
//   maxInFlightRequests: 1, // Needed for exactly-once semantics
//   idempotent: true, // Ensure idempotence
// }

// Function to send order created event
export const sendOrderCreatedEvent = async (order: OrderEntity): Promise<void> => {
  await producer.connect();
  try {
    const result = await producer.send({
      topic: 'order-created',
      messages: [{ /*key: order.id, */ value: JSON.stringify(order) }], //Key-based Partitioning
      //compression: CompressionTypes.GZIP, // Specify the compression type here
    });
    console.log('Message successfully produced:', result);
  } catch (error) {
    console.error('Error producing message:', error);
  }

  await producer.disconnect();
};