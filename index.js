const express    = require('express')
const bodyParser = require('body-parser')
const morgan     = require('morgan')
const R          = require('ramda')
const vagrant    = require('./vagrant')

const app = express()
const port = process.env.PORT || 7000

const logger = {
  logError: function (msg) { this.log('[ERROR] ' + msg) },
  logInfo:  function (msg) { this.log('[INFO] ' + msg) },
  log: console.log
}

logger.logInfo('Starting up HTTP server listening on port ' + port)

app.listen(port)
app.use(morgan('dev'))
app.use(bodyParser.json())

app.get('/boxes', function (req, res) {
  vagrantfile = vagrant.vagrantfile({ box: 'precise64' })

  console.log(vagrantfile)
})

app.get('/boxes/:box_id', function (req, res) {
})

app.post('/boxes', function (req, res) {
  // const machine = vagrant.create({ cwd: boxes_dir, env: {} })
})
