const express = require('express'); 
const http = require('http'); 
const path = require('path'); 
const socketio = require('socket.io'); 

const app = express(); 
const server = http.createServer(app); 
app.use(express.static(path.join(__dirname,"public"))); 
const io = socketio(server); 
let userCount = 0; 
const {moves, gameMoves} = require("./util/gameInfo"); 
io.on("connection", client => {
    console.log("New User Connected! Total User Count:",++userCount); 
    const playerID = userCount-1; 
    client.emit("set-playerID", playerID);  

    client.on("choice-rock", function(){
        console.log("Player", playerID, "chose rock"); 
        gameMoves[playerID] = "rock"; 
        let res = check(playerID); 
        if(res !== false) {
            io.sockets.emit(res, playerID); 
        } else {
            client.emit("waiting-screen"); 
        }
    }); 
    client.on("choice-paper", function(){
        console.log("Player", playerID, "chose paper"); 
        gameMoves[playerID] = "paper"; 
        let res = check(playerID); 
        if(res !== false) {
            io.sockets.emit(res, playerID); 
        } else {
            client.emit("waiting-screen"); 
        }
    }); 
    client.on("choice-scissors", function(){
        console.log("Player", playerID, "chose scissors"); 
        gameMoves[playerID] = "scissors"; 
        let res = check(playerID); 
        if(res !== false) {
            io.sockets.emit(res, playerID); 
        } else {
            client.emit("waiting-screen"); 
        }
    }); 
}); 
function check(playerID) {
    console.log("check", gameMoves[0], gameMoves[1]); 
    if(gameMoves[0]!=="" && gameMoves[1]!=="") {
        console.log("hello", playerID, !playerID?1:0); 
        let myMove = gameMoves[playerID]; 
        let enemyMove = gameMoves[!playerID?1:0]; 
        console.log(myMove, enemyMove, moves[myMove]); 
        if(myMove === enemyMove) {
            console.log("DRAW"); 
            return "draw"; 
        }
        else if (moves[myMove] === enemyMove) {
            console.log(myMove, enemyMove, moves[myMove]); 
            console.log("WIN"); 
            return "win"; 
        } 
        else {
            console.log("LOSE"); 
            return "lose"; 
        }
    }
    return false; 
}

server.listen(5000, () => console.log("Server Started on port 5000.")); 