import io from "socket.io-client";

const connection = "http://localhost:4000/";

export const socket = io(connection);


