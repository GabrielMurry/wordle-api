const express = require("express");
const router = express.Router();
const updateStatsController = require("../controllers/updateStatsController");

router.put("/", updateStatsController.handleUpdateStats);

module.exports = router;
