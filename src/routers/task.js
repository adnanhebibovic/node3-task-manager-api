const express = require('express')
const login = require('../middleware/login')
const Task = require('../models/task')

const router = new express.Router()

router.post('/tasks', login.authorize, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save() 
        res.status(201)
        res.send(task)
    } catch (error) {
        res.status(500)
        res.send()
    }    
})

router.delete('/tasks/:id', login.authorize, async(req, res) => {
    try {
        const result = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if (!result) {
            res.status(404)
            res.send()
        }

        await result.remove()

        res.send(result)
    }
    catch (error) {
        res.status(500)
        res.send()
    }
})

router.get('/tasks/:id', login.authorize, async (req, res) => {
    const _id = req.params.id
    try {
        const result = await Task.findOne({ _id: _id, owner: req.user._id })
        if (!result)
        {
            res.status(404)
            return res.send()
        }

        res.send(result)
    } catch (error) {
        res.status(500)
        res.send()
    }
})

router.patch('/tasks/:id', login.authorize, async (req, res) => {
    const _id = req.params.id
    const keys = Object.keys(req.body)
    try {
        const result = await Task.findOne({ _id: _id, owner: req.user._id })
        
        if (!result)
        {
            res.status(404)
            return res.send()
        }

        keys.forEach((key) => {
            result[key] = req.body[key]
        })

        await result.save()

        res.send(result)
    } catch (error) {
        res.status(500)
        res.send()
    }
})

router.get('/tasks', login.authorize, async (req, res) => {
    try {
        const filter = { owner: req.user._id }
        if (req.query.completed) {
            filter.completed = req.query.completed === 'true'
        }

        const options = {}
        if (req.query.skip) {
            options.skip = parseInt(req.query.skip)
        }
        if (req.query.limit) {
            options.limit = parseInt(req.query.limit)
        }
        if (req.query.sort) {
            const sort = req.query.sort
            options.sort = { [sort] : 1 }

            if (req.query.order) {
                if (req.query.order === 'asc') {
                    options.sort = { [sort] : 1 }
                } else if (req.query.order === 'desc') {
                    options.sort = { [sort] : -1 }
                } else {
                    res.status(400)
                    res.send()
                }
            }
        }

        const result = await Task.find(filter, null, options)
        res.send(result)
    }
    catch (error) {
        res.status(500)
        res.send()
    }
})

module.exports = router