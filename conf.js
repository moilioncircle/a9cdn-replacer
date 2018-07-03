// must use module.exports, 
// so can `cost conf = require('conf.js')`
module.exports = {

    cnfBase: { // global config with default value
        cdnHost: "http://cdn.moilioncircle.com", // the CDN url
        charset: "utf8", // text file encoding
        recurse: true, // recursive to children
        webRoot: "./", // the local path used as start point
    },

    cdnFile: [ // the assets will upload to CDN
        { // file-conf-entry
            //recurse: false, // recursive to children // override `$cnfBase.recurse`
            webRoot: "./test", // override `$cnfBase.webRoot` for this entry.
            uriPath: "../", // the relpath to $webRoot. `''`,`null`,`'.'`,`'./'`,`'/'` are same.
            include: [ // include files (not directory)
                // ant-wildcard style. case insensitive, `*` means `[^/]*` `**` means `.*`
                "**.js",
                "**.css",
                // regexp style.
                /\.(png|jpg)$/i,
            ],
            exclude: [ // exclude files (not directory)
                "**/node_modules/**",
                "**/bower_components/**",
            ],
        }
    ],

    txtFile: [ // the text-file in which the asset uri will be replaced
        { // as same as `cdnFile`'s entry
            include: [
                "**.html",
                "**.js",
                "**.css",
            ],
            exclude: [ // exclude files (not directory)
                "**/node_modules/**",
                "**/bower_components/**",
            ],
        }
    ],

    // `dryrun` - just log the message
    // `inline` - rename the cdn-file or modify the txt-file
    //  $filepath - copy the deploy-file to $filepath
    outFile: { // how to deal with the output files
        cdnType: "dryrun", // `dryrun|inline|/tmp/a9cdn/cdn`
        txtType: "inline", // `dryrun|inline|/tmp/a9cdn/txt`
    }
}