module.exports.getTariffsAsKeys = () ->
	out = {}

	for service, tariffs of @tariffCodes
		for tariffId in tariffs
			out[tariffId] = service

	return out

module.exports.tariffCodes =
	'russianPost' : [1, 2, 61, 62, 68, 69, 70, 71, 72, 73, 74]

	'ems' : [3, 18]

	'spsr' : [5, 19]

	'cdek' : [6, 9, 10, 17, 37, 38, 65, 66]

	'dhl' : [11, 20]

	'ups' : [12, 21]

	'zhelDorExpedition' : [14, 48]

	'autotrading' : [15, 50]

	'pek' : [16, 49]

	'delLine' : [22, 51]

	'megapolis' : [23, 24]

	'garantpost' : [25, 26]

	'ponyExpress' : [27, 28]

	'pickPoint' : [29]

	'courier' : [31, 32, 33, 34]

	'selfPickUp' : [35, 56, 57, 58]

	'boxberry' : [36, 43]

	'energy' : [39, 40, 41, 42, 52, 53, 54, 55]

	'dpd' : [44, 45, 46, 47]

	'ratek' : [59, 60]

	'inPost' : [67]

	'customCourier' : [31, 32, 33, 34]

	'customSelfPickup' : [35, 56, 57, 58]
