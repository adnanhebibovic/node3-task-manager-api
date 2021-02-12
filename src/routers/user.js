const express = require('express')
const login = require('../middleware/login')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const account = require('../emails/account')

const router = new express.Router()

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image!'), undefined)
        }
        
        cb(undefined, true)
    }
})

router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        const token = await login.generate(user._id)
        user.tokens = user.tokens.concat({token})
        await user.save()
        account.sendWelcomeEmail(user.email)
        res.status(201)
        res.send({ user, token })
    } catch (error) {
        res.status(400)
        res.send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await login.generate(user._id)
        user.tokens = user.tokens.concat({token})
        await user.save()

        res.send({ user, token })
    } catch (error) { 
        res.status(400)
        res.send(error)        
    }
})

router.post('/users/logout', login.authorize, async (req, res) => {
    try {
       req.user.tokens = req.user.tokens.filter((t) => {
           return t.token != req.token
       })

       await req.user.save()
       res.send()
    } catch (error) { 
        res.status(400)
        res.send(error)        
    }
})

router.post('/users/logout/all', login.authorize, async (req, res) => {
    try {
       req.user.tokens.splice(0, req.user.tokens.length)

       await req.user.save()
       res.send()
    } catch (error) { 
        res.status(400)
        res.send(error)        
    }
})

router.get('/users/me', login.authorize, async (req, res) => {
    try {
        res.send(req.user)
    } catch (error) {
        res.status(500)
        res.send(error)
    }
})

router.patch('/users/me', login.authorize, async (req, res) => {
    try {
        const keys = Object.keys(req.body)
        keys.forEach((index) => {
            req.user[index] = req.body[index]
        })
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(500)
        res.send(error)
    }
})

router.delete('/users/me', login.authorize, async (req, res) => {
    try {
        await req.user.remove()
        account.sendCancelationEmail(req.user.email)
        res.send(req.user)
    } catch (error) {
        res.status(500)
        res.send(error)
    }
})

router.post('/users/me/avatar', login.authorize, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, 
(error, req, res, next) => {
    res.status(400)
    res.send({ error: error.message })
})

router.delete('/users/me/avatar', login.authorize, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

module.exports = router