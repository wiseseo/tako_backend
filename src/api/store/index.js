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
    const promise = Stores.create({title, type, location : { address }, time, description});
    promise.then((store)=>{
       //console.log(store);
       const storeId = store._id;
       //console.log(storeId);
       return storeId;
       
    })
    res.send('register store');
});
//메뉴 등록
router.patch('/:storeId/menu', async (req,res) => {
    const storeId = req.params.storeId;
    const {menu, price, photo, userId} = req.body;
    //console.log(storeId);
    //console.log(await Stores.findById(storeId));
    const store = await Stores.findById(storeId);
    store.items.push({
        menu,
        price,
        photo
    });
    //console.log(store);
    await Stores.findByIdAndUpdate(storeId,store);
    //내가게등록까지
    const user = await Users.findOne({id : userId});
    user.stores.push(store._id);
    //console.log(user);
    await Users.findOneAndUpdate({id:userId},user);
    res.send('register menu');
});


module.exports = router;

