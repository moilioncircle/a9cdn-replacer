const conf = require('../conf.js')
const scan = require('../lib/scan.js')
const item = require('../lib/item.js')

const cnf = item.parse(conf.cnfBase, conf.cdnFile)
console.log('---')
console.log(cnf)

const cand = scan.list(cnf[0])
console.log('===')
console.log(cand)
