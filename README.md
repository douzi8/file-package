file-package - Simplified file package
============

Compress files, then package them together.
```js
var filePackage = require('file-package');

filePackage('src', 'path/dest.zip');

filePackage('src', 'path/dest.zip', {
  level: 9,            // compression level, 0-9
  filter: [
    '**/*',
    '!**/*.html'
  ],
  packageRoot: '',
  done: function(size) {

  }
});
```
### options
* mode {number}  
Set the file permissions.
* level {number} [level = 1]  
Compression level, 0 - 9.
* filter {string|array} [filter = null]  
[filter params description](https://github.com/douzi8/file-match#filter-description)
* packageRoot {string} [packageRoot = '']  
File root path with archive files.
* done {function}  [done = function(size) {}]  
Compress done callback.
