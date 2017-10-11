const app = require('express')()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.listen(9017)

app.post('/claim', function(req,res){

})

app.post('/reportclaim/:usrid', function(req,res){

})

app.get('/grouplist', function(req,res){

})

app.post('/joingroup/:grpid', function(req,res){

})

app.post('/exitgroup/:grpid', function(req,res){

})

app.post('/truth/:usrid', function(req,res){

})

app.get('userlist/:grpid', function(req,res){

})

app.get('reputation/:usrid', function(req,res){

})