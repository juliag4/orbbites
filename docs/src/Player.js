export default class Player{
    constructor(id, x, y, radius, color){
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.maxSpeed = 3;
        
        this.view = {x: 0, y: 0};
    }
    
    // changes player's x and y position
    calculateMoves(mouseX, mouseY, viewX, viewY){
        const mouseXDiff = mouseX - (this.x - viewX);
        const mouseYDiff = mouseY - (this.y - viewY);
        
        const changeX = mouseXDiff <= 0 ? Math.max(mouseXDiff, -this.maxSpeed) : Math.min(mouseXDiff, this.maxSpeed);
        const changeY = mouseYDiff <= 0 ? Math.max(mouseYDiff, -this.maxSpeed) : Math.min(mouseYDiff, this.maxSpeed);
        
        this.x += changeX;
        this.y += changeY;
    }
    
    // TODO: create function for calculating new view or put into the function above
    
}

