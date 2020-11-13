const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
 
require('./app/controllers/index')(app)

app.listen(4001,  () => {
    console.log(`servidor listado na porta, http://localhost:4001`)
})