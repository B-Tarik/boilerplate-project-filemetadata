'use strict';

const express = require('express');
const cors = require('cors');
const multer  = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1 * 1024 * 1024 }
})

const app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res, next) => {
  if(req.file == undefined) next(new Error('No file chosen'))
  res.json({
    name : req.file.originalname,
    type : req.file.mimetype,
    size : -~(req.file.size/1024) + 'KB'
   });
})

app.use((err, req, res, next) => {
   res.status(404).json({
    error: {
      message: err.message || 'Not found'
    }
  });
 });

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
