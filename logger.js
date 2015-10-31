module.exports =  {
  logError: function (msg) { this.log('[ERROR] ' + msg) },
  logInfo:  function (msg) { this.log('[INFO] ' + msg) },
  log: console.log
}
