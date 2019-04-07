const todo = require('../models/todo')
const user = require('../models/user')

class Todo{
    static create(req, res){
        let newTodo = new todo({
            name: req.body.name,
            description: req.body.description,
            status: false,
            due_date: req.body.due_date,
            userId: req.body.userId
        })
        todo.create(newTodo)
        .then(data=>{
            res.status(201).json(data)
        })
        .catch(err=>{
            res.status(500).json(err)
        })
    }

    static findAll(req, res){
        todo.find()
        .populate("userId")
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(err=>{
            res.status(500).json(err)
        })
    }

    static findOne(req, res){
        todo.findById(req.params.id)
        .populate("userId")
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(err=>{
            res.status(500).json(err)
        })
    }

    static update(req, res){
        let updateTodo = {
            name: req.body.name,
            description: req.body.description,
            status: req.body.status,
            due_date: req.body.due_date,
            userId: req.body.userId
        }
        todo.findOneAndUpdate(req.params.id, updateTodo, {new:true} )
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(err=>{
            res.status(500).json(err)
        })
    }

    static update(req, res){
        
        todo.findOneAndUpdate(req.params.id, updateTodo, {new:true} )
        .then(data=>{
            res.status(200).json(data)
        })
        .catch(err=>{
            res.status(500).json(err)
        })
    }

    static delete(req, res){
        todo.deleteOne({_id:req.params.id})
        .then(data=>{
            res.status(200).json("Delete Success")
        })
        .catch(err=>{
            res.status(500).json({err})
        })
    }
}

module.exports = Todo