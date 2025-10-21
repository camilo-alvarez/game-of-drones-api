import { Schema, model, Model } from 'mongoose';
import { IPlayer } from '../types/interfaces';

interface IPlayerModel extends Model<IPlayer> {
  findByName(name: string): Promise<IPlayer | null>;
  getTopPlayers(limit: number): Promise<IPlayer[]>;
}

const PlayerSchema = new Schema<IPlayer>(
  {
    name: {
      type: String,
      required: [true, 'Player name is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [2, 'Player name must be at least 2 characters'],
      maxlength: [50, 'Player name cannot exceed 50 characters'],
    },
    wins: {
      type: Number,
      default: 0,
      min: [0, 'Wins cannot be negative'],
    },
    losses: {
      type: Number,
      default: 0,
      min: [0, 'Losses cannot be negative'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
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

PlayerSchema.index({ wins: -1 });

PlayerSchema.methods = {
  incrementWins: async function (): Promise<IPlayer> {
    this.wins += 1;
    return await this.save();
  },

  incrementLosses: async function (): Promise<IPlayer> {
    this.losses += 1;
    return await this.save();
  },
};

PlayerSchema.statics = {
  findByName: async function (name: string): Promise<IPlayer | null> {
    return await this.findOne({ name: name.toLowerCase().trim() });
  },

  getTopPlayers: async function (limit: number = 10): Promise<IPlayer[]> {
    return await this.find().sort({ wins: -1 }).limit(limit);
  },
};

const Player = model<IPlayer, IPlayerModel>('Player', PlayerSchema);

export default Player;
