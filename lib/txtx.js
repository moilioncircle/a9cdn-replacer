/**
 * deal the txt files.
 */
const fs = require('fs')
const path = require('path')
/**
 * inline/copyto/dryrun files and return 
 * [{
        trueUri: '/index.html',
        dealCdn: ['/icon.png']
    },
    ]
 * @param {*} scanItem the list of `scan.js/list()`
 * @param {*} encoding the text file encoding
 * @param {*} cdnxList the list of `cdnx.js/deal()`
 * @param {*} editType dryrun|inline|copyto
 * @param {*} cdnHost the host prefix, http://cdn.a.com
 */
function deal(scanItem, encoding, cdnxList, editType, cdnHost) {
    const result = []
    const pos = scanItem.root.length
    const rrg = regexit(cdnxList)

    for (const f of scanItem.file) {
        let txt = fs.readFileSync(f, encoding)
        // replace all
        const mrk = []
        for (const r of rrg) {
            if (r.exp.test(txt)) {
                mrk.push(r.uri)
                txt = txt.replace(r.exp, (m, o, s) => {
                    return s.charAt(o) + cdnHost + r.str
                })
            }
        }

        if (mrk.length == 0) continue

        const uri = f.substring(pos)
        const nf = f + '.a9cdn.tmp'

        if (editType !== 'dryrun') {
            fs.writeFileSync(nf, txt, encoding)
        }

        if (editType === 'inline') {
            console.log('txt-inline:' + f + ':' + mrk)
            fs.unlinkSync(f)
            fs.renameSync(nf, f)
        } else if (editType === 'dryrun') {
            console.log('txt-dryrun:' + nf + ':' + mrk)
        } else {
            const t = editType + uri
            console.log('txt-copyto:' + t + ':' + mrk)
            mkdirp(path.dirname(t))
            fs.renameSync(nf, t);
        }

        result.push({
            trueUri: uri,
            dealCdn: mrk
        })
    }
    return result
}

function regexit(lst) {
    const result = []
    const esc = '*.?+$^[](){}|\\'
    const bnd = '[=\'"\(\) #?&@:]' // unsupport lookbehind
    // {
    //     trueUri:'/icon.png',
    //     hashUri:'/icon-074f90fffa5732845f7f98f422a4df4ebb700bf8.png', // 40 char sha1
    //     sha1Sum:'074f90fffa5732845f7f98f422a4df4ebb700bf8'
    // }
    for (const e of lst) {
        const n = e.hashUri
        let r = ''
        for (let i = 0; i < n.length; i++) {
            const c = n.charAt(i)
            if (esc.indexOf(c) >= 0) {
                r += '\\'
            }
            r += c
        }
        r = r.replace('-' + e.sha1Sum, '(?:-[0-9a-z]{40})?')
        r = bnd + r + '(?=' + bnd + ')'
        result.push({
            uri: e.trueUri,
            exp: new RegExp(r, 'ig'),
            str: e.hashUri
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


module.exports = {
    deal: deal
}
