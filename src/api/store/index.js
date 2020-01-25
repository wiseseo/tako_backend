const express = require('express');
const router = express.Router();
const Stores = require('../../models/stores');
const Users = require('../../models/users');

router.use(express.json());

router.get('/', (req,res)=>{
    res.send('store page');
});
//가게 등록
router.post('/', (req,res)=> {
    console.log(req.body);
    const {title, type, address, time, description} = req.body;
    //address에서 latitude, longtitude 로 변환 필요
    const promise = Stores.create({title, type, location : { address }, time, description});
    promise.then((store)=>{
       const storeId = store._id;
       return storeId;
       
    })
    res.send('register store');
});
//메뉴 등록
router.patch('/:storeId/menu', async (req,res) => {
    const storeId = req.params.storeId;
    const {menu, price, photo, userId} = req.body;
    await Stores.findByIdAndUpdate(storeId,{$push : {items : {menu, price, photo}}});
    //내가게등록까지
    await Users.findOneAndUpdate({id:userId},{$push:{stores: storeId}});
    res.send('register menu');
});


module.exports = router;

