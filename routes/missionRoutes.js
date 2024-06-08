const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController');

router.get('/:user_id', missionController.getMissionsByUserId);
router.post('/claim', missionController.claimMission);

module.exports = router;
