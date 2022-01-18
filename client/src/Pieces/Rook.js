import Piece from "./Piece";


export class Rook extends Piece {
    constructor(player) {
        super(player, player === 1 ? "" : "")
        this.hasMoved = false;
        this.name = "Rook";
    }
    handleMoved() {
        this.hasMoved = true;
    }

    moved() {
        return this.hasMoved;
    }

    getName() {
        return this.name;
    }
    isMoveValid = (initialPos, endPos) => {
        const mod = initialPos % 8;
        const diff = 8 - mod;

        return (
            Math.abs(initialPos - endPos) % 8 === 0 ||
            (endPos >= (initialPos - mod) && endPos < (initialPos + diff))
        )
    }

    getPathIndicies = (initialPos, endPos) => {
        const diff = Math.abs(endPos - initialPos);
        var increment;
        var indicies = [];

        if (diff % 8 === 0) {
            increment = 8;
        }

        else {
            increment = 1;
        }

        if (endPos > initialPos) {
            for (var i = initialPos + increment; i < endPos; i += increment) {
                indicies.push(i);
            }
        }

        else {
            for (i = initialPos - increment; i > endPos; i -= increment) {
                indicies.push(i);
            }
        }

        return indicies;
    }
}