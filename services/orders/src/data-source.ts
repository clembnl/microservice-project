import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { OrderEntity } from './orderEntity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'myuser',
  password: 'mypassword',
  database: 'orders_db',
  entities: [OrderEntity],
  synchronize: false,
  dropSchema: false,   // Add this to drop the schema before synchronization
});

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to PostgreSQL for Orders service');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
