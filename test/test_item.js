const item = require('../lib/item.js')

const arr = item.parse(
    { // 默认配置
        cdnHost: "http://cdn.moilioncircle.com", // the CDN url
        charset: "utf8", // text file encoding
        webRoot: "./test", // the local path used as start point
        recurse: true, // recursive to children
    }
    ,
    {
        //"webRoot": "/src/main/webapp2", // override $webRoot for this entry
        uriPath: "/", // the relpath to $webRoot
        recurse: false, // recursive to children
        include: [ // include files (not directory)
            // ant-wildcard style. case insensitive, `*` means `[^/]*` `**` means `.*`
            "test*.js",
            "*.css",
            // regexp style.
            /\.(png|jpg)$/i
        ]
    }
)
console.log(arr)
