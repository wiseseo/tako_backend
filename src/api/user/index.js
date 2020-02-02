const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const Users = require('../../models/users');
const Stores = require('../../models/stores');

router.use(express.json());

router.get('/', (req,res)=>{
    res.send('user page');
});

//내가좋아하는가게 보여주기
router.get('/like', (req, res)=>{
    const id = req.decoded.id;
    Users.findOne({id}).then((user)=>{
        const userLike = user.likes;
        res.send(userLike);
    }).catch((err)=>{
        console.log(err);
    })
});

//내가좋아하는가게등록
router.post('/like', (req, res)=>{
    const {storeId} = req.body;
    const id = req.decoded.id;
    Users.findOneAndUpdate({id},{$push : {likes : storeId}}).then(()=>{
        res.send('좋아하는 가게 등록!');
    }).catch((err)=>{
        console.log(err);
    })
    
})

//내가게보여주기
router.get('/store', (req, res)=>{
    const id = req.decoded.id;
    Users.findOne({id}).then((user)=>{
        const userStore = user.stores;
        res.send(userStore);
    }).catch((err)=>{
        console.log(err);
    })
});

//내정보수정
router.put('/', async (req, res)=>{
    const { password, name } = req.body;
    const id = req.decoded.id;
    //비밀번호 수정시 새로운 암호 만들기
    crypto.pbkdf2(password, 'iloveeunwoo', 108236, 64, 'sha256', (err, key)=>{
        Users.findOneAndUpdate({id},{$set : {password: key.toString('base64') , name}},{ new: true}).then((user)=>{
            res.send('개인정보수정');
        }).catch((err)=>{
            console.log(err);
        })
    });

});

//내가좋아하는가게수정(삭제)
router.delete('/like/:storeId', (req, res)=>{
    const id = req.decoded.id;
    const storeId = req.params.storeId;
    Users.findOneAndUpdate({id},{$pull : {likes : storeId}},{new: true}).then((storeLike)=>{
        console.log(storeLike);
        res.send('좋아하는가게삭제');
    }).catch((e)=>{console.log(e)});
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

        Promise.all(resStore).then(() => {
            console.log('내가게 삭제끝');

            const resUser = userStores.map((storeId)=>{
                return  Users.updateMany({likes : {$in : storeId}},{$pull : {likes : storeId }});
            })
            
            Promise.all(resUser).then(() => {
                console.log('좋아하는 가게 삭제 끝');

                Users.deleteOne({id}).then(()=>{
                    res.send('유저 삭제');
                }).catch(err => console.log(err));

            }).catch(err => console.log(err.message));

        }).catch(err => console.log(err.message));
        
    }).catch((err)=>{
        console.log(err);
    })
})
module.exports = router;
