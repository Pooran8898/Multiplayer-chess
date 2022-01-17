import React from "react";
import { Routes, Route, Link } from "react-router-dom";

export const Router = () => {

    return (
        <>
            <Routes>
                <Route path="/" element={<h1>Home</h1>} />
                <Route path="/game/:gameId" element={<h1>Game</h1>} />
                <Route path="*" element={<h1>Incorrect Page <Link to={"/"}>Click here to go to Home page</Link></h1>} />
            </Routes>
        </>
    )
}