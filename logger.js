module.exports =  {
  logError: function (msg) { this.log('[ERROR] ' + msg) },
  logInfo:  function (msg) { this.log('[INFO] ' + msg) },
  logDebug: function (msg) { this.log('[DEBUG] ' + msg) },
  log: console.log
}
