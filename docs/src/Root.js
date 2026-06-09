import {AddStyle} from './Styles.js';
import Game from './Game.js';

AddStyle(`
    orb-root{
        display: flex;
        width: 100vw;
        height: 100vh;
        margin: 0;
        font-family: sans-serif;
    }

    orb-root .name-input-view{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    orb-root .header{
        display: flex;
        color: steelblue;
        font-size: 50px;
        font-weight: bold;
        position: absolute;
        top: 0;
    }

    orb-root .input-button-container{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 40px;
    }

    orb-root .input-button{
        padding: 5px;
        border: 1px solid black;
        border-radius: 3px;
        font-size: 18px;
    }

    orb-root .username{
        display: flex;
        background-color: lightgrey;
    }

    orb-root .single-player, orb-root .multiplayer{
        display: flex;
        justify-content: center;
        width: 80%;
        background-color: steelblue;
        color: white;
        cursor: pointer;
    }

    orb-root .single-player:hover, .multiplayer:hover{
        filter: brightness(0.7);
    }
`);

class Root extends HTMLElement{
    constructor(){
        super();
        this.innerHTML = `
            <div class="name-input-view">
                <div class="header">OrbBites</div>
                <div class="input-button-container">
                    <input class="username input-button" placeholder="Name" spellcheck="false"></input>
                    <button class="single-player input-button">Single Player Mode</button>
                    <button class="multiplayer input-button">Multi Player Mode</button>
                </div>
            </div>
        `;
        
        this.querySelector('.single-player').addEventListener('click', () => location.href += 'game.html');
        
        this.querySelector('.multiplayer').addEventListener('click', () => {
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
            });
            
            //location.href += 'multiplayergame.html';
        });
        
    };
};
customElements.define('orb-root', Root);
