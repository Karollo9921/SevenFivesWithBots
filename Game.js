import { convertBidToArray, SINGULAR, PLURAL } from './GameComponents/dictonary.js'
import { bidHierarchy, arraysIdentical, indexOf } from './GameComponents/bidHierarchy.js'


export class Game {

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
        this.round = 1;
        this.turn = 1;
        this.currentBid = [];
        this.numOfAllDices = this.players.length;
        this.randomizePlayersSlots();
    };
    
    startGame() {
        this.BidTable.table.style.visibility = 'hidden';
        this.btnRollTheDice.addEventListener('click', (e) => this.rollTheDice(e));
    };

    singleTurn(Player) {
        console.log("Turn: " + this.turn);
        console.log(this.currentBid);
        if (!Player.isBot & this.turn > 1) {
            
            this.btnRollTheDice.style.display = "none";
            this.btnCallHimLiar.style.display = "block";
            this.BidTable.table.style.visibility = 'visible';
            Array.from(document.getElementsByClassName('staking-btn')).forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.btnCallHimLiar.style.display = 'none';
                    
                    let positionOfCurrentBid = indexOf(bidHierarchy, this.currentBid, arraysIdentical);
                    let positionOfPlayerBid = indexOf(bidHierarchy, convertBidToArray(e.target.parentElement.children[0].textContent, e.target.textContent), arraysIdentical);

                    if (positionOfCurrentBid < positionOfPlayerBid) {
                        this.Backlog.setNewLog(this.playerTurn.nickname + ": " + e.target.parentElement.children[0].textContent + ' ' + e.target.textContent + " !")
                        this.turn = this.turn + 1;
                        this.playerPreviousTurn = this.playerTurn;
                        this.playerTurn = this.playersInGame()[(this.playersInGame().indexOf(this.playerTurn) + 1) % (this.playersInGame().length)];
                        this.Statement.setNewStatement(`Now it's ${this.playerTurn.nickname}'s turn!`);
                        this.currentBid = convertBidToArray(e.target.parentElement.children[0].textContent, e.target.textContent);
                        this.BidTable.table.style.visibility = 'hidden';
                        this.singleTurn(this.playerTurn);
                        e.stopImmediatePropagation();
                    } else {
                        this.Statement.setNewStatement(`You must Call Him A Liar or Up The Bid !`);
                        this.singleTurn(this.playerTurn);
                        e.stopImmediatePropagation();
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
                    this.BidTable.table.style.visibility = 'hidden';
                    if (this.playerTurn.numOfDices > 5) {
                        this.playerTurn.inGame = false;
                        this.Backlog.setNewLog(this.playerTurn.nickname + " lost and end his Game !");
                        this.playerTurn = this.playerPreviousTurn;
                    } else {
                        document.getElementsByClassName('dices')[0].innerHTML += `<div class="dice">?</div>`
                    }
                    this.btnOK.addEventListener('click', (e) => this.letsEndTheRound(e));
                    e.stopImmediatePropagation();
                } else {
                    this.playerPreviousTurn.numOfDices += 1;
                    this.Backlog.setNewLog(this.playerTurn.nickname + " calls " + this.playerPreviousTurn.nickname + " a Liar !");
                    this.Backlog.setNewLog("All Dices: " + this.allDicesInTurn().sort());
                    this.Backlog.setNewLog(this.playerPreviousTurn.nickname + " is a Liar, " + this.playerPreviousTurn.nickname + " gets extra Dice !");
                    if (this.playerPreviousTurn.numOfDices > 5) {
                        this.playerPreviousTurn.inGame = false;
                        this.Backlog.setNewLog(this.playerPreviousTurn.nickname + " lost and end his Game !");
                        document.getElementsByClassName("player")[this.players.indexOf(this.playerPreviousTurn)-1].children[0].style.color = "Red"
                        document.getElementsByClassName("player")[this.players.indexOf(this.playerPreviousTurn)-1].children[1].textContent = "Out of the Game"
                    } else {
                        console.log(document.getElementsByClassName("player")[this.players.indexOf(this.playerPreviousTurn)-1].children[1]);
                        document.getElementsByClassName("player")[this.players.indexOf(this.playerPreviousTurn)-1].children[1].textContent = `Number of Dices: ${this.playerPreviousTurn.numOfDices}`
                        this.playerTurn = this.playerPreviousTurn;
                    }
                    this.playerPreviousTurn = {};
                    this.Statement.setNewStatement(`Round is over, click "OK" to begin next Round`);
                    this.btnCallHimLiar.style.display = "none";
                    this.btnOK.style.display = "block";
                    this.BidTable.table.style.visibility = 'hidden';
                    this.btnOK.addEventListener('click', (e) => this.letsEndTheRound(e));
                    e.stopImmediatePropagation();
                }
            });

        }

        if (!Player.isBot & this.turn === 1) {
            this.BidTable.table.style.visibility = 'visible';
            Array.from(document.getElementsByClassName('staking-btn')).forEach(button => {
                button.addEventListener('click', (e) => {
                    let singularPartOfBid = e.target.parentElement.children[0].textContent;
                    let pluralPartOfBid = e.target.textContent;
                    this.Backlog.setNewLog(Player.nickname + ": " + singularPartOfBid + ' ' + pluralPartOfBid + " !")
                    this.turn = this.turn + 1;
                    this.playerPreviousTurn = Player;
                    this.playerTurn = this.playersInGame()[(this.playersInGame().indexOf(Player) + 1) % (this.playersInGame().length)];
                    this.Statement.setNewStatement(`Now it's ${this.playerTurn.nickname}'s turn!`);
                    this.currentBid = convertBidToArray(singularPartOfBid, pluralPartOfBid);
                    this.BidTable.table.style.visibility = 'hidden';
                    this.singleTurn(this.playerTurn);
                });
            });
        }

        if (Player.isBot & this.turn === 1) {
            this.Statement.setNewStatement(`Now it's ${this.playerTurn.nickname}'s turn!`);
            setTimeout(() => {
                this.Backlog.setNewLog(this.playerTurn.nickname + ": " + SINGULAR[0] + ' ' + PLURAL[this.playerTurn.dices[0] - 1] + " !")
                this.currentBid = convertBidToArray(SINGULAR[0], PLURAL[this.playerTurn.dices[0] - 1]);
                this.turn = this.turn + 1;
                this.playerPreviousTurn = this.playerTurn;
                this.playerTurn = this.playersInGame()[(this.playersInGame().indexOf(this.playerTurn) + 1) % (this.playersInGame().length)];
                this.Statement.setNewStatement(`Now it's ${this.playerTurn.nickname}'s turn!`);
                this.singleTurn(this.playerTurn);
            }, 1000)
        }

        if (Player.isBot & this.turn > 1) {
            this.Statement.setNewStatement(`Now it's ${this.playerTurn.nickname}'s turn!`);
            setTimeout(() => {
                if (Math.random()*10 > 5) {
                    let dicesfromBidTemp = this.allDicesInTurn().filter((el) => (el) === this.currentBid[0])
                    this.Backlog.setNewLog(Player.nickname + " calls " + this.playerPreviousTurn.nickname + " a Liar !");
                    if (dicesfromBidTemp.length >= this.currentBid.length) {
                        this.Backlog.setNewLog("All Dices: " + this.allDicesInTurn().sort());
                        this.Backlog.setNewLog(this.playerPreviousTurn.nickname + " is not a Liar, " + Player.nickname + " gets extra Dice !");
                        Player.numOfDices += 1
                        if (Player.numOfDices > 5) {
                            Player.inGame = false;
                            this.Backlog.setNewLog(Player.nickname + " lost and end his Game !");
                            document.getElementsByClassName("player")[this.players.indexOf(Player)-1].children[0].style.color = "Red"
                            document.getElementsByClassName("player")[this.players.indexOf(Player)-1].children[1].textContent = "Out of the Game"
                            this.playerTurn = this.playerPreviousTurn;
                        } else {
                            document.getElementsByClassName("player")[this.players.indexOf(this.playerTurn)-1].children[1].textContent = `Number of Dices: ${Player.numOfDices}`
                        }
                        this.Statement.setNewStatement(`Round is over, click "OK" to begin next Round`);
                        this.btnCallHimLiar.style.display = "none";
                        this.btnOK.style.display = "block";
                        this.BidTable.table.style.visibility = 'hidden';
                        this.btnOK.addEventListener('click', (e) => this.letsEndTheRound(e));
                    } else {
                        this.playerPreviousTurn.numOfDices += 1;
                        this.Backlog.setNewLog("All Dices: " + this.allDicesInTurn().sort());
                        this.Backlog.setNewLog(this.playerPreviousTurn.nickname + " is a Liar, " + this.playerPreviousTurn.nickname + " gets extra Dice !");
                        if (this.playerPreviousTurn.numOfDices > 5) {
                            this.playerPreviousTurn.inGame = false;
                            this.Backlog.setNewLog(this.playerPreviousTurn.nickname + " lost and end his Game !");
                            if (this.playerPreviousTurn.isBot) {
                                document.getElementsByClassName("player")[this.players.indexOf(this.playerPreviousTurn)-1].children[0].style.color = "Red"
                                document.getElementsByClassName("player")[this.players.indexOf(this.playerPreviousTurn)-1].children[1].textContent = "Out of the Game"
                            } 
                        } else {
                            this.playerTurn = this.playerPreviousTurn
                            if (this.playerPreviousTurn.isBot) {
                                document.getElementsByClassName("player")[this.players.indexOf(this.playerPreviousTurn)-1].children[1].textContent = `Number of Dices: ${this.playerPreviousTurn.numOfDices}`
                            } else {
                                document.getElementsByClassName('dices')[0].innerHTML += `<div class="dice">?</div>`
                            }
                        }
                        this.playerPreviousTurn = {};
                        this.Statement.setNewStatement(`Round is over, click "OK" to begin next Round`);
                        this.btnCallHimLiar.style.display = "none";
                        this.btnOK.style.display = "block";
                        this.BidTable.table.style.visibility = 'hidden';
                        this.btnOK.addEventListener('click', (e) => this.letsEndTheRound(e));
                    }
                } else {
                    let newBid = bidHierarchy[indexOf(bidHierarchy, this.currentBid, arraysIdentical) + 2];
                    this.Backlog.setNewLog(this.playerTurn.nickname + ": " + SINGULAR[newBid.length - 1] + ' ' + PLURAL[newBid[0] - 1] + " !")
                    this.turn = this.turn + 1;
                    this.playerPreviousTurn = this.playerTurn;
                    this.playerTurn = this.playersInGame()[(this.playersInGame().indexOf(this.playerTurn) + 1) % this.playersInGame().length];
                    this.Statement.setNewStatement(`Now it's ${this.playerTurn.nickname}'s turn!`);
                    this.currentBid = newBid;
                    this.singleTurn(this.playerTurn);
                }
            }, 1000)
        }
    };

    letsBeginTheRound(e) {
        this.currentBid = [];
        this.turn = 1;
        this.Statement.setNewStatement(`Now it's ${this.playerTurn.nickname}'s turn!`);
        this.Backlog.clearBacklog();
        this.Backlog.setNewLog(`It's Round ${this.round}, we have ${this.allDicesInTurn().length} dices in this Round !`);
        this.singleTurn(this.playerTurn);
        e.stopImmediatePropagation();
    };

    letsEndTheRound(e) {
        // e.preventDefault();
        this.turn = 1;
        this.round += 1;
        console.log(this.BidTable.table.children.length);
        console.log(this.allDicesInTurn().length);
        if (this.allDicesInTurn().length >= this.BidTable.table.children.length) {
            this.numOfAllDices = this.allDicesInTurn().length + 1;
            this.BidTable.addColumn(this.numOfAllDices);
            this.BidTable.table.style.gridTemplateColumns = `repeat(${this.numOfAllDices}, 1fr)`;  
        } else {
            this.BidTable.dropColumns(5);
            this.BidTable.table.style.gridTemplateColumns = `repeat(${this.BidTable.table.children.length}, 1fr)`;  
        }
        this.btnOK.style.display = "none";
        this.btnRollTheDice.style.display = "block";
        this.Backlog.clearBacklog();
        Array.from(document.getElementsByClassName("dice")).forEach((d) => {
            d.textContent = "?";
        });
        // e.stopPropation();
        if (this.playersInGame().length < 2) {
            this.Backlog.setNewLog(`Game is Over! The Winner is: ${this.playersInGame()[0].nickname}`)
            this.Statement.setNewStatement(`Game is Over! The Winner is: ${this.playersInGame()[0].nickname}`);
            this.btnRollTheDice.style.display = "none";
        } else {
            this.Statement.setNewStatement("ROLL THE DICE ! ^");
            this.btnRollTheDice.addEventListener('click', (e) => this.rollTheDice(e));
        }
        e.stopImmediatePropagation();
    };


    playersInGame() {
        return this.players.filter(player => player.inGame === true);
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

    rollTheDice(e) {
        this.players.forEach(Player => {
            for (let i = 1; i <= Player.numOfDices; i++) {
                Player.dices[i-1] = Math.ceil(Math.random() * 6)
            };
        });
        
        this.renderDices(this.getMainPlayer());
        this.btnRollTheDice.style.display = "none";
        this.letsBeginTheRound(e);
        e.stopImmediatePropagation();
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
        this.playersInGame().forEach(Player => {
            allDices = allDices.concat(Player.dices);
        });

        return allDices;
    }
};




