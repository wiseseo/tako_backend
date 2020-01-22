const express = require('express');
const router = express.Router();
const Stores = require('../../models/store');

router.get('/', (req,res)=>{
    res.send('store page');
});

module.exports = router;