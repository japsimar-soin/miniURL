import { Router } from 'express';
import { join } from 'path';
import authRoute from '../routes/auth';
import linksRoute from '../routes/links';
import redirectLink from '../controllers/links/redirectLink';
import expressRateLimit from '../lib/expressRateLimit';

const router = Router();

// Health check endpoint
router.get('/healthz', (req, res) => {
  const uptime = process.uptime();
  res.status(200).json({
    status: 'ok',
    uptime: `${Math.floor(uptime)}s`,
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/api/auth', authRoute);
router.use('/api/links', linksRoute);

router.get('/', (req, res) => {
  res.sendFile(join(process.cwd(), 'public', 'dashboard.html'));
});

router.get('/code/:code', (req, res) => {
  res.sendFile(join(process.cwd(), 'public', 'stats.html'));
});

router.get('/:code', expressRateLimit('basic'), redirectLink);

export default router;
