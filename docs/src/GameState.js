import Player from './Player.js';

export default class GameState{
    constructor(){
        this.mapWidth = 3000;
        this.mapHeight = 3000;
        this.borderThickness = 40;
        this.initialPlayerRadius = 20;

        this.players = {};
        this.foodCollection = {};
        
        this.playerId = null;
    };
    
    updateState(players, foodCollection){
        this.players = players;
        this.foodCollection = foodCollection;
    }
    
    addPlayer(id){
        const xPos = Math.floor(Math.random() * ((this.mapWidth - this.initialPlayerRadius -
            this.borderThickness) - this.initialPlayerRadius - this.borderThickness)) + this.initialPlayerRadius + this.borderThickness;
        const yPos = Math.floor(Math.random() * ((this.mapHeight - this.initialPlayerRadius) - this.initialPlayerRadius)) + this.initialPlayerRadius;
        const color = this.getRandomRGB();
        
        this.players[String(id)] = new Player(String(id), xPos, yPos, this.initialPlayerRadius, color);
    }
    
    deletePlayer(id){
        delete this.players[String(id)];
    }
    
    getRandomRGB() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r}, ${g}, ${b})`;
    }
    
    getPlayerId(){
        return this.players[this.playerId] || null;
    }
    
    // TODO: collision checking
};
