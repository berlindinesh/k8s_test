import express from 'express';

const router = express.Router();

// ✅  Public health check endpoint
router.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
~                                                                                                                                                                                                          
