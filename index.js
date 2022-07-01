const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const userRouter = require('./src/routes/user.routes')

let database = []
let id = 0

app.all('*', (req, res, next) => {
    const method = req.method
    console.log(`Methode ${method} aangeroepen.`)
    next()
})

app.all('*', (req, res) => {
    res.status(400).json({
        status: 404,
        result: 'End-point not found.'
    })
})

app.use(userRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})