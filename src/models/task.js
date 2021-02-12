const db = require('../db/mongoose')

const schema = require('../schemes/task')

const Task = db().model('Tasks', schema)

module.exports = Task

