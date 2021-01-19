const socket = io("/")
const roomId = ROOM_ID
const peer = new Peer(undefined, { host: "/", port: "3001" })
const videoGrid = document.querySelector("#video-grid")
console.log("videoGrid", videoGrid)

const myVideo = document.createElement("video")
myVideo.muted = true

// let myVideoStream
// navigator.mediaDevices
//   .getUserMedia({
//     video: false,
//     audio: true,
//   })
//   .then((stream) => {
//     myVideoStream = stream
//     addVideoStream(myVideo, stream)
//   })

const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener("loadedmetadata", () => {
    video.play()
  })
  videoGrid.append(video)
}

const addVideoSource = (video, source) => {
  video.src = source
  video.addEventListener("loadedmetadata", () => {
    video.play()
  })
  videoGrid.append(video)
}

const connectToNewUser = () => {
  console.log("new user")
}
peer.on("open", (userId) => {
  socket.emit("join-room", roomId, userId)
})

socket.on("user-connected", (userId, source) => {
  console.log("The User : " + userId + " is cionnected to the room \n" + roomId)
  addVideoSource(myVideo, source)
})
