const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router

router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    const token = await user.generateAuthToken()
    
    res.status(201).send({user, token})
  } catch(e) {
    res.status(400).send(e)
  }
})

router.get('/users/me', auth, (req, res) => {
  res.send(req.user)
})

router.get('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((currentToken) => {
      return currentToken.token !== req.token
    })
    await req.user.save()

    res.send()
  } catch(e) {
    res.status(500).send()
  }
})

router.get('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch(e) {
    res.status(500).send()
  }
})

router.patch('/users', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
      res.status(404).send('Invalid attributes for update!')
    }

    const user = await User.findOne( {_id: req.params.id })

    if (!user) {
      res.status(404).send()
    }

    updates.forEach((update) => user[update] = req.body[update])
    await user.save()

    res.send(user)
  } catch (e) {
    res.status(400).send(e)
  }

})

router.delete('/users', auth, async (req, res) => {
  try {
    const user = await User.findOneAndDelete(req.params.id)
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
    res.send({ user, token })
  } catch(e){
    console.log(e)
    res.status(400).send(e)
  }
})

module.exports = router