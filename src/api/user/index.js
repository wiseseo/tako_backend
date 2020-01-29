const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Users = require('../../models/users');
const Stores = require('../../models/stores');

router.use(express.json());

router.get('/', (req,res)=>{
    res.send('user page');
});

router.post('/signup', (req, res) => {
    //console.log(req.body);
    //console.log(req.body.id);
    const { id , password, name } = req.body;
    crypto.pbkdf2(password, 'iloveeunwoo', 108236, 64, 'sha256', (err, key)=>{
        key = key.toString('base64');
        //console.log(key);
        Users.create({id, password : key, name});
        res.send('signup');
    });
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

//회원탈퇴
router.delete('/:userId', async(req,res)=>{
    const userId = req.params.userId;
    await Users.findOne({id:userId}).then( async (user)=>{
        //res.send('회원탈퇴');
        const userStores = user.stores;
        console.log(userStores);
        userStores.forEach(async (storeId)=>{
            await Stores.findByIdAndDelete(storeId).then(()=>{console.log('가게삭제')}).catch((err)=>{console.log(err)});

            await Users.updateMany({likes : {$in : storeId}},{$pull : {likes : storeId }}).then(()=>{
                //console.log(store);
                console.log('내가좋아하는가게 삭제');
            })
            console.log(storeId);

        });

        await Users.deleteOne({id:userId}).then(()=>{
            res.send('유저 삭제');
        })
    }).catch((err)=>{
        console.log(err);
    })
})

router.post('/login', (req,res)=>{
    console.log(req.body);
    const { userId, password } = req.body;
    crypto.pbkdf2(password, 'iloveeunwoo', 108236, 64, 'sha256', async (err, key)=>{
        key = key.toString('base64');
        //console.log(key);
        await Users.findOne({id: userId, password : key}).then(()=>{
            //console.log(user);
            res.send('login');
        }).catch((err)=>{
            console.log(`로그인 실패 : ${err}`);
        })
    });

});

/*
router.get('/logout', (req,res)=>{
    //console.log(req.body);
    res.send('logout');
});
*/


module.exports = router;