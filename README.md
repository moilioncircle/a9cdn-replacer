# a9cdn-replacer

a simple cli for asset(`cdnFile`) and any text(`txtFile`),
hash cdn file and replace them in any text file.

``` bash
# install global as system command
sudo npm -g install a9cdn-replacer

# show the help
a9cdn-replacer -h
```

## how it works

for `cdnFile`, scan (`recurse`?) the `webRoot` / `uriPath`,
collect files with `include` and `exclude`.

then, for each cdn file, `sha1` it and, when `outFile.cdnType` is

 - `dryrun` only log the file and sha1_sum.
 - `inline` renmae the file.
 - `any path` copy cdn file to this path. 

for `txtFile`, scan(`recurse`?)  the `webRoot` / `uriPath`,
collect files with `include` and `exclude`.

then, for each txt file, test the content to `cdnFile` uri ,
when `outFile.cdnType` is

 - `dryrun` only log the file and cdn-file uri.
 - `inline` replace the uri.
 - `any path` copy the replaced txt file to this path. 
