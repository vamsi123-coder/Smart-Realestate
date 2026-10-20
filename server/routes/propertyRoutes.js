const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  uploadImage,
} = require('../controllers/propertyController');
const { verifyToken } = require('../middleware/verifyToken');

// Multer for image buffer (no disk storage — streams to Cloudinary)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getProperties);
router.get('/me', verifyToken, getMyProperties);
router.get('/:id', getPropertyById);
router.post('/', verifyToken, createProperty);
router.put('/:id', verifyToken, updateProperty);
router.delete('/:id', verifyToken, deleteProperty);
router.post('/upload/image', verifyToken, upload.single('image'), uploadImage);

module.exports = router;
