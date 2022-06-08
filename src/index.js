const express = require('express')
var bodyParser = require('body-parser')
require('./db/mongoose')
const userRouter = require('./routers/user')
const coinRouter = require('./routers/coin')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(userRouter)
app.use(coinRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
