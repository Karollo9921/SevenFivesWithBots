import * as dictonary from './dictonary.js'

export class BidTable {
    constructor(table) {
        this.table = table
    };

    addColumn(columnNumber) {
        this.table.innerHTML += `<div class="column-${columnNumber}">
                                    <p class="staking-header">${dictonary[columnNumber-1]}</p>
                                    <button class="staking-btn">ONES</button><br>
                                    <button class="staking-btn">TWOS</button><br>
                                    <button class="staking-btn">THREES</button><br>
                                    <button class="staking-btn">FOURS</button><br>
                                    <button class="staking-btn">FIVES</button><br>
                                    <button class="staking-btn">SIXES</button>
                                </div>`
    }
};