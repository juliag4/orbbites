export default class Food {
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.area = Math.round(Math.PI * (this.radius * this.radius));
        this.color = color;
        this.isConsumed = false;
    }
}
