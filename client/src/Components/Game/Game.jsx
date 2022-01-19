import React, { useState, useContext, useEffect } from "react";
import useSound from "use-sound";
import chessSound from "./chess_move.mp3";
import { initializeChessBoard } from "../../Helpers/InitializeChessBoard";
import { Board } from "../Board/Board";
import { Datacontext } from "../../Context/Datacontext";



export const Game = () => {
    const [squares, setSquares] = useState(initializeChessBoard(1));
    const [playerTurn, setPlayerTurn] = useState(1);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [usernames, setUsernames] = useState([]);
    const [start, setStart] = useState(false);
    const [playSound] = useSound(chessSound);
    const [checkmate, setCheckmate] = useState(false);
    const [open, setOpen] = useState(false);
    const [clickRematch, setClickRematch] = useState(false);
    const [pawnToQueenIndex, setPawnToQueenIndex] = useState(-1);
    const { username, socket, gameId } = useContext(Datacontext)

    useEffect(() => {
        socket.emit("shouldGameStart", gameId);

        socket.on("start game", (users) => {
            setStart(true);
            setUsernames(users);
        })
    }, [])

    const handleClick = (index) => {
        let player = usernames[0] === username ? 1 : 2;
        if (player === playerTurn) {
            let tempsquares = squares.slice();
            if (selectedIndex < 0) {
                if (tempsquares[index] && tempsquares[index].player === playerTurn) {

                }
                else if (tempsquares[index] && tempsquares[index].player !== playerTurn) {
                    console.log("Not Your Piece");
                }
                else {
                    console.log("There is no Piece");
                }
            }
        }
    }
    return (
        <>
            <Board onClick={(index) => handleClick(index)} squares={squares} player={usernames[0] === username ? 1 : 2} />
        </>
    )
}