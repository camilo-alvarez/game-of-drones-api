import { Types } from 'mongoose';
import {
  isValidObjectId,
  toObjectId,
  toStringId,
  compareObjectIds,
  calculateWinRate,
  sanitizeName,
} from '../src/utils/helpers';

describe('Helper Functions Tests', () => {
  describe('isValidObjectId', () => {
    it('should return true for valid ObjectId strings', () => {
      expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
      expect(isValidObjectId('67890abcdef1234567890abc')).toBe(true);
    });

    it('should return false for invalid ObjectId strings', () => {
      expect(isValidObjectId('invalid')).toBe(false);
      expect(isValidObjectId('123')).toBe(false);
      expect(isValidObjectId('')).toBe(false);
    });
  });

  describe('toObjectId and toStringId', () => {
    it('should convert string to ObjectId and back', () => {
      const idString = '507f1f77bcf86cd799439011';
      const objectId = toObjectId(idString);

      expect(objectId).toBeInstanceOf(Types.ObjectId);
      expect(toStringId(objectId)).toBe(idString);
    });
  });

  describe('compareObjectIds', () => {
    it('should return true for equal ObjectIds', () => {
      const id1 = new Types.ObjectId('507f1f77bcf86cd799439011');
      const id2 = new Types.ObjectId('507f1f77bcf86cd799439011');

      expect(compareObjectIds(id1, id2)).toBe(true);
    });

    it('should return false for different ObjectIds', () => {
      const id1 = new Types.ObjectId('507f1f77bcf86cd799439011');
      const id2 = new Types.ObjectId('507f1f77bcf86cd799439012');

      expect(compareObjectIds(id1, id2)).toBe(false);
    });

    it('should work with string comparisons', () => {
      const id = '507f1f77bcf86cd799439011';
      const objectId = new Types.ObjectId(id);

      expect(compareObjectIds(id, objectId)).toBe(true);
    });
  });

  describe('calculateWinRate', () => {
    it('should return 0 when total matches is 0', () => {
      expect(calculateWinRate(0, 0)).toBe(0);
    });

    it('should calculate correct win rate', () => {
      expect(calculateWinRate(5, 10)).toBe(50);
      expect(calculateWinRate(7, 10)).toBe(70);
      expect(calculateWinRate(3, 10)).toBe(30);
    });

    it('should round to 2 decimal places', () => {
      expect(calculateWinRate(1, 3)).toBe(33.33);
      expect(calculateWinRate(2, 3)).toBe(66.67);
    });

    it('should handle 100% win rate', () => {
      expect(calculateWinRate(10, 10)).toBe(100);
    });
  });

  describe('sanitizeName', () => {
    it('should convert to lowercase and trim', () => {
      expect(sanitizeName('  JOHN DOE  ')).toBe('john doe');
      expect(sanitizeName('Alice')).toBe('alice');
    });

    it('should handle already sanitized names', () => {
      expect(sanitizeName('player1')).toBe('player1');
    });

    it('should preserve spaces between words', () => {
      expect(sanitizeName('John Doe')).toBe('john doe');
    });
  });
});
