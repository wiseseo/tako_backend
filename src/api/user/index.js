const express = require('express');
const router = express.Router();
const Users = require('../../models/users');

router.use(express.json());

router.get('/', (req,res)=>{
    res.send('user page');
});

router.get('/:name', (req, res) => {
    console.log(req.body)
    res.send(`hello ${req.params.name}`);
});

router.post('/signup', (req, res) => {
    console.log(req.body);
    res.send('signup!');
});

module.exports = router;