const sqlite3   = require('sqlite3').verbose()
const Promise   = require('promise')
const logger    = require('../logger')
const R         = require('ramda')

const db = new sqlite3.Database('./db.sqlite3')
db.on('trace', function(sql){
  logger.logDebug(sql)
})

function Model(tableName) {
  var table = tableName

  this.find = function(id) {
    return new Promise(function(fulfill, reject){
      db.get('SELECT * FROM ' + table + ' WHERE id = ' + id, function(err, row) {
        if (err) {
          logger.logError(err)
          reject(err)
        } else {
          fulfill(row)
        }
      })
    })
  }

  this.fetchAll = function(where) {
    var sql = 'SELECT * FROM ' + table;
    var values = [];
    var conditions = [];
    for (var i in where) {
      var value = where[i]
      if (Array.isArray(value)) {
        var expression = i + ' IN(' + R.repeat('?', value.length).join(', ') + ')'
        conditions.push(expression)
        values = R.concat(values, value)
      } else {
        conditions.push(i + ' = ?')
        values.push(value)
      }
    }
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ')
    }

    return new Promise(function(fulfill, reject) {
      db.all(sql, values, function(err, rows) {
        if (err) {
          logger.logError(err)
          reject(err)
        } else {
          fulfill(rows)
        }
      })
    })
  }

  this.insert = function(entry) {
    var sql = 'INSERT INTO ' + table

    var cols = []
    var values = []
    for (var col in entry) {
      cols.push(col)
      values.push(entry[col])
    }
    sql += '(' + cols.join(', ') + ')  VALUES(' + R.repeat('?', values.length).join(', ') + ')'

    return new Promise(function(fulfill, reject) {
      db.run(sql, values, function(err) {
        if (err) {
          logger.logError(err)
          reject(err)
        } else {
          logger.logInfo('Created ' + table + ' with identifier = ' + this.lastID)
          fulfill(this.lastID)
        }
      })
    })
  }

  this.update = function(id, data) {
    var sql = 'UPDATE ' + table

    var cols = []
    var values = []
    for (var col in data) {
      cols.push(col + ' = ?')
      values.push(data[col])
    }

    sql += ' SET ' + cols.join(', ') + ' WHERE id = ?'

    values.push(id)
    console.log(sql);
    console.log(values);

    return new Promise(function(fulfill, reject) {
      db.run(sql, values, function(err) {
        if (err) {
          logger.logError(err)
          reject(err)
        } else {
          fulfill(this.change)
        }
      })
    })
  }

  this.delete = function(id) {
    var sql = 'DELETE FROM ' + table + ' WHERE id = ?'
    return new Promise(function(fulfill, reject) {
      db.run(sql, id, function(err) {
        if (err) {
          logger.logError(err)
          reject(err)
        } else {
          fulfill(this.change)
        }
      })
    })
  }
}

module.exports = Model
