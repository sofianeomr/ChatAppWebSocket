const connectBtn = document.querySelector('#connect');
const sendBtn    = document.querySelector('#send');
const messages   = document.querySelector('#messages');
const messageBox = document.querySelector('#messageBox');
const destination = document.querySelector('#destination');
const userName   = document.querySelector('#userName');
document.querySelector('#send-message').classList.add('hidden');
sendBtn.classList.add('hidden');

if ("WebSocket" in window) {
	
	function showMessage(message) {
		messages.textContent += `\n${message}`;
		messages.scrollTop = messages.scrollHeight;
		messageBox.value = '';
	}

	let ws = new WebSocket("ws://localhost:3000");

	ws.onopen = function() {
		console.log("Connected to Server"); 
	};

	connectBtn.onclick = function() {
		if (ws) {
			ws.send(JSON.stringify({ name: userName.value, message: "" })); //ajouter objet destinataire
			document.querySelector('#owner-user').innerHTML = userName.value;
			document.querySelector('#send-message').classList.remove('hidden');
			document.querySelector('#user-connect').classList.add('hidden');
			sendBtn.classList.remove('hidden');
		} else {
			alert("ERROR: Not connected... refresh to try again!");
		}
	}

	sendBtn.onclick = function() {
		if (ws && messageBox.value!="") {

			ws.send(JSON.stringify({ name: userName.value, message: messageBox.value, destination: destination.value }));
			showMessage(`ME: ${messageBox.value}`);
		} else {
			alert("ERROR: Not connected... refresh to try again!");
		}
	}

	ws.onmessage = function ({data}) { 
		msg = JSON.parse(data)
		showMessage(`${msg.name}: ${msg.message}`);
	};

	ws.onclose = function() { 
		ws = null;
		alert("Connection closed... refresh to try again!"); 
	};

} else {
	alert("WebSocket NOT supported by your Browser!");
}
