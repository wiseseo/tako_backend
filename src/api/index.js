const express = require('express');
const authMiddleware = require('./../middlewares/auth');
const router = express.Router();


router.use('/user', authMiddleware)
router.use('/user', require('./user'));
router.use('/store', authMiddleware)
router.use('/store', require('./store'));
router.use('/auth', require('./auth'));

router.get('/', (req,res)=>{
    res.send('api page');
});

module.exports = router;