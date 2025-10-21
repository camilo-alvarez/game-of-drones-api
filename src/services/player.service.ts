import { Types } from 'mongoose';
import { Player, Match } from '../models';
import { IPlayer, IPlayerStats, CreatePlayerDto } from '../types/interfaces';
import { ERROR_MESSAGES } from '../utils/constants';
import { isValidObjectId, toObjectId, calculateWinRate, sanitizeName } from '../utils/helpers';

export class PlayerService {
  async createPlayer(dto: CreatePlayerDto): Promise<IPlayer> {
    const { name } = dto;

    const sanitizedName = sanitizeName(name);

    const existingPlayer = await Player.findByName(sanitizedName);
    if (existingPlayer) {
      throw new Error(ERROR_MESSAGES.PLAYER_NAME_EXISTS);
    }

    const player = new Player({
      name: sanitizedName,
      wins: 0,
      losses: 0,
    });

    return await player.save();
  }

  async getAllPlayers(): Promise<IPlayer[]> {
    return await Player.find().sort({ wins: -1, createdAt: -1 });
  }

  async getPlayerById(playerId: string): Promise<IPlayer> {
    if (!isValidObjectId(playerId)) {
      throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
    }

    const player = await Player.findById(playerId);
    if (!player) {
      throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
    }

    return player;
  }

  async getPlayerByName(name: string): Promise<IPlayer | null> {
    return await Player.findByName(name);
  }

  async getPlayerStats(playerId: string): Promise<IPlayerStats> {
    const player = await this.getPlayerById(playerId);

    const matches = await Match.findByPlayer(toObjectId(playerId));
    const totalMatches = player.wins + player.losses;
    const winRate = calculateWinRate(player.wins, totalMatches);

    return {
      player,
      totalMatches,
      winRate,
      matchHistory: matches.slice(0, 10),
    };
  }

  async getLeaderboard(limit: number = 10): Promise<IPlayer[]> {
    return await Player.getTopPlayers(limit);
  }

  async incrementWins(playerId: Types.ObjectId): Promise<IPlayer> {
    const player = await Player.findById(playerId);
    if (!player) {
      throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
    }

    player.wins += 1;
    return await player.save();
  }

  async incrementLosses(playerId: Types.ObjectId): Promise<IPlayer> {
    const player = await Player.findById(playerId);
    if (!player) {
      throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
    }

    player.losses += 1;
    return await player.save();
  }

  async deletePlayer(playerId: string): Promise<void> {
    if (!isValidObjectId(playerId)) {
      throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
    }

    const result = await Player.findByIdAndDelete(playerId);
    if (!result) {
      throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
    }
  }
}

export const playerService = new PlayerService();
