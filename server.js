const express = require('express');
const cors = require('cors');
require('dotenv').config()

const mongoose = require("mongoose");
const url = process.env.MONGO_URI;
const { Schema } = mongoose;
const multer = require('multer')
const {GridFsStorage}  = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')

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

// upload a file
app.post("/api/fileanalyse",upload.single("upfile"),(req,res)=>{
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  })
})

// get list of files
app.get('/api/fileanalyse', (req, res) => {
    gfs.files.find().toArray((error, files) => {
        //check if files exist
        if (!files || files.length == 0) {
            return res.status(404).json({
                error: "No files exist"
            })
        }
        // files exist
        return res.json(files)
    })
})

// get a single image
app.get('/api/fileanalyse/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (error, file) => {
        //check if files exist
        if (!file || file.length == 0) {
            return res.status(404).json({
                error: "No files exist"
            })
        }
        //file exist
        return res.json(file)
    })
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
