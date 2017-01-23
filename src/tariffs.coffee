module.exports.getTariffsAsKeys = () ->
	out = {}
	
	for service, tariffs of @tariffCodes
		for tariffId in tariffs
			out[tariffId] = service
			
	return out

module.exports.tariffCodes =
	'russianPost' : [1, 2, 61, 62, 68]
	
	'ems' : [3]