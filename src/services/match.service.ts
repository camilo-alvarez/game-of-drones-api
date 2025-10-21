import { Match } from '../models';
import {
  IMatch,
  IRound,
  IPlayerMove,
  CreateMatchDto,
  RegisterMoveDto,
  RoundResultResponse,
} from '../types/interfaces';
import { MatchStatus, GameMove, RoundResult } from '../types/enums';
import { ERROR_MESSAGES, ROUNDS_TO_WIN } from '../utils/constants';
import {
  isValidObjectId,
  toObjectId,
  compareObjectIds,
  toStringId,
} from '../utils/helpers';
import {
  determineRoundWinner,
  calculateRoundResult,
  isValidMove,
} from '../utils/gameLogic';
import { playerService } from './player.service';

export class MatchService {
  async createMatch(dto: CreateMatchDto): Promise<IMatch> {
    const { player1Id, player2Id } = dto;

    if (!isValidObjectId(player1Id) || !isValidObjectId(player2Id)) {
      throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
    }

    if (player1Id === player2Id) {
      throw new Error(ERROR_MESSAGES.SAME_PLAYER_MATCH);
    }

    await playerService.getPlayerById(player1Id);
    await playerService.getPlayerById(player2Id);

    const match = new Match({
      players: [toObjectId(player1Id), toObjectId(player2Id)],
      rounds: [],
      currentRound: 1,
      score: { player1: 0, player2: 0 },
      status: MatchStatus.PLAYING,
      winner: null,
    });

    return await match.save();
  }

  async getMatchById(matchId: string, populate = true): Promise<any> {
    if (!isValidObjectId(matchId)) {
      throw new Error(ERROR_MESSAGES.MATCH_NOT_FOUND);
    }

    const query = Match.findById(matchId);
    const match = populate ? await query.populate('players') : await query;
    
    if (!match) {
      throw new Error(ERROR_MESSAGES.MATCH_NOT_FOUND);
    }

    return match;
  }

  async getAllMatches(): Promise<IMatch[]> {
    return await Match.find().populate('players').sort({ createdAt: -1 });
  }

  async getMatchesByPlayer(playerId: string): Promise<IMatch[]> {
    if (!isValidObjectId(playerId)) {
      throw new Error(ERROR_MESSAGES.PLAYER_NOT_FOUND);
    }

    return await Match.findByPlayer(toObjectId(playerId));
  }

  async registerMove(
    matchId: string,
    dto: RegisterMoveDto
  ): Promise<{ waiting: boolean; result?: RoundResultResponse }> {
    const { playerId, move } = dto;

    if (!isValidMove(move)) {
      throw new Error(ERROR_MESSAGES.INVALID_MOVE);
    }

    if (!isValidObjectId(matchId)) {
      throw new Error(ERROR_MESSAGES.MATCH_NOT_FOUND);
    }

    const match = await Match.findById(matchId) as any;
    if (!match) {
      throw new Error(ERROR_MESSAGES.MATCH_NOT_FOUND);
    }

    if (match.status === MatchStatus.FINISHED) {
      throw new Error(ERROR_MESSAGES.MATCH_ALREADY_FINISHED);
    }

    const playerObjectId = toObjectId(playerId);
    
    const isPlayerInMatch = match.players.some(
      (p: any) => p.toString() === playerObjectId.toString()
    );
    if (!isPlayerInMatch) {
      throw new Error(ERROR_MESSAGES.INVALID_PLAYER);
    }

    const currentRoundForCheck = match.rounds.find(
      (r: any) => r.roundNumber === match.currentRound
    );
    if (currentRoundForCheck) {
      const playerIdStr = playerObjectId.toString();
      const isPlayer1Check = match.players[0].toString() === playerIdStr;
      const hasAlreadyMoved = isPlayer1Check
        ? currentRoundForCheck.moves.player1 !== undefined
        : currentRoundForCheck.moves.player2 !== undefined;
      
      if (hasAlreadyMoved) {
        throw new Error(ERROR_MESSAGES.PLAYER_ALREADY_MOVED);
      }
    }

    const isPlayer1 = compareObjectIds(match.players[0], playerObjectId);

    let currentRoundIndex = match.rounds.findIndex(
      (r: any) => r.roundNumber === match.currentRound
    );

    if (currentRoundIndex === -1) {
      const newRound: IRound = {
        roundNumber: match.currentRound,
        moves: {},
        winner: null,
      };
      match.rounds.push(newRound);
      currentRoundIndex = match.rounds.length - 1;
    }

    const playerMove: IPlayerMove = {
      playerId: playerObjectId,
      move: move as GameMove,
      timestamp: new Date(),
    };

    if (isPlayer1) {
      match.rounds[currentRoundIndex].moves.player1 = playerMove;
    } else {
      match.rounds[currentRoundIndex].moves.player2 = playerMove;
    }

    const currentRound = match.rounds[currentRoundIndex];

    if (currentRound.moves.player1 && currentRound.moves.player2) {
      const result = await this.calculateAndSaveRoundResult(match, currentRound);
      await match.save();
      return { waiting: false, result };
    }

    await match.save();
    return { waiting: true };
  }

