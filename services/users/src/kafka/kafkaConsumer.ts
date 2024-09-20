import { Kafka } from 'kafkajs';
import { UserService } from '../userService';  // Import the user service to update the user

const kafka = new Kafka({
    clientId: 'user-service',
    brokers: ['kafka:9092'],
  });
  
const consumer = kafka.consumer({ groupId: 'user-group' });
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