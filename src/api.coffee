Q = require 'q'
http = require 'http'
url = require 'url'
querystring = require 'querystring'
{parseString} = require 'xml2js'
statusCodes = require './statusCodes'

class Api
	constructor : (@shopId, @pass) ->
		@apiUrl = 'http://www.edost.ru/edost_calc_kln.php'
		@method = 'POST'

	calcDelivery : (params) ->
		defered = Q.defer()

		Q()
		.then () =>
			data = @prepareParams params
			return @makeRequest data
		.then (res) =>
			return @parseResponse res
		.then (out) =>
			defered.resolve out
		.catch (e) =>
			defered.reject e
		.done()

		return defered.promise

	prepareParams : (params) ->
		if !params.to_city?
			throw new Error 'Parameter "to_city" is not specified'

		if !params.weight?
			throw new Error 'Parameter "weight" is not specified'

		if !params.strah?
			throw new Error 'Parameter "strah" is not specified'

		data =
			id: @shopId,
			p: @pass,
			to_city: params.to_city
			weight: params.weight
			strah: params.strah

		if params.ln?
			data.ln = params.ln

		if params.wd?
			data.wd = params.wd

		if params.hg?
			data.hg = params.hg

		if params.zip?
			data.zip = params.zip

		return data

	makeRequest : (postData) ->
		defered = Q.defer()

		parsedUrl = url.parse @apiUrl
		postData = querystring.stringify postData

		options = {
			host: parsedUrl.host,
			path: parsedUrl.path,
			method: @method,
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
				defered.reject e

			res.on 'end', () =>
				defered.resolve xml

		req.on 'error', (e) =>
			defered.reject e

		req.write postData
		req.end()

		return defered.promise

	parseResponse : (xml) ->
		defered = Q.defer()

		Q.nfcall parseString, xml
		.then (result) =>
			result = result.rsp

			if result.stat[0] != '1'
				throw new Error "Server respond with error: #{statusCodes[result.stat[0]]} (status code: #{result.stat[0]})"

			delete result.stat

			defered.resolve result
		.catch (e) =>
			defered.reject e
		.done()

		return defered.promise

module.exports = Api
