const user = require('../models/user')
const bcrypt = require('bcryptjs')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)
const jwt = require('jsonwebtoken')

class User{
  static create(req, res){
    console.log("MASUK server");

      // console.log(req.body.names)
      let newUser = new user({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
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
        const token = jwt.sign({name: payload.name, email: payload.email},process.env.SECRET_KEY)     //JWT
        res.status(200).json(token)
      } else {
        
        let newUser = new user({
          name: payload.name,
          email: payload.email,
          password: bcrypt.hashSync("password123", 10)
        })
        user.create(newUser)          
        .then(data=>{
          const token = jwt.sign({name: payload.name, email: payload.email},process.env.SECRET_KEY)     //JWT
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
    // console.log("req.body  ",req.body);
    
    user.findOne({
      email:req.body.email
    })
    .then(found => {
      
      if (found) {
        if(bcrypt.compareSync(req.body.password, found.password)) {
          let token = jwt.sign({
            name: req.body.name,
            email: req.body.email
          }, process.env.SECRET_KEY)          
          res.status(200).json(token)
        } else {
          console.log("MASUK 1");
          
          res.status(400).json({message: `Wrong Username/Password`})
        }
      } else {
        console.log("MASUK 2");

        res.status(400).json({message: `Wrong Username/Password`})
      }
    })
    .catch(err => {
      console.log("MASUK 3");

      res.status(500).json(err.message)
    })
  }
}

module.exports = User