const scan = require('../lib/scan.js')
const item = require('../lib/item.js')
const cdnx = require('../lib/cdnx.js')
const txtx = require('../lib/txtx.js')

const base = { // 默认配置
    cdnHost: "http://cdn.moilioncircle.com",
    charset: "utf8",
    webRoot: "/home/trydofor/Workspace/jiayu/source/pingxing-src/pingxing/pingxing-front/src/main/webapp",
    recurse: true,
}

const it = item.parse(base,
    {
        uriPath: "/",
        include: [
            "/root/**.js",
            "/root/**.css",
            /\.(png|jpg)$/i
        ],
        exclude: [
            /.*bower_components.*/i
        ],
    })
console.log('===')
console.log(it)

const sc = scan.list(it[0])
console.log('===')
// console.log(sc)

const cd = cdnx.deal(sc, 'dryrun')
console.log('===')
//console.log(cd)


const rp = item.parse(base,
    {
        include: [
            "index.html"
        ]
    })
console.log('===')
console.log(rp)

const sr = scan.list(rp[0])
console.log('===')
console.log(sr)


const tx = txtx.deal(sr, 'utf8', cd, 'inline', 'http://cdn.moilioncircle.com')
console.log('===')
console.log(tx)

