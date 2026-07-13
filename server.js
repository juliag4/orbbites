import express from 'express';
import path from 'path';
import {createServer} from 'http';
import {Server} from 'socket.io';
import GameState from './docs/src/GameState.js';


const PORT = process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = new Server(server);

// Set static folder
app.use(express.static(path.join(import.meta.dirname, 'docs')));

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

let room = '';
let gamestate = new GameState();

// Handle a socket connection request from web client
const connections = [null, null, null, null, null, null, null, null];
io.on('connection', socket => {
    // Find an available player number
    let playerIndex = -1;
    for(const i in connections){
        if(connections[i] === null){
            playerIndex = i;
            break;
        }
    }
    
    if(playerIndex === -1){ return; }
    
    // Tell client what player number has connected
    socket.emit('player-number', playerIndex);
    console.log(`Player ${playerIndex} has connected`);
    
    connections[playerIndex] = true;
    
    socket.on('join', (roomId) => {
        socket.join('Room 1');
        console.log('adding player!!');
        gamestate.addPlayer(socket.id);
    });
    
    socket.on('mouse-move', (mouseX, mouseY, canvasWidth, canvasHeight) => {
        if(gamestate.players[socket.id]){
            gamestate.players[socket.id].mouseX = mouseX;
            gamestate.players[socket.id].mouseY = mouseY;
            gamestate.players[socket.id].calculateMoves(mouseX, mouseY);
            gamestate.players[socket.id].calculateView(canvasWidth, canvasHeight);
            gamestate.players[socket.id].adjustView(canvasWidth, canvasHeight, gamestate.mapWidth, gamestate.mapHeight);
        }
    });

    socket.on('disconnect', () => {
        gamestate.deletePlayer(socket.id);
    });
    
    setInterval(() => {
        socket.emit('state', {players: gamestate.players, food: gamestate.foodCollection, id: socket.id});
    }, 50);
});
