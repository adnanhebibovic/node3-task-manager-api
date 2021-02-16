const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const id = new mongoose.Types.ObjectId()

const user = {
    _id: id,
    name: 'Adnan',
    email: 'adnan.hebibovic@gmail.com',
    password: 'reactjs12345!!',
    tokens: [{
        token: jwt.sign({ _id: id }, process.env.JWT_SECRET, {expiresIn: '1 day'})
    }]
}

const task = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Learn React.js',
    owner: user._id
}

const setup = async () => {
    await User.deleteMany({})
    await Task.deleteMany({})
    await new User(user).save()
    await new Task(task).save()
}

module.exports = {
    user: user,
    task: task,
    setup: setup
}