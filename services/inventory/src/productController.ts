import { Request, Response } from 'express';
import { ProductService } from './productService';

class ProductController {
  private productService = new ProductService();

  // Get all products
  async getAllProducts(req: Request, res: Response) {
    try {
      // Await the retrieval of all products
      const products = await this.productService.getAllProducts();
      if (!products) {
        return res.status(404).json({ message: 'No products found' });
      }
      else if (products.length === 0) {
        return res.status(404).json({ message: 'No products found' });
      }
      // Return the list of products
      return res.json(products);
    } catch (error) {
      console.error('Error retrieving products:', error);
      return res.status(500).json({ message: 'Error retrieving products' });
    }
  }

  // Get a product by ID
  async getProductById(req: Request, res: Response) {
    try {
      // Await the product retrieval by ID
      const product = await this.productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      // Return the found product
      return res.json(product);
    } catch (error) {
      console.error('Error retrieving product by ID:', error);
      return res.status(500).json({ message: 'Error retrieving product' });
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      // Await the product creation from the service layer
      const product = await this.productService.createProduct(req.body);
      if (!product) {
        return res.status(400).json({ message: 'Product creation failed' });
      }
      // Return the created product with status 201
      return res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({ message: 'Error creating product' });
    }
  }

  // Update a product by ID
  async updateProduct(req: Request, res: Response) {
    try {
      const updatedProduct = await this.productService.updateProduct(req.params.id, req.body);
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found or failed to update' });
      }
      return res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ message: 'Error updating product' });
    }
  }

  // Delete a product by ID
  async deleteProduct(req: Request, res: Response) {
    try {
      const deletedProduct = await this.productService.deleteProduct(req.params.id);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found or failed to delete' });
      }
      return res.status(204).send(); // No content on success
    } catch (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ message: 'Error deleting product' });
    }
  }
}

export { ProductController };