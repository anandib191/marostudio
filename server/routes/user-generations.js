import express from 'express';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/auth.js';
import Generation from '../models/Generation.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @route   POST /api/user/generations/save
 * @desc    Save generation record with image URLs
 * @access  Private
 */
router.post('/save', protect, async (req, res) => {
  try {
    const { type, quality, imageUrls, category, productType, style, creditsUsed, sourceImageUrl, numberOfImages, background, creatorName, aspectRatio, consistentCharacter } = req.body;

    if (!imageUrls || imageUrls.length === 0) {
      return res.status(400).json({ success: false, message: 'No image URLs provided' });
    }

    const generation = await Generation.create({
      userId: req.user._id,
      userEmail: req.user.email,
      type: type || 'photoshoot',
      quality: quality || 'HD',
      imageUrls,
      category: category || null,
      productType: productType || null,
      style: style || null,
      creditsUsed: creditsUsed || 0,
      sourceImageUrl: sourceImageUrl || null,
      numberOfImages: numberOfImages || 1,
      background: background || null,
      creatorName: creatorName || null,
      aspectRatio: aspectRatio || null,
      consistentCharacter: consistentCharacter || false,
    });

    res.status(201).json({
      success: true,
      generation: { _id: generation._id },
    });
  } catch (error) {
    logger.error('Save generation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/user/generations
 * @desc    Get user's generated images (paginated)
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const type = req.query.type; // 'photoshoot' | 'marketing' | undefined

    const filter = { userId: req.user._id };
    if (type && type !== 'all') {
      filter.type = type;
    }

    const [generations, total] = await Promise.all([
      Generation.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Generation.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      generations,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    logger.error('Get user generations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/user/generations/admin/all
 * @desc    Get all generations for admin dashboard
 * @access  Private/Admin
 */
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const [generations, total] = await Promise.all([
      Generation.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Generation.countDocuments({}),
    ]);

    res.status(200).json({
      success: true,
      generations,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    logger.error('Admin get generations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   DELETE /api/user/generations/:id
 * @desc    Delete a generation
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const generation = await Generation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!generation) {
      return res.status(404).json({ success: false, message: 'Generation not found' });
    }

    res.status(200).json({ success: true, message: 'Generation deleted successfully' });
  } catch (error) {
    logger.error('Delete generation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
