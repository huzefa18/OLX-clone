const ctrl    = require('../controller/auth.controller');
const express  = require('express');
const { requireAuth } = require('../middleware/requireAuth');

const router = express.Router();

router.post('/signup',  ctrl.signup);
router.post('/login',   ctrl.login);
router.post('/refresh', ctrl.refresh);
router.post('/logout',  ctrl.logout);
router.get('/profile',  requireAuth, ctrl.profile);

// Public seller profile — no auth needed
router.get('/user/:id', ctrl.publicProfile);

module.exports = router;