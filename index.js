const express     = require('express')
const bodyParser  = require('body-parser')
const morgan      = require('morgan')
const R           = require('ramda')

const app = express()
const port = process.env.PORT || 7000

RT.logger.logInfo('Starting up HTTP server listening on port ' + port)

app.listen(port)


app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())

app.get('/boxes', function (req, res) {
})

app.get('/boxes/:box_id', function (req, res) {
})

app.post('/boxes', function (req, res) {
})
