
let socket = io.connect("http://localhost:4000");
let divVideoChatLobby = document.getElementById("video-chat-lobby");
let divVideoChat = document.getElementById("video-chat-room");
let joinButton = document.getElementById("join");
let userVideo = document.getElementById("user-video");
let peerVideo = document.getElementById("peer-video");
let roomInput = document.getElementById("roomName");
let roomName = roomInput.value;
let userStream;


let creater = false;

let rtcPeerConnection;

let iceServers = {
    iceServers:[
        { urls: "stun:stun.services.mozilla.com"},
        { urls: "stun2.l.google.com:19302"},
        
    ],
};


joinButton.addEventListener("click", function () {
    if (roomInput.value =="") {
        alert("please enter a room name");
    }
    
    else{

        socket.emit("join", roomName);
    }
        
});


socket.on("created",function () {

    creater = true;

    //Implement signaling server through webscoket
    navigator.getUserMedia({ 
        audio: false,
         video: { width: 1280, height: 720 },
        },
        
        function (stream) {

            userStream = stream;

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


});


socket.on("joined",function () {

    creater = false;

        //Implement signaling server through webscoket
        navigator.getUserMedia({ 
            audio: false,
             video: { width: 1280, height: 720 },
            },
            
            function (stream) {

                userStream = stream;

                //Captured from navigator.getUserMedia from the internet.

                divVideoChatLobby.style = "display:none";

                userVideo.srcObject = stream;
                userVideo.onloadedmetadata = function(e) {
                    userVideo.play();
                };

                socket.emit("ready",roomName);

                
            },function () {
                alert("couldn't access user media");
            }

        );

    //Implement signaling server through webscoket
    socket.emit("join", roomInput.value);

    navigator.getUserMedia({ 
        audio: false,
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

    
});

socket.on("full",function (parms) {

    alert("Room is full anyone can't join");
    
});

socket.on("ready",function (parms) {
    if (creator) {
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
        rtcPeerConnection.ontrack = OnTrackFunction;

        rtcPeerConnection.addTrack(userStream.getTrack()[0],userStream); // video track
        rtcPeerConnection.addTrack(userStream.getTrack()[1],userStream); // audio track
        rtcPeerConnection.createOffer(function(offer){
            socket.emit("offer", offer , roomName);

        },
        function(error) {
            console.log(error);
        })
    }
});

function OnIceCandidateFunction(event) {
    
    if (event.candidate) {
        socket.emit("candidate",event.candidate,roomName);
    }

}

function OnTrackFunction(event) {
    
    peerVideo.srcObject = event.streams[0];
    peerVideo.onloadedmetadata = function(e) {
        peerVideo.play();

    };

   
}


socket.on("candidate",function (parms) {
    
});

socket.on("offer",function (parms) {
    
});

socket.on("answer",function (parms) {
    
});