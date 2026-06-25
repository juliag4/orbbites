export default class Player{
    constructor(id, x, y, radius, color){
        this.id = id;
        this.x = x;
        this.y = y;
        this.view = {x: 0, y: 0};
        this.radius = radius;
        this.color = color;
    }
    
    calculateMoves(mouseX, mouseY){
        // TODO: Calculate where player is going to move
        // TODO: Set this.x, this.y to that calculated position
    }
    
}

