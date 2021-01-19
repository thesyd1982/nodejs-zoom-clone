const express = require("express")
const { createServer } = require("http")
const { v4: uuidv4 } = require("uuid")
const fs = require("fs")
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

server.listen(process.env.PORT || 5000)

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    console.log(`Server :userId_${userId} is connected to the ${roomId}`)
    socket.join(roomId)
    let source = "/video/bbb.mp4"
    socket.to(roomId).broadcast.emit("user-connected", userId, source)
    // io.to(roomId).broadcast.emit("user-connected")
  })
})

app.get("/video/:name", (req, res) => {
  const name = req.params.name

  const contentType = path.extname(name)

  const videoPath = `./video/${name}`
  const videoSize = fs.statSync(videoPath).size
  let range = req.headers.range
  if (range) {
    const parts = range.replace("bytes=", "").split("-")

    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1

    const chunkSize = end - start + 1
    const readStrem = createReadStream(videoPath, { start, end })
    const head = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-type": contentType,
    }
    res.writeHead(206, head)
    readStrem.pipe(res)
  } else {
    const head = {
      "Content-type": contentType,
      "Content-Length": videoSize,
    }
    res.writeHead(200, head)
    fs.createReadStream(videoPath).pipe(res)
  }
})
