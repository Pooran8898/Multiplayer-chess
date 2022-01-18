import React from "react";
import { useContext } from "react";
import { Datacontext } from "../../Context/Datacontext";
import { Navigate } from "react-router-dom";
import "./Join.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";


export const Join = () => {
    const { redirect, gameId, Setusername, username, generateGameId } = useContext(Datacontext);

    return (
        <>
            <div>
                {redirect ? <Navigate to={"/game/" + gameId} /> : <>
                    <div className="home-container">
                        <h1>Play Chess Online with your Friends</h1>
                        <p>Enter your name to create your game lobby!</p>
                        <TextField id="outlined-basic" style={{ width: "15vw", marginBottom: "1%" }} label="Name" variant="outlined" required onChange={(event) => Setusername(event.target.value)} />
                        <Button variant="contained" color="primary" onClick={(event) => username === "" ? event.preventDefault() : generateGameId()}>
                            Enter
                        </Button>
                    </div>
                </>}
            </div>
        </>
    )
}