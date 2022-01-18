import Piece from "./Piece";

export class Knight extends Piece {
    constructor(player) {
        super(player, player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chess_nlt45.svg/68px-Chess_nlt45.svg.png" : "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Chess_ndt45.svg/68px-Chess_ndt45.svg.png")
        this.name = "Knight";
        this.hasMoved = false;
    }
    handleMoved() {
        this.hasMoved = true;
    }
    getName = () => {
        return this.name;
    }
    isMoveValid(initialposition, endingposition) {
        if (initialposition + 6 === endingposition || initialposition - 6 === endingposition || initialposition + 10 === endingposition || initialposition - 10 === endingposition || initialposition + 15 === endingposition || initialposition - 15 === endingposition || initialposition + 17 === endingposition || initialposition - 17 === endingposition) {
            return true;
        }
        return false;
    }
    getPathIndicies = (initialposition, endingposition) => {
        return [];
    }
}