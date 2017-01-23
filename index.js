'use strict'

const Api = require('./lib/api');
const tariffsRelation = require('./lib/tariffs');
const tariffs = tariffsRelation.getTariffsAsKeys();

module.exports.createApi = function(id, password) {
    let api = new Api(id, password);

    return api;
}

module.exports.tariffToProvider = function(tariffId) {
    if (!tariffId in tariffs)
        throw new Error("Unknown tariff ID: '" + tariffId + "'");

    return tariffs[tariffId];
}

module.exports.isTariffRussianPost = function(tariffId) {
    
}

module.exports.isTariffEms = function(tariffId) {

}