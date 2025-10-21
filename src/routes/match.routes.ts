import { Router } from 'express';
import { matchController } from '../controllers';
import {
  validate,
  createMatchSchema,
  registerMoveSchema,
  matchIdParamSchema,
} from '../middlewares/validation.middleware';

const router = Router();

/**
 * @swagger
 * /matches:
 *   post:
 *     tags: [Matches]
 *     summary: Create a new match
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMatch'
 *     responses:
 *       201:
 *         description: Match created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/', validate(createMatchSchema), matchController.createMatch);

/**
 * @swagger
 * /matches/{id}:
 *   get:
 *     tags: [Matches]
 *     summary: Get match by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Match ID
 *     responses:
 *       200:
 *         description: Match retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/:id', validate(matchIdParamSchema), matchController.getMatchById);

/**
 * @swagger
 * /matches/{id}/move:
 *   post:
 *     tags: [Matches]
 *     summary: Register a player move
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Match ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterMove'
 *     responses:
 *       200:
 *         description: Move registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post('/:id/move', validate(registerMoveSchema), matchController.registerMove);

export default router;
