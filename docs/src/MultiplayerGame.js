import {AddStyle} from './Styles.js';

import GameState from './GameState.js';
import FoodCollection from './FoodCollection.js';

AddStyle(`
    body{
        margin: 0;
    }

    orb-multiplayer{
        display: flex;
        font-family: sans-serif;
        width: 100vw;
        height: 100vh;
    }

    canvas{
        object-fit: contain;
    }
`);

export default class MultiplayerGame extends HTMLElement{
    constructor(){
        super();
        
        this.innerHTML = `
            <canvas></canvas>
        `;
        
        this.canvas = this.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
                
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        let gameMode = 'multiPlayer';
        
        this.gameState = new GameState();
        this.gameUpdate = this.gameUpdate.bind(this);
    }
    
    startGame(){
        let playerNum = 0;
        const socket = io();
        
        // Get your player number
        socket.on('player-number', num => {
            console.log('player-nunmber socket');
            if(num === -1){
                console.log('Sorry the server is full');
            }else{
                playerNum = parseInt(num);
                socket.emit('join', 'Room 1');
                console.log(`Player number ${num} has connected or disconnected`);
            }
        });
                
        socket.on('state', ({players, food, id}) => {
            this.gameState.playerId = String(id);
            this.gameState.updateState(players, food);
        });
                
        // event listener for mouse move
        this.canvas.addEventListener('mousemove', (e) => {
            socket.emit('mouse-move', e.clientX, e.clientY, this.canvas.width, this.canvas.height);
        });
        
        requestAnimationFrame(this.gameUpdate);
    }
    
    gameUpdate(currentTime){
        const isNotEmpty = Object.keys(this.gameState.players).length > 0;
        if(isNotEmpty && this.gameState.playerId){
            this.translateContext(this.gameState.players[this.gameState.playerId].view);
            this.redrawPlayers(this.gameState.players);
        }

        requestAnimationFrame(this.gameUpdate);
    }
    
    translateContext(view){
        // Undo the transform
        this.ctx.resetTransform();
        
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Move the view window
        this.ctx.translate(-view.x, -view.y);
    }
    
    redrawPlayers(players){
        for(const [key, player] of Object.entries(players)){
            // Styling of the circle itself
            this.ctx.beginPath();
            this.ctx.arc(player.x, player.y, player.radius, 0, 2 * Math.PI);
            this.ctx.fillStyle = player.color;
            this.ctx.fill();
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            this.ctx.closePath();
        }
    };
}
customElements.define('orb-multiplayer', MultiplayerGame);
