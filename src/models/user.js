const bcrypt = require('bcryptjs')

const db = require('../db/mongoose')

const schema = require('../schemes/user')

const Task = require('./task')

schema.pre('remove', async function(next) {
    await Task.deleteMany({ owner: this._id })
    next()
})

schema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

schema.methods.toJSON = function() {
    const user = this.toObject()
    delete user.password
    delete user.tokens
    delete user.avatar
    return user
}

schema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

const User = db().model('User', schema)

module.exports = User

