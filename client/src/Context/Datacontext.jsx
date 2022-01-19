import React from "react";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { socket } from "../socket/socket";
import { useLocation } from "react-router-dom";


export const Datacontext = React.createContext();

export const DatacontextProvider = ({ children }) => {
    const pathname = useLocation().pathname.split("/game/");
    const paramsgameId = pathname[1];
    const [username, Setusername] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [gameId, setgameId] = useState(paramsgameId || uuid());

    

    const generateGameId = () => {
        setRedirect(true);
        socket.emit("joinGameLobby", { gameId, username });
    }

    const value = {
        username,
        Setusername,
        redirect,
        setRedirect,
        gameId,
        setgameId,
        generateGameId,
        socket
    }
    return (
        <>
            <Datacontext.Provider value={value}>
                {children}
            </Datacontext.Provider>
        </>
    )
}