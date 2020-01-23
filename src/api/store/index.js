const express = require('express');
const router = express.Router();
const Stores = require('../../models/stores');

router.use(express.json());

router.get('/', (req,res)=>{
    res.send('store page');
});

router.post('/', (req,res)=> {
    console.log(req.body);
    const {title, type, address, time, description} = req.body;
    Stores.create({title, type, location : { address }, time, description});
    res.send('register store');
});

module.exports = router;