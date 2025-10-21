import { Types } from 'mongoose';
import { GameMove, MatchStatus } from './enums';

export interface IPlayer {
  _id?: Types.ObjectId;
  name: string;
  wins: number;
  losses: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IPlayerMove {
  playerId: Types.ObjectId;
  move: GameMove;
  timestamp: Date;
}

export interface IRound {
  roundNumber: number;
  moves: {
    player1?: IPlayerMove;
    player2?: IPlayerMove;
  };
  winner: Types.ObjectId | null; // null = tie
  result?: string;
}

export interface IMatchScore {
  player1: number;
  player2: number;
}

export interface IMatch {
  _id?: Types.ObjectId;
  players: [Types.ObjectId, Types.ObjectId];
  rounds: IRound[];
  currentRound: number;
  score: IMatchScore;
  status: MatchStatus;
  winner: Types.ObjectId | null;
  createdAt: Date;
  finishedAt?: Date;
  updatedAt?: Date;
}

export interface IPlayerStats {
  player: IPlayer;
  totalMatches: number;
  winRate: number;
  matchHistory: IMatch[];
}

export interface CreatePlayerDto {
  name: string;
}

export interface CreateMatchDto {
  player1Id: string;
  player2Id: string;
}

export interface RegisterMoveDto {
  playerId: string;
  move: GameMove;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  [key: string]: unknown;
}

export interface RoundResultResponse {
  roundNumber: number;
  moves: {
    player1: { playerId: string; move: GameMove };
    player2: { playerId: string; move: GameMove };
  };
  winner: string | null;
  result: string;
  score: IMatchScore;
  matchStatus: MatchStatus;
  matchWinner?: string;
}
