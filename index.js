'use strict'

const Api = require('./lib/api');
const tariffsRelation = require('./lib/tariffs');
const tariffs = tariffsRelation.getTariffsAsKeys();

module.exports.createApi = function(id, password) {
	return new Api(id, password);
}

module.exports.tariffToProvider = function(tariffId) {
	if (!tariffId in tariffs)
		throw new Error("Unknown tariff ID: '" + tariffId + "'");

	return tariffs[tariffId];
}

module.exports.isTariffRussianPost = function(tariffId) {
	return this.tariffToProvider(tariffId) === 'russianPost';
}

module.exports.isTariffEms = function(tariffId) {
	return this.tariffToProvider(tariffId) === 'ems';
}
