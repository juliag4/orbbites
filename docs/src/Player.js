export default class Player{
    constructor(id, x, y, radius, color){
        this.id = id;
        this.x = x;
        this.y = y;
        this.mouseX = x;
        this.mouseY = y;
        this.radius = radius;
        this.color = color;
        this.maxSpeed = 3;
        
        this.view = {x: 0, y: 0};
    }
    
    // changes player's x and y position
    calculateMoves(mouseX, mouseY){
        const mouseXDiff = mouseX - (this.x - this.view.x);
        const mouseYDiff = mouseY - (this.y - this.view.y);
        
        const changeX = mouseXDiff <= 0 ? Math.max(mouseXDiff, -this.maxSpeed) : Math.min(mouseXDiff, this.maxSpeed);
        const changeY = mouseYDiff <= 0 ? Math.max(mouseYDiff, -this.maxSpeed) : Math.min(mouseYDiff, this.maxSpeed);
        
        this.x += changeX;
        this.y += changeY;
    }
    
    // calculate's player's view
    calculateView(canvasWidth, canvasHeight){
        this.view.x = this.x - canvasWidth / 2;
        this.view.y = this.y - canvasHeight / 2;
    }
    
    // adjust player's view to canvas
    adjustView(canvasWidth, canvasHeight, mapWidth, mapHeight){
        // Check to ensure that view x and y aren't outside of of canvas boundaries
        this.view.x = Math.max(0, Math.min(this.view.x, mapWidth - canvasWidth));
        this.view.y = Math.max(0, Math.min(this.view.y, mapHeight - canvasHeight));
    }
}

