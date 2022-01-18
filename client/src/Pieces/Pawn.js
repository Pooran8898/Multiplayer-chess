import Piece from "./Piece";


export class Pawn extends Piece {
    constructor(player) {
        super(player, player === 1 ? "" : "");
        this.initialPositions = {
            1: [48, 49, 50, 51, 52, 53, 54, 55],
            2: [8, 9, 10, 11, 12, 13, 14, 15]
        };
        this.name = "Pawn";
        this.hasMoved = false;
        this.doubleJump = false;
    }
    handleMoved() {
        this.hasMoved = true;
    }
    getName = () => {
        return this.name;
    }
    isMoveValid(initialposition, endingposition, endingpositionocc) {
        if (this.player === 1) {
            if ((endingposition === initialposition - 8 && !endingpositionocc)) {
                return true
            }
            else if ((endingposition === initialposition - 16 && this.initialPositions[1].indexOf(initialposition) >= 0 && !endingpositionocc)) {
                return true;
            }
            else if ((endingposition === initialposition - 7 || endingposition === initialposition - 9) && endingpositionocc) {
                return true;
            }
        }
        else {
            if ((endingposition === initialposition + 8 && !endingpositionocc)) {
                return true
            }
            else if ((endingposition === initialposition + 16 && this.initialPositions[2].indexOf(initialposition) >= 0)) {
                return true;
            }
            else if ((endingposition === initialposition + 7 || endingposition === initialposition + 9) && endingpositionocc) {
                return true;
            }
        }
    }
    getPathIndices(initialposition, endingposition) {
        let indices = [];
        if (endingposition - initialposition === 16) {
            indices.push(initialposition + 8);
        }
        else if (initialposition - endingposition === 16) {
            indices.push(initialposition - 8);
        }
        return indices;
    }
}

