/**
 * deal with the cdn files.
 */
const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
/**
 * inline/copyto/dryrun files and return 
 * [{
        trueUri:'/icon.png',
        hashUri:'/icon-074f90fffa5732845f7f98f422a4df4ebb700bf8.png', // 40 char sha1
        sha1Sum:'074f90fffa5732845f7f98f422a4df4ebb700bf8'
    },
    ]
 * @param {*} scanItem the list of `scan.js/list()`
 * @param {*} editType dryrun|inline|$path
 */
function deal(scanItem, editType) {
    const result = []
    const pos = scanItem.root.length

    for (const f of scanItem.file) {
        const b = fs.readFileSync(f)
        const sha1 = crypto.createHash('sha1');
        sha1.update(b)
        const sum = sha1.digest('hex')

        const ren = catsum(f, sum)
        const uri = f.substring(pos)
        const hsh = ren.substring(pos)

        if (editType === 'inline') {
            console.log('cdn-inline:' + f + ':' + ren)
            fs.renameSync(f, ren)
        } else if (editType === 'dryrun') {
            console.log('cdn-dryrun:' + f + ':' + sum)
        } else {
            const t = editType + hsh
            console.log('cdn-copyto:' + f + ':' + t)
            mkdirp(path.dirname(t))
            fs.copyFileSync(f, t);
        }

        result.push({
            trueUri: uri.replace(/\\+/, '/'),
            hashUri: hsh.replace(/\\+/, '/'),
            sha1Sum: sum
        })
    }
    return result
}

function mkdirp(p) {
    if (!fs.existsSync(p)) {
        mkdirp(path.dirname(p))
        fs.mkdirSync(p)
    }
}

function catsum(str, sum) {
    const d = str.lastIndexOf('.')
    let fn = str
    let en = ''
    if (d > 0) {
        fn = str.substring(0, d)
        en = str.substring(d)
    }

    fn = fn.replace(/(-[a-z0-9]{32,})+$/ig, '')
    return fn + '-' + sum + en
}

module.exports = {
    deal: deal
}