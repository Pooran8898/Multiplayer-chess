import Piece from "./Piece";


export class Queen extends Piece {
    constructor(player) {
        super(player, player === 1 ? "" : "")
        this.name = "Queen";
        this.hasMoved = false;
    }
    handleMoved() {
        this.hasMoved = true;
    }
    getName = () => {
        return this.name;
    }
    isMoveValid(initialposition, endingposition) {
        let diff = Math.abs(endingposition - initialposition);
        return (
            diff % 9 === 0 ||
            diff % 8 === 0 ||
            diff % 7 === 0 ||
            diff < 8
        );
    }
    getPathIndicies(initialposition, endingposition) {
        let indices = [];
        let increment;
        let diff = Math.abs(endingposition - initialposition);
        if (diff % 9 === 0) {
            increment = 9;
        }
        else if (diff % 8 === 0) {
            increment = 8;
        }
        else if (diff % 7 === 0) {
            increment = 7;
        }
        else {
            increment = 1;
        }
        if (endingposition > initialposition) {
            for (let i = initialposition + increment; i < endingposition; i += increment) {
                indices.push(1);
            }
        }
        else {
            for (let i = initialposition - increment; i > endingposition; i -= increment) {
                indices.push(1);
            }
        }
        return indices;
    }
}