import Piece from "./Piece";

export class King extends Piece {
    constructor(player) {
        super(player, player === 1 ? "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg" : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/68px-Chess_kdt45.svg.png");
        this.name = "King";
        this.hasMoved = false
    }
    handleMoved() {
        this.hasMoved = true;
    }
    moved() {
        return this.hasMoved;
    }
    isMoveValid(initialposition, endingposition) {
        if (initialposition + 1 === endingposition || initialposition - 1 === endingposition || initialposition + 7 === endingposition || initialposition - 7 === endingposition || initialposition + 8 === endingposition || initialposition - 8 === endingposition || initialposition + 9 === endingposition || initialposition - 9 === endingposition) {
            return true;
        }
        return false
    }
    getPathIndicies = (initialPos, endPos) => {
        return [];
    }
    getName = () => {
        return this.name;
    }
}
