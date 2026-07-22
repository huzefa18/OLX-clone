const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/requireAuth');
const ctrl = require('../controller/message.controller');

// GET /messages/:productId/:sellerId  — fetch conversation history
router.get('/:productId/:sellerId', requireAuth, ctrl.getMessages);

// POST /messages — send a message via REST
router.post('/', requireAuth, ctrl.sendMessage);

module.exports = router;
