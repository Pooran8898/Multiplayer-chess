import React, { useState } from "react";
import useSound from "use-sound";
import chessSound from "./chess_move.mp3";



export const Game = () => {
    const [squares, setSquares] = useState("");
    const [playerTurn, setPlayerTurn] = useState(1);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [usernames, setUsernames] = useState([]);
    const [start, setStart] = useState(false);
    const [playSound] = useSound(chessSound);
    const [checkmate, setCheckmate] = useState(false);
    const [open, setOpen] = useState(false);
    const [clickRematch, setClickRematch] = useState(false);
    const [pawnToQueenIndex, setPawnToQueenIndex] = useState(-1);

    return (
        <>
            <h1>Game</h1>
        </>
    )
}