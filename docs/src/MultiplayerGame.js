import {AddStyle} from './Styles.js';

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
        background-color: lightblue;
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
        
        socket.on('state', ({players, food}) => {
            // Draw everything here
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = 'lightblue';
            this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
            
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
        });
                
        // event listener for mouse move
        this.canvas.addEventListener('mousemove', (e) => {
            socket.emit('mouse-move', e.clientX, e.clientY, this.canvas.width, this.canvas.height);
            // Next step: move view window
        });
    }
}
customElements.define('orb-multiplayer', MultiplayerGame);
