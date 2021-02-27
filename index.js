const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./routes/index.routes');

const server = express();
server.use(cors({
    origin: '*',
    credentials: true
}));
server.use(morgan('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: true}));
// ROUTER
server.use('/', router);
// PORT
server.set("port", 3000);

server.get('/', (req, res) => {
    res.send('Welcome');
})

server.listen(server.get("port"), () => {
    console.log("Server running on port 3000");
})