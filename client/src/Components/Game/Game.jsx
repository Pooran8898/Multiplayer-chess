import React, { useState, useContext, useEffect } from "react";
import useSound from "use-sound";
import chessSound from "./chess_move.mp3";
import { initializeChessBoard } from "../../Helpers/InitializeChessBoard";
import { Board } from "../Board/Board";
import { Datacontext } from "../../Context/Datacontext";
import { Queen } from "../../Pieces/Queen";



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


    const isKingCheckmated = (tempsquares, attackingPiecePos, enemyKingPos, attackingPath) => {
        const otherPlayer = playerTurn === 1 ? 2 : 1;
        var found = false;
        var allPaths = [...attackingPath, attackingPiecePos];
        for (var j = 0; j < allPaths.length; ++j) {
            for (var k = 0; k < tempsquares.length && !found; ++k) {
                if (tempsquares[k] !== null && tempsquares[k].player === otherPlayer && tempsquares[k].name !== "King") {
                    console.log(tempsquares[k], k, allPaths[j]);
                    const validMove = tempsquares[k].isMoveValid(k, allPaths[j], true);
                    if (validMove) {
                        const path = tempsquares[k].getPathIndicies(k, allPaths[j]);
                        const validPath = checkValidPath(tempsquares, path);
                        if (validPath) {
                            found = true;
                        }
                    }
                }
            }
        }
        const kingPossibleMoves = [
            enemyKingPos + 1,
            enemyKingPos - 1,
            enemyKingPos + 8,
            enemyKingPos - 8,
            enemyKingPos + 9,
            enemyKingPos - 9,
            enemyKingPos + 7,
            enemyKingPos - 7,
        ];

        for (var a = 0; a < kingPossibleMoves.length && !found; ++a) {
            var temp;
            if (tempsquares[a] !== null) {
                if (tempsquares[a].player === otherPlayer) {
                    temp = tempsquares[a];
                    tempsquares[a] = tempsquares[enemyKingPos];
                    tempsquares[enemyKingPos] = null;

                    isEnemyKinginCheck(tempsquares)
                        .then((data) => {
                            if (data.check) {
                                tempsquares[enemyKingPos] = tempsquares[a];
                                tempsquares[a] = temp;
                            }
                            else {
                                found = true;
                            }
                        })
                }
            }
            else {
                temp = tempsquares[a];
                tempsquares[a] = tempsquares[enemyKingPos];
                tempsquares[enemyKingPos] = null;

                isEnemyKinginCheck(tempsquares)
                    .then((data) => {
                        if (data.check) {
                            tempsquares[enemyKingPos] = tempsquares[a];
                            tempsquares[a] = temp;
                        }
                        else {
                            found = true;
                        }
                    });
            }
        }
        return found;

    }

    const isEnemyKinginCheck = (squares) => {
        return new Promise((resolve, reject) => {
            let enemyKingIndex = -1;
            let check = false;
            let otherPlayer = playerTurn === 1 ? 2 : 1;
            var path = [];
            var attackingPiece = -1;

            for (let i = 0; i < squares.length && enemyKingIndex < 0; ++i) {
                if (squares[i] !== null && squares[i].name === "King" && squares[i].player === otherPlayer) {
                    enemyKingIndex = i;
                }
            }

            var found = false;

            for (let j = 0; j < squares.length && !found; ++j) {
                if (squares[j] !== null && squares[j].player === playerTurn) {
                    const validMove = squares[j].isMoveValid(j, enemyKingIndex, true);
                    path = squares[j].getPathIndicies(j, enemyKingIndex);
                    if (validMove) {
                        const validPath = checkValidPath(squares, path);
                        if (validPath) {
                            attackingPiece = j;
                            found = true;
                        }
                    }
                }
            }
            let checkmate = false;
            if (found) {
                check = true;
                checkmate = isKingCheckmated(squares, attackingPiece, enemyKingIndex, path);
            }
            else {
                check = false;
            }
            let enemyCheck = { check, enemyKingIndex, checkmate };
            resolve(enemyCheck);
        })
    }

    const isMyKinginCheck = (squares) => {
        return new Promise((resolve, reject) => {
            let kingIndex = -1;
            let check = false;
            let otherPlayer = playerTurn === 1 ? 2 : 1;

            for (let i = 0; i < squares.length && kingIndex < 0; ++i) {
                if (squares[i] !== null && squares[i].name === "King" && squares[i].player === playerTurn) {
                    kingIndex = i
                }
            }

            let found = false;

            for (let j = 0; j < squares.length && !found; ++j) {
                if (squares[j] !== null && squares[j].player === otherPlayer) {
                    const validMove = squares[j].isMoveValid(j, kingIndex, true);
                    const path = squares[j].getPathIndicies(j, kingIndex);
                    if (validMove) {
                        const validPath = checkValidPath(squares, path);
                        if (validPath) {
                            found = true;
                        }
                    }
                }
            }
            if (found) {
                squares[kingIndex].style = { ...squares[kingIndex].style, backgroundColor: '#FF6060' };
                check = true;
            }
            else {
                squares[kingIndex].style = { ...squares[kingIndex].style, backgroundColor: null };
                check = false;
            }
            const obj = { check, kingIndex };
            resolve(obj);
        })
    }

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

    const checkValidPath = (squares, path) => {
        let valid = true;
        for (let i = 0; i < path.length && valid; ++i) {
            if (squares[path[i]] !== null) {
                valid = false;
            }
        }
        return valid;
    }

    const handleClick = (index) => {
        let player = usernames[0] === username ? 1 : 2;
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
                    socket.emit("enPassant", {
                        gameId,
                        endIndex: index
                    })
                }
                else if (tempsquares[index] !== null && tempsquares[index].player === playerTurn) {
                    console.log("You move your own coins");
                    setSquares(tempsquares);
                    setSelectedIndex(-1);
                }
                else {
                    const lastRows = {
                        1: [0, 1, 2, 3, 4, 5, 6, 7],
                        2: [56, 57, 58, 59, 60, 61, 62, 63]
                    };
                    const isSquareOccupied = tempsquares[index] === null ? false : true;
                    const validMove = tempsquares[selectedIndex].isMoveValid(selectedIndex, index, isSquareOccupied);
                    const pathIndicies = tempsquares[selectedIndex].getPathIndicies(selectedIndex, index);
                    if (validMove) {
                        const validPath = checkValidPath(tempsquares, pathIndicies);
                        if (validPath) {
                            tempsquares[index] = tempsquares[selectedIndex];
                            tempsquares[index].handleMoved();
                            tempsquares[selectedIndex] = null;
                            if (tempsquares[index].name === "Pawn" && lastRows[1].indexOf(index) >= 0) {
                                tempsquares[index] = null;
                                tempsquares[index] = new Queen(1);
                                setPawnToQueenIndex(index);
                            }
                            if (tempsquares[index].name === "Pawn" && lastRows[2].indexOf(index) >= 0) {
                                tempsquares[index] = null;
                                tempsquares[index] = new Queen(2);
                                setPawnToQueenIndex(index);
                            }
                            isMyKinginCheck(tempsquares).then((data) => {
                                if (data.check) {
                                    console.log("move your king ");
                                    setSelectedIndex(-1);
                                }
                                else {
                                    isEnemyKinginCheck(tempsquares).then((enemyCheckData) => {
                                        if (enemyCheckData.check) {
                                            socket.emit("move", {
                                                initialIndex: selectedIndex,
                                                endIndex: index,
                                                gameId: gameId,
                                                enemyKingIndex: enemyCheckData.enemyKingIndex,
                                                checkmate: enemyCheckData.checkmate,
                                                evolveIndex: pawnToQueenIndex
                                            })
                                        }
                                        else {
                                            socket.emit("move", {
                                                initialIndex: selectedIndex,
                                                endIndex: index,
                                                gameId: gameId,
                                            })
                                        }
                                    })
                                }
                            }).catch((err) => {
                                console.log(err);
                            })
                        }
                        else {
                            console.log("invalid path", pathIndicies);
                            setSquares(tempsquares);
                            setSelectedIndex(-1);
                        }
                    }
                    else {
                        console.log("invalid move");
                        setSquares(tempsquares);
                        setSelectedIndex(-1);
                    }
                }
            }
        }
        else {
            console.log("not your turn");
        }
    }

    useEffect(() => {
        socket.emit("shouldGameStart", gameId);
        socket.on("start game", (users) => {
            setStart(true);
            setUsernames(users);
        })
    }, [])

    return (
        <>
            <Board onClick={(index) => handleClick(index)} squares={squares} player={usernames[0] === username ? 1 : 2} />
        </>
    )
}