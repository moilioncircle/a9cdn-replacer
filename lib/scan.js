/**
 * list files that match file-conf-entry
 */

const fs = require('fs')
const path = require('path')


/**
 * entry = {
        webRoot: realpath(absolute path),
        uriPath: relative path to the `webRoot`,
        recurse: true|false,
        include: regexp array,
        exclude: regexp array
    }
   return {
       root: realpath
       file:[realpath]
    }
 * @param {entry} entry on item of `entry.js/parse()` returned array
 */
function list(entry) {
    const list = []
    const root = entry.webRoot
    const posi = root.length
    const dir = path.resolve(root, entry.uriPath)
    walk(list, posi, dir, entry.include, entry.exclude, entry.recurse)
    return {
        root: root,
        file: list
    }
}

function walk(outs, posi, dir, ins, exs, rec) {
    const lst = fs.readdirSync(dir)
    for (const f of lst) {
        const p = path.resolve(dir, f)

        const uri = p.substring(posi)
        let ex = false
        for (const e of exs) {
            if (e.test(uri)) {
                ex = true
                break
            }
        }
        if (ex) continue

        if (fs.statSync(p).isDirectory()) {
            if (rec) {
                walk(outs, posi, p, ins, exs, rec)
            }
        } else {
            let inc = false
            for (const e of ins) {
                if (e.test(uri)) {
                    inc = true
                    break
                }
            }

            if (inc) {
                outs.push(p)
            }
        }
    }
}

module.exports = {
    list: list
}
