import React from "react";
import "../Board/Board.css";

export const Square = ({ onClick, colour, style }) => {
    return (
        <>
            <button onClick={onClick} className={`square ${colour}`} style={style}>

            </button>
        </>
    )
}