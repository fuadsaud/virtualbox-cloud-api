const exec        = require('child_process').exec
const shellescape = require('shell-escape')
const logger      = require('./logger')


function Commander() {
    var commands = [];

    var klass = this;

    this.addCommand = function(command, params) {
        var args = command.split(' ')
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

    this.execute = function() {
        var command = commands.shift()
        if (command) {
            logger.logInfo('Executing: ' + command)
            exec(command, function(err, stdout, stderr) {
                if (err != null) {
                    logger.logError(err)
                } else {
                    logger.logInfo('Done')
                    klass.execute()
                }
            })
        }
    }
}

module.exports = Commander
