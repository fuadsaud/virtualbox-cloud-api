const express    = require('express')
const bodyParser = require('body-parser')
const morgan     = require('morgan')
const R          = require('ramda')
const vmManager  = require('./vmmanager')
const logger     = require('./logger')

const app = express()
const port = process.env.PORT || 7000
const address = process.env.ADDRESS || '127.0.0.1'


logger.logInfo('Starting up HTTP server listening on port ' + port)

app.listen(port)
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

app.get('/boxes', function (req, res) {
  vmManager.retrieveList().then(function(result) {
    res.send(result)
  }, function() {
    res.status(500).send({error: 'Internal Error'})
  })
})

app.get('/boxes/:box_id', function (req, res) {
  vmManager.retrieve(req.params.box_id).then(function(result) {
    if (result) {
      res.send(result)
    } else {
      res.status(404).send({error: 'Unknow box with id ' + req.params.box_id})
    }
  }, function(msg) {
    res.status(500).send({error: 'Internal Error'})
  })
})

app.post('/boxes', function (req, res) {
  // const machine = vagrant.create({ cwd: boxes_dir, env: {} })
  vmManager.create(req.body.name, req.body.os_id).then(function(){
    res.status(200).send({message: 'The box will be create soon'})
  }, function(message) {
    res.status(400).send({error: message})
  })
})

app.delete('/boxes/:box_id', function(req, res) {
  vmManager.delete(req.params.box_id).then(function(result) {
    if (result) {
      res.send({message: 'This vm will be removed soon'})
    } else {
      res.status(404).send({error: 'The box with id ' + req.params.box_id + ' not exists or cannot be removed'})
    }
  }, function(msg) {
    res.send(500).send({error: 'Internal Error'})
  })
})

app.get('/boxes/:box_id/start', function(req, res) {
  vmManager.start(req.params.box_id).then(function(result) {
    if (result) {
      res.send({message: 'VmBox started at http://' + address + ':' + result.port})
    } else {
      res.status(404).send({error: 'Box not exists'});
    }
  });
})

app.get('/boxes/:box_id/stop', function(req, res) {
  vmManager.stop(req.params.box_id).then(function(result) {
    if (result) {
      res.send({message: 'VmBox was stoped'})
    } else {
      res.status(404).send({error: 'Box not exists'});
    }
  });
})
