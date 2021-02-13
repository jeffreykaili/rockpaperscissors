const express = require('express'); 
const http = require('http'); 
const path = require('path'); 
const socketio = require('socket.io'); 

const app = express(); 
const server = http.createServer(app); 
app.use(express.static(path.join(__dirname,"public"))); 
const io = socketio(server); 
let userCount = 0; 
const {moves, gameMoves, gameScore} = require("./util/gameInfo"); 
io.on("connection", client => {
    console.log("New User Connected! Total User Count:",++userCount); 
    const playerID = userCount-1; 
    client.on("queue-game", function() {
        let roomsz = io.sockets.adapter.rooms.get("game-room"); 
        roomsz = (roomsz==undefined?0:roomsz.size); 
        console.log("number of people in room:", roomsz); 
        if(roomsz < 2) {
            client.join("game-room"); 
            client.emit("set-playerID", playerID);  
            roomsz = io.sockets.adapter.rooms.get("game-room").size; 
            console.log("NEW number of people in room:", roomsz); 
            if(roomsz == 1) {
                client.emit("queue-wait"); 
            }
        }
        if(roomsz == 2) {
            io.to("game-room").emit("game-start"); 
        }
    });  
    client.on("choice-rock", function(){
        console.log("Player", playerID, "chose rock"); 
        gameMoves[playerID] = "rock"; 
        let res = check(playerID); 
        if(res !== false) {
            let gameScoreA = gameScore[0]; 
            let gameScoreB = gameScore[1]; 
            console.log("SCORE: ",gameScoreA, gameScoreB); 
            io.to("game-room").emit(res, {playerID, gameScoreA, gameScoreB}); 
            console.log("emitted", res, playerID); 

        } else {
            client.emit("waiting-screen"); 
        }
    }); 
    client.on("choice-paper", function(){
        console.log("Player", playerID, "chose paper"); 
        gameMoves[playerID] = "paper"; 
        let res = check(playerID); 
        if(res !== false) {
            let gameScoreA = gameScore[0]; 
            let gameScoreB = gameScore[1]; 
            console.log("SCORE: ",gameScoreA, gameScoreB); 
            io.to("game-room").emit(res, {playerID, gameScoreA, gameScoreB}); 
            console.log("emitted", res, playerID); 
        } else {
            client.emit("waiting-screen"); 
        }
    }); 
    client.on("choice-scissors", function(){
        console.log("Player", playerID, "chose scissors"); 
        gameMoves[playerID] = "scissors"; 
        let res = check(playerID); 
        if(res !== false) {
            let gameScoreA = gameScore[0]; 
            let gameScoreB = gameScore[1]; 
            console.log("SCORE: ",gameScoreA, gameScoreB); 
            io.to("game-room").emit(res, {playerID, gameScoreA, gameScoreB}); 
            console.log("emitted", res, playerID); 
        } else {
            client.emit("waiting-screen"); 
        }
    }); 

    client.on("reset-round", function() {
        gameMoves[0] = gameMoves[1] = ""; 
        io.to("game-room").emit("reset-round"); 
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
            gameScore[playerID]++; 
            return "win"; 
        } 
        else {
            console.log("LOSE"); 
            gameScore[!playerID?1:0]++; 
            return "lose"; 
        }
    }
    return false; 
}


server.listen(5000, () => console.log("Server Started on port 5000.")); 