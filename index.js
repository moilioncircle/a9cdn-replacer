const libScan = require('./lib/scan.js')

/**
 * hash the cdn-file only
 * @param {*} cnf a js-json format, see the `conf()` output.
 */
function hash(cnf) {
    const conf = parse(cnf)
    return cdnx(conf)
}

/**
 * hash the cdn-files and mend txt-files.
 * @param {*} cnf a js-json format, see the `conf()` output.
 */
function mend(cnf) {
    const conf = parse(cnf)
    return txtx(conf)
}

function conf() {
    const fs = require('fs')
    const t = fs.readFileSync(__dirname + '/conf.js', 'utf8')
    console.log('``` conf.js')
    console.log(t)
    console.log('```')
}

// 

function cdnx(conf) {
    const libCdnx = require('./lib/cdnx.js')
    const cdnx = []
    const ot = conf.outFile.cdnType
    for (const e of conf.cdnFile) {
        const i = libScan.list(e)
        const l = libCdnx.deal(i, ot)
        for (const c of l) {
            cdnx.push(c)
        }
    }
    return cdnx
}

function txtx(conf) {
    const cx = cdnx(conf)
    console.log('=== cdn-files:' + cx.length + ' ===')

    const cs = conf.cnfBase.charset
    const ot = conf.outFile.txtType
    const ch = conf.cnfBase.cdnHost
    
    const txtx = []
    const libTxtx = require('./lib/txtx.js')
    for (const e of conf.txtFile) {
        const i = libScan.list(e)
        const l = libTxtx.deal(i, cs, cx, ot, ch)
        for (const c of l) {
            txtx.push(c)
        }
    }

    return txtx
}

function parse(cnf) {

    //
    if (cnf.cnfBase == null) {
        console.error('need `cnfBase`')
        process.exit(1)
    }
    // cnfBase: {
    //     cdnHost: cnf.cnfBase.cdnHost,
    //     charset: "utf8",
    //     recurse: true,
    //     webRoot: "./",
    // }
    const cnfBase = {}
    let cdnHost = cnf.cnfBase.cdnHost
    if (cdnHost == null) {
        console.warn('need `cnfBase.cdnHost`, use \'\' as default')
        cdnHost = ''
    }
    cnfBase.cdnHost = cdnHost

    let charset = cnf.cnfBase.charset
    if (charset == null) {
        console.warn('need `cnfBase.charset`, use `utf8` as default')
        charset = 'utf8'
    }
    cnfBase.charset = charset

    let recurse = cnf.cnfBase.recurse
    if (recurse == null) {
        console.warn('need `cnfBase.recurse`, use `true` as default')
        recurse = 'utf8'
    }
    cnfBase.recurse = recurse

    let webRoot = cnf.cnfBase.webRoot
    if (webRoot == null) {
        console.warn('need `cnfBase.webRoot`, use `./` as default')
        recurse = './'
    }
    cnfBase.webRoot = webRoot


    //
    if (!Array.isArray(cnf.cdnFile) || cnf.cdnFile.length == 0) {
        console.error('need `cdnFile` not empty')
        process.exit(1)
    }
    if (!Array.isArray(cnf.txtFile) || cnf.txtFile.length == 0) {
        console.error('need `txtFile` not empty')
        process.exit(1)
    }

    const libItem = require('./lib/item.js')
    const cdnFile = libItem.parse(cnfBase, cnf.cdnFile)
    const txtFile = libItem.parse(cnfBase, cnf.txtFile)

    //
    const outFile = {}

    let cdnType = cnf.outFile.cdnType
    if (cdnType == null) {
        console.warn('need `outFile.cdnType`, use `dryrun` as default')
        cdnType = 'dryrun'
    }
    outFile.cdnType = cdnType

    let txtType = cnf.outFile.txtType
    if (txtType == null) {
        console.warn('need `outFile.txtType`, use `dryrun` as default')
        txtType = 'dryrun'
    }
    outFile.txtType = txtType


    const result = {
        cnfBase: cnfBase,
        cdnFile: cdnFile,
        txtFile: txtFile,
        outFile: outFile
    }
    return result
}

module.exports = {
    hash: hash,
    mend: mend,
    conf: conf
}