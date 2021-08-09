import server from "./server";

const PORT = Number.parseInt(process.env.PORT || "3000")

server(PORT)