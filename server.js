const express = require("express")
const { createServer } = require("http")
const { v4: uuidv4 } = require("uuid")

require("dotenv").config()

const app = express()
const server = createServer(app)

const io = require("socket.io")(server)

app.set("view engine", "ejs")
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`)
})

app.get("/:room", (req, res) => {
  res.status(200).render("room", { roomId: req.params.room })
})

server.listen(process.env.PORT || 1337)

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId)

    socket.broadcast.emit("user-connected", "world")
    // io.to(roomId).broadcast.emit("user-connected")
  })
})
