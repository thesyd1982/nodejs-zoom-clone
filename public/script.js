const socket = io("/")
const roomId = ROOM_ID

const videoGrid = document.querySelector("#video-grid")
console.log("videoGrid", videoGrid)

const myVideo = document.createElement("video")
myVideo.muted = true

let myVideoStream
navigator.mediaDevices
  .getUserMedia({
    video: false,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)
  })

const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener("loadedmetadata", () => {
    video.play()
  })
  videoGrid.append(video)
}
const connectToNewUser = () => {
  console.log("new user")
}
socket.emit("join-room", roomId)

socket.on("user-connected", () => {
  console.log("new user")
})
