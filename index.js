const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const authenticationRouter = require('./src/routes/authentication.routes')
const mealRouter = require('./src/routes/meal.routes')
const userRouter = require('./src/routes/user.routes')

let database = []
let id = 0

app.all('*', (req, res, next) => {
    const method = req.method
    console.log(`Methode ${method} aangeroepen.`)
    next()
})

app.use(authenticationRouter)
app.use(mealRouter)
app.use(userRouter)

app.all('*', (req, res) => {
    res.status(400).json({
        status: 404,
        result: 'End-point not found.'
    })
})

//Error Handler
app.use((err,req,res,next)=>{
    res.status(err.status).json(err)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})