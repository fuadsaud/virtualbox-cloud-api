const exec    = require('child_process').exec
const manager = 'VBoxManage'
const hds_dir = process.env.HDS_DIR || './hds'
const R       = require('ramda')
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./db.sqlite3')

module.exports = {
    create: function(box_name, os, opts) {
        default_opts = {
        }

        opts = R.merge(default_opts, opts);


        exec(manager + ' createvm  --name ' + box_name + ' --ostype Other --register', function(err, stdout, stderr) {
            if (err != null) {
                throw new Error(err)
            }
            exec(manager + ' storagectl ' + box_name + ' --name "SATA Controller" --add sata --controller IntelAHCI ', function(err, stdout, stderr) {
                if (err != null) {
                    throw new Error(err)
                }
                //TODO remove this shit
                var base_hd_name = hds_dir + '/test.vdi'
                var hd_name = hds_dir + '/new_hd.vdi'
                var command = manager + ' clonehd ' + base_hd_name + ' ' + hd_name + ' --format VDI'
                console.log(command)
                exec(command, function(err, stdout, stderr) {
                    if (err != null) {
                        throw new Error(err)
                    }
                    var command = manager + ' storageattach ' + box_name + ' --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium ' + hd_name
                    exec(command, function(err, stdout, stderr) {
                        if (err != null) {
                            throw new Error(err)
                        }
                    })
                })
            })
        })


        console.log('AKI')
    },

    retrieve: function() {
    },

    update: function() {
    },

    delete: function() {
    }
}
