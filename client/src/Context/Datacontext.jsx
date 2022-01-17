import React from "react";
import { useState } from "react";
import { v4 as uuid } from "uuid";


export const Datacontext = React.createContext();

let socket = "";

export const DatacontextProvider = ({ children }) => {
    const [username, Setusername] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [gameId, setgameId] = useState(uuid());

    // Function to Join Lobby

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
        generateGameId
    }
    return (
        <>
            <Datacontext.Provider value={value}>
                {children}
            </Datacontext.Provider>
        </>
    )
}