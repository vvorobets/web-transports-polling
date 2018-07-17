(function(){
	// var userHeader = document.getElementById('userHeader');
	const chatEnter = document.getElementById('chatEnter');
	const uname = document.getElementById('uname');
	const nick = document.getElementById('nick');
	const enterButton = document.getElementById('enterButton');

	var messages = document.getElementById('messages');
	var text = document.getElementById('text');
	var textSubmit = document.getElementById('textSubmit');

	let userName = '';
	let nickName = '';

	enterButton.addEventListener('click', function(e) {
		e.preventDefault();
		var data = {
			userName: uname.value,
			nickName: nick.value
		}
console.log("Clicked!");
		ajaxRequest({
			method: 'POST',
			url: '/users',
			data: data,
			callback: 
function(x) {buildChat();}
			

			// buildChat()
		});

	});

	textSubmit.onclick = function() {
		var data = {
			name: userName,
			text: text.value
		};
		text.value = '';

		ajaxRequest({
			method: 'POST',
			url: '/messages',
			data: data
		})
	};

	var ajaxRequest = function(options) {
		var url = options.url || '/';
		var method = options.method || 'GET';
		var callback = options.callback || function() {};
		var data = options.data || {};
		var xmlHttp = new XMLHttpRequest();

		xmlHttp.open(method, url, true);
		xmlHttp.setRequestHeader('Content-Type', 'application/json');
		xmlHttp.onreadystatechange = function() {
			if(xmlHttp.status === 200 && xmlHttp.readyState === 4) {
console.log(xmlHttp.responseText);
				callback(xmlHttp.responseText);
			}
		};
		xmlHttp.send(JSON.stringify(data));

	};

	const getData = function() {
		ajaxRequest({
			url: '/messages',
			method: 'GET',
			callback: function(msg) {
				msg = JSON.parse(msg);
				messages.innerHTML = '';
				for(var i in msg) {
					if(msg.hasOwnProperty(i)) {
						var el = document.createElement('li');
						el.innerText = msg[i].name + ': ' + msg[i].text;
						messages.appendChild(el);
					}
				}
			}
		});
	};

	function buildChat() {
		chatEnter.style.display = "none";
	};

	getData();

	setInterval(function() {
		getData();
	}, 15000);
})();