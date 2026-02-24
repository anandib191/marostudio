import express from 'express';
import AppConfig from '../models/AppConfig.js';

const router = express.Router();

/**
 * @route   GET /api/statistics
 * @desc    Get public statistics for landing page
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const config = await AppConfig.getConfig();
    res.status(200).json({
      success: true,
      statistics: config.statistics || {
        categories: '4+',
        activeUsers: '10k+',
        imageGenerated: '50k+',
        activeSubscription: '1k+',
      },
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      statistics: {
        categories: '4+',
        activeUsers: '10k+',
        imageGenerated: '50k+',
        activeSubscription: '1k+',
      },
    });
  }
});

export default router;
