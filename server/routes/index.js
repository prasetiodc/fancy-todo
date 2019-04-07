const router = require('express').Router()
const user = require('./user.js')
const todo = require('./todo.js')

router.use('/users', user)
router.use('/todo', todo)

module.exports = router