import { Types } from 'mongoose';

/**
 * Checks if a string is a valid MongoDB ObjectId
 * @param id - String to validate
 * @returns true if valid ObjectId, false otherwise
 */
export const isValidObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

/**
 * Converts string to ObjectId
 * @param id - String id
 * @returns MongoDB ObjectId
 */
export const toObjectId = (id: string): Types.ObjectId => {
  return new Types.ObjectId(id);
};

/**
 * Converts ObjectId to string
 * @param id - ObjectId
 * @returns String representation
 */
export const toStringId = (id: Types.ObjectId): string => {
  return id.toString();
};

/**
 * Compares two ObjectIds for equality
 * @param id1 - First ObjectId
 * @param id2 - Second ObjectId
 * @returns true if equal, false otherwise
 */
export const compareObjectIds = (
  id1: Types.ObjectId | string,
  id2: Types.ObjectId | string
): boolean => {
  return id1.toString() === id2.toString();
};

/**
 * Calculates win rate percentage
 * @param wins - Number of wins
 * @param totalMatches - Total matches played
 * @returns Win rate percentage (0-100)
 */
export const calculateWinRate = (wins: number, totalMatches: number): number => {
  if (totalMatches === 0) return 0;
  return Math.round((wins / totalMatches) * 100 * 100) / 100; // Round to 2 decimals
};

/**
 * Sanitizes player name
 * @param name - Raw name input
 * @returns Sanitized name
 */
export const sanitizeName = (name: string): string => {
  return name.trim().toLowerCase();
};

/**
 * Formats date to ISO string
 * @param date - Date object
 * @returns ISO string
 */
export const formatDate = (date: Date): string => {
  return date.toISOString();
};

/**
 * Creates a delay promise
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
