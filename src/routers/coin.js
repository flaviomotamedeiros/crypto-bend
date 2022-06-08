const express = require('express')
const Coin = require('../models/coin')
const auth = require('../middleware/auth')

const router = new express.Router

router.post('/coins', auth, async (req, res) => {
  const coin = new Coin({
    ...req.body,
    owner: req.user._id
  })

  try {
    await coin.save()
    res.status(201).send({ coin })
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/coins', auth, async (req, res) => {
  try {
    await req.user.populate('coins')
    res.send(req.user.coins)
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

router.get('/coins/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const coin = await Coin.findOne({ _id, owner: req.user._id })

    if (!coin) {
      res.status(404).send()
    }

    res.send(coin)
  } catch (e) {
    res.status(500).send()
  }
})

router.patch('/coins/:id', auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'initials']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
      res.status(404).send('Invalid attributes for update!')
    }

    const coin = await Coin.findOne({ _id: req.params.id, owner: req.user._id })

    if (!coin) {
      res.status(404).send()
    }

    updates.forEach((update) => coin[update] = req.body[update])
    await coin.save()

    res.send(coin)
  } catch (e) {
    res.status(400).send(e)
  }

})

router.delete('/coins/:id', auth, async (req, res) => {
  try {
    const coin = await Coin.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    if (!coin) {
      res.status(404).send()
    }
    res.send(coin)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router