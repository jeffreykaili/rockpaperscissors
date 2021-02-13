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
const queueBtn = document.getElementById("queue"); 
const homeScreen = document.querySelector(".home-screen"); 
const queueScreen = document.querySelector(".queue-screen"); 
const scoreText = document.getElementById("score-display");  
const countdownText = document.getElementById("countdown"); 

let myID; 

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

queueBtn.addEventListener("click", function(){
    homeScreen.style.display = "none"; 
    socket.emit("queue-game"); 
}); 

socket.on("game-start", () => {
    queueScreen.style.display = "none";
    gameScreen.style.display = "flex"; 
}); 

socket.on("queue-wait", ()=> {
    queueScreen.style.display = "flex"; 
}); 

socket.on("set-playerID", (ID)=> {
    myID = ID; 
}); 

socket.on("draw", ({playerID, gameScoreA, gameScoreB}) => {
    let scores = [gameScoreA, gameScoreB]; 
    waitingScreen.style.display = "none";
    scoreText.innerText = "Score: " + scores[myID] + " (You) - " + scores[!myID?1:0] + " (Opponent)"; 
    scoreText.style.display = "flex"; 
    drawScreen.style.display = "flex";
    countdown(); 
}); 

socket.on("win", ({playerID, gameScoreA, gameScoreB}) => {
    let scores = [gameScoreA, gameScoreB]; 
    waitingScreen.style.display = "none";
    scoreText.innerText = "Score: " + scores[myID] + " (You) - " + scores[!myID?1:0] + " (Opponent)"; 
    scoreText.style.display = "flex"; 
    if (myID === playerID) {
        winScreen.style.display = "flex";
    } else {
        loseScreen.style.display = "flex";
    }
    if(gameScoreA < 3 && gameScoreB < 3){
        countdown(); 
    }
}); 

socket.on("lose", ({playerID, gameScoreA, gameScoreB}) =>  {
    let scores = [gameScoreA, gameScoreB]; 
    waitingScreen.style.display = "none";
    scoreText.innerText = "Score: " + scores[myID] + " (You) - " + scores[!myID?1:0] + " (Opponent)"; 
    scoreText.style.display = "flex"; 
    if (myID === playerID) {
        loseScreen.style.display = "flex";
    } else {
        winScreen.style.display = "flex";
    }
    if(gameScoreA < 3 && gameScoreB < 3){
        countdown(); 
    }
}); 

socket.on("reset-round", ()=>{
    loseScreen.style.display = "none";
    winScreen.style.display = "none";
    drawScreen.style.display = "none";
    scoreText.style.display = "none"; 
    countdownText.style.display = "none"; 
    gameScreen.style.display = "flex"; 
}); 

socket.on("waiting-screen", ()=>{
    waitingScreen.style.display = "flex"; 
}); 


function countdown() {
    var timeleft = 1; 
    countdownText.innerHTML = 3; 
    countdownText.style.display = "flex"; 
    var downloadTimer = setInterval(function(){
        if(3 - timeleft <= 0){
            clearInterval(downloadTimer);
            socket.emit("reset-round"); 
        }
        countdownText.innerHTML = 3 - timeleft;
        timeleft += 1;
    }, 1000);
}