const user = require('../models/user')
const bcrypt = require('bcryptjs')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)
const jwt = require('jsonwebtoken')
const {hash, compare} = require('../helpers/bcrypt')
const {sign, verify} = require('../helpers/jwt')

class User{
  static create(req, res){
      let newUser = new user({
        name: req.body.name,
        email: req.body.email,
        password: hash(req.body.password)
      })
      user.create(newUser)

      .then(data=>{
          res.status(201).json(data)
      })
      .catch(err=>{
          console.log(err.message);
      })
  }

  static googleLogin(req, res){
    
    let payload;
    client.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.CLIENT_ID
    })
    .then(ticket => {
      payload = ticket.getPayload() // dari sana

      return user.findOne({
        email: payload.email
      })
    })
    .then((foundUser) => {
      if (foundUser) {  
        const token = sign({id: foundUser._id, name: foundUser.name, email: foundUser.email})
        res.status(200).json(token)
      } else {
        let newUser = new user({
          name: payload.name,
          email: payload.email,
          password: hash(Math.floor(Math.random()*1000000000000))
        })
        user.create(newUser)          
        .then(data=>{
          const token = sign({name: payload.name, email: payload.email})
          res.status(200).json(token)
        })
        
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err.message)
    })
  }

  static login(req, res){
    user.findOne({
      email:req.body.email
    })
    .then(found => {
      
      if (found) {
        if(compare(req.body.password, found.password)) {
          let token = sign({
            id: found._id,
            email: found.email
          })          
          res.status(200).json(token)
        } else {          
          res.status(400).json({message: `Wrong Username/Password`})
        }
      } else {
        res.status(400).json({message: `Wrong Username/Password`})
      }
    })
    .catch(err => {
      res.status(500).json(err.message)
    })
  }
}

module.exports = User