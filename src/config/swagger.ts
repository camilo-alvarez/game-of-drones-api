import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './environment';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Game of Drones API',
    version: '1.0.0',
    description:
      'REST API for Game of Drones - A multiplayer Rock, Paper, Scissors variation where players compete to win 3 rounds',
    contact: {
      name: 'API Support',
      email: 'support@gameofdrones.com',
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/api/${config.apiVersion}`,
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Players',
      description: 'Player management endpoints',
    },
    {
      name: 'Matches',
      description: 'Match management and gameplay endpoints',
    },
  ],
  components: {
    schemas: {
      Player: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Player unique identifier',
          },
          name: {
            type: 'string',
            description: 'Player name (unique, lowercase)',
          },
          wins: {
            type: 'number',
            description: 'Number of matches won',
          },
          losses: {
            type: 'number',
            description: 'Number of matches lost',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Match: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Match unique identifier',
          },
          players: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Array of two player IDs',
          },
          rounds: {
            type: 'array',
            items: {
              type: 'object',
            },
            description: 'Array of round data',
          },
          currentRound: {
            type: 'number',
            description: 'Current round number',
          },
          score: {
            type: 'object',
            properties: {
              player1: { type: 'number' },
              player2: { type: 'number' },
            },
          },
          status: {
            type: 'string',
            enum: ['waiting', 'playing', 'finished'],
          },
          winner: {
            type: 'string',
            nullable: true,
            description: 'Winner player ID (null if not finished)',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      CreatePlayer: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            minLength: 2,
            maxLength: 50,
            description: 'Player name',
          },
        },
      },
      CreateMatch: {
        type: 'object',
        required: ['player1Id', 'player2Id'],
        properties: {
          player1Id: {
            type: 'string',
            description: 'First player ID',
          },
          player2Id: {
            type: 'string',
            description: 'Second player ID',
          },
        },
      },
      RegisterMove: {
        type: 'object',
        required: ['playerId', 'move'],
        properties: {
          playerId: {
            type: 'string',
            description: 'Player ID making the move',
          },
          move: {
            type: 'string',
            enum: ['rock', 'paper', 'scissors'],
            description: 'Player move',
          },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
          },
          message: {
            type: 'string',
          },
          data: {
            type: 'object',
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
          statusCode: {
            type: 'number',
          },
        },
      },
    },
  },
};

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: ['src/routes/*.ts', 'src/controllers/*.ts', 'dist/routes/*.js', 'dist/controllers/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
