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
      //parse fixture name from url
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

  //res.end(archive.paths.list);


  /*

  get 
    serve static


  post

    not in urllist
      start piping
      send loading page

    in list but still piping
      fs.stats().isfile
        send loading page
    in list and piped
      send assets



  */
};