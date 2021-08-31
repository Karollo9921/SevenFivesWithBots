import { Player } from './Player.js';


class Game {
    constructor({ btnRollTheDice }) {
        this.btnRollTheDice = btnRollTheDice;
        this.startGame();
    }


    startGame() {
        setPlayers();
        this.btnRollTheDice.addEventListener('click', (e) => this.rollTheDice());
    }

    setPlayers() {
        
    }

    rollTheDice() {

    }



}


const game = new Game({
    btnRollTheDice: document.getElementById('roll')
});

game.startGame();
