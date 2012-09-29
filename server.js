var connect = require('connect');

var app = connect()
	.use(connect.static('public'))
	.use(require('less-middleware')({
		src: 'public'
	}));

app.listen(3000);
