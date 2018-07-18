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
	function checkNickname(msg) {
		let isValid = true;
		nickNames.forEach(el=>{
			if(Object.is(msg.nickName && msg.nickName, el.nickName)) {
				isValid = false;
			}
		});
		return isValid;
	};

	if(checkNickname(req.body)) {
		nickNames.push(req.body);
		res.json({});
	} else {
		res.status(403).send({error: "Nickname is invalid! Please try again later."});
	}
});


app.get('/users', function(req, res){
	res.json(nickNames);
});

app.get('/messages', function(req, res){
	res.json(messages);
});

app.post('/messages', function(req, res){
	messages.push(req.body);
	if(messages.length > 100) {
		messages.shift();
	}
});

http.listen(5000, function(){
	console.log('listening on *:5000');
});