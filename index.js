/**
 * Anonymous Chat Logic
 * When First User Connected Generate a new Id
 * Save that id to the MongoDB
 * When Second User Connected Connect that new User to Non-Connected User
 * When Chat Log Mounted Get that Connected Id from The User and Emit the Message to other User
 */
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const CONFIG = require('./config');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const compression = require('compression');

/* We are Using Default Promise */
mongoose.Promise = global.Promise;
mongoose.connect(CONFIG.MONGODB_URL, {useMongoClient:true});

app.use(bodyParser.json());

/* Socket Connection Handles */
require('./services/socket')(io);

/* Mongoose Models */
require('./models/User');

/* All Routes */
require('./routes/userRoutes')(app);


/* Production config */
if(process.env.NODE_ENV === "production"){
    app.use(compression());
    app.use(require('express').static(path.join(__dirname, 'client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname+'/client/build/index.html'));
    });
}

server.listen(CONFIG.port,() => {
    console.log('I am In')
});