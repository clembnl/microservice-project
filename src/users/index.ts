import { Router } from 'express';
import { getUserById, createUser, updateUser, deleteUser } from './userController';

export const usersRouter = Router();

usersRouter.get('/', (req, res) => {
  res.json([{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }]);
});

usersRouter.get('/:id', getUserById);
usersRouter.post('/', createUser);
usersRouter.put('/:id', updateUser);
usersRouter.delete('/:id', deleteUser);