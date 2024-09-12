import { ProductModel, Product } from './productModel';
import { Types } from 'mongoose';

class ProductService {
  async createProduct(product: Product): Promise<Product | null> {
    try {
      console.log('Creating product:', product);  // Log the incoming product data
      const newProduct = new ProductModel(product);
      const savedProduct = await newProduct.save();
      console.log('Product saved:', savedProduct);  // Log the saved product
      return savedProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;  // Return null or handle the error appropriately
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      // Convert string `id` to MongoDB ObjectId
      const objectId = new Types.ObjectId(id);
      return await ProductModel.findById(objectId).exec();
    } catch (error) {
      console.error('Error retrieving product by ID:', error);
      return null;
    }
  }

  async getAllProducts(): Promise<Product[] | null> {
    try {
      return await ProductModel.find().exec();
    }
    catch (error) {
      console.error('Error retrieving products:', error);
      return null;
    }
  }

  async updateProduct(id: string, updatedData: Partial<Product>): Promise<Product | null> {
    try {
      // Convert string `id` to MongoDB ObjectId
      const objectId = new Types.ObjectId(id);
      return await ProductModel.findByIdAndUpdate(objectId, updatedData, { new: true }).exec();
    } catch (error) {
      console.error('Error updating product by ID:', error);
      return null;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      // Convert string `id` to MongoDB ObjectId
      const objectId = new Types.ObjectId(id);
      const result = await ProductModel.findByIdAndDelete(objectId).exec();
      return result !== null;
    } catch (error) {
      console.error('Error deleting product by ID:', error);
      return false;
    }
  }
}

export { ProductService };