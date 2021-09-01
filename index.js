import { convertBidToArray, SINGULAR, PLURAL } from './GameComponents/dictonary.js'
import { bidHierarchy, arraysIdentical, indexOf } from './GameComponents/bidHierarchy.js'
import { Player } from './GameComponents/Player.js';
import { BidTable } from './GameComponents/BidTable.js';
import { Backlog } from './GameComponents/Backlog.js';
import { Statement } from './GameComponents/Statement.js';


class Game {

    constructor({ btnRollTheDice, btnCallHimLiar, btnOK, players, Statement, Backlog, BidTable }) {
        this.btnRollTheDice = btnRollTheDice;
        this.btnCallHimLiar = btnCallHimLiar;
        this.btnOK = btnOK;
        this.players = players;
        this.Statement = Statement;
        this.Backlog = Backlog;
        this.BidTable = BidTable;
        this.playerTurn = this.players[Math.ceil(Math.random() * 4) - 1]
        this.playerPreviousTurn = {};
        this.round = 0;
        this.turn = 1;
        this.currentBid = [];
        this.numOfAllDices = this.players.length;
        this.randomizePlayersSlots();
    };
    
    startGame() {
        this.btnRollTheDice.addEventListener('click', (e) => this.rollTheDice());
    };

    singleTurn(Player) {
        console.log(this.allDicesInTurn());
        if (!Player.isBot & this.turn > 1) {
            
            this.btnCallHimLiar.style.display = "block";
            Array.from(document.getElementsByClassName('staking-btn')).forEach(button => {
                button.addEventListener('click', (e) => {

                    let positionOfCurrentBid = indexOf(bidHierarchy, this.currentBid, arraysIdentical);
                    let positionOfPlayerBid = indexOf(bidHierarchy, convertBidToArray(e.target.parentElement.children[0].textContent, e.target.textContent), arraysIdentical); 

                    if (positionOfCurrentBid < positionOfPlayerBid & !Player.isBot & this.turn > 1) {
                        this.Backlog.setNewLog(this.playerTurn.nickname + ": " + e.target.parentElement.children[0].textContent + ' ' + e.target.textContent + " !")
                        this.turn = this.turn + 1;
                        this.playerPreviousTurn = this.playerTurn;
                        this.playerTurn = this.players[(this.players.indexOf(this.playerTurn) + 1) % 4];
                        this.Statement.setNewStatement(`Now it's ${this.playerTurn.nickname}'s turn!`);
                        this.currentBid = convertBidToArray(e.target.parentElement.children[0].textContent, e.target.textContent);
                        this.singleTurn(this.playerTurn);
                    }
                });
            });
            
            this.btnCallHimLiar.addEventListener('click', (e) => {
                let dicesfromBidTemp = this.allDicesInTurn().filter((el) => (el) === this.currentBid[0])
                
                if (dicesfromBidTemp.length >= this.currentBid.length) {
                    this.playerTurn.numOfDices += 1;
                    this.Backlog.setNewLog(this.playerTurn.nickname + " calls " + this.playerPreviousTurn.nickname + " a Liar !");
                    this.Backlog.setNewLog("All Dices: " + this.allDicesInTurn().sort());
                    this.Backlog.setNewLog(this.playerPreviousTurn.nickname + " is not a Liar, " + this.playerTurn.nickname + " gets extra Dice !");
                    this.Statement.setNewStatement(`Round is over, click "OK" to begin next Round`);
                    this.btnCallHimLiar.style.display = "none";
                    this.btnOK.style.display = "block";
                    this.btnOK.addEventListener('click', (e) => this.letsEndTheRound());
                } else {
                    this.playerPreviousTurn.numOfDices += 1;
                    this.Backlog.setNewLog(this.playerTurn.nickname + " calls " + this.playerPreviousTurn.nickname + " a Liar !");
                    this.Backlog.setNewLog("All Dices: " + this.allDicesInTurn().sort());
                    this.Backlog.setNewLog(this.playerPreviousTurn.nickname + " is a Liar, " + this.playerPreviousTurn.nickname + " gets extra Dice !");
                    this.playerTurn = this.playerPreviousTurn;
                    this.playerPreviousTurn = {};
                    this.Statement.setNewStatement(`Round is over, click "OK" to begin next Round`);
                    this.btnCallHimLiar.style.display = "none";
                    this.btnOK.style.display = "block";
                    this.btnOK.addEventListener('click', (e) => this.letsEndTheRound());
                }
            });

        }

        if (!Player.isBot & this.turn === 1) {
            Array.from(document.getElementsByClassName('staking-btn')).forEach(button => {
                button.addEventListener('click', (e) => {
                    this.Backlog.setNewLog(this.playerTurn.nickname + ": " + e.target.parentElement.children[0].textContent + ' ' + e.target.textContent + " !")
                    this.turn = this.turn + 1;
                    this.playerPreviousTurn = this.playerTurn;
                    this.playerTurn = this.players[(this.players.indexOf(this.playerTurn) + 1) % 4];
                    this.Statement.setNewStatement(`Now it's ${this.playerTurn.nickname}'s turn!`);
                    this.currentBid = convertBidToArray(e.target.parentElement.children[0].textContent, e.target.textContent);
                    this.singleTurn(this.playerTurn);
                });
            });
        }

        if (Player.isBot & this.turn === 1) {
            this.Statement.setNewStatement(`Now it's ${this.playerTurn.nickname}'s turn!`);
            setTimeout(() => {
                this.Backlog.setNewLog(this.playerTurn.nickname + ": " + SINGULAR[0] + ' ' + PLURAL[this.playerTurn.dices[0] - 1] + " !")
                this.turn = this.turn + 1;
                this.playerPreviousTurn = this.playerTurn;
                this.playerTurn = this.players[(this.players.indexOf(this.playerTurn) + 1) % 4];
                this.Statement.setNewStatement(`Now it's ${this.playerTurn.nickname}'s turn!`);
                this.currentBid = convertBidToArray(SINGULAR[0], PLURAL[this.playerTurn.dices[0] - 1]);
                this.singleTurn(this.playerTurn);
            }, 5000)
        }

        if (Player.isBot & this.turn > 1) {
            this.Statement.setNewStatement(`Now it's ${this.playerTurn.nickname}'s turn!`);
            setTimeout(() => {
                



                let positionOfCurrentBid = indexOf(bidHierarchy, this.currentBid, arraysIdentical);
                let positionOfPlayerBid = indexOf(bidHierarchy, convertBidToArray(SINGULAR[0], PLURAL[this.playerTurn.dices[0] - 1]), arraysIdentical);          

            }, 5000)



        }
    };

