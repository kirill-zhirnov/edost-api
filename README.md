# edost-api
Node.JS library for calculating a cost of delivery with edost.ru API 

## How to use?

```
'use strict';

const edostApi = require('edost-api');
let api = edostApi.createApi('<shopId>', '<yourKey>');

// pass to_city, weight, insurance and additional params.
api.calcDelivery(1019, 1, 1)
.then(function(res) {
	console.log(res);
})
.catch(function(e) {
	console.log("Error!", e);
})
.done();
```

Detailed API description: http://edost.ru/kln/help.html