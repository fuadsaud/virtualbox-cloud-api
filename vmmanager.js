const manager   = 'VBoxManage'
const hds_dir   = process.env.HDS_DIR || './hds'
const R         = require('ramda')
const Commander = require('./commander')
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./db.sqlite3')

module.exports = {
    create: function(box_name, os) {

        var cmd = new Commander()

        cmd.addCommand(
            manager + ' createvm',
            { name: box_name, ostype: 'Other', register: null }
        )
        cmd.addCommand(
            manager + ' storagectl ' + box_name,
            { name: 'Sata Controller', add: 'sata', controller: 'IntelAHCI' }
        )


        //TODO remove this shit, from here
        var base_hd_name = hds_dir + '/test.vdi'
        var hd_name = hds_dir + '/' + box_name +'.vdi'
        // until here

        var command = manager + ' clonehd ' + base_hd_name + ' ' + hd_name
        cmd.addCommand(command, { format: 'VDI' })
        cmd.addCommand(
            manager + ' storageattach ' + box_name,
            {
                storagectl: 'Sata Controller', port: 0, device: 0,
                type: 'hdd', medium: hd_name
            }
        )


        cmd.addCommand(
            manager + ' modifyvm ' + box_name,
            {
                nic1: 'bridged',
                bridgeadapter1: 'e1000g0'
            }
        )

        cmd.execute()
    },

    retrieve: function() {
    },

    update: function() {
    },

    delete: function() {
    }
}
