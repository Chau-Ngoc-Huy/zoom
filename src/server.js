import http from "http"
import express from "express"
import {Server} from "socket.io"
import {instrument} from "@socket.io/admin-ui"

const app = express()
app.set("view engine", "pug")
app.set("views", __dirname + "/views")
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (req, res) => res.render("home"))
app.get("/*", (req, res) => res.redirect("/"))

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true
    }
})
instrument(io, {
    auth: false,
    mode: "development",
});


const handleListener = () => {console.log('listening on http://localhost:3000')}
httpServer.listen(3000, handleListener)

function publicRooms() {
    const {sockets: {adapter: {rooms, sids}}} = io;
    const publicRooms = []
    rooms.forEach((_, key) => {
        if (sids.get(key) === undefined) {
            publicRooms.push(key)
        }
    })
    return publicRooms;
}

function userCount(roomName) {
    return io.sockets.adapter.rooms.get(roomName).size
}
io.on("connection", (socket) => {
    socket["nickname"] = "someone"
    socket.onAny((eventName) => {
        console.log(eventName)
    })
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName)
        socket.to(roomName).emit("welcome", socket["nickname"], userCount(roomName))
        io.sockets.emit("rooms_change", publicRooms())
        done(roomName, userCount(roomName))
    })
    socket.on("nickname", (name) => {
        socket["nickname"] = name
    })
    socket.on("send_message", (msg, room, done) => {
        socket.to(room).emit("new_message", msg, socket["nickname"])
        done()
    })
    socket.on("disconnecting", (reason) => {
        console.log(reason)
        socket.rooms.forEach(room => {
            socket.to(room).emit("bye", socket["nickname"], userCount(room) - 1)
        });
    })
    socket.on("disconnect", () => {
        io.sockets.emit("rooms_change", publicRooms())
    })
})


// import http from "http"
// import WebSocket from "ws"
// import express from "express"

// const app = express()
// app.set("view engine", "pug")
// app.set("views", __dirname + "/views")
// app.use("/public", express.static(__dirname + "/public"))
// app.get("/", (req, res) => res.render("home"))
// app.get("/*", (req, res) => res.redirect("/"))


// const handleListener = () => console.log(`Listening on http://localhost:3000`)
// const server = http.createServer(app)


// const wss = new WebSocket.Server({server})

// const sockets = []
// wss.on("connection", (socket) => {
//     sockets.push(socket)
//     socket["nickname"] = "unknow user"
//     console.log("Connected to the client")
//     socket.on("close", () => console.log("Disconnected to client"))
//     socket.on("message", (message) => {
//         const m = JSON.parse(message.toString())
//         switch (m.type){
//             case "message": 
//                 sockets.forEach((aSocket) => aSocket.send(`${socket["nickname"]}: ${m.payload}`))
//             case "nickname":
//                 socket["nickname"] = m.payload
//                 console.log(m.payload)
//         }
        
//     })
// })

// server.listen(3000, handleListener)
