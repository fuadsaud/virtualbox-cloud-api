const express    = require('express')
const bodyParser = require('body-parser')
const morgan     = require('morgan')
const R          = require('ramda')
const vmManager  = require('./vmmanager')
const logger     = require('./logger')

const app = express()
const port = process.env.PORT || 7000


logger.logInfo('Starting up HTTP server listening on port ' + port)

app.listen(port)
app.use(morgan('dev'))
app.use(bodyParser.json())

app.get('/boxes', function (req, res) {
    vmManager.create('another', {})
})

app.get('/boxes/:box_id', function (req, res) {
})

app.post('/boxes', function (req, res) {
  // const machine = vagrant.create({ cwd: boxes_dir, env: {} })
})
