const express = require('express');
const router = express.Router();
const Stores = require('../../models/stores');

router.use(express.json());

router.get('/', (req,res)=>{
    res.send('store page');
});

router.post('/', (req,res)=> {
    console.log(req.body);
    const {title, type, address, time, description} = req.body;
    console.log(Stores.create({title, type, location : { address }, time, description}));
    const promise = Stores.create({title, type, location : { address }, time, description});
    promise.then((store)=>{
       console.log(store);
       const storeId = store._id;
       console.log(storeId);
       return storeId;
       
    })
    res.send('register store');
});

router.patch('/:storeId/menu', async (req,res) => {
    const storeId = req.params.storeId;
    const {menu, price, photo} = req.body;
    //console.log(storeId);
    //console.log(await Stores.findById(storeId));
    const store = await Stores.findById(storeId);
    store.items.push({
        menu,
        price,
        photo
    });
    console.log(store);
    Stores.findByIdAndUpdate(storeId,store);
    res.send('..');
})
module.exports = router;

