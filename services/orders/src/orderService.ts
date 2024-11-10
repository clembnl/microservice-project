import { OrderEntity } from './orderModel';
import { AppDataSource } from './data-source';


class OrderService {
  private orderRepository = AppDataSource.getRepository(OrderEntity);

  async createOrder(order: Partial<OrderEntity>): Promise<OrderEntity | null> {
    try {
      const newOrder = this.orderRepository.create(order);
      await this.orderRepository.save(newOrder);
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;  // Return null or handle the error appropriately
    }
  }

  async getOrderById(id: string): Promise<OrderEntity | null> {
    try {
      return await this.orderRepository.findOneBy({ id });
    } catch (error) {
      console.error('Error retrieving order by ID:', error);
      return null;  // Return null or handle the error appropriately
    }
  }

  async getAllOrders(): Promise<OrderEntity[] | null> {
    try {
      return await this.orderRepository.find();
    } catch (error) {
      console.error('Error retrieving orders:', error);
      return null;  // Return null or handle the error appropriately
    }
  }

  async updateOrderStatus(id: string, status: string): Promise<OrderEntity | null> {
    try {
      const order = await this.orderRepository.findOneBy({ id });
      if (order) {
        order.status = status;
        await this.orderRepository.save(order);
      }
      return order;
    } catch (error) {
      console.error('Error updating order by ID:', error);
      return null;  // Return null or handle the error appropriately
    }
  }

  async deleteOrder(id: string): Promise<boolean> {
    try {
      const result = await this.orderRepository.delete(id);
      return result.affected !== 0;
    } catch (error) {
      console.error('Error deleting order by ID:', error);
      return false;  // Return null or handle the error appropriately
    }
  }
}

export { OrderService };