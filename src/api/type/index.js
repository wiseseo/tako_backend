const express = require('express');
const router = express.Router();
const Types = require('../../models/types');

router.use(express.json());

router.get('/',(req,res)=> {
    Types.find().then((types)=>{
        res.send(types);
    })
})

router.post('/',(req,res)=> {
    const  { name, number } =req.body;
    Types.create({name, number}).then(()=>res.send('success')).catch(e=>res.send(e.message));
})

module.exports = router;