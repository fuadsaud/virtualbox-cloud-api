const exec        = require('child_process').exec
const shellescape = require('shell-escape')
const logger      = require('./logger')
const Promise     = require('promise')

function Commander() {
    var commands = []

    var klass = this

    var PRIVATE = {}

    this.addCommand = function(command, params) {
        var args = command
        for (var i in params) {
            var arg = '-' + i
            if (i.length > 1) {
                arg = '-' + arg
            }
            args.push(arg)
            if (params[i] != null) {
                args.push(params[i])
            }
        }
        commands.push(shellescape(args))
    }

    PRIVATE.execute = function(fulfill, reject) {
        var command = commands.shift()

        if (command) {
            logger.logInfo('Executing: ' + command)
            exec(command, function(err, stdout, stderr) {
                if (err != null) {
                    logger.logError(err)
                    reject(err)
                } else {
                    logger.logInfo('Done')
                    PRIVATE.execute(fulfill, reject)
                }
            })
        } else {
          fulfill(true)
        }
    }

    this.execute = function() {
      return new Promise(function(fulfill, reject) {
        PRIVATE.execute(fulfill, reject)
      })
    }
}

module.exports = Commander
