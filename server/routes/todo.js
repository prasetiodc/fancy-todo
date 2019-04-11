const router = require('express').Router()
const todo = require('../controllers/todo')
const {authentication} = require('../middleware/auth')
const {authorization} = require('../middleware/auth')

router.get('/', todo.findAll)
router.get('/:id', authentication, authorization, todo.findOne)
router.post('/', todo.create)

router.put('/:id', authentication, authorization, todo.update)
router.patch('/:id', todo.changeStatus)
router.delete('/:id', authentication, authorization, todo.delete)

module.exports = router