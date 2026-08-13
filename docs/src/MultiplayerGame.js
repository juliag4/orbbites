import {AddStyle} from './Styles.js';

import GameState from './GameState.js';
import Player from './Player.js';
import FoodCollection from './FoodCollection.js';

// TODO: remove player import if not needed

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
            console.log('player-number socket');
            if(num === -1){
                console.log('Sorry the server is full');
            }else{
                playerNum = parseInt(num);
                socket.emit('join', 'Room 1');
                console.log(`Player number ${num} has connected or disconnected`);
                
                socket.emit('player-name', document.querySelector('.username').value);
            }
        });
                
        socket.on('state', ({players, food, id}) => {
            this.gameState.playerId = String(id);
            this.gameState.updateState(players, food);
        });
                
        // Event listeners that will emit events so the gamestate object in the server is updated
        
        this.canvas.addEventListener('mousemove', (e) => {
            socket.emit('mouse-move', e.clientX, e.clientY, this.canvas.width, this.canvas.height);
        });
        
        this.addEventListener('gameOver', () => {
            socket.emit('game-over');
        });
        
        this.addEventListener('playerRadiusUpdate', () => {
            socket.emit('player-radius-update', this.gameState.players[this.gameState.playerId]);
        });
        
        this.addEventListener('foodUpdate', () => {
            socket.emit('food-update', this.gameState.foodCollection);
        });
        
        requestAnimationFrame(this.gameUpdate);
    }
    
    // checks this.gameState.players[this.gameState.playerId] is within the bounds of the map
    // if player isn't, then the main page reloads
    gameUpdate(currentTime){
        const isNotEmpty = Object.keys(this.gameState.players).length > 0;
        if(isNotEmpty && this.gameState.playerId){
            const player = this.gameState.players[this.gameState.playerId];
            
            const hasCrossedRight = player.x > (this.gameState.mapWidth - this.gameState.borderThickness) - player.radius;
            const hasCrossedLeft = player.x < this.gameState.borderThickness + player.radius;
            const hasCrossedBottom = player.y > (this.gameState.mapHeight - this.gameState.borderThickness) - player.radius;
            const hasCrossedTop = player.y < this.gameState.borderThickness + player.radius;
            
            const playerDead = hasCrossedRight || hasCrossedLeft || hasCrossedBottom || hasCrossedTop;
            if(playerDead){
                this.ctx.resetTransform();
                this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                const gameOverEvent = new CustomEvent('gameOver', { bubbles: true });
                this.dispatchEvent(gameOverEvent);
                return;
            }
            
            for(const [index, food] of this.gameState.foodCollection.foods.entries()){
                // Don't do anything if food has already been eaten by player
                if(food.isConsumed){ continue; }
                // Checks full overlap between player and food to determine if player eats food
                const foodIsConsumed = this.checkFullOverlap(player, food);
                
                if(foodIsConsumed){
                    this.gameState.foodCollection.foods[index].isConsumed = true;
                    // Dispatches event so the food collection in server is updated
                    this.dispatchEvent(new Event('foodUpdate', { bubbles: true }));
                    
                    const newPlayerArea = (Math.PI * (player.targetRadius * player.targetRadius)) + food.area;
                    const newPlayerRadius = Math.sqrt(newPlayerArea / Math.PI);
                    
                    if(player.targetRadius !== newPlayerRadius){
                        player.targetRadius = newPlayerRadius;
                        player.radius = Math.round(newPlayerRadius);
                        // Dispatches event so the the player's target radius and radius in server are updated
                        this.dispatchEvent(new Event('playerRadiusUpdate', { bubbles: true }));
                    }
                }
            }
            
            // TODO: after checking collision with food, check collision with player
            this.translateContext(player.view);
            this.redraw(this.gameState.players);
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
    
    redraw(players){
        // Border drawing
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = this.gameState.borderThickness;
        // Fits the whole border inside of our current map
        this.ctx.strokeRect(this.ctx.lineWidth / 2,
                            this.ctx.lineWidth / 2,
                            this.gameState.mapWidth - this.ctx.lineWidth,
                            this.gameState.mapHeight - this.ctx.lineWidth);
        
        for(const food of this.gameState.foodCollection.foods){
            // Styling of the circle itself
            if(food.isConsumed){ continue; }
            this.ctx.beginPath();
            this.ctx.arc(food.x, food.y, food.radius, 0, 2 * Math.PI);
            this.ctx.fillStyle = food.color;
            this.ctx.fill();
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            this.ctx.closePath();
        }
        
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
        
        // TODO: Draw all player names
    };
    
    // checks if food is entirely within player's boundaries
    // returns true if food is consumed, false otherwise
    checkFullOverlap(player, food){
        const rightOverlap = food.x + food.radius <= player.x + player.radius;
        const leftOverlap = food.x - food.radius >= player.x - player.radius;
        const bottomOverlap = food.y + food.radius <= player.y + player.radius;
        const topOverlap = food.y - food.radius >= player.y - player.radius;
        return rightOverlap && leftOverlap && bottomOverlap && topOverlap;
    }
}
customElements.define('orb-multiplayer', MultiplayerGame);
