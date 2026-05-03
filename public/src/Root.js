import {AddStyle} from './Styles.js';

AddStyle(`
    circle-root{
        display: flex;
        width: 100vw;
        height: 100vh;
        margin: 0;
        font-family: sans-serif;
    }

    circle-root .name-input-view{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
    }

    circle-root .header{
        display: flex;
        color: steelblue;
        font-size: 50px;
        font-weight: bold;
        position: absolute;
        top: 0;
    }

    circle-root .input-button-container{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 40px;
    }

    circle-root .input-button{
        padding: 5px;
        border: 1px solid black;
        border-radius: 3px;
        font-size: 18px;
    }

    circle-root .username{
        display: flex;
        background-color: lightgrey;
    }

    circle-root .single-play, circle-root .multi-play{
        display: flex;
        justify-content: center;
        width: 80%;
        background-color: steelblue;
        color: white;
        cursor: pointer;
    }

    circle-root .single-play:hover, .multi-play:hover{
        filter: brightness(0.7);
    }
`);

class Root extends HTMLElement{
    constructor(){
        super();
        this.innerHTML = `
          <div class="name-input-view">
              <div class="header">Circles</div>
              <div class="input-button-container">
                  <input class="username input-button" placeholder="Name" spellcheck="false"></input>
                  <button class="single-play input-button">Single Player Mode</button>
                   <button class="multi-play input-button">Multi Player Mode</button>
              </div>
          </div>
        `;
        this.querySelector('.single-play').addEventListener('click', () => location.href += 'game.html');
        
        this.querySelector('.multi-play').addEventListener('click', () => {
            let gameMode = 'multiPlayer';
            let playerNum = 0;
            const socket = io();
            
            // Get your player number
            socket.on('player-number', num => {
                if(num === -1){
                    console.log('Sorry the server is full');
                }else{
                    playerNum = parseInt(num);
                    console.log(playerNum);
                }
            });
            
            // Another player has connected or disconnected
            socket.on('player-connection', num => {
                console.log(`Player number ${num} has connected or disconnected`);
            });
            location.href += 'game.html';
        });
        
    };
};
customElements.define('circle-root', Root);
