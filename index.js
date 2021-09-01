import * as dictonary from './GameComponents/dictonary.js'
import { Player } from './GameComponents/Player.js';
import { StakingTable } from './GameComponents/StakingTable.js';
import { Backlog } from './GameComponents/Backlog.js';
import { Statement } from './GameComponents/Statement.js';



class Game {

    constructor({ btnRollTheDice, btnCallHimLiar, players, Statement, Backlog, StakingTable }) {
        this.btnRollTheDice = btnRollTheDice;
        this.btnCallHimLiar = btnCallHimLiar;
        this.players = players;
        this.Statement = Statement;
        this.Backlog = Backlog;
        this.StakingTable = StakingTable;
        this.playerTurn = this.players[Math.ceil(Math.random() * 4) - 1]
        this.round = 1;
        this.turn = 1;
        this.currentStake = [];
        this.numOfAllDices = this.players.length;
        this.randomizePlayersSlots();
    };
    
    startGame() {
        this.btnRollTheDice.addEventListener('click', (e) => this.rollTheDice());
    };

    singleTurn(Player) {
        if (!Player.isBot & this.turn > 1) {
            this.btnCallHimLiar.style.visibility = "visible";
            Array.from(document.getElementsByClassName('staking-btn')).forEach(button => {
                button.addEventListener('click', (e) => {
                    console.log(e.target.parentElement.children[0].textContent + ' ' + e.target.textContent);
                })
            });

        }
    };

    letsBeginTheRound() {
        this.Statement.setNewStatement(`Now it's ${this.playerTurn.nickname}'s turn!`);
        this.Backlog.setNewLog(`It's Round ${this.round}, we have ${this.numOfAllDices} dices in this Round !`);
        this.btnRollTheDice.style.display = "none";

        this.singleTurn(this.playerTurn);

    };

    letsEndTheRound() {

    };
    
    randomizePlayersSlots() {
        for (let i = this.players.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random()*(i) + 1);
			let temp = this.players[i];
			this.players[i] = this.players[j];
			this.players[j] = temp;
            document.getElementsByClassName("player")[i-1].children[0].textContent = this.players[i].nickname;
		}

		return this.players;
    };

    rollTheDice() {
        this.players.forEach(Player => {
            for (let i = 1; i <= Player.numOfDices; i++) {
                Player.dices[i-1] = Math.ceil(Math.random() * 6)
            };
        });
        
        let mainPlayer = this.getMainPlayer();
        this.renderDices(mainPlayer);

        this.letsBeginTheRound();
    };

    getMainPlayer() {
        return this.players.filter((Player) => { return Player.isBot === false })[0]
    };

    renderDices(Player) {
        for (let i = 0; i < Player.dices.length; i++) {
            document.getElementsByClassName("dice")[i].textContent = Player.dices[i]
        }
    };
};



// let's initialize the game
const game = new Game({
    btnRollTheDice: document.getElementById('roll'),
    btnCallHimLiar: document.getElementById('call'),
    players: [
        new Player('YOU', false), 
        new Player('DAVY JONES', true), 
        new Player('BILL TURNER', true), 
        new Player('WILLIAM', true)
    ],
    Statement: new Statement(document.getElementsByClassName('statement')[0]),
    Backlog: new Backlog(document.getElementsByClassName('backlog')[0]),
    StakingTable: new StakingTable(document.getElementsByClassName('grid-table')[0])
});






game.startGame();
