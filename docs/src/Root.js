import {AddStyle} from './Styles.js';
import Game from './Game.js';
import MultiplayerGame from './MultiplayerGame.js';

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

    orb-root .hidden{
        display: none;
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
                    <button class="multiplayer input-button">Multiplayer Mode</button>
                </div>
            </div>
        
            <orb-game class="hidden"></orb-game>
            <orb-multiplayer class="hidden"></orb-multiplayer>
        `;
        
                        
        this.querySelector('.single-player').addEventListener('click', () => {
            this.querySelector('.name-input-view').classList.add('hidden');
            this.querySelector('orb-game').classList.remove('hidden');
            this.querySelector('orb-game').startGame();
        });
        
        this.querySelector('.multiplayer').addEventListener('click', () => {
            this.innerHTML = '';
            this.style.width = 0;
            this.style.height = 0;
            document.querySelector('orb-multiplayer').style.width = '100vw';
            document.querySelector('orb-multiplayer').style.height = '100vh';
        });
    };
};
customElements.define('orb-root', Root);
