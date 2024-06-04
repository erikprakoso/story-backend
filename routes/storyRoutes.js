const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');

router.get('/', storyController.getStories);
router.get('/:id', storyController.getStory);
router.get('/themes/:themeId', storyController.getStoriesByTheme);

module.exports = router;
