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

//내가좋아하는가게등록
router.post('/:userId/like', async (req, res)=>{
    const {storeId} = req.body;
    const userId = req.params.userId;
    await Users.findOneAndUpdate({id:userId},{$push : {likes : storeId}});
    res.send('좋아하는 가게 등록!');
})

//내가게보여주기
router.get('/:userId/store', async (req, res)=>{
    const userId = req.params.userId;
    await Users.findOne({id:userId}).then((user)=>{
        const userStore = user.stores;
        res.send(userStore);
    })
});

//내정보수정
router.put('/:userId', async (req, res)=>{
    const { password, name } = req.body;
    const userId = req.params.userId;
    console.log(password);
    console.log(name);
    await Users.findOneAndUpdate({id : userId},{$set : {password, name}},{returnNewDocument : true}).then((user)=>{
        console.log(user);
        res.send('개인정보수정');
    }).catch((err)=>{
        console.log(err);
    })
});

//내가좋아하는가게수정(삭제)
router.delete('/:userId/like/:storeId', async (req, res)=>{
    const userId = req.params.userId;
    const storeId = req.params.storeId;
    await Users.findOneAndUpdate({id:userId},{$pull : {likes : storeId}}).then(()=>{}).catch((e)=>{console.log(e)});
    res.send('좋아하는가게삭제');
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