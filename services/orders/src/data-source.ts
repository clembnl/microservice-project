import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { OrderEntity } from './orderModel';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'myuser',
  password: 'mypassword',
  database: 'orders_db',
  entities: [OrderEntity],
  synchronize: true,  // Only use this in development
  dropSchema: true,   // Drop schema before synchronization in development
});

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to PostgreSQL for Orders service');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
