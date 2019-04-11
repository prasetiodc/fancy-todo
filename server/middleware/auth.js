const User = require('../models/user') 
const Todo = require('../models/todo') 
const jwt = require('jsonwebtoken')

function authentication(req, res, next){
    let decoded = jwt.verify(req.headers.authorization , process.env.SECRET_KEY);     
    
    User.findOne({email : decoded.email})
    .then(userFound=>{ 
        if(userFound){
            req.body.userId = userFound._id 
            next()
        }else{
            res.status(401).json({message: 'Unauthorized'})
            res
        }       
    })
    .catch(err=>{
        console.log(err)
    })
    
}

function authorization(req, res, next){
    Todo.findOne({_id:req.params.id})
    .then(data=>{
        
        if(String(data.userId)===String(req.body.userId)){
            next()
        }else{
            res.status(401).json({message: 'Unauthorized'})
        }
    })
    .catch(err=>{
        console.log(err);
    })
    
}

module.exports={authentication, authorization}