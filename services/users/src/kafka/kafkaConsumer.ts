import { readFileSync } from 'fs';
import { Kafka } from 'kafkajs';
import { UserService } from '../userService';  // Import the user service to update the user

const kafka = new Kafka({
    clientId: 'user-service',
    brokers: ['kafka-1:9092', 'kafka-2:9093', 'kafka-3:9094'],
    ssl: {
        rejectUnauthorized: false,
        ca: [readFileSync('/etc/kafka/secrets/ca-cert.pem', 'utf-8')],
        key: readFileSync('/etc/kafka/secrets/users-service-key.pem', 'utf-8'),
        cert: readFileSync('/etc/kafka/secrets/users-service-certificate.pem', 'utf-8'),
      },
    sasl: {
        mechanism: 'plain',
        username: 'user-service',
        password: 'user-service-secret'
      }
  });
  
const consumer = kafka.consumer({ 
    groupId: 'user-group'
    // isolationLevel is not directly supported with this version of kafkajs
});
const userService = new UserService();

export const consumeOrderCreatedEvent = async (): Promise<void> => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'order-created', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const decodedMessage = message.value?.toString();
            console.log(`Consumed message :`, decodedMessage);
            const order = JSON.parse(decodedMessage || '{}');
            // Logic to update the user with the new order
            if (order.userId && order.id) {
                await userService.addOrderToUser(order.userId, order.id);
            }
        },
    });
};