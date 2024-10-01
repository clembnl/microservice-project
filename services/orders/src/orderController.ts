import { Request, Response } from 'express';
import { OrderService } from './orderService';

class OrderController {
  private orderService = new OrderService();

  async createOrder(req: Request, res: Response): Promise<Response> {
    try {
      const newOrder = await this.orderService.createOrder(req.body);
      if (!newOrder) {
        return res.status(500).json({ message: 'Error creating the order' });
      }
      return res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Error creating order' });
    }
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    const order = await this.orderService.getOrderById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  }

  async getAllOrders(req: Request, res: Response): Promise<void> {
    const orders = await this.orderService.getAllOrders();
    res.json(orders);
  }

  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    const updatedOrder = await this.orderService.updateOrderStatus(req.params.id, req.body.status);
    if (updatedOrder) {
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  }

  async deleteOrder(req: Request, res: Response): Promise<void> {
    const success = await this.orderService.deleteOrder(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  }
}

export { OrderController };
