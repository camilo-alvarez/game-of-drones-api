import { Request, Response, NextFunction } from 'express';
import { matchService } from '../services';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../utils/constants';
import { ApiResponse } from '../types/interfaces';

export class MatchController {
  
  async createMatch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { player1Id, player2Id } = req.body;

      const match = await matchService.createMatch({ player1Id, player2Id });

      const response: ApiResponse = {
        success: true,
        message: SUCCESS_MESSAGES.MATCH_CREATED,
        data: match,
      };

      res.status(HTTP_STATUS.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getAllMatches(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const matches = await matchService.getAllMatches();

      const response: ApiResponse = {
        success: true,
        data: matches,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getMatchById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const match = await matchService.getMatchById(id);

      const response: ApiResponse = {
        success: true,
        data: match,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async registerMove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { playerId, move } = req.body;

      const result = await matchService.registerMove(id, { playerId, move });

      if (result.waiting) {
        const response: ApiResponse = {
          success: true,
          message: SUCCESS_MESSAGES.WAITING_FOR_OPPONENT,
          data: { status: 'waiting' },
        };

        res.status(HTTP_STATUS.OK).json(response);
      } else {
        const response: ApiResponse = {
          success: true,
          message: SUCCESS_MESSAGES.MOVE_REGISTERED,
          data: result.result,
        };

        res.status(HTTP_STATUS.OK).json(response);
      }
    } catch (error) {
      next(error);
    }
  }

  async getActiveMatches(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const matches = await matchService.getActiveMatches();

      const response: ApiResponse = {
        success: true,
        data: matches,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getFinishedMatches(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const matches = await matchService.getFinishedMatches();

      const response: ApiResponse = {
        success: true,
        data: matches,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getMatchesByPlayer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { playerId } = req.params;

      const matches = await matchService.getMatchesByPlayer(playerId);

      const response: ApiResponse = {
        success: true,
        data: matches,
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteMatch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await matchService.deleteMatch(id);

      const response: ApiResponse = {
        success: true,
        message: 'Match deleted successfully',
      };

      res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const matchController = new MatchController();
