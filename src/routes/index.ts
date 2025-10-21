import { Router } from 'express';
import playerRoutes from './player.routes';
import matchRoutes from './match.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Game of Drones API is running',
    timestamp: new Date().toISOString(),
  });
});

router.use('/players', playerRoutes);
router.use('/matches', matchRoutes);

export default router;
