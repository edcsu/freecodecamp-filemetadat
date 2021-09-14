const express = require('express');
const cors = require('cors');
require('dotenv').config()

const mongoose = require("mongoose");
const url = process.env.MONGO_URI;
const { Schema } = mongoose;
const multer = require('multer')
const {GridFsStorage}  = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')

const fileanalyse = require("./api/fileanalyse");

// create a connection using mongoose
let conn = mongoose.connection;
let gfs;
conn.once('open', () => {
    //initialize our stream
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('imageUpload')
});
// create a storage object
const storage = new GridFsStorage({ url });

// Set the multer storage engine to the newly created object
const upload = multer({ storage })

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.use("/api/fileanalyse", fileanalyse);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
