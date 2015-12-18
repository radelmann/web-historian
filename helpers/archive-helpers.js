var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var promise = require('bluebird');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

// exports.readListOfUrls = function(cb) {
//   fs.readFile(exports.paths.list, 'utf8', function(err, data) {
//     if (err) {
//       console.log(err + 'error from readlist');
//       return;
//     }

//     cb(data.split('\n'));
//   });


// };

exports.readListOfUrls = function() {
  return new Promise(function(resolve, reject) {
    fs.readFile(exports.paths.list, 'utf8', function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data.split('\n'));
      }
    });
  });
};

// exports.isUrlInList = function(url, cb) {
//   exports.readListOfUrls(function(array) {
//     if (array.indexOf(url) > -1) {
//       cb(true);
//     } else {
//       cb(false);
//     }
//   });
// };

exports.isUrlInList = function(url) {
  return new Promise(function(resolve, reject) {
    exports.readListOfUrls().then(function(array) {
      if (array.indexOf(url) > -1) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

// exports.addUrlToList = function(url, cb) {
//   fs.appendFile(exports.paths.list, url + '\n', 'utf8', function(err) {
//     if (err) {
//       console.log(err);
//     }
//     return cb();
//   });
// };

exports.addUrlToList = function(url) {
  return new Promise(function(resolve, reject) {
    fs.appendFile(exports.paths.list, url + '\n', 'utf8', function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// exports.isUrlArchived = function(url, callback) {
//   fs.stat(exports.paths.archivedSites + url, function(err, stats) {
//     if (err) {
//       return callback(false);
//     }

//     return callback(true);
//   });
// };

exports.isUrlArchived = function(url) {
  return new Promise(function(resolve, reject) {
    fs.stat(exports.paths.archivedSites + url, function(err, stats) {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

exports.downloadUrls = function(array) {
  //get array of urls
  var download = function(url) {
    var options = {
      host: url,
      port: 80,
      path: ''
    };

    var req = http.get(options, function(response) {
      // handle the response
      var res_data = '';
      response.on('data', function(chunk) {
        res_data += chunk;
      });

      response.on('end', function() {
        fs.writeFile(exports.paths.archivedSites + '/' + url, res_data, function(err) {
          if (err) {
            console.log(err);
          }
        });
      });


      req.on('error', function(err) {
        console.log("Request error: " + err.message);
      });
    });
  };
  
  array.forEach(function(url) {
    //exports.isUrlArchived(url, function(result) {
    //if (result) {
    download(url);
    //}
    //}); //cb
  });
};