const express = require("express");
const http = require("http");
const socketio = require("socket.io");
require("dotenv").config();
const HTTP_PORT = process.env.PORT || "4000";
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

    socket.on("shouldGameStart", (gameId) => {
        console.log(numClients[gameId]);
        if (numClients[gameId] === 2) {
            io.in(gameId).emit("start game", clientNames[gameId]);
            io.in(gameId).emit('message', { text: "Welcome to Online Chess!", user: "admin" });
        }

        if (numClients[gameId] > 2) {
            console.log("room full :(");
        }
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

    socket.on("clickResign", (data) => {
        io.in(data.gameId).emit("initiateResign");
    })

    socket.on("enPassant", (data) => {
        io.in(data.gameId).emit("handleEnpassant", data);
    })

    socket.on("sendMessage", (message, gameId, username, callback) => {
        io.in(gameId).emit('message', { text: message, user: username })
        callback();
    });

    socket.on("callUser", (data) => {
        io.in(data.gameId).emit("hello", { signal: data.signalData, from: data.from })
    });

    socket.on('acceptCall', (data) => {
        io.in(data.gameId).emit("callAccepted", data.signal);
    });
})


app.listen(HTTP_PORT, () => {
    console.log(`Server ${HTTP_PORT} is Running`);
})