Q = require 'q'
http = require 'http'
url = require 'url'
queryString = require 'querystring'
{parseString} = require 'xml2js'
statusCodes = require './statusCodes'
_ = require 'underscore'

class Api
	@API_URL : 'http://www.edost.ru/edost_calc_kln.php'

	constructor : (@shopId, @pass) ->

	calcDelivery : (toCity, weight, insurance, params = {}) ->
		deferred = Q.defer()

		Q()
		.then () =>
			return @makeRequest @prepareParams(toCity, weight, insurance, params)
		.then (res) =>
			return @parseResponse res
		.then (out) =>
			deferred.resolve out
		.catch (e) =>
			deferred.reject e
		.done()

		return deferred.promise

	prepareParams : (toCity, weight, insurance, params = {}) ->
		_.extend params, {
			id: @shopId
			p: @pass
			to_city : toCity
			weight : weight
			strah : insurance
		}

		return params

	makeRequest : (postData) ->
		deferred = Q.defer()

		parsedUrl = url.parse @constructor.API_URL
		postData = queryString.stringify postData

		options = {
			host: parsedUrl.host,
			path: parsedUrl.path,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(postData)
			}
		}

		req = http.request options, (res) =>
			if res.statusCode != 200
				throw new Error "Server respond with status code #{res.statusCode}"

			res.setEncoding 'utf8'

			xml = ''

			res.on 'data', (chunk) =>
				xml += chunk

			res.on 'error', (e) =>
				deferred.reject e

			res.on 'end', () =>
				deferred.resolve xml

		req.on 'error', (e) =>
			deferred.reject e

		req.write postData
		req.end()

		return deferred.promise

	parseResponse : (xml) ->
		deferred = Q.defer()

		Q.nfcall parseString, xml, { explicitArray: false }
		.then (result) =>
			result = result.rsp

			if result.stat != '1'
				throw new Error "Server respond with error: #{statusCodes[result.stat]} (status code: #{result.stat})"

			delete result.stat

			if result.tarif? && !_.isArray result.tarif
				result.tarif = [result.tarif]

			if result.office? && !_.isArray result.office
				result.office = [result.office]

			deferred.resolve result
		.catch (e) =>
			deferred.reject e
		.done()

		return deferred.promise

module.exports = Api
