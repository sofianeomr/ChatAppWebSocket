const SocketServer = require('websocket').server
const http = require('http');
let last_id = 0;
const server = http.createServer((req, res) => {})
const challenges = []

//Type de messages
const publicMessage = 0; //message publique pour tous les clients => message{message}
const privateMessage = 1;// message privé pour un client seul
const routineMessage = 2;// message routine de mise à jour information client/serveur

console.log(">> Chat-application : Starting server...")
server.listen(3000, ()=>{
    console.log("Listening on port [3000]...")
})

wsServer = new SocketServer({httpServer:server})

const connections = []

wsServer.on('request', (req) => {
    const connection = req.accept();
	let id = ++last_id;
    console.log('new connection : id = '+id);
    con = new Object();
	con.connection = connection;
	con.id = id;
	con.name = "";
	connections.push(con);

    connections.forEach(element => {
        console.log(element.name);
    })

    connection.on('message', (mes) => {
		msg = JSON.parse(mes.utf8Data);
		//console.log('new message : name [' + msg.name + '], message [' + msg.message + '], destination ['+ msg.destination + '].');
		
		/*
        switch (msg.type) {
            case publicMessage:
                connections.forEach(element => {
                    if (element.connection != connection)  element.connection.sendUTF(mes.utf8Data);
                })
                break;
            
            case privateMessage:
                connections.forEach(element => {
                    if (msg.destination == element.name)  element.connection.sendUTF(mes.utf8Data);
                })
                break;

            case routineMessage:
                element.name = msg.name;
                break;
        }*/

        connections.forEach(element => {
            if (element.connection != connection && msg.message!="" && 
            (msg.destination == "" || msg.destination == element.name)){
                
                element.connection.sendUTF(mes.utf8Data);
            }
			else {
				if(element.name =="" && msg.message==""){
					element.name = msg.name;
				}
			}
        })
    })

    connection.on('close', (resCode, des) => {
        console.log('connection closed')
        connections.splice(connections.indexOf(connection), 1)
    })

})