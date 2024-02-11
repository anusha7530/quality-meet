const videoGrid = document.getElementById("video-grid");
const socket = io();

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030",
});

const myVideo = document.createElement("video");
myVideo.muted = true;

var myVideoStream;
var user;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(myVideoStream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      setTimeout(connectNewUser, 1000, userId, stream);
    });

    let text = $("input");

    $("html").keydown((e) => {
      if (e.which === 13 && text.val().length !== 0) {
        socket.emit("message", text.val(),user);
        text.val("");
      }
    });
   

    socket.on("createMessage", (message,user) => {
      $(".messages").append(`<li class="message"><b>${user}</b><br />${message}</li>`);
      scrollToBottom();
    });

    var items = document.getElementsByClassName("participant");
    console.log(items.length);
    for (var i = 0; i < items.length; ++i) {
  if(items[i] !== user){
    socket.emit("participant",ROOM_ID,user);
  }
}

    socket.on('createParticipant',user => {
      $(".participant").append(`<li class="users"><b>${user}</b></li>`)    
    })
  });
  
 

peer.on("open", (id) => {
  user = prompt("Enter your name to join the meet");
  if(user.length === 0){
    user = "guest"+ 0+ Math.floor((Math.random() * 100) + 1);
  }
  socket.emit("join-room", ROOM_ID, id);
 
});


const connectNewUser = (userId, stream) => {
  const call = peer.call(userId, myVideoStream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};


const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

const scrollToBottom = () => {
  var d = $('.main_chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if(enabled){
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else{
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton = () =>{
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main_mute_button').innerHTML = html;
}

const setUnmuteButton = () =>{
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main_mute_button').innerHTML = html;
}

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if(enabled){
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else{
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setStopVideo = () =>{
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main_video_button').innerHTML = html;
}
const setPlayVideo = () =>{
  const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Start Video</span>
  `
  document.querySelector('.main_video_button').innerHTML = html;
}

const toggle = () => {
  var blur = document.getElementById('blur');
  blur.classList.toggle('active');
  var popup = document.getElementById('pop1');
  popup.classList.toggle('active');
}
