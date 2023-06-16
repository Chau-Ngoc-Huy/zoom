const socket = io()

const welcome = document.getElementById("welcome")
const roomNameForm = document.getElementById("roomname")
const nickNameForm = document.getElementById("nickname")
const room = document.getElementById("room")
const message = document.getElementById("message")
room.hidden = true
roomNameForm.hidden = true
// nick_name.hidden = true

let roomName
let nickName
function showRoom(name) {
    welcome.hidden = true
    room.hidden = false
    const h3 = room.querySelector("h3")
    h3.innerText = `${name} Room`
}

const handleSubmit = (event) => {
    event.preventDefault()
    const input = roomNameForm.querySelector("input")
    roomName = input.value
    socket.emit("enter_room", roomName, showRoom)
    input.value = ""
}
const handleSaveName = (event) => {
    event.preventDefault()
    const input = nickNameForm.querySelector("input")
    nickName = input.value
    input.value = ""
    nickNameForm.hidden = true
    roomNameForm.hidden = false
}
const addMessage = (message) => {
    const ul = room.querySelector("ul")
    const li = document.createElement("li")
    li.innerText = message
    ul.appendChild(li)
}
const handleSendMessage = (event) => {
    event.preventDefault()
    const input = message.querySelector("input")
    const msg = input.value
    socket.emit("send_message", msg, roomName, nickName, () => {
        addMessage(`You: ${msg}`)
    })
    input.value = ""
}



roomNameForm.addEventListener("submit", handleSubmit)
nickNameForm.addEventListener("submit", handleSaveName)
message.addEventListener("submit", handleSendMessage)


socket.on("welcome", () => {
    addMessage("someone joined")
})
socket.on("new_message", (msg, nickName) => {
    addMessage(`${nickName}: ${msg}`)
})
socket.on("bye", () => {
    addMessage("someone disconnected!")
})