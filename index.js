// let's import modules
import { Player } from './GameComponents/Player.js';
import { BidTable } from './GameComponents/BidTable.js';
import { Backlog } from './GameComponents/Backlog.js';
import { Statement } from './GameComponents/Statement.js';
import { Game } from './Game.js'


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