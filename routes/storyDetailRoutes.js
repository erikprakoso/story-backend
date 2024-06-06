const express = require('express');
const router = express.Router();
const storyDetailController = require('../controllers/storyDetailController');

router.get('/:id', storyDetailController.getStoryDetailsByStoryId);

module.exports = router;