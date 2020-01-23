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
    //console.log(req.body);
    //console.log(req.body.id);
    const { id , password, name } = req.body;
    Users.create({id, password, name, likes:[], stores:[]});
    res.send('signup');
});

/*
router.post('/login', (req,res)=>{
    console.log(req.body);
    res.send('login');
});

router.get('/logout', (req,res)=>{
    //console.log(req.body);
    res.send('logout');
});
*/


module.exports = router;