import http from "http"
import express from "express"
import SocketIO from "socket.io"

const app = express()
app.set("view engine", "pug")
app.set("views", __dirname + "/views")
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (req, res) => res.render("home"))
app.get("/*", (req, res) => res.redirect("/"))

const server = http.createServer(app)
const io = SocketIO(server)


const handleListener = () => {console.log('listening on http://localhost:3000')}
server.listen(3000, handleListener)

io.on("connection", (socket) => {
    socket.onAny((eventName) => {
        console.log(eventName)
    })
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName)
        socket.to(roomName).emit("welcome")
        done(roomName)
        
    })
    socket.on("send_message", (message, done) => {
        console.log(socket.rooms[1])
        socket.to("hihi").emit("new_message", message)
        done(message)
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
