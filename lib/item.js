/**
 * parse file-conf-entry from conf.js.
 * - real path webroot
 * - regexp include/exclude
 * - others default value
 */

const fs = require('fs')

/**
 * [{
        webRoot: realpath(absolute path),
        uriPath: relative path to the `webRoot`,
        recurse: true|false,
        include: regexp array,
        exclude: regexp array
    }]
 * @param {*} base the `cnfBase` in `conf.js`
 * @param {*} conf `cdnFile` or `txtFile` in `conf.js`
 */
function parse(base, conf) {
    const root = fs.realpathSync(base.webRoot)
    const recu = base.recurse

    if (!Array.isArray(conf)) conf = [conf] // to array

    const result = [];
    for (const e of conf) {
        const wr = realPath(e.webRoot, root)
        result.push({
            webRoot: wr,
            uriPath: dealUri(e.uriPath),
            recurse: e.recurse == null ? recu : e.recurse,
            include: regexpAll(e.include),
            exclude: regexpAll(e.exclude)
        })
    }
    return result
}

function dealUri(str) {
    if (str == null) return ''
    let p = 0
    while (true) {
        const c = str.charAt(p)
        if (c === '/' || c === '\\') {
            p++
        } else {
            break
        }
    }
    return p > 0 ? str.substring(p) : str
}

function realPath(path, deft) {
    return path == null ? deft : fs.realpathSync(path)
}

function regexpAll(arr) {
    let result = [];
    for (let i = 0; arr != null && i < arr.length; i++) {
        let o = arr[i]
        result.push(typeof (o) === 'string' ? wildcard(o) : o)
    }

    return result
}

function wildcard(s) {
    let r = ''
    esc = '*.?+$^[](){}|\\'
    for (let i = 0; i < s.length; i++) {
        let c = s.charAt(i)
        if (c === '*') {
            let n = i + 1
            if (n < s.length && s.charAt(n) === '*') {
                r += '.*'
                i = n
            } else {
                r += '[^/]*'
            }
        } else if (esc.indexOf(c) > 0) {
            r += '\\' + c
        } else {
            r += c
        }
    }

    return new RegExp('^/?' + r + '$', 'i')
}

module.exports = {
    parse: parse
}
