const router = require('express').Router()
const todo = require('../controllers/todo')

router.get('/', todo.findAll)
router.get('/:id', todo.findOne)
router.post('/', todo.create)

router.put('/:id', todo.update)
router.patch('/:id', todo.changeStatus)
router.delete('/:id', todo.delete)

module.exports = router