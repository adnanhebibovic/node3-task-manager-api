const jwt = require('jsonwebtoken')

const User = require('../models/user')

const authorize = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }

        req.user = user
        req.token = token

        next()
    } catch (error) {
        res.status(401)
        res.send()
    }
}

const generate = async function(id) {
    const token = jwt.sign({_id: id}, process.env.JWT_SECRET, {expiresIn: '1 day'})
    return token
}

module.exports = {
    authorize: authorize,
    generate: generate,
}