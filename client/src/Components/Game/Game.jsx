import React, { useState, useContext, useEffect } from "react";
import useSound from "use-sound";
import chessSound from "./chess_move.mp3";
import { initializeChessBoard } from "../../Helpers/InitializeChessBoard";
import { Board } from "../Board/Board";
import { Datacontext } from "../../Context/Datacontext";
import { Queen } from "../../Pieces/Queen";
import { Rook } from "../../Pieces/Rook";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Chat } from "../Chat/Chat";
import "./Game.css";


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

    const handleEnPassant = (squares, index) => {
        if (playerTurn === 1) {
            if (index === selectedIndex - 9) {
                squares[index] = squares[selectedIndex];
                squares[selectedIndex] = null;
                squares[index + 8] = null;
            }
            if (index === selectedIndex - 7) {
                squares[index] = squares[selectedIndex];
                squares[selectedIndex] = null;
                squares[index + 8] = null;
            }
        }

        else {
            if (index === selectedIndex + 7) {
                squares[index] = squares[selectedIndex];
                squares[selectedIndex] = null;
                squares[index - 8] = null;
            }
            if (index === selectedIndex + 9) {
                squares[index] = squares[selectedIndex];
                squares[selectedIndex] = null;
                squares[index - 8] = null;
            }
        }
        return squares;
    }

    const isKingCheckmated = (tempsquares, attackingPiecePos, enemyKingPos, attackingPath) => {
        const otherPlayer = playerTurn === 1 ? 2 : 1;
        var found = false;
        var allPaths = [...attackingPath, attackingPiecePos];
        console.log(allPaths);
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
            var enemyKingIndex = -1;
            var check = false;
            var otherPlayer = playerTurn === 1 ? 2 : 1;
            var path = [];
            var attackingPiece = -1;
            for (var i = 0; i < squares.length && enemyKingIndex < 0; ++i) {
                if (squares[i] !== null && squares[i].name === "King" && squares[i].player === otherPlayer) {
                    enemyKingIndex = i;
                }
            }
            var found = false;
            for (var j = 0; j < squares.length && !found; ++j) {
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

            if (found) {
                check = true;
                var checkmate = isKingCheckmated(squares, attackingPiece, enemyKingIndex, path);
            }
            else {
                check = false;
            }
            var enemyCheck = { check, enemyKingIndex, checkmate }
            resolve(enemyCheck);
        })
    }

    const isMyKinginCheck = (squares) => {
        return new Promise((resolve, reject) => {
            var kingIndex = -1;
            var check = false;
            var otherPlayer = playerTurn === 1 ? 2 : 1;
            for (var i = 0; i < squares.length && kingIndex < 0; ++i) {
                if (squares[i] !== null && squares[i].name === "King" && squares[i].player === playerTurn) {
                    kingIndex = i;
                }
            }

            var found = false;

            for (var j = 0; j < squares.length && !found; ++j) {
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
            console.log(squares[selectedIndex - 9] === index);
            if (squares[selectedIndex - 1] !== null && squares[selectedIndex - 1].name === "Pawn" && squares[selectedIndex - 1].player === otherPlayer && squares[selectedIndex - 1].doubleJump && index === selectedIndex - 9) {
                return true;
            }
            if (squares[selectedIndex + 1] !== null && squares[selectedIndex + 1].name === "Pawn" && squares[selectedIndex + 1].player === otherPlayer && squares[selectedIndex + 1].doubleJump && index === selectedIndex - 7) {
                return true;
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
                        socket.emit('castle', {
                            gameId: gameId,
                            start: selectedIndex,
                            end: index,
                            space1: 61,
                            space2: 63,
                        });
                    }

                    else {
                        console.log("invalid move");
                    }
                }
            }

            if (index === 6) {
                if (checkRook(squares, index)) {
                    if (squares[5] === null && squares[6] === null) {
                        socket.emit('castle', {
                            gameId: gameId,
                            start: selectedIndex,
                            end: index,
                            space1: 5,
                            space2: 7,
                        });
                    }
                    else {
                        return false;
                    }
                }
            }
            if (index === 2) {
                if (checkRook(squares, index)) {
                    if (squares[1] === null && squares[2] === null && squares[3] === null) {
                        socket.emit('castle', {
                            gameId: gameId,
                            start: selectedIndex,
                            end: index,
                            space1: 3,
                            space2: 0,
                        });
                    }
                    else {
                        return false;
                    }
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
        var valid = true;

        for (var i = 0; i < path.length && valid; ++i) {
            if (squares[path[i]] !== null) {
                valid = false;
            }
        }

        return valid;
    }

    const handleClick = (index) => {
        var player = usernames[0] === username ? 1 : 2;
        if (player === playerTurn) {
            var tempsquares = squares.slice();

            if (selectedIndex < 0) {
                if (tempsquares[index] && (tempsquares[index].player === playerTurn)) {
                    tempsquares[index].style = { ...tempsquares[index].style, backgroundColor: "#575E6B" };
                    setSquares(tempsquares);
                    setSelectedIndex(index);
                }
                else {
                    console.log("That is not your piece");
                }
            }

            else {
                tempsquares[selectedIndex].style = { ...squares[selectedIndex].style, backgroundColor: null };
                if (tempsquares[selectedIndex] !== null && tempsquares[selectedIndex].name === "King" && !tempsquares[selectedIndex].moved() && (index === 2 || index === 6 || index === 58 || index === 62)) {
                    checkCastle(tempsquares, index);
                }

                else if (checkEnPassant(tempsquares, index)) {
                    socket.emit("enPassant", {
                        gameId: gameId,
                        endIndex: index,
                    });
                }

                else if (tempsquares[index] !== null && tempsquares[index].player === playerTurn) {
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
                            isMyKinginCheck(tempsquares)
                                .then((data) => {
                                    if (data.check) {
                                        setSelectedIndex(-1);
                                    }
                                    else {
                                        isEnemyKinginCheck(tempsquares)
                                            .then((enemyCheckData) => {
                                                if (enemyCheckData.check) {
                                                    console.log(index);
                                                    socket.emit('move', {
                                                        initialIndex: selectedIndex,
                                                        endIndex: index,
                                                        gameId: gameId,
                                                        enemyKingIndex: enemyCheckData.enemyKingIndex,
                                                        checkmate: enemyCheckData.checkmate,
                                                        evolveIndex: pawnToQueenIndex,
                                                    })
                                                }

                                                else {
                                                    socket.emit('move', {
                                                        initialIndex: selectedIndex,
                                                        endIndex: index,
                                                        gameId: gameId,
                                                    })
                                                }

                                            })
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                        }
                        else {
                            setSquares(tempsquares);
                            setSelectedIndex(-1);
                        }
                    }
                    else {

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

    function handleClose() {
        setOpen(false);
    }

    function rematch() {
        setClickRematch(true);
        socket.emit("rematch", { gameId: gameId, num: 1 });
    }

    function resign() {
        console.log("resign");
        socket.emit("clickResign", { gameId: gameId });
    }

    useEffect(() => {
        socket.on("handleEnpassant", (data) => {
            const tempSquares = squares.slice();
            const newSquares = handleEnPassant(tempSquares, data.endIndex);
            var nextTurn = playerTurn === 1 ? 2 : 1;
            setSquares(newSquares);
            setSelectedIndex(-1);
            setPlayerTurn(nextTurn);
        });

        return () => {
            socket.off("handleEnpassant");
        }
    })

    useEffect(() => {
        socket.on("initiateResign", () => {
            setOpen(true);
            console.log("initiateresign");
        })

        return () => {
            socket.off("initiateResign");
        }
    });

    useEffect(() => {
        socket.on("initiateRematch", () => {
            var temp = usernames[0];
            usernames[0] = usernames[1];
            usernames[1] = temp;
            setPlayerTurn(1);
            setSelectedIndex(-1);
            setClickRematch(false);
            handleClose();
            setSquares(initializeChessBoard());
        });

        return () => {
            socket.off("initiateRematch");
        }
    })

    useEffect(() => {
        socket.on('castleBoard', (data) => {
            var temp = squares.slice();

            temp[data.end] = temp[data.start];
            temp[data.end].handleMoved();
            temp[data.start] = null;
            if (playerTurn === 1) {
                temp[data.space1] = new Rook(1);
            }
            else {
                temp[data.space1] = new Rook(2);
            }
            temp[data.space2] = null;

            setSquares(temp);
            setSelectedIndex(-1);
            playSound();
            setPlayerTurn(playerTurn === 1 ? 2 : 1);
        })

        return () => {
            socket.off('castleBoard');
        }
    });

    useEffect(() => {
        socket.on('userMove', (state) => {
            var temp = squares.slice();
            if (state.evolveIndex > 0) {
                temp[state.endIndex] = new Queen(playerTurn);
                temp[state.initialIndex] = null;
            }
            else {
                temp[state.endIndex] = temp[state.initialIndex];
                temp[state.initialIndex] = null;
            }

            temp.forEach((square) => {
                if (square !== null) {
                    square.style = { ...square.style, backgroundColor: null };
                }
            })

            temp[state.endIndex].style = { ...temp[state.endIndex].style, backgroundColor: '#FFFABD' };
            if (state.enemyKingIndex !== undefined) {
                temp[state.enemyKingIndex].style = { ...temp[state.enemyKingIndex].style, backgroundColor: '#FF6060' };
            }

            setSquares(temp);

            setPlayerTurn(playerTurn === 1 ? 2 : 1);
            setSelectedIndex(-1);
            playSound();
            if (state.checkmate !== undefined) {
                if (!state.checkmate) {
                    setCheckmate(true);
                    setOpen(true);
                }
            }
        })

        return () => {
            socket.off('userMove');
        }
    });

    useEffect(() => {
        socket.emit("shouldGameStart", gameId);

        socket.on("start game", (users) => {
            setStart(true);
            setUsernames(users);
        });
    }, []);


    return (
        <>
            <div className="Game">
                {start ?
                    <>
                        <div className="game-container">
                            <div>
                                <Dialog
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">{`${playerTurn === 1 ? usernames[1] : usernames[0]} wins!`}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">

                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={rematch} color="primary" disabled={clickRematch}>
                                            {clickRematch ? "Waiting for other player" : "Rematch"}
                                        </Button>
                                        <Button onClick={handleClose} color="primary" autoFocus>
                                            Cancel
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <h1>{usernames[0] === username ? usernames[1] : usernames[0]}</h1>
                                <Board
                                    squares={squares}
                                    onClick={(index) => handleClick(index)}
                                    player={usernames[0] === username ? 1 : 2}
                                />
                                <h1>{usernames[0] === username ? usernames[0] : usernames[1]}</h1>
                                <Button onClick={resign} variant="contained" color="primary">
                                    Resign
                                </Button>
                            </div>
                            <Chat />
                        </div>
                    </>
                    :
                    <>
                        <div className="game-lobby-container">
                            <h1>Welcome to Online Chess!</h1>
                            <p>
                                Hey {username}! This app was made so that you can play chess with your friends at the comfort of your own home!
                            </p>
                            <p>
                                Send this link with a friend to start your chess game
                            </p>

                            <div>
                                <TextField
                                    id="outlined-read-only-input"
                                    label="Share Link"
                                    defaultValue={window.location}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    style={{ width: '30vw', marginTop: '2%', marginBottom: '1%' }}
                                    variant="outlined"
                                />
                            </div>

                            <div>
                                <p>Waiting for game to start ...</p>
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    )
}