require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const {
    PORT : port = 3000,
    MONGO_URI : mongoURI,
    SECRET : secret
} = process.env;

mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, {useNewUrlParser: true, useUnifiedTopology:true}).then(()=>{
    console.log('connect to mongodb');
}).catch((e)=>{
    console.log(e);
});
const app = express();

app.use('/api', require('./api'));

app.set('jwt-secret', secret);

app.get('/', (req, res)=> {
    res.send('성공');
})
app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});