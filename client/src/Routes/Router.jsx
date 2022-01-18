import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Join } from "../Components/Join/Join";
import { Navbar } from "../Components/Navbar/Navbar";
import { Lobby } from "../Components/Lobby/Lobby";

export const Router = () => {

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Join />} />
                <Route path="/game/:gameId" element={<Lobby />} />
                <Route path="*" element={<h1>Incorrect Page <Link to={"/"}>Click here to go to Home page</Link></h1>} />
            </Routes>
        </>
    )
}