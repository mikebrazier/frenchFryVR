/*
author - Mike Brazier
French Fries Virtual Reality - "where friends ketchup"
a webVR demo that relies on PeerJS for web RTC connections and ThreeJS for rendering
 */

//mediaStream is our webRTC content, threeHelper handles the graphics,
//peerHelper sets up and handles connections, connections allows for global access to said connections,
//and players holds our Player objects

var mediaStream, peerHelper, threeHelper, connections, players;

window.onload = function(){

	//get media for streaming audio
	getAudio();

	//returns an object that holds our connections and our individual peer information
	//it also tries to connect with the id provided in the queryString, if there is one.
	peerHelper = new peerJSHelper();
}

/*
get the audio we'll be streaming via webRTC
 */
getAudio = function(){
	navigator.getUserMedia = ( navigator.getUserMedia ||
			                       navigator.webkitGetUserMedia ||
			                       navigator.mozGetUserMedia ||
			                       navigator.msGetUserMedia
			                       );

	if (navigator.getUserMedia) {

	    navigator.getUserMedia (
		    // constraints
		    {
		        video: false,
		        audio: true
		    },
		    // successCallback
		    function(localMediaStream) {
		    	mediaStream = localMediaStream;
		    },
		    // errorCallback
		    function(err) {
		        console.log("Call had error: " + err);
		    }
		);

	} else {
		console.log("getUserMedia not supported");
	}
}

/*
creates the Three content we'll be using for our world
 */
function startThree(){
	//when starting the world, everyone should be joined. This can be edited eventually.
	connections = peerHelper.connections;
	players = {};
	//threeHelper handles the graphics side of the VR experience
	threeHelper = new threeHelper();
	//remove the iframe background
	var vrIframe = document.getElementById( 'vrIframe' );
		vrIframe.parentNode.removeChild( vrIframe );
	//add in the scene
	document.getElementById('webGL').appendChild( threeHelper.renderer.domElement );
	//send to other players my information
	sendMyPlayer();
	//start the animation
	threeHelper.animate();
}

/*
a loop that constantly sends our player's information.
This isn't the best solution because we only need to send data when our state changes.
A loop like this causes unnecessary strain on the peer and connections.
I'll (probably) get around to fixing this
*/
function sendMyPlayer(){

	setInterval(function(){

		//get the user's player data
		var data = threeHelper.player.data;

		peerHelper.connections.sendData(data);

	}, 10);
}

/*
events
 */
function onWindowResize() {
	threeHelper.player.camera.aspect = window.innerWidth / window.innerHeight;
	threeHelper.player.camera.updateProjectionMatrix();
	
	threeHelper.renderer.setSize( window.innerWidth, window.innerHeight);
	threeHelper.effect.setSize( window.innerWidth, window.innerHeight);
}
function goFullScreen(){
	threeHelper.effect.setSize( window.innerWidth, window.innerHeight );
	threeHelper.effect.setFullScreen( true );
}

window.addEventListener('resize', onWindowResize, false );
document.getElementById("VRClick").addEventListener('click', startThree);
document.getElementById("webGL").addEventListener( 'dblclick', goFullScreen);

