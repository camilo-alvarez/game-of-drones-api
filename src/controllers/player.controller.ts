import { Request, Response, NextFunction } from 'express';
import { playerService } from '../services';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../utils/constants';
import { ApiResponse } from '../types/interfaces';

export class PlayerController {

  async createPlayer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name } = req.body;

      const player = await playerService.createPlayer({ name });

      const response: ApiResponse = {
        success: true,
        message: SUCCESS_MESSAGES.PLAYER_CREATED,
        data: player,
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAllPlayers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const players = await playerService.getAllPlayers();

      const response: ApiResponse = {
        success: true,
        data: players,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getPlayerById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const player = await playerService.getPlayerById(id);

      const response: ApiResponse = {
        success: true,
        data: player,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getPlayerStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const stats = await playerService.getPlayerStats(id);

      const response: ApiResponse = {
        success: true,
        data: stats,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getLeaderboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      const players = await playerService.getLeaderboard(limit);

      const response: ApiResponse = {
        success: true,
        data: players,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deletePlayer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await playerService.deletePlayer(id);

      const response: ApiResponse = {
        success: true,
        message: 'Player deleted successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const playerController = new PlayerController();
