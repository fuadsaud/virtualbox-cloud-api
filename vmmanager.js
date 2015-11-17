const Model       = require('./models/model')
const Promise     = require('promise')
const VBoxManager = require('./vboxmanager')

module.exports = {
  create: function(boxName, osId, memory) {
    if (!memory) {
      memory = '512'
    }
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
              vmModel.fetchAll([], 'MAX(port) as port').then(function(result) {
                console.log(result);

                var port = parseInt(result[0].port ? result[0].port + 1 : 10000 );
                vmModel.insert({name: boxName, os_id: osId, provisioned: 0, port: port}).then(function(result) {
                  VBoxManager.create({name: boxName, port: port, os: os, memory: memory}).then(function() {
                    vmModel.update(result, {provisioned: 1})
                    fulfill(result)
                  })
                }, function(message) { reject(message) })
              });
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
  },

  start: function(id) {
    return new Promise(function(fulfill, reject) {
      var vms = new Model('vms')
      vms.find(id).then(function(vm) {
        console.log(vm);
        if (vm && vm.provisioned == 1 && vm.status == 1) {
          VBoxManager.start(vm.name).then(function(result) {
            fulfill(vm)
          });
        } else {
          fulfill(false)
        }
      })
    })
  },
  stop: function(id) {
    return new Promise(function(fulfill, reject) {
      var vms = new Model('vms')
      vms.find(id).then(function(vm) {
        if (vm && vm.provisioned == 1 && vm.status == 1) {
          VBoxManager.stop(vm.name).then(function(result) {
            fulfill(true)
          }, function() {
            fulfill(true)
          });
        } else {
          fulfill(false)
        }
      })
    })
  }
}
