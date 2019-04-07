require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const port = 3000
const routes = require('./routes')
const cors = require('cors')
const jwt = require('jsonwebtoken')

let app = express()

app.use(cors())

app.use(express.urlencoded({extended:false}))
app.use(express.json())

mongoose.connect('mongodb://localhost/todo', {useNewUrlParser:true})

app.use('/api', routes)

app.listen(port, ()=>{
    console.log(`Listen on ${port}`);
    
})