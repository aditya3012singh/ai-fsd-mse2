const express = require('express');
const router = express.Router();
const {
    getItems,
    getItemById,
    addItem,
    updateItem,
    deleteItem,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.route('/').get(getItems).post(protect, upload.single('image'), addItem);
router.get('/search', getItems);
router
    .route('/:id')
    .get(getItemById)
    .put(protect, upload.single('image'), updateItem)
    .delete(protect, deleteItem);

module.exports = router;
