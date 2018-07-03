#!/usr/bin/env node
const prg = require('commander')

prg
  .version('1.0.0')
  .usage('<cmd> <cnf>')
  .description('<cnf> is a js-json config file path (see conf output)')

prg.command('hash <cnf>')
  .description('hash cdn-files only.')
  .action(cnf => exec('hash', cnf))

prg.command('mend <cnf>')
  .description('hash cdn-files and mend txt-files.')
  .action(cnf => exec('mend', cnf))

prg.command('*')
  .description('print sample conf.js')
  .action(() => exec('conf'))

prg.parse(process.argv)

if (process.argv.length < 3) {
  exec('help')
}

function exec(cmd, cnf) {
  if (cmd === 'hash' || cmd === 'mend' || cmd === 'conf') {
    const a9 = require('../index.js')
    if (cmd === 'conf') {
      a9.conf()
      return
    }

    const path = require('path')
    const obj = require(path.resolve(process.cwd(), cnf))
    switch (cmd) {
      case 'hash':
        a9.hash(obj)
        break
      case 'mend':
        a9.mend(obj)
        break
    }
  } else {
    console.log('use -h')
  }
}
