var express = require('express'),
	lessMiddleware = require('less-middleware');

var app = express.createServer();

app.configure(function () {
	app.use(lessMiddleware({
		src: __dirname + '/public',
		compress: true,
		debug: true
	}));

	app.use(express.static(__dirname + '/public'));
});

app.listen(process.env['app_port'] || 3000);
console.log('running on 3000');

