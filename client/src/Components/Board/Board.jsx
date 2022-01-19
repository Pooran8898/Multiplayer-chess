import React from "react";
import "./Board.css";
import { Square } from "../Square/Square";
import { v4 as uuid } from "uuid";


export const Board = ({ squares, onClick, player }) => {
    let board = [];
    function renderSquare(i, colour) {
        return <Square key={uuid()} onClick={() => onClick(i)} style={squares[i] ? squares[i].style : null} colour={colour} />
    }

    function createBoard() {
        if (player === 1) {
            for (let i = 0; i < 8; ++i) {
                let row = [];
                for (let j = 0; j < 8; ++j) {
                    if (i % 2 === 0) {
                        if (j % 2 === 0) {
                            row.push(renderSquare(i * 8 + j, "light"));
                        }
                        else {
                            row.push(renderSquare(i * 8 + j, "dark"));
                        }
                    }
                    else {
                        if (j % 2 === 0) {
                            row.push(renderSquare(i * 8 + j, "dark"));
                        }
                        else {
                            row.push(renderSquare(i * 8 + j, "light"));
                        }
                    }
                }
                board.push(<div key={uuid()}>{row}</div>)
            }
        }
        else {
            for (let i = 7; i >= 0; --i) {
                let row = [];
                for (let j = 7; j >= 0; --j) {
                    if (i % 2 === 0) {
                        if (j % 2 === 0) {
                            row.push(renderSquare(i * 8 + j, "light"));
                        }
                        else {
                            row.push(renderSquare(i * 8 + j, "dark"));
                        }
                    }
                    else {
                        if (j % 2 === 0) {
                            row.push(renderSquare(i * 8 + j, "dark"));
                        }
                        else {
                            row.push(renderSquare(i * 8 + j, "light"));
                        }
                    }
                }
                board.push(<div key={uuid()}>{row}</div>)
            }
        }
    }
    createBoard();
    return (
        <>
            <div className="board-container">
             {board}
            </div>
        </>
    )
}
