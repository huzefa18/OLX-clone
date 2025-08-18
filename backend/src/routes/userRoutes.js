const ctrl= require('../controller/auth.controller')
const express= require('express')
const requireAuth=require('../middleware/requireAuth')

const router=express.Router();

router.post('/signup',ctrl.signup);
router.post('/login,ctrl',ctrl.login);
router.post('/refresh',ctrl.refresh);
router.post('/logout',ctrl.logout);
router.get('/profile',requireAuth,ctrl.profile);

module.exports=router;