import io from "socket.io-client";

const connection = "https://chess-backend-by-pooran.herokuapp.com/";

export const socket = io(connection);


