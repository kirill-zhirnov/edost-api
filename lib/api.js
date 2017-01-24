(function() {
  var Api, Q, _, http, parseString, queryString, statusCodes, url;

  Q = require('q');

  http = require('http');

  url = require('url');

  queryString = require('querystring');

  parseString = require('xml2js').parseString;

  statusCodes = require('./statusCodes');

  _ = require('underscore');

  Api = (function() {
    Api.API_URL = 'http://www.edost.ru/edost_calc_kln.php';

    function Api(shopId, pass) {
      this.shopId = shopId;
      this.pass = pass;
    }

    Api.prototype.calcDelivery = function(toCity, weight, insurance, params) {
      var deferred;
      if (params == null) {
        params = {};
      }
      deferred = Q.defer();
      Q().then((function(_this) {
        return function() {
          return _this.makeRequest(_this.prepareParams(toCity, weight, insurance, params));
        };
      })(this)).then((function(_this) {
        return function(res) {
          return _this.parseResponse(res);
        };
      })(this)).then((function(_this) {
        return function(out) {
          return deferred.resolve(out);
        };
      })(this))["catch"]((function(_this) {
        return function(e) {
          return deferred.reject(e);
        };
      })(this)).done();
      return deferred.promise;
    };

    Api.prototype.prepareParams = function(toCity, weight, insurance, params) {
      if (params == null) {
        params = {};
      }
      _.extend(params, {
        id: this.shopId,
        p: this.pass,
        to_city: toCity,
        weight: weight,
        strah: insurance
      });
      return params;
    };

    Api.prototype.makeRequest = function(postData) {
      var deferred, options, parsedUrl, req;
      deferred = Q.defer();
      parsedUrl = url.parse(this.constructor.API_URL);
      postData = queryString.stringify(postData);
      options = {
        host: parsedUrl.host,
        path: parsedUrl.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        }
      };
      req = http.request(options, (function(_this) {
        return function(res) {
          var xml;
          if (res.statusCode !== 200) {
            throw new Error("Server respond with status code " + res.statusCode);
          }
          res.setEncoding('utf8');
          xml = '';
          res.on('data', function(chunk) {
            return xml += chunk;
          });
          res.on('error', function(e) {
            return deferred.reject(e);
          });
          return res.on('end', function() {
            return deferred.resolve(xml);
          });
        };
      })(this));
      req.on('error', (function(_this) {
        return function(e) {
          return deferred.reject(e);
        };
      })(this));
      req.write(postData);
      req.end();
      return deferred.promise;
    };

    Api.prototype.parseResponse = function(xml) {
      var deferred;
      deferred = Q.defer();
      Q.nfcall(parseString, xml).then((function(_this) {
        return function(result) {
          result = result.rsp;
          if (result.stat[0] !== '1') {
            throw new Error("Server respond with error: " + statusCodes[result.stat[0]] + " (status code: " + result.stat[0] + ")");
          }
          delete result.stat;
          return deferred.resolve(result);
        };
      })(this))["catch"]((function(_this) {
        return function(e) {
          return deferred.reject(e);
        };
      })(this)).done();
      return deferred.promise;
    };

    return Api;

  })();

  module.exports = Api;

}).call(this);
