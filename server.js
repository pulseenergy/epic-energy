var connect = require('connect');

var app = connect()
	.use(connect.static('public'))
	.use(require('less-middleware')({
		debug: true,
		src: 'public'
	}));

app.listen(3000);
