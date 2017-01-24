lib = require './index'
_ = require 'underscore'

api = lib.createApi('a', 'EzFIn5AZSRZiaLfe1Ga4HI2VMq8jlUmH');

api.calcDelivery(1019, 1, 1)
.then (res) =>
	console.log _.keys(res)
.catch (e) ->
	console.log "Error!\n\n", e, e.message
.done()