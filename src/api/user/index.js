const express = require('express');
const router = express.Router();
const Users = require('../../models/users');
const Stores = require('../../models/stores');

router.use(express.json());

router.get('/', (req,res)=>{
    res.send('user page');
});

router.get('/like', (req, res)=>{
    const id = req.decoded.id;
    Users.findOne({id}).then((user)=>{
        const userLike = user.likes;
        res.send(userLike);
    })
});

//내가좋아하는가게등록
router.post('/like', async (req, res)=>{
    const {storeId} = req.body;
    const id = req.decoded.id;
    await Users.findOneAndUpdate({id},{$push : {likes : storeId}});
    res.send('좋아하는 가게 등록!');
})

//내가게보여주기
router.get('/store', (req, res)=>{
    const id = req.decoded.id;
    Users.findOne({id}).then((user)=>{
        const userStore = user.stores;
        res.send(userStore);
    })
});

//내정보수정
router.put('/', (req, res)=>{
    const { password, name } = req.body;
    const id = req.decoded.id;
    Users.findOneAndUpdate({id},{$set : {password, name}},{returnNewDocument : true}).then((user)=>{
        res.send('개인정보수정');
    }).catch((err)=>{
        console.log(err);
    })
});

//내가좋아하는가게수정(삭제)
router.delete('/like/:storeId', (req, res)=>{
    const id = req.decoded.id;
    const storeId = req.params.storeId;
    Users.findOneAndUpdate({id},{$pull : {likes : storeId}}).then(()=>{}).catch((e)=>{console.log(e)});
    res.send('좋아하는가게삭제');
});

//회원탈퇴
router.delete('/', (req,res)=>{
    const id = req.decoded.id;
    Users.findOne({id}).then( (user)=>{
        
        const userStores = user.stores;
        //바꿔야함!!!!!!!!!!!!!!!!!!!!!!모든작업이 끝나야 res.send를 호출해야해요
        const resStore = userStores.map((storeId)=>{
            return Stores.findByIdAndDelete(storeId);
        });

        Promise.all(resStore).then(() => console.log('내가게 삭제끝')).catch(err => console.log(err.message));
        
        const resUser = userStores.map((storeId)=>{
            return  Users.updateMany({likes : {$in : storeId}},{$pull : {likes : storeId }});
        })
        
        Promise.all(resUser).then(() => console.log('좋아하는 가게 삭제 끝')).catch(err => console.log(err.message));

        Users.deleteOne({id}).then(()=>{
            res.send('유저 삭제');
        })

    }).catch((err)=>{
        console.log(err);
    })
})
module.exports = router;
