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
    const {title, type, address, time, description, userId} = req.body;
    //address에서 latitude, longtitude 로 변환 필요
    const promise = Stores.create({title, type, location : { address }, time, description});;
    promise.then(async (store)=>{
       const storeId = store._id;
       //내가게등록
       await Users.findOneAndUpdate({id:userId},{$push:{stores: storeId}});
       res.send(storeId);
    });
});
//메뉴 등록
router.patch('/:storeId/menu', async (req,res) => {
    const storeId = req.params.storeId;
    const {menu, price, photo} = req.body;
    await Stores.findByIdAndUpdate(storeId,{$push : {items : {menu, price, photo}}});
    res.send('register menu');
});

//가게 거리에 따라서 보여주기
router.get('/:latitude/:longitude/:latitudeDelta/:longitudeDelta', async (req,res)=>{
    const userlatitude = parseFloat(req.params.latitude);
    const userlongitude = parseFloat(req.params.longitude);
    const latitudeDelta = parseFloat(req.params.latitudeDelta);
    const longitudeDelta = parseFloat(req.params.longitudeDelta);
    console.log(typeof userlatitude);
    await Stores.find({$and : [{'location.latitude' : { $lte : userlatitude + latitudeDelta}} , {'location.longitude' : { $lte : userlongitude + longitudeDelta}} ]}).then((stores)=>{
        res.send(stores);
    })
})
module.exports = router;

