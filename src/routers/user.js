const express = require('express')
const User = require('../models/user')

const router = new express.Router

router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    const token = await user.generateAuthToken()
    user.password = undefined
    res.status(201).send({user, token})
  } catch(e) {
    res.status(400).send(e)
  }
})

router.get('/users', (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users)
    })
    .catch(() => {
      res.status(500).send()
    })
})

router.get('/users:id', (req, res) => {
  const _id = req.params.id
  User.findById(_id)
    .then((user) => {
      if (!user) {
        res.status(404).send()
      }
      user.password = undefined
      res.send(user)
    })
    .catch(() => {
      res.status(500).send()
    })
})

router.patch('/users/:id', async (req, res) => {
  try {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
      res.status(404).send('Invalid attributes for update!')
    }

    const user = await User.findById(req.params.id)
    updates.forEach((update) => user[update] = req.body[update])
    await user.save()

    if (!user) {
      res.status(404).send()
    }

    user.password = undefined
    res.send(user)
  } catch (e) {
    res.status(400).send(e)
  }

})

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      res.status(404).send()
    }
    res.send(user)
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    user.password = undefined
    res.send({ user, token })
  } catch(e){
    console.log(e)
    res.status(400).send(e)
  }
})

module.exports = router