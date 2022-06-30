const express = require('express')
const http = require('http')
const app = express()
const port = process.env.PORT || 3000

const result = {
    code: 200,
    message: 'Hello World!'
}

const server = http.createServer((req, res) => {
    res.statuscode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(result))
})

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})