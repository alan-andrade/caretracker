var async = require('async');
// "https://hint-healthstore.appspot.com/ccda/list/jeremydw@direct.gohint.com"

var HealthStore = function(options){
  this.options = options || {};
  this.baseUrl = this.options.url || 'https://hint-healthstore.appspot.com/ccda/';
  // Not sure if the BB+ parser should live here...
  // TODO - Fix this require, it should work with the updated library version
  this.directAddress = this.options.directAddress;
  var protocol = this.baseUrl.match(/^https/) ? require('https') : require('http');

  var getURL = function(url, done){
    console.log("getting "+url);
    protocol.get(url, function(res) {
      var body = '';
      res.on('data', function(chunk) {
          body += chunk;
      });

      res.on('end', function() {
        console.log("Got response!");
        done(null, body);
      });
    }).on('error', function(e) {
        console.log("Got error: ", e);
        done(e);
    });
  };

  var getJSON = function(url, done){
    getURL(url, function(error, response){
      if(error) return done(error);
      var parsedResponse = JSON.parse(response);
      done(null, parsedResponse);
    });
  };
  this.list = function(done, directAddress){
    var url = this.baseUrl + 'list/' + (directAddress || this.directAddress);
    getJSON(url, done);
  };
  this.contentFor = function(ccdaKey, done){
    var url = this.baseUrl + 'content/' + ccdaKey;
    getURL(url, done);
  };
  this.retrieveAll = function(eachCallback, done){
    var self = this;
    self.list(function(error, allResults){
      if(error) return done(Error("Error listing ccda's"));
      async.each(allResults, function(ccda, resultDone){
        self.contentFor(ccda.key, function(error, xml){
          eachCallback(error, ccda, xml, resultDone);
        });
      }, function(error){
        done(error, allResults);
      });
    });
  };
};

module.exports = HealthStore;
