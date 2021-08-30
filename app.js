const express = require("express")
const app = express()
const path = require("path")
const server = require("http").createServer(app);
const port = 3000;
const date = require("date-and-time");
const now = new Date();
const { Server } = require('socket.io');
const io = new Server(server);
var usuarios = [];

app.use(express.static(__dirname+"/public"))

io.on("connection", socket => {
	socket.on("entrar", (apelido, callback) => {
		if (!(apelido in usuarios)) {
			socket.apelido = apelido;
			usuarios[apelido] = socket;
			io.sockets.emit("atualizar usuarios", Object.keys(usuarios));
			let entrou_sucesso = `[${date.format(now, "HH:mm:ss")}] ${socket.apelido}`;
			io.sockets.emit("entrou chat", entrou_sucesso);
			callback(true);
	  }
		else {
	       callback(false);
			}
	})
	socket.on("enviar mensagem", mensagem_enviada => {
		 mensagem_enviada = `[${date.format(now, "HH:mm:ss")}] ${socket.apelido}: ${mensagem_enviada}`;
		io.sockets.emit("atualizar mensagem", mensagem_enviada);
	})
	socket.on("disconnect", () => {
		let saiu_sucesso = `[${date.format(now, "HH:mm:ss")}] ${socket.apelido}`;
		delete usuarios[socket.apelido];
		io.sockets.emit("atualizar usuarios", Object.keys(usuarios));
		io.sockets.emit("saiu chat", saiu_sucesso);
	})
})

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname+"/index.html"));
});

server.listen(port, (error) => {
	if (error) {
		return console.log("Erro ocorreu em", error);
	}
	console.log("Olá, o servidor está funcionando corretamente");
});
