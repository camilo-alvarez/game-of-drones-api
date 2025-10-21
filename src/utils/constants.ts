import { GameMove } from '../types/enums';

/**
 * Number of rounds needed to win a match
 */
export const ROUNDS_TO_WIN = 3;

export const VALID_MOVES = [GameMove.ROCK, GameMove.PAPER, GameMove.SCISSORS];

/**
 * Game rules mapping - defines which move beats which
 * Key beats Value
 */
export const GAME_RULES: Record<GameMove, GameMove> = {
  [GameMove.ROCK]: GameMove.SCISSORS,
  [GameMove.PAPER]: GameMove.ROCK,
  [GameMove.SCISSORS]: GameMove.PAPER,
};

export const RESULT_MESSAGES: Record<string, string> = {
  [`${GameMove.ROCK}_${GameMove.SCISSORS}`]: 'Rock crushes Scissors',
  [`${GameMove.PAPER}_${GameMove.ROCK}`]: 'Paper covers Rock',
  [`${GameMove.SCISSORS}_${GameMove.PAPER}`]: 'Scissors cuts Paper',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  PLAYER_NOT_FOUND: 'Player not found',
  PLAYER_NAME_EXISTS: 'Player name already exists',
  MATCH_NOT_FOUND: 'Match not found',
  MATCH_ALREADY_FINISHED: 'Match is already finished',
  INVALID_PLAYER: 'Player is not part of this match',
  PLAYER_ALREADY_MOVED: 'Player has already moved in this round',
  INVALID_MOVE: 'Invalid move. Must be rock, paper, or scissors',
  SAME_PLAYER_MATCH: 'Cannot create a match with the same player',
  DATABASE_ERROR: 'Database error occurred',
  VALIDATION_ERROR: 'Validation error',
} as const;

export const SUCCESS_MESSAGES = {
  PLAYER_CREATED: 'Player created successfully',
  MATCH_CREATED: 'Match created successfully',
  MOVE_REGISTERED: 'Move registered successfully',
  WAITING_FOR_OPPONENT: 'Waiting for opponent move',
} as const;
