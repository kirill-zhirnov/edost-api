(function() {
  module.exports.getTariffsAsKeys = function() {
    var i, len, out, ref, service, tariffId, tariffs;
    out = {};
    ref = this.tariffCodes;
    for (service in ref) {
      tariffs = ref[service];
      for (i = 0, len = tariffs.length; i < len; i++) {
        tariffId = tariffs[i];
        out[tariffId] = service;
      }
    }
    return out;
  };

  module.exports.tariffCodes = {
    'russianPost': [1, 2, 61, 62, 68],
    'ems': [3]
  };

}).call(this);
