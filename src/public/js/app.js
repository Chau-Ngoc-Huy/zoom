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
function showRoom(name, userCount) {
    welcome.hidden = true
    room.hidden = false
    const h3 = room.querySelector("h3")
    h3.innerText = `${name} Room (${userCount})`
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
    const nickName = input.value
    socket.emit("nickname", nickName)
    input.value = ""

    const h3 = roomNameForm.querySelector("h3")
    h3.innerText = `Hi ${nickName}`
    nickNameForm.hidden = true
    roomNameForm.hidden = false

    const inputRoom = roomNameForm.querySelector("input")
    inputRoom.select()

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
    socket.emit("send_message", msg, roomName, () => {
        addMessage(`You: ${msg}`)
    })
    input.value = ""
}



roomNameForm.addEventListener("submit", handleSubmit)
nickNameForm.addEventListener("submit", handleSaveName)
message.addEventListener("submit", handleSendMessage)


socket.on("welcome", (nickname, userCount) => {
    addMessage(`${nickname} someone joined`)
    const h3 = room.querySelector("h3")
    h3.innerText = `${roomName} Room (${userCount})`
})
socket.on("new_message", (msg, nickname) => {
    addMessage(`${nickname}: ${msg}`)
})
socket.on("bye", (nickname, userCount) => {
    const h3 = room.querySelector("h3")
    console.log(userCount)
    h3.innerText = `${roomName} Room (${userCount})`
    addMessage(`${nickname} disconnected!`)
    
})
socket.on("rooms_change", (rooms) => {
    const ul = welcome.querySelector("ul")
    ul.innerHTML = ""
    rooms.forEach((room) => {
        const li = document.createElement("li")
        li.innerText = room;
        ul.append(li)
    })
})