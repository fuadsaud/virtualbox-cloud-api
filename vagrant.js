const exec       = require('child_process').exec
const vagrant    = require('node-vagrant')
const handlebars = require('handlebars')
const fs         = require('fs')

const boxes_dir = process.env.BOXES_DIR || './boxes'

var template

fs.readFile('./templates/Vagrantfile', function(err, data) {
  template = handlebars.compile(data.toString())
})

module.exports = {
  vagrantfile: function(opts) {
    return template(opts)
  },
  create: function(vagrantfile) {
    // create dir:
    //
    // write vagrantfile
    //
    // vagrant.create (dir)
  }
}
