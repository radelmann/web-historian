var path = require('path');
var archive = require('../helpers/archive-helpers');
var url = require('url');
var httpHelper = require('./http-helpers.js');

// require more modules/folders here!

exports.handleRequest = function(req, res) {

  //handle get for root asset '/' 

  var urlObj = url.parse(req.url);

  if (req.method === 'GET') {
    if (urlObj.pathname === '/') {
      var fileName = archive.paths.siteAssets + '/index.html';
      httpHelper.serveAssets(res, fileName, function(res, contents) {
        res.writeHead(200, httpHelper.headers);
        res.end(contents);

      });
    } else {
      // parse fixture name from url
      var fixture = urlObj.pathname;
      archive.isUrlArchived(fixture, function(isFile) {
        if (isFile) {
          var fileName = archive.paths.archivedSites + fixture;
          httpHelper.serveAssets(res, fileName, function(res, contents) {
            res.writeHead(200, httpHelper.headers);
            res.end(contents);
          });
        } else {
          res.writeHead(404, httpHelper.headers);
          res.end();
        }
      });
    }
  }


  if (req.method === "POST") {
    if (urlObj.pathname === '/') {
      var postData = '';

      req.on('data', function(data) {
        postData += data;
      });

      req.on('end', function(err) {
        var url = postData.split('=')[1];

        archive.isUrlInList(url, function(result) {
          if (result) {
            var fileName = archive.paths.archivedSites + '/' + url;
            
            httpHelper.serveAssets(res, fileName, function(res, contents) {
              res.writeHead(302, httpHelper.headers);
              res.end(contents);
            });
          } else {
            archive.addUrlToList(url, function() {
              console.log('success!');
            });
            
            //display waiting page
            
            var fileName = archive.paths.siteAssets + '/loading.html';
            
            httpHelper.serveAssets(res, fileName, function(res, contents) {
              res.writeHead(200, httpHelper.headers);
              res.end(contents);
            });

            var array = [];
            array.push(url);
            archive.downloadUrls(array);
          }
        });
      });
    }
  }
}