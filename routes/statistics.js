const express = require("express");
const router = express.Router();
const getStatsController = require("../controllers/getStatsController");

router.get("/", getStatsController.handleGetStats);

module.exports = router;
