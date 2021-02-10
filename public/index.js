const socket = io(); 

// dom stuff
const rockBtn = document.getElementById("rock"); 
const paperBtn = document.getElementById("paper"); 
const scissorsBtn = document.getElementById("scissors"); 
const waitingScreen = document.querySelector(".waiting-screen"); 
const gameScreen = document.querySelector('.game-screen'); 
const drawScreen = document.querySelector('.draw-screen'); 
const winScreen = document.querySelector('.win-screen'); 
const loseScreen = document.querySelector('.lose-screen'); 
let playerID; 

rockBtn.addEventListener("click", function(){
    gameScreen.style.display = "none"; 
    socket.emit("choice-rock"); 
}); 

paperBtn.addEventListener("click", function(){
    gameScreen.style.display = "none"; 
    socket.emit("choice-paper"); 
}); 

scissorsBtn.addEventListener("click", function(){
    gameScreen.style.display = "none"; 
    socket.emit("choice-scissors"); 
}); 

socket.on("set-playerID", (ID)=> {
    playerID = ID; 
}); 

socket.on("draw", (ID) => {
    waitingScreen.style.display = "none";
    drawScreen.style.display = "flex";
}); 

socket.on("win",(winnerID)=>{
    waitingScreen.style.display = "none";
    if(playerID===winnerID) {
        winScreen.style.display = "flex"; 
    } else {
        loseScreen.style.display = "flex"; 
    }
}); 

socket.on("lose",(loserID)=>{
    waitingScreen.style.display = "none";
    if(playerID===loserID) {
        loseScreen.style.display = "flex"; 
    } else {
        winScreen.style.display = "flex"; 
    }
}); 

socket.on("waiting-screen", ()=>{
    waitingScreen.style.display = "flex"; 
}); 