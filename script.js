(function(){
	// var userHeader = document.getElementById('userHeader');
	const chatEnter = document.getElementById('chatEnter');
	const uname = document.getElementById('uname');
	const nick = document.getElementById('nick');
	const enterButton = document.getElementById('enterButton');
	const errMessage = document.getElementById('errorMessage');
	const usersList = document.getElementById('usersList');
	const chat = document.getElementById('chat');

	var messages = document.getElementById('messages');
	var text = document.getElementById('text');
	var textSubmit = document.getElementById('textSubmit');

	let userName = '';
	let nickName = '';

	enterButton.addEventListener('click', function(e) {
		e.preventDefault();
		userName = uname.value;
		nickName = nick.value;
		var data = {
			userName: userName,
			nickName: nickName
		}
		ajaxRequest({
			method: 'POST',
			url: '/users',
			data: data,
			callback: 
function(msg) {
	buildChat();
}
		});

	});

	textSubmit.addEventListener('click', function(e) {
		e.preventDefault();
		let time = new Date();
		var data = {
			nickName: nickName,
			text: text.value,
			time: time.toUTCString()
		};
		text.value = '';

		ajaxRequest({
			method: 'POST',
			url: '/messages',
			data: data
		})
	});

	var ajaxRequest = function(options) {
		var url = options.url || '/';
		var method = options.method || 'GET';
		var callback = options.callback || function() {};
		var data = options.data || {};
		var xmlHttp = new XMLHttpRequest();

		xmlHttp.open(method, url, true);
		xmlHttp.setRequestHeader('Content-Type', 'application/json');
		xmlHttp.send(JSON.stringify(data));
		xmlHttp.onreadystatechange = function() {
			if(xmlHttp.status === 200 && xmlHttp.readyState === 4) {
				callback(xmlHttp.responseText);
			} else if(xmlHttp.status === 403) errorHandler(xmlHttp.responseText);
		};
		
	};

	const getData = function() {
		ajaxRequest({
			url: '/messages',
			method: 'GET',
			callback: function(msg) {
				msg = JSON.parse(msg);
				messages.innerHTML = '';
				let side = "left-aligned";
				for(var i in msg) {
					if(msg.hasOwnProperty(i)) {
						var el = document.createElement('li');
						el.setAttribute('class', side);
						side = side === 'left-aligned' ? 'right-aligned' : 'left-aligned';
						el.innerHTML = '<span>' + msg[i].nickName + ' <small><i>' + msg[i].time + '</i></small></span><br><p>' + 
						msg[i].text + '</p>';
						messages.appendChild(el);
					}
				}
			}
		});
		ajaxRequest({
			url: '/users',
			method: 'GET',
			callback: function(msg) {
				const users = JSON.parse(msg);
				usersList.innerHTML = '';
				if(users.length > 0) {
					for(let i in users) {
						var el = document.createElement('li');
						el.innerHTML = '<i>' + users[i].userName + ' </i><b> @' + users[i].nickName + '</b>';
						usersList.appendChild(el);
					}
				}
				
			}
		});
	};

	function buildChat() {
		errMessage.innerText = '';
		chatEnter.style.display = "none";
		chat.style.display = "grid";
	};

	function errorHandler(msg) {
		errMessage.innerText = "Nickname is already used! Please choose another one."; // JSON.parse(msg).error;
	}

	getData();

	setInterval(function() {
		getData();
	}, 1000);
})();