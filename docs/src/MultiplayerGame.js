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
        
        let gameMode = 'multiPlayer';
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
            console.log('all players', players);
            console.log('client player num', playerNum);
        });
        
        
    }
}
customElements.define('orb-multiplayer', MultiplayerGame);
