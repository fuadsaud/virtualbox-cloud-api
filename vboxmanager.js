const Commander = require('./commander')

const manager    = 'VBoxManage'
const hds_dir    = process.env.HDS_DIR || './hds'
const os_dir     = process.env.OS_DIR || './hds/oss'
const net_device = process.env.NET_DEVICE || 'eth1'



module.exports = {
  create: function(vm) {
    var cmd = new Commander()

   cmd.addCommand([manager, 'createvm'], {
      name: vm.name,
      ostype: vm.os.vboxid,
      register: null
    })

    cmd.addCommand([manager, 'storagectl', vm.name], {
      name: 'Sata Controller',
      add: 'sata',
      controller: 'IntelAHCI'
    })

    var base_hd_name = os_dir + '/' + vm.os.path
    var hd_name = hds_dir + '/' + vm.name +'.vdi'


    cmd.addCommand([manager, 'clonehd', base_hd_name, hd_name ], { format: 'VDI' })

    cmd.addCommand([manager, 'storageattach', vm.name], {
      storagectl: 'Sata Controller', port: 0, device: 0,
      type: 'hdd', medium: hd_name
    })
    cmd.addCommand([manager, 'modifyvm', vm.name], {
      nic1: 'bridged',
      bridgeadapter1: net_device
    })
    return cmd.execute()
  },

  delete: function (name) {
    var cmd = new Commander()
    cmd.addCommand([manager, 'unregistervm', name], {delete: null})
    return cmd.execute()
  }
}
