const express = require('express');
const router = express.Router();
const Stores = require('../../models/stores');

router.get('/', (req,res)=>{
    res.send('store page');
});

module.exports = router;