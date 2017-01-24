(function() {
  var Api, Q, http, parseString, querystring, statusCodes, url;

  Q = require('q');

  http = require('http');

  url = require('url');

  querystring = require('querystring');

  parseString = require('xml2js').parseString;

  statusCodes = require('./statusCodes');

  Api = (function() {
    function Api(shopId, pass) {
      this.shopId = shopId;
      this.pass = pass;
      this.apiUrl = 'http://www.edost.ru/edost_calc_kln.php';
      this.method = 'POST';
    }

    Api.prototype.calcDelivery = function(params) {
      var defered;
      defered = Q.defer();
      Q().then((function(_this) {
        return function() {
          var data;
          data = _this.prepareParams(params);
          return _this.makeRequest(data);
        };
      })(this)).then((function(_this) {
        return function(res) {
          return _this.parseResponse(res);
        };
      })(this)).then((function(_this) {
        return function(out) {
          return defered.resolve(out);
        };
      })(this))["catch"]((function(_this) {
        return function(e) {
          return defered.reject(e);
        };
      })(this)).done();
      return defered.promise;
    };

    Api.prototype.prepareParams = function(params) {
      var data;
      if (params.to_city == null) {
        throw new Error('Parameter "to_city" is not specified');
      }
      if (params.weight == null) {
        throw new Error('Parameter "weight" is not specified');
      }
      if (params.strah == null) {
        throw new Error('Parameter "strah" is not specified');
      }
      data = {
        id: this.shopId,
        p: this.pass,
        to_city: params.to_city,
        weight: params.weight,
        strah: params.strah
      };
      if (params.ln != null) {
        data.ln = params.ln;
      }
      if (params.wd != null) {
        data.wd = params.wd;
      }
      if (params.hg != null) {
        data.hg = params.hg;
      }
      if (params.zip != null) {
        data.zip = params.zip;
      }
      return data;
    };

    Api.prototype.makeRequest = function(postData) {
      var defered, options, parsedUrl, req;
      defered = Q.defer();
      parsedUrl = url.parse(this.apiUrl);
      postData = querystring.stringify(postData);
      options = {
        host: parsedUrl.host,
        path: parsedUrl.path,
        method: this.method,
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
            return defered.reject(e);
          });
          return res.on('end', function() {
            return defered.resolve(xml);
          });
        };
      })(this));
      req.on('error', (function(_this) {
        return function(e) {
          return defered.reject(e);
        };
      })(this));
      req.write(postData);
      req.end();
      return defered.promise;
    };

    Api.prototype.parseResponse = function(xml) {
      var defered;
      defered = Q.defer();
      Q.nfcall(parseString, xml).then((function(_this) {
        return function(result) {
          result = result.rsp;
          if (result.stat[0] !== '1') {
            throw new Error("Server respond with error: " + statusCodes[result.stat[0]] + " (status code: " + result.stat[0] + ")");
          }
          delete result.stat;
          return defered.resolve(result);
        };
      })(this))["catch"]((function(_this) {
        return function(e) {
          return defered.reject(e);
        };
      })(this)).done();
      return defered.promise;
    };

    return Api;

  })();

  module.exports = Api;

}).call(this);
