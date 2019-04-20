const glob = require('glob')
const fs = require('fs')
const exec = require('child_process').exec;

glob('*.tgz', function (err, files) {
  if (err) {
    throw err
  }

  files.forEach(fs.unlinkSync)

  exec('npm pack', function (err) {
    if (err) {
      throw err
    }

    glob('*.tgz', function (err, files) {
      if (err) {
        throw err
      }

      fs.renameSync(files[0], 'lib.tgz')
    })
  })
})
