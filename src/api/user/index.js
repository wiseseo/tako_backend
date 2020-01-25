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
    Users.create({id, password, name});
    res.send('signup');
});

router.get('/:userId/like', async (req, res)=>{
    const userId = req.params.userId;
    await Users.findOne({id:userId}).then((user)=>{
        const userLike = user.likes;
        res.send(userLike);
    })
});

router.post('/:userId/like', async (req, res)=>{
    const {storeId} = req.body;
    const userId = req.params.userId;
    await Users.findOneAndUpdate({id:userId},{$push : {likes : storeId}});
    res.send('좋아하는 가게 등록!');
})


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