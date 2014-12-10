var file = require('file-system');
var util = require('utils-extend');
var path = require('path');
var packer = require('zip-stream');
/**
 * @description
 * Package file
 * @example
 * filePackage('src', 'dest.zip');
 * filePackage('src', 'path/dest.zip', { level: 9 })
 */
function filePackage(src, dest, options) {
  options = util.extend({
    level: 1,
    filter: null,
    packageRoot: '',
    done: util.noop
  }, options || {});

  var dirname = path.dirname(dest);
  var files = [];
  var archiveOptions = {
    zlib: {
      level: options.level
    }
  };
  if (options.mode) {
    archiveOptions[mode] = options.mode;
  }
  var archive = new packer(archiveOptions);
  if (dirname !== '.') {
    // Make sure folder exist.
    file.mkdirSync(dirname);
  }
  var output = file.createWriteStream(dest);

  function done() {
    archive.finish();
    options.done(archive.getBytesWritten());
  }
  // Recurse src folder
  file.recurseSync(src, options.filter, function(filepath, filename) {
    if (!filename) return;

    files.push({
      filepath: filepath,
      stream: file.createReadStream(filepath)
    });
  });

  archive.pipe(output);

  function entry(item) {
    var relative = path.relative(src, item.filepath);
    var dest = path.join(options.packageRoot, relative);

    archive.entry(item.stream, { name: dest }, function() {
      entry.count++;
      if (entry.count === files.length) {
        return done();
      }
      entry(files[entry.count]);
    });
  }
  entry.count = 0;

  if (files.length) {
    entry(files[0]);
  } else {
    done();
  }
}

module.exports = filePackage;