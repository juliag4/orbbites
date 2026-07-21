import Food from './Food.js';

export default class FoodCollection {
    constructor(){
        this.foods = [];
    }
    
    addFood(x, y, radius, color){
        this.foods.push(new Food(x, y, radius, color));
    }
}
