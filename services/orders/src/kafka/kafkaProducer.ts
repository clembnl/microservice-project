import { readFileSync } from 'fs';
import { Kafka, CompressionTypes } from 'kafkajs';
import { OrderEntity } from '../orderEntity';

const kafka = new Kafka({
  clientId: 'order-service',
  //brokers: ['kafka-1:9092', 'kafka-2:9093', 'kafka-3:9094'],
  brokers: ['kafka:9092'],
  ssl: {
    rejectUnauthorized: false,
    ca: [readFileSync('/etc/kafka/secrets/ca-cert.pem', 'utf-8')],
    key: readFileSync('/etc/kafka/secrets/orders-service-key.pem', 'utf-8'),
    cert: readFileSync('/etc/kafka/secrets/orders-service-certificate.pem', 'utf-8'),
  },
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