const express = require('express');
const router = express.Router();
const sowController = require('../controllers/sowController');
const verifyJWT = require('../middleware/verifyJWT');

router.use(verifyJWT);

router.route('/')
    .get(sowController.getAllSoWs)
    .post(sowController.createNewSoW)
    .patch(sowController.updateSoW)
    .delete(sowController.deleteSoW);

module.exports = router;
