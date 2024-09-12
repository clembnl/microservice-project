import { Request, Response } from 'express';

export const getUserById = (req: Request, res: Response) => {
  const userId = req.params.id;
  res.json({ id: userId, name: `User ${userId}` });
};

export const createUser = (req: Request, res: Response) => {
  const newUser = req.body;
  res.status(201).json(newUser);
};

export const updateUser = (req: Request, res: Response) => {
    const userId = req.params.id;
    const updatedUser = req.body;
    res.json({ id: userId, ...updatedUser });
}

export const deleteUser = (req: Request, res: Response) => {
    const userId = req.params.id;
    res.status(204).send();
}