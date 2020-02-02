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

    Users.find().then((users)=>{
        const usersId = users.map((user)=>user.id).includes(id);
        if(usersId) res.send('중복된 아이디 있음');
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
    //console.log(req.body);
    const { id, password } = req.body;
    const secret = req.app.get('jwt-secret');

    crypto.pbkdf2(password, 'iloveeunwoo', 108236, 64, 'sha256', (err, key)=>{
        Users.findOne({$and : [{id}, {password:key.toString('base64')}]}).then((user)=>{
            if(!user) {
                res.send('ID나 Password가 잘못되었습니다.');
            }
            else{
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            id: user.id,
                            //username: user.name,
                            //admin: user.admin
                        }, 
                        secret, 
                        {
                            expiresIn: '7d',
                            issuer: 'tako.com',
                            subject: 'userInfo'
                        }, (err, token) => {
                            if (err) reject(err)
                            resolve(token) 
                        })
                })
                return p;
            }
        }).then((token)=>{
            res.json({
                message: 'logged in successfully',
                token
            });
        })
        .catch((err)=>{
            console.log(err);
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
