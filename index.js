const express = require("express");
const socket  = require("socket.io");

const app = express();

let server = app.listen(4000,function () {
    console.log("server is running");
});

app.use(express.static("public"));


let io = socket(server);
io.on("connection",function (socket) {
    console.log("User connected : " + socket.id);

    socket.on("join",function (roomName) {

        var rooms = io.sockets.adapter.rooms;
        var room = rooms.get(roomName);

        if (room == undefined) {
            socket.join(roomName);
            console.log("Room is created");

            socket.emit("created");

        }else if (room.size == 1) {
            socket.join(roomName);
            console.log("Room Joined");

            socket.emit("joined");
        }else{
            console.log("Room full for now");

            socket.emit("full");
        }

        console.log(rooms);
       
        /*
        var rooms = io.socket.adapter.rooms;
        console.log(rooms);
        var room = io.socket.adapter.rooms.get(roomName);

        */

    });

    socket.on("ready",function (roomName) {
        
        console.log("Ready");
        socket.broadcast.to(roomName).emit("ready");

    });

    // always broadcast in the other person inthe romm ( ice candidate)

    socket.on("candidate",function (candidate,roomName) {

        console.log("Candidate");
        socket.broadcast.to(roomName).emit("candidate",candidate);

    });

    socket.on("offer",function (offer,roomName) {

        console.log("Offer");
        socket.broadcast.to(roomName).emit("offer",offer);

    });

    socket.on("answer",function (answer,roomName) {

        console.log("Answer");
        socket.broadcast.to(roomName).emit("answer",answer);

    });
    
});