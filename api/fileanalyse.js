const express = require("express");
const router = express.Router();

const multer = require('multer')

// Set the multer storage engine to the newly created object
const upload = multer({ storage })

// upload a file
router.post('/',upload.single("upfile"),(req,res)=>{
    res.json({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    })
  })
  
  // get list of files
  router.get('/', (req, res) => {
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
  router.get('/:filename', (req, res) => {
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

  module.exports = router;