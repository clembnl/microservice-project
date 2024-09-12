import mongoose from 'mongoose';
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import { ProductController } from './productController';

mongoose.connect('mongodb://mongo-inventory:27017/inventory_db').then(() => {
  console.log('Connected to MongoDB for Products service');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

const app = express();
const productController = new ProductController();

app.use(express.json());
app.use(errorHandler);
app.use(logger);

app.get('/products', productController.getAllProducts.bind(productController));
app.get('/products/:id', productController.getProductById.bind(productController));
app.post('/products', productController.createProduct.bind(productController));
app.put('/products/:id', productController.updateProduct.bind(productController));
app.delete('/products/:id', productController.deleteProduct.bind(productController));

app.listen(3003, () => {
  console.log('Products service is running on port 3003');
});