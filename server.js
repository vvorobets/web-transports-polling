var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');

let messages = [];
let nickNames = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/script.js', function(req, res){
	res.sendFile(__dirname + '/script.js');
});

app.post('/users', function(req, res){
	nickNames.forEach(el=>{
		if(el.nickName===req.body.nickName) {
			res.status(403).send({ error: "Nickname is invalid! Please try again later."});
		}
	});
	nickNames.push(req.body);
	res.json({});
});

app.get('/users', function(req, res){
	res.json(nickNames);
});

app.get('/messages', function(req, res){
	res.json(messages);
});

app.post('/messages', function(req, res){
	messages.push(req.body);
console.log("Pushed by: " + req.body.nick);
console.log(req.body);
	if(messages.length > 100) {
		messages.shift();
	}
});

http.listen(5000, function(){
	console.log('listening on *:5000');
});