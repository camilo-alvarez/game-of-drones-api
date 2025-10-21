/**
 * Game logic utilities for determining winners and results
 */

import { GameMove, RoundResult } from '../types/enums';
import { GAME_RULES, RESULT_MESSAGES } from './constants';

/**
 * Determines the winner of a round based on the moves
 * @param move1 - First player's move
 * @param move2 - Second player's move
 * @returns RoundResult indicating who won or if it's a tie
 */
export const determineRoundWinner = (move1: GameMove, move2: GameMove): RoundResult => {
  // Check for tie
  if (move1 === move2) {
    return RoundResult.TIE;
  }

  // Check if player 1 wins
  if (GAME_RULES[move1] === move2) {
    return RoundResult.PLAYER1_WINS;
  }

  // Otherwise player 2 wins
  return RoundResult.PLAYER2_WINS;
};

/**
 * Gets a human-readable description of the round result
 * @param winningMove - The move that won
 * @param losingMove - The move that lost
 * @returns Human-readable result message
 */
export const getResultMessage = (winningMove: GameMove, losingMove: GameMove): string => {
  const key = `${winningMove}_${losingMove}`;
  return RESULT_MESSAGES[key] || `${winningMove} beats ${losingMove}`;
};

/**
 * Validates if a move is valid
 * @param move - The move to validate
 * @returns true if valid, false otherwise
 */
export const isValidMove = (move: string): move is GameMove => {
  return Object.values(GameMove).includes(move as GameMove);
};

/**
 * Calculates the result description for display
 * @param move1 - First player's move
 * @param move2 - Second player's move
 * @param winner - The round result
 * @returns Complete result description
 */
export const calculateRoundResult = (
  move1: GameMove,
  move2: GameMove,
  winner: RoundResult
): string => {
  if (winner === RoundResult.TIE) {
    return `Tie - Both played ${move1}`;
  }

  const winningMove = winner === RoundResult.PLAYER1_WINS ? move1 : move2;
  const losingMove = winner === RoundResult.PLAYER1_WINS ? move2 : move1;

  return getResultMessage(winningMove, losingMove);
};
