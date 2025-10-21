import { determineRoundWinner, isValidMove, calculateRoundResult } from '../src/utils/gameLogic';
import { GameMove, RoundResult } from '../src/types/enums';

describe('Game Logic Tests', () => {
  describe('determineRoundWinner', () => {
    it('should return TIE when both players play the same move', () => {
      expect(determineRoundWinner(GameMove.ROCK, GameMove.ROCK)).toBe(RoundResult.TIE);
      expect(determineRoundWinner(GameMove.PAPER, GameMove.PAPER)).toBe(RoundResult.TIE);
      expect(determineRoundWinner(GameMove.SCISSORS, GameMove.SCISSORS)).toBe(RoundResult.TIE);
    });

    it('should return PLAYER1_WINS when player 1 wins', () => {
      expect(determineRoundWinner(GameMove.ROCK, GameMove.SCISSORS)).toBe(
        RoundResult.PLAYER1_WINS
      );
      expect(determineRoundWinner(GameMove.PAPER, GameMove.ROCK)).toBe(RoundResult.PLAYER1_WINS);
      expect(determineRoundWinner(GameMove.SCISSORS, GameMove.PAPER)).toBe(
        RoundResult.PLAYER1_WINS
      );
    });

    it('should return PLAYER2_WINS when player 2 wins', () => {
      expect(determineRoundWinner(GameMove.SCISSORS, GameMove.ROCK)).toBe(
        RoundResult.PLAYER2_WINS
      );
      expect(determineRoundWinner(GameMove.ROCK, GameMove.PAPER)).toBe(RoundResult.PLAYER2_WINS);
      expect(determineRoundWinner(GameMove.PAPER, GameMove.SCISSORS)).toBe(
        RoundResult.PLAYER2_WINS
      );
    });
  });

  describe('isValidMove', () => {
    it('should return true for valid moves', () => {
      expect(isValidMove('rock')).toBe(true);
      expect(isValidMove('paper')).toBe(true);
      expect(isValidMove('scissors')).toBe(true);
    });

    it('should return false for invalid moves', () => {
      expect(isValidMove('invalid')).toBe(false);
      expect(isValidMove('ROCK')).toBe(false);
      expect(isValidMove('')).toBe(false);
      expect(isValidMove('stone')).toBe(false);
    });
  });

  describe('calculateRoundResult', () => {
    it('should return tie message when result is TIE', () => {
      const result = calculateRoundResult(GameMove.ROCK, GameMove.ROCK, RoundResult.TIE);
      expect(result).toBe('Tie - Both played rock');
    });

    it('should return correct message when player 1 wins', () => {
      const result = calculateRoundResult(
        GameMove.ROCK,
        GameMove.SCISSORS,
        RoundResult.PLAYER1_WINS
      );
      expect(result).toBe('Rock crushes Scissors');
    });

    it('should return correct message when player 2 wins', () => {
      const result = calculateRoundResult(
        GameMove.SCISSORS,
        GameMove.ROCK,
        RoundResult.PLAYER2_WINS
      );
      expect(result).toBe('Rock crushes Scissors');
    });

    it('should handle all winning combinations', () => {
      expect(
        calculateRoundResult(GameMove.PAPER, GameMove.ROCK, RoundResult.PLAYER1_WINS)
      ).toContain('Paper');
      expect(
        calculateRoundResult(GameMove.SCISSORS, GameMove.PAPER, RoundResult.PLAYER1_WINS)
      ).toContain('Scissors');
    });
  });
});
