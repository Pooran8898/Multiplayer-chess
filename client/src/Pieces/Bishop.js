import Piece from "./Piece";

export class Bishop extends Piece {
    constructor(player) {
        super(player, player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chess_blt45.svg/68px-Chess_blt45.svg.png" : "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chess_bdt45.svg/68px-Chess_bdt45.svg.png")
        this.name = "Bishop";
        this.hasMoved = false;
    }
    handleMoved() {
        this.hasMoved = true;
    }
    getName() {
        return this.name
    }
    isMoveValid(initialposition, endingposition) {
        const diff = Math.abs(endingposition - initialposition);
        return (diff % 9 === 0 || diff % 7 === 0);
    }
    getPathIndicies(initialposition, endingposition) {
        let indices = [];
        let increment;
        const diff = Math.abs(endingposition - initialposition);
        if (diff % 9 === 0) {
            increment = 9;
        }
        else if (diff % 7 === 0) {
            increment = 7;
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