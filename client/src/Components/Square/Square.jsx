import React from "react";
import "../Board/Board.css";

export const Square = ({ onClick, colour, style }) => {
    return (
        <>
            <button onClick={onClick} className={`sqaure ${colour}`} style={style}>

            </button>
        </>
    )
}