const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const HTTP_PORT = "4000";
const app = express();
const server = http.createServer(app);
const io = socketio(server);
var numClients = {};
var clientNames = {};
var rematchCounter = 0;

io.on("connected", (socket) => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        console.log("A user disconnected");
        numClients[socket.room]--;
        console.log(numClients[socket.room]);
    })

    socket.on("joinGameLobby", (room) => {
        const { gameId } = room;
        socket.join(gameId);
        console.log(gameId);
        socket.room = gameId;
        if (numClients[gameId] === undefined) {
            numClients[gameId] = 1;
        }
        else {
            numClients[gameId] += 1;
        }
        if (clientNames[gameId] === undefined) {
            clientNames[gameId] = [];
        }
        clientNames[gameId].push(room.username);
        console.log(clientNames[gameId]);
    });

    socket.on("move", (state) => {
        io.in(state.gameId).emit("userMove", state);
    })

    socket.on("castle", (data) => {
        io.in(data.gameId).emit("castleBoard", data);
    })

    socket.on("rematch", (data) => {
        rematchCounter += data.num;
        if (rematchCounter === 2) {
            rematchCounter = 0;
            io.in(data.gameId).emit("initiateRematch");
        }
    })

})


app.listen("4000", () => {
    console.log("Server 4000 is Running");
})