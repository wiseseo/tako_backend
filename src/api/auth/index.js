const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./../../middlewares/auth');
const router = express.Router();
const Users = require('../../models/users');

router.use(express.json());

router.get('/', (req,res)=>{
    res.send('auth page');
});

router.post('/signup', (req, res) => {
    const { id , password, name } = req.body;
    crypto.pbkdf2(password, 'iloveeunwoo', 108236, 64, 'sha256', (err, key)=>{
        Users.create({id, password : key.toString('base64'), name});
        res.send('signup');
    });
});

router.get('/checkId', (req,res) => {
    const { id } = req.body;

    Users.findOne({id}).then((user)=>{
        if(user) res.send('중복된 아이디 있음');
        else res.send('사용가능한 아이디입니다');
    }).catch((err)=>{
        console.log(err);
    })
})

router.use('/check', authMiddleware)
router.get('/check', (req, res)=>{
    res.json({
        success : true,
        info : req.decoded
    })
});


router.post('/login', (req,res)=>{
    const { id, password } = req.body;
    const secret = req.app.get('jwt-secret');

    Users.findOne({id}).then((user)=>{
        if(!user) throw new Error('아이디 오류');
        else {
            crypto.pbkdf2(password, 'iloveeunwoo', 108236, 64, 'sha256', (err,key)=>{
                if(user.password !== key.toString('base64')) throw new Error('비밀번호 오류');
                else {
                    jwt.sign(
                        {
                            id: user.id
                        }, 
                        secret, 
                        {
                            expiresIn: '7d',
                            issuer: 'tako.com',
                            subject: 'userInfo'
                        }, (err, token) => {
                            if (err) throw new Error
                            res.json({
                                message: 'logged in successfully',
                                token
                            });
                        }
                    )
                }
            })
        }
    })
});


/*
router.get('/logout', (req,res)=>{
    //console.log(req.body);
    res.send('logout');
});
*/


module.exports = router;
