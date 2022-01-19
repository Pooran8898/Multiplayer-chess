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

    const checkEnPassant = (squares, index) => {
        const enPassantPositions = {
            1: [24, 25, 26, 27, 28, 29, 30, 31],
            2: [32, 33, 34, 35, 36, 37, 38, 39]
        }

        const otherPlayer = playerTurn === 1 ? 2 : 1;

        if (squares[selectedIndex].name === "Pawn" && enPassantPositions[1].indexOf(selectedIndex) >= 0 && playerTurn === 1) {

            if (squares[selectedIndex - 1] !== null && squares[selectedIndex - 1].name === "Pawn" && squares[selectedIndex - 1].player === otherPlayer && squares[selectedIndex - 1].doublejump &&
                index === selectedIndex - 9) {
                return true
            }
            if (squares[selectedIndex + 1] !== null && squares[selectedIndex + 1].name === "Pawn" && squares[selectedIndex + 1].player === otherPlayer && squares[selectedIndex + 1].doublejump &&
                index === selectedIndex - 7) {
                return true
            }
        }
        if (squares[selectedIndex].name === "Pawn" && enPassantPositions[2].indexOf(selectedIndex) >= 0 && playerTurn === 2) {
            if (squares[selectedIndex - 1] !== null && squares[selectedIndex - 1].name === "Pawn" && squares[selectedIndex - 1].player === otherPlayer && squares[selectedIndex - 1].doubleJump && index === selectedIndex + 7) {
                return true;
            }
            if (squares[selectedIndex - 1] !== null && squares[selectedIndex - 1].name === "Pawn" && squares[selectedIndex - 1].player === otherPlayer && squares[selectedIndex - 1].doubleJump && index === selectedIndex + 9) {
                return true;
            }
        }
        return false;
    }

    const checkRook = (squares, index) => {
        if (index === 6 || index === 62) {
            if (squares[index + 1].name === "Rook" && !squares[index + 1].moved()) {
                return true;
            }
        }
        if (index === 2 || index === 58) {
            if (squares[index - 2].name === "Rook" && !squares[index - 2].moved()) {
                return true;
            }
        }
    }

    const checkCastle = (squares, index) => {
        if (selectedIndex === 4 || selectedIndex === 60) {
            if (index === 62) {
                if (checkRook(squares, index)) {
                    if (squares[61] === null && squares[62] === null) {
                        socket.emit("castle", {
                            gameId,
                            start: selectedIndex,
                            end: index,
                            space1: 61,
                            space2: 63
                        })
                    }
                }
                else {
                    return false
                }
            }
            if (index === 6) {
                if (checkRook(squares, index)) {
                    if (squares[5] === null && squares[6] === null) {
                        socket.emit("castle", {
                            gameId,
                            start: selectedIndex,
                            end: index,
                            space1: 5,
                            space2: 7
                        })
                    }
                    else {
                        return false
                    }
                }
            }
            if (index === 2) {
                if (checkRook(squares, index)) {
                    if (squares[1] === null && squares[2] === null && squares[3] === null) {
                        socket.emit("castle", {
                            gameId,
                            start: selectedIndex,
                            end: index,
                            space1: 3,
                            space2: 0
                        })
                    }
                }
                else {
                    return false
                }
            }
            if (index === 58) {
                if (checkRook(squares, index)) {
                    if (squares[57] === null && squares[58] === null && squares[59] === null) {
                        socket.emit('castle', {
                            gameId: gameId,
                            start: selectedIndex,
                            end: index,
                            space1: 59,
                            space2: 56,
                        });
                    }
                    else {
                        return false;
                    }
                }
            }
            return squares;
        }
    }

    const handleClick = (index) => {
        let player = usernames[0] === username ? 1 : 2;
        console.log(index);
        if (player === playerTurn) {
            let tempsquares = squares.slice();
            if (selectedIndex < 0) {
                if (tempsquares[index] && tempsquares[index].player === playerTurn) {
                    tempsquares[index].style = { ...tempsquares[index].style, backgroundColor: "#575E6B" }
                    setSquares(tempsquares);
                    setSelectedIndex(index);
                }
                else if (tempsquares[index] && tempsquares[index].player !== playerTurn) {
                    console.log("Not Your Piece");
                }
                else {
                    console.log("There is no Piece");
                }
            }
            else {
                tempsquares[selectedIndex].style = { ...squares[selectedIndex].style, backgroundColor: null }
                if (tempsquares[selectedIndex] !== null && tempsquares[selectedIndex].name === "King" && !tempsquares[selectedIndex].moved() && (index === 2 || index === 6 || index === 58 || index === 62)) {
                    checkCastle(tempsquares, index);
                }
                else if (checkEnPassant(tempsquares, index)) {

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