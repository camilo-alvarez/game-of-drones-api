import { Router } from 'express';
import { playerController } from '../controllers';
import { validate, createPlayerSchema, playerIdParamSchema } from '../middlewares/validation.middleware';

const router = Router();

/**
 * @swagger
 * /players:
 *   post:
 *     tags: [Players]
 *     summary: Create a new player
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePlayer'
 *     responses:
 *       201:
 *         description: Player created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/', validate(createPlayerSchema), playerController.createPlayer);

/**
 * @swagger
 * /players:
 *   get:
 *     tags: [Players]
 *     summary: Get all players
 *     responses:
 *       200:
 *         description: List of all players
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/', playerController.getAllPlayers);

/**
 * @swagger
 * /players/{id}/stats:
 *   get:
 *     tags: [Players]
 *     summary: Get player statistics
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Player ID
 *     responses:
 *       200:
 *         description: Player statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/:id/stats', validate(playerIdParamSchema), playerController.getPlayerStats);

export default router;
