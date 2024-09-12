import { Request, Response } from 'express';
import { UserService } from './userService';

class UserController {
  private userService = new UserService();

  // Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      if (!users) {
        return res.status(404).json({ message: 'No users found' });
      }
      else if (users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
      return res.json(users);
    } catch (error) {
      console.error('Error retrieving users:', error);
      return res.status(500).json({ message: 'Error retrieving users' });
    }
  }

  // Get a user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json(user);
    } catch (error) {
      console.error('Error retrieving user by ID:', error);
      return res.status(500).json({ message: 'Error retrieving user' });
    }
  }

  // Create a new user
  async createUser(req: Request, res: Response) {
    try {
      const user = await this.userService.createUser(req.body);
      if (!user) {
        return res.status(400).json({ message: 'User creation failed' });
      }
      return res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Error creating user' });
    }
  }

  // Update a user by ID
  async updateUser(req: Request, res: Response) {
    try {
      const updatedUser = await this.userService.updateUser(req.params.id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found or failed to update' });
      }
      return res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Error updating user' });
    }
  }

  async addOrderToUser(req: Request, res: Response) {
    try {
      const updatedUser = await this.userService.addOrderToUser(req.params.id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found or failed to update' });
      }
      return res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Error updating user' });
    }
  }

  // Delete a user by ID
  async deleteUser(req: Request, res: Response) {
    try {
      const deletedUser = await this.userService.deleteUser(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found or failed to delete' });
      }
      return res.status(204).send(); // No content on success
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Error deleting user' });
    }
  }
}

export { UserController };