  
let socket = io.connect("http://localhost:4000");
let divVideoChatLobby = document.getElementById("video-chat-lobby");
let divVideoChat = document.getElementById("video-chat-room");
let joinButton = document.getElementById("join");
let userVideo = document.getElementById("user-video");
let peerVideo = document.getElementById("peer-video");
let roomInput = document.getElementById("roomName");

joinButton.addEventListener("click", function () {
    if (roomInput.value =="") {
        alert("please enter a room name");
    }
    
    else{
        navigator.getUserMedia({ 
            audio: true,
             video: { width: 1280, height: 720 },
            },
            
            function (stream) {

                //Captured from navigator.getUserMedia from the internet.

                divVideoChatLobby.style = "display:none";

                userVideo.srcObject = stream;
                userVideo.onloadedmetadata = function(e) {
                    userVideo.play();
                };

                
            },function () {
                alert("couldn't access user media");
            }

        );

    }
        
});

