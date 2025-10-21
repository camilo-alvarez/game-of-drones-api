import mongoose from 'mongoose';
import { config } from './environment';

const mongooseOptions: mongoose.ConnectOptions = {
  autoIndex: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(config.mongoUri, mongooseOptions);
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};
