const express = require('express');
const router = express.Router();
const dogController = require('../controllers/dogController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateDog } = require('../middleware/validator');

// Public routes
router.get('/', dogController.getAllDogs);
router.get('/:id', dogController.getDogById);

// Protected routes (require JWT verification)
router.post('/', authMiddleware, validateDog, dogController.createDog);
router.put('/:id', authMiddleware, validateDog, dogController.updateDog);
router.delete('/:id', authMiddleware, dogController.deleteDog);

module.exports = router;
