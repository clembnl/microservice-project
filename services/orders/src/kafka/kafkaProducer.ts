import { readFileSync } from 'fs';
import { Kafka, CompressionTypes } from 'kafkajs';
import { OrderEntity } from '../orderEntity';

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['kafka:9092'],
  ssl: false,
  sasl: {
    mechanism: 'plain',
    username: 'order-service',
    password: 'order-service-secret'
  }
});

const producer = kafka.producer({
  transactionalId: 'order-transaction-id', 
  maxInFlightRequests: 1, // Needed for exactly-once semantics
  idempotent: true // Ensure idempotence
});

export const sendOrderCreatedEvent = async (order: OrderEntity): Promise<void> => {
  await producer.connect();
  const transaction = await producer.transaction(); // Start a transaction

  try {
    const result = await transaction.send({
      topic: 'order-created',
      messages: [{ key: order.id, value: JSON.stringify(order) }], // Use order ID as a key for partitioning
      compression: CompressionTypes.GZIP, // Apply GZIP compression
    });

    console.log('Message successfully produced:', result);
    await transaction.commit(); // Commit the transaction
  } catch (error) {
    console.error('Error producing message:', error);
    await transaction.abort(); // Rollback in case of failure
  }

  await producer.disconnect();
};