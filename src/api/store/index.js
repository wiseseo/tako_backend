const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const uuid4 = require('uuid4');
const Stores = require('../../models/stores');
const Users = require('../../models/users');
const Types = require('../../models/types');

router.use(express.json());

router.get('/', (req,res)=>{
    res.send('store page');
});

const uploadThumbnail = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'public/thumbnail/');
      },
      filename: function (req, file, cb) {
        cb(null, uuid4() + path.extname(file.originalname));
    }
}),
});

const uploadItem = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/item/');
        },
        filename: function (req, file, cb) {
            cb(null, uuid4() + path.extname(file.originalname));
      }
    }),
});

//가게 등록
router.post('/',uploadThumbnail.single('img'),(req,res)=> {
    const {title, type, location, time, description} = req.body;
    const id = req.decoded.id;
    console.log(req.file);
    console.log(__dirname);
    const thumbnail = req.file.filename;
    //address에서 latitude, longtitude 로 변환 필요
    const promise = Stores.create({title, type, location , time, description, thumbnail});;
    promise.then((store)=>{
       const storeId = store._id;
       //내가게등록
       Users.findOneAndUpdate({id},{$push:{stores: storeId}},{new:true}).then((newuser)=>{
            res.send(newuser);
       })
    });
    
});

//메뉴 등록
router.patch('/:storeId/menu',uploadItem.single('img'), (req,res) => {
    const storeId = req.params.storeId;
    const {menu, price} = req.body;
    const photo = req.file.filename;
    Stores.findByIdAndUpdate(storeId,{$push : {items : {menu, price, photo}}},{new:true}).then((store)=>{
        res.send(store);
    })
});

//가게 거리에 따라서 보여주기
router.get('/:latitude/:longitude/:latitudeDelta/:longitudeDelta', (req,res)=>{
    const latitude = parseFloat(req.params.latitude);
    const longitude = parseFloat(req.params.longitude);
    const latitudeDelta = parseFloat(req.params.latitudeDelta);
    const longitudeDelta = parseFloat(req.params.longitudeDelta);

    Stores.find({$and : [{'location.latitude' : { $lte : latitude + latitudeDelta}} , {'location.latitude' : { $gte : latitude - latitudeDelta}}, {'location.longitude' : { $lte : longitude + longitudeDelta}} , {'location.longitude' : { $gte : longitude - longitudeDelta}} ]}).then((stores)=>{
        res.send(stores);
    });    
});

async function getTypeByNumber(number) {
    const {name} = await Types.findOne({number});
    return name;
}

//가게 거리+type 따라서 보여주기
router.get('/:latitude/:longitude/:latitudeDelta/:longitudeDelta/:typeNumber', async (req,res)=>{
    const latitude = parseFloat(req.params.latitude);
    const longitude = parseFloat(req.params.longitude);
    const latitudeDelta = parseFloat(req.params.latitudeDelta);
    const longitudeDelta = parseFloat(req.params.longitudeDelta);
    const name = await getTypeByNumber(parseInt(req.params.typeNumber));

    Stores.find({$and : [{type:name},{'location.latitude' : { $lte : latitude + latitudeDelta}} , {'location.latitude' : { $gte : latitude - latitudeDelta}}, {'location.longitude' : { $lte : longitude + longitudeDelta}} , {'location.longitude' : { $gte : longitude - longitudeDelta}} ]}).then((stores)=>{
        res.send(stores)
    }).catch(err => res.statusCode(404));    
});

//가게 수정
router.put('/:storeId', uploadThumbnail.single('img'), (req, res)=>{
    const {title, type, location, time, description } = req.body;
    const storeId = req.params.storeId;
    const thumbnail = req.file.filename;

    Stores.findByIdAndUpdate(storeId, {$set: {title, type, location,time, description, thumbnail }}, {new : true}).then((store)=>{
        res.send(store);
    }).catch((err)=>{
        console.log(err);
    })
});

//메뉴 수정
router.patch('/:storeId/item/:itemIndex', uploadItem.single('img'), (req,res)=>{
    const storeId = req.params.storeId;
    const itemIndex = parseInt(req.params.itemIndex);
    const { menu, price} = req.body;
    const photo = req.file.filename;

    Stores.findById(storeId).then(async (store)=>{
        store.items[itemIndex] = { menu ,price, photo};
        const menuAddedStore = await Stores.findByIdAndUpdate(storeId, {$set : {items : store.items}}, {new : true});
        res.send(menuAddedStore);
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
        res.send('내가좋아하는가게 삭제');
    })
});

//메뉴 삭제
router.delete('/:storeId/item/:itemIndex', (req,res)=> {
    const storeId = req.params.storeId;
    const itemIndex = parseInt(req.params.itemIndex);
    
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

