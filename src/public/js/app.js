const socket = io()

const welcome = document.getElementById("welcome")
const form = welcome.querySelector("form")
const room = document.getElementById("room")
const message = document.getElementById("message")

room.hidden = true
function showRoom(roomName) {
    welcome.hidden = true
    room.hidden = false
    const h3 = room.querySelector("h3")
    h3.innerText = `${roomName} Room`
}
const handleSubmit = (event) => {
    event.preventDefault();
    const input = form.querySelector("input")
    socket.emit("enter_room", input.value, showRoom)
    input.value = ""
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
    socket.emit("send_message", input.value, addMessage)
    input.value = ""
}


form.addEventListener("submit", handleSubmit)
message.addEventListener("submit", handleSendMessage)

socket.on("welcome", () => {
    addMessage("someone joined")
})
socket.on("new_message", (message) => {
    addMessage(message)
})