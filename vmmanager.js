const Model       = require('./models/model')
const Promise     = require('promise')
const VBoxManager = require('./vboxmanager')

module.exports = {
  create: function(boxName, osId) {
    return new Promise(function(fulfill, reject) {
      if (boxName == undefined) {
        reject('box name must be informed')
        return;
      }
      if (osId == undefined) {
        reject('OS ID must be informed')
        return;
      }

      var osModel = new Model('oss');
      var vmModel = new Model('vms');

      vmModel.fetchAll({name: boxName}).then(function(result) {
        if (result.length == 0) {
          osModel.find(osId).then(function(os) {
            if (os != undefined) {
              vmModel.insert({name: boxName, os_id: osId, provisioned: 0}).then(function(result) {
                VBoxManager.create({name: boxName, os: os}).then(function() {
                  vmModel.update(result, {provisioned: 1})
                })
                fulfill(true)
              }, function(message) { reject(message) })
            } else {
              reject('Invalid OS')
            }
          }, function(message) { reject(message) })
        } else {
          reject('Box name already exists')
        }
      }, function(message) { reject(message) })
    })
  },

  retrieve: function(id) {
    return (new Model('vms')).find(id)
  },

  retrieveList: function() {
    return (new Model('vms')).fetchAll()
  },

  update: function(id, data) {
  },

  delete: function(id) {
    return new Promise(function(fulfill, reject) {
      var vms = new Model('vms')
      vms.find(id).then(function(vm) {
        result = false
        if (vm && vm.provisioned == 1) {
          if (vm.status == 1) {
            vms.update(id, {status: 0}).then(function() {
              VBoxManager.delete(vm.name).then(function() {
                vms.delete(id)
              })
            }, function(msg) {
              reject(msg)
            })
          }
          result = true
        }
        fulfill(result)
      })
    })
  }
}
