// server.js

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

app.use(express.static("public"));

let votes = {
    john: 0,
    emma: 0,
    michael: 0
};

io.on("connection", (socket) => {

    console.log("User connected");

    // Send current votes
    socket.emit("updateVotes", votes);

    socket.on("vote", (person) => {

        if (votes[person] !== undefined) {

            votes[person]++;

            // Broadcast updated votes to all users
            io.emit("updateVotes", votes);

        }

    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });

});

const PORT = 3000;

server.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));