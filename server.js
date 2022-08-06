var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
const fileupload = require('express-fileupload')
const nodemailer = require('nodemailer')
var path = require('path');

var app = express()
var port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cors())
app.use( 
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(fileupload());
// app.use(express.static("files"));
app.use("/files", express.static(path.resolve(__dirname + '/files')));

var Users = require('./routes/Users')
var Tasks = require('./routes/Tasks')


app.use('/users', Users)
app.use('/api', Tasks)

app.listen(port, function() {
  console.log('Server is running on port: ' + port)
})