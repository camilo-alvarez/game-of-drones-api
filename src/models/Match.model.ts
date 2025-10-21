import { Schema, model, Model, Types } from 'mongoose';
import { IMatch, IRound, IPlayerMove } from '../types/interfaces';
import { MatchStatus } from '../types/enums';

interface IMatchModel extends Model<IMatch> {
  findActiveByPlayer(playerId: Types.ObjectId): Promise<IMatch[]>;
  findByPlayer(playerId: Types.ObjectId): Promise<IMatch[]>;
  getMatchStats(): Promise<{ total: number; playing: number; finished: number }>;
}

const PlayerMoveSchema = new Schema<IPlayerMove>(
  {
    playerId: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    move: {
      type: String,
      enum: ['rock', 'paper', 'scissors'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const RoundSchema = new Schema<IRound>(
  {
    roundNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    moves: {
      player1: {
        type: PlayerMoveSchema,
        default: undefined,
      },
      player2: {
        type: PlayerMoveSchema,
        default: undefined,
      },
    },
    winner: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      default: null,
    },
    result: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const MatchSchema = new Schema<IMatch>(
  {
    players: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Player',
        },
      ],
      required: true,
      validate: {
        validator: function (players: Types.ObjectId[]) {
          return players.length === 2 && players[0].toString() !== players[1].toString();
        },
        message: 'Match must have exactly 2 different players',
      },
    },
    rounds: {
      type: [RoundSchema],
      default: [],
    },
    currentRound: {
      type: Number,
      default: 1,
      min: 1,
    },
    score: {
      player1: {
        type: Number,
        default: 0,
        min: 0,
      },
      player2: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    status: {
      type: String,
      enum: Object.values(MatchStatus),
      default: MatchStatus.PLAYING,
    },
    winner: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    finishedAt: {
      type: Date,
      default: null,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

MatchSchema.index({ players: 1 });
MatchSchema.index({ status: 1 });
MatchSchema.index({ createdAt: -1 });
MatchSchema.index({ winner: 1 });

MatchSchema.methods = {
  isFinished: function (): boolean {
    return this.status === MatchStatus.FINISHED;
  },

  hasPlayer: function (playerId: Types.ObjectId | string): boolean {
    const playerIdStr = playerId.toString();
    return this.players.some((p: Types.ObjectId) => p.toString() === playerIdStr);
  },

  getOpponent: function (playerId: Types.ObjectId | string): Types.ObjectId | null {
    const playerIdStr = playerId.toString();
    const opponent = this.players.find((p: Types.ObjectId) => p.toString() !== playerIdStr);
    return opponent || null;
  },

  hasPlayerMovedInCurrentRound: function (playerId: Types.ObjectId | string): boolean {
    const currentRound = this.rounds.find((r: IRound) => r.roundNumber === this.currentRound);
    if (!currentRound) return false;

    const playerIdStr = playerId.toString();
    const isPlayer1 = this.players[0].toString() === playerIdStr;

    if (isPlayer1) {
      return currentRound.moves.player1 !== undefined;
    } else {
      return currentRound.moves.player2 !== undefined;
    }
  },

  getCurrentRound: function (): IRound | null {
    return this.rounds.find((r: IRound) => r.roundNumber === this.currentRound) || null;
  },
};

MatchSchema.statics = {
  findActiveByPlayer: async function (playerId: Types.ObjectId): Promise<IMatch[]> {
    return await this.find({
      players: playerId,
      status: { $in: [MatchStatus.PLAYING, MatchStatus.WAITING] },
    }).populate('players');
  },

  findByPlayer: async function (playerId: Types.ObjectId): Promise<IMatch[]> {
    return await this.find({
      players: playerId,
    })
      .populate('players')
      .sort({ createdAt: -1 });
  },

  getMatchStats: async function (): Promise<{
    total: number;
    playing: number;
    finished: number;
  }> {
    const total = await this.countDocuments();
    const playing = await this.countDocuments({ status: MatchStatus.PLAYING });
    const finished = await this.countDocuments({ status: MatchStatus.FINISHED });

    return { total, playing, finished };
  },
};

const Match = model<IMatch, IMatchModel>('Match', MatchSchema);

export default Match;
