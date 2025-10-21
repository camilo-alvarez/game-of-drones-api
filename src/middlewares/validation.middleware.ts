import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { HTTP_STATUS } from '../utils/constants';

export const createPlayerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .trim(),
  }),
});

export const createMatchSchema = z.object({
  body: z.object({
    player1Id: z.string().min(1, 'Player 1 ID is required'),
    player2Id: z.string().min(1, 'Player 2 ID is required'),
  }),
});

export const registerMoveSchema = z.object({
  body: z.object({
    playerId: z.string().min(1, 'Player ID is required'),
    move: z.enum(['rock', 'paper', 'scissors']),
  }),
  params: z.object({
    id: z.string().min(1, 'Match ID is required'),
  }),
});

export const playerIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Player ID is required'),
  }),
});

export const matchIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Match ID is required'),
  }),
});

export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: 'Validation Error',
          message: 'Invalid request data',
          details: errors,
        });
        return;
      }
      next(error);
    }
  };
};