  private async calculateAndSaveRoundResult(
    match: IMatch,
    round: IRound
  ): Promise<RoundResultResponse> {
    const move1 = round.moves.player1!.move;
    const move2 = round.moves.player2!.move;

    const roundResult = determineRoundWinner(move1, move2);

    if (roundResult === RoundResult.TIE) {
      round.winner = null;
      round.result = calculateRoundResult(move1, move2, roundResult);
    } else if (roundResult === RoundResult.PLAYER1_WINS) {
      round.winner = match.players[0];
      match.score.player1 += 1;
      round.result = calculateRoundResult(move1, move2, roundResult);
    } else {
      round.winner = match.players[1];
      match.score.player2 += 1;
      round.result = calculateRoundResult(move1, move2, roundResult);
    }

    let matchWinnerId: string | undefined;
    if (match.score.player1 >= ROUNDS_TO_WIN) {
      match.status = MatchStatus.FINISHED;
      match.winner = match.players[0];
      match.finishedAt = new Date();
      matchWinnerId = toStringId(match.players[0]);

      await playerService.incrementWins(match.players[0]);
      await playerService.incrementLosses(match.players[1]);
    } else if (match.score.player2 >= ROUNDS_TO_WIN) {
      match.status = MatchStatus.FINISHED;
      match.winner = match.players[1];
      match.finishedAt = new Date();
      matchWinnerId = toStringId(match.players[1]);

      await playerService.incrementWins(match.players[1]);
      await playerService.incrementLosses(match.players[0]);
    } else {
      match.currentRound += 1;
    }

    (match as any).markModified('rounds');
    (match as any).markModified('score');

    const response: RoundResultResponse = {
      roundNumber: round.roundNumber,
      moves: {
        player1: {
          playerId: toStringId(round.moves.player1!.playerId),
          move: round.moves.player1!.move,
        },
        player2: {
          playerId: toStringId(round.moves.player2!.playerId),
          move: round.moves.player2!.move,
        },
      },
      winner: round.winner ? toStringId(round.winner) : null,
      result: round.result || '',
      score: match.score,
      matchStatus: match.status,
      matchWinner: matchWinnerId,
    };

    return response;
  }

  async getActiveMatches(): Promise<IMatch[]> {
    return await Match.find({
      status: { $in: [MatchStatus.PLAYING, MatchStatus.WAITING] },
    })
      .populate('players')
      .sort({ createdAt: -1 });
  }

  async getFinishedMatches(): Promise<IMatch[]> {
    return await Match.find({ status: MatchStatus.FINISHED })
      .populate('players')
      .sort({ finishedAt: -1 });
  }

  async deleteMatch(matchId: string): Promise<void> {
    if (!isValidObjectId(matchId)) {
      throw new Error(ERROR_MESSAGES.MATCH_NOT_FOUND);
    }

    const result = await Match.findByIdAndDelete(matchId);
    if (!result) {
      throw new Error(ERROR_MESSAGES.MATCH_NOT_FOUND);
    }
  }
}

export const matchService = new MatchService();
