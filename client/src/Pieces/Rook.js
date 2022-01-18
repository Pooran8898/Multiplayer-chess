import Piece from "./Piece";


export class Rook extends Piece {
    constructor(player) {
        super(player, player === 1 ? "" : "")
        this.hasMoved = false;
        this.name = "Rook";
    }
}