    letsBeginTheRound() {
        this.turn = 1;
        this.round += 1;
        this.Statement.setNewStatement(`Now it's ${this.playerTurn.nickname}'s turn!`);
        this.Backlog.setNewLog(`It's Round ${this.round}, we have ${this.numOfAllDices} dices in this Round !`);
        this.btnRollTheDice.style.display = "none";
        this.singleTurn(this.playerTurn);
    };

    letsEndTheRound() {
        this.BidTable.addColumn(this.numOfAllDices + 1);
        this.btnOK.style.display = "none";
        this.btnRollTheDice.style.display = "block";
        this.Statement.setNewStatement("ROLL THE DICE ! ^");
        Array.from(document.getElementsByClassName("dice")).forEach((d) => {
            d.textContent = "?";
        });
        letsBeginTheRound();
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
        
        this.renderDices(this.getMainPlayer());

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

    allDicesInTurn() {
        var allDices = [];
        this.players.forEach(Player => {
            allDices = allDices.concat(Player.dices);
        });
        console.log(allDices);

        return allDices;
    }
};



// let's initialize the game
const game = new Game({
    btnRollTheDice: document.getElementById('roll'),
    btnCallHimLiar: document.getElementById('call'),
    btnOK: document.getElementById('ok'),
    players: [
        new Player('YOU', false), 
        new Player('DAVY JONES', true), 
        new Player('BILL TURNER', true), 
        new Player('WILLIAM', true)
    ],
    Statement: new Statement(document.getElementsByClassName('statement')[0]),
    Backlog: new Backlog(document.getElementsByClassName('backlog')[0]),
    BidTable: new BidTable(document.getElementsByClassName('grid-table')[0])
});






game.startGame();
