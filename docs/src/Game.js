import {AddStyle} from './Styles.js';

import FoodCollection from './FoodCollection.js';

AddStyle(`
    body{
        margin: 0;
    }

    orb-game{
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

export default class Game extends HTMLElement{
    constructor(){
        super();
        
        this.style.width = '100vw';
        this.style.height = '100vh';
        
        this.innerHTML = `
            <canvas></canvas>
        `;
                
        this.canvas = this.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.mousePos = {x: 45, y: 230};
        // Absolute starting position
        this.circlePosAbs = {x: 45, y: 230};
        
        this.view = {x: 0, y: 0};
        
        this.map = {width: 3000, height: 3000};
    };
    
    startGame(){
        // Changes mouse position based on mousemove event
        this.canvas.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });
        
        // Last time game updated
        this.lastTime = 0;
        // Interval at which the canvas redraws
        this.interval = 33;
        
        // Circle radius
        this.radius = 20;
        // Style for drawing circle border
        this.ctx.strokeStyle = 'black';
        
        // Initialize food collection
        this.snacks = new FoodCollection();

        this.gameUpdate = this.gameUpdate.bind(this);
        requestAnimationFrame(this.gameUpdate);
    }
    
    gameUpdate(currentTime){
        requestAnimationFrame(this.gameUpdate);
        
        const elapsed = currentTime - this.lastTime;

        if(elapsed > this.interval){
            this.lastTime = currentTime - (elapsed % this.interval);
            
            const playerAlive = this.circlePosAbs.x <= (this.map.width - 40) && this.circlePosAbs.x >= 40 && this.circlePosAbs.y <= (this.map.height - 40) && this.circlePosAbs.y >= 40;
            if(!playerAlive){
                location.href = location.href.replace('game.html', '');
                return;
            }
            this.calculateMoves();
            this.redrawPlayer();
        }
    };
    
    calculateMoves(){
        // Previous view position
        const prevViewX = this.view.x;
        const prevViewY = this.view.y;
        // Calculates how far to move the circle
        const xDiff = this.mousePos.x - (this.circlePosAbs.x - this.view.x);
        const yDiff = this.mousePos.y - (this.circlePosAbs.y - this.view.y);
        
        const maxSpeed = 3;
        
        const changeX = xDiff <= 0 ? Math.max(xDiff, -maxSpeed) : Math.min(xDiff, maxSpeed);
        const changeY = yDiff <= 0 ? Math.max(yDiff, -maxSpeed) : Math.min(yDiff, maxSpeed);
        
        this.circlePosAbs.x += changeX;
        this.circlePosAbs.y += changeY;
      
        this.view.x = this.circlePosAbs.x - this.canvas.width / 2;
        this.view.y = this.circlePosAbs.y - this.canvas.height / 2;
        
        // Check to ensure that view x and y aren't outside of of canvas boundaries
        this.view.x = Math.max(0, Math.min(this.view.x, this.map.width - this.canvas.width));
        this.view.y = Math.max(0, Math.min(this.view.y, this.map.height - this.canvas.height));
        
        // Undo the transform
        this.ctx.resetTransform();
        
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Move the view window
        this.ctx.translate(-this.view.x, -this.view.y);
    };
    
    redrawPlayer(){
        this.ctx.fillStyle = 'lightblue';
        this.ctx.fillRect(this.view.x, this.view.y, window.innerWidth, window.innerHeight);
        
        // Styling of the circle itself
        this.ctx.beginPath();
        this.ctx.arc(this.circlePosAbs.x, this.circlePosAbs.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'purple';
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();
    };
};
customElements.define('orb-game', Game);
