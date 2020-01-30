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
    const {title, type, address, latitude, longitude, time, description} = req.body;
    const id = req.decoded.id;
    //address에서 latitude, longtitude 로 변환 필요
    const promise = Stores.create({title, type, location : { address, latitude, longitude }, time, description});;
    promise.then(async (store)=>{
       const storeId = store._id;
       //내가게등록
       await Users.findOneAndUpdate({id},{$push:{stores: storeId}});
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
router.get('/:latitude/:longitude/:latitudeDelta/:longitudeDelta', (req,res)=>{
    const userlatitude = parseFloat(req.params.latitude);
    const userlongitude = parseFloat(req.params.longitude);
    const latitudeDelta = parseFloat(req.params.latitudeDelta);
    const longitudeDelta = parseFloat(req.params.longitudeDelta);
    //console.log(typeof userlatitude);
    Stores.find({$and : [{'location.latitude' : { $lte : userlatitude + latitudeDelta}} , {'location.latitude' : { $gte : userlatitude - latitudeDelta}}, {'location.longitude' : { $lte : userlongitude + longitudeDelta}} , {'location.longitude' : { $gte : userlongitude - longitudeDelta}} ]}).then((stores)=>{
        res.send(stores);
    });    
});

//가게 거리+type 따라서 보여주기
router.get('/:latitude/:longitude/:latitudeDelta/:longitudeDelta/:type', (req,res)=>{
    const userlatitude = parseFloat(req.params.latitude);
    const userlongitude = parseFloat(req.params.longitude);
    const latitudeDelta = parseFloat(req.params.latitudeDelta);
    const longitudeDelta = parseFloat(req.params.longitudeDelta);
    const type = req.params.type;

    console.log(typeof type, type);
    Stores.find({$and : [{'location.latitude' : { $lte : userlatitude + latitudeDelta}} , {'location.latitude' : { $gte : userlatitude - latitudeDelta}}, {'location.longitude' : { $lte : userlongitude + longitudeDelta}} , {'location.longitude' : { $gte : userlongitude - longitudeDelta}} ]}).then((stores)=>{
        const filteredStore = stores.filter(store => store.type.includes(type));
        res.send(filteredStore);
    });    
});

//가게 수정
router.put('/:storeId', (req, res)=>{
    const {title, type, address, latitude, longitude, time, description } = req.body;
    const storeId = req.params.storeId;

    Stores.findByIdAndUpdate(storeId, {$set: {title, type, location:{address, latitude, longitude },time, description}}, {returnNewDocument : true}).then((store)=>{
        console.log(store);
        res.send('가게 수정');
    }).catch((err)=>{
        console.log(err);
    })
});

//메뉴 수정
router.patch('/:storeId/item/:itemIndex', (req,res)=>{
    const storeId = req.params.storeId;
    const itemIndex = parseInt(req.params.itemIndex);
    const { menu, price, photo } = req.body;

    Stores.findById(storeId).then(async (store)=>{
        store.items[itemIndex] = { menu ,price, photo};
        console.log(store.items);
        await Stores.findByIdAndUpdate(storeId, {$set : {items : store.items}});
        res.send('메뉴 수정');
    })
});

//가게 삭제
router.delete('/:storeId', (req,res)=> {
    const storeId = req.params.storeId;
    const id = req.decoded.id;
    
    Stores.findByIdAndDelete(storeId).then(()=>{res.send('가게삭제')}).catch((err)=>{console.log(err)});

    //내가게에서도 삭제
    Users.findOneAndUpdate({id}, {$pull :{stores : storeId}}).then(()=>{res.send('내가게 삭제')}).catch((err)=>{console.log(err)});

    //내가좋아하는가게 - 사용자 삭제
    Users.updateMany({likes : {$in : storeId}},{$pull : {likes : storeId }}).then((store)=>{
        console.log(store);
        res.send('내가좋아하는가게 삭제');
    })
});

//메뉴 삭제
router.delete('/:storeId/item/:itemIndex', (req,res)=> {
    const storeId = req.params.storeId;
    const itemIndex = parseInt(req.params.itemIndex);
    //const { userId } = req.body;
    
    Stores.findById(storeId).then(async (store)=>{
        store.items.splice(itemIndex,1);
        console.log(store.items);
        await Stores.findByIdAndUpdate(storeId, {$set : {items : store.items}});
        res.send('메뉴 수정');
    }).catch((err)=>{
        console.log(err);
    })
})

module.exports = router;

