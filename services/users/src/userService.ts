import { UserModel, User } from './userModel';
import { Types } from 'mongoose';

class UserService {
  async createUser(user: User): Promise<User | null> {
    try {
      const newUser = new UserModel(user);
      return await newUser.save();
    } catch (error) {
      console.error('Error creating user:', error);
      return null;  // Return null or handle the error appropriately
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      // Convert string `id` to MongoDB ObjectId
      const objectId = new Types.ObjectId(id);
      return await UserModel.findById(objectId).exec();
    } catch (error) {
      console.error('Error retrieving user by ID:', error);
      return null;  // Return null or handle the error appropriately
    }
  }

  async getAllUsers(): Promise<User[] | null> {
    try {
      return await UserModel.find().exec();
    } catch (error) {
      console.error('Error retrieving users:', error);
      return null;  // Return null or handle the error appropriately
    }
  }

  async updateUser(id: string, updatedData: Partial<User>): Promise<User | null> {
    try {
      // Convert string `id` to MongoDB ObjectId
      const objectId = new Types.ObjectId(id);
      return await UserModel.findByIdAndUpdate(objectId, updatedData, { new: true }).exec();
    } catch (error) {
      console.error('Error updating user by ID:', error);
      return null;  // Return null or handle the error appropriately
    }
  }

  // This method adds an order ID to a specific user
  async addOrderToUser(id: string, orderId: string): Promise<User | null> {
    try {
      // Convert string `id` to MongoDB ObjectId
      const objectId = new Types.ObjectId(id);
      // Use `findByIdAndUpdate` to add the order ID to the user's orders array
      return await UserModel.findByIdAndUpdate(
        objectId,
        { $push: { order_ids: orderId } },  // Push the new order ID to the 'orders' array
        { new: true }  // Return the updated user
      ).exec();
    } catch (error) {
      console.error('Error updating user with order ID:', error);
      return null;  // Return null or handle the error appropriately
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      // Convert string `id` to MongoDB ObjectId
      const objectId = new Types.ObjectId(id);
      const result = await UserModel.findByIdAndDelete(objectId).exec();
      return result !== null;
    } catch (error) {
      console.error('Error deleting user by ID:', error);
      return false;  // Return null or handle the error appropriately 
    }
  }
}

export { UserService };