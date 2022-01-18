import React, { useContext } from "react";
import "./Lobby.css";
import { Datacontext } from "../../Context/Datacontext";
import { Game } from "../Game/Game";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useEffect } from "react";

export const Lobby = () => {
    const { username, Setusername, redirect, setRedirect, generateGameId } = useContext(Datacontext);

    useEffect(() => {
        if (username !== "") {
            setRedirect(true);
        }
    }, [])
    return (
        <>
            <div>
                {
                    redirect ? <div>
                        <Game />
                    </div> :
                        <div className="lobby-container">
                            <p>Enter your name to start the game</p>
                            <TextField id="outlined-basic" style={{ width: "15vw", marginBottom: "1%" }} label="Name" variant="outlined" required onChange={(event) => Setusername(event.target.value)} />
                            <Button variant="contained" color="primary" onClick={(event) => username === "" ? event.preventDefault() : generateGameId()}>
                                Enter
                            </Button>
                        </div>
                }
            </div>
        </>
    )
}