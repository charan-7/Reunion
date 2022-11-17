const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const uri = 'mongodb://0.0.0.0:27017/reunion';
mongoose.connect(uri)
.then(()=> console.log('connected to db...'))
.catch((err) => console.log(err));

const loginRoute = require('./routes/loginRoute');
const authorization = require('./authorization');
const postRoute = require('./routes/postRoute');
const likeRoute = require('./routes/likeRoute');
const commentRoute = require('./routes/commentRoute');
const userRoute = require('./routes/userRoute');

app.use(authorization);
app.use('/api/authenticate', loginRoute);
app.use('/api', postRoute);
app.use('/api', likeRoute);
app.use('/api', commentRoute);
app.use('/api', userRoute);

app.listen(5000, ()=>{
    console.log('connected to port 5000...');
})