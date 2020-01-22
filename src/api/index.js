const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use('/store', require('./store'));

router.get('/', (req,res)=>{
    res.send('api page');
});

module.exports = router;