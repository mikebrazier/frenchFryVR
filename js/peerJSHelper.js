/*
creates a peer for the user and provides a connections object that handles connections
 */

peerJSHelper = function(){

	var self = this;
		self.id = null;
		self.username;
		self.connections = makeConnections();
		self.peer = makePeer();

	var queries = queries();

	function makePeer(){

		var peer = new Peer({ key: 'pxm5mijjoz0bpgb9', debug: 3});

			peer.on('error', function(err){
				switch(err.type){
				}
			});

			//when connected to signaling server
			peer.on('open', function(id) {
				//provide a link to the user he/she can use for inviting
				document.querySelector('#myPeerId').innerHTML = 'localhost:8000/?id='+id;
				self.id = id;
				//connect to the id provided by the queryString, if it exists
				if(queries.id){
					var connection = peer.connect(queries.id);
					self.connections.addConnection(connection);
				}
			});

			//when someone connects to us
			peer.on('connection', function(conn) {
				//add this new individual to our list
				self.connections.addConnection(conn);

				//call this peer
				var call = peer.call(conn.peer, mediaStream);

				//provide the current connections with this new connection
				var connID = conn.peer;
				var data = {};
					data.connID = connID;

				self.connections.sendData(data);
			});

			//when the peer receives a call, in our case for audio
			peer.on('call', function(call) {

				// Answer the call with our audio stream
			    call.answer(mediaStream);

			    //when the call receives a stream, play it through our audio element
			    call.on('stream', function(stream) {

			    	var audioElement = document.querySelector('audio');
					audioElement.src = window.URL.createObjectURL(stream);
					//audioElement.src = stream;

					}
				);

			});

		return peer;
	}

	function makeConnections(){

		var connections = {};

			connections.list = {};

			connections.addConnection = function(connection){
				addConnectionEvents(connection);
				connections.list[connection.peer] = connection;
			}

			connections.removeConnection = function(connection){
				delete connections.list[connection.peer];
			}

			connections.sendData = function(data){

				Object.keys(connections.list).forEach(function(key) {
				 	var connection = connections.list[key];
					connection.send(data);
				});

			}

		function addConnectionEvents(connection){

			connection.on('open', function(){
				var data = {};

				//if you've provided a username
				if(self.username){
					data.username = self.username;
				}

				connection.send(data);
				addListItem(connection.peer);
			});

			connection.on('close', function(){
				removeListItem(connection.peer);
				connections.removeConnection(connection);
			});

			connection.on('data', function(data){
				//username is used for the HTML list
				if(data.username){
					changeListItem(this.peer, data.username);
				}
				if(data.cameraRotation){
					players[data.name].head.rotation.fromArray(data.cameraRotation);
				}
				if(data.position){
					players[data.name].person.position.fromArray(data.position);
				}

				if(data.connID){

					var myIDs = Object.keys(connections.list);

					if(myIDs.indexOf(data.connID) < 0){
						var connection = self.peer.connect(data.connID);
						self.connections.addConnection(connection);
					}
				}
			});

		}

		return connections;

	}

	function addListItem(string){

		var text = document.createTextNode(string);
		var el = document.createElement("LI");
			el.setAttribute("id", string);
			el.appendChild(text);
		document.getElementById("connectionsList").appendChild(el);

	}

	function removeListItem(string){

		var el = document.getElementById(string);
			el.parentNode.removeChild(el);

	}

	function changeListItem(id, string){
		var text = document.createTextNode(string);
		var el = document.getElementById(id),
			child = el.childNodes[0];

		el.removeChild(child);
		el.appendChild(text);

	}

	function queries(){

		var queryString = window.location.search.replace("?", ""),
			params = {};

		if(queryString.length>0){

			var queries, temp, i, l;

		    // Split into key/value pairs
		    queries = queryString.split("&");

		    // Convert the array of strings into an object
		    for ( i = 0, l = queries.length; i < l; i++ ) {
		        temp = queries[i].split('=');
		        temp[1]=temp[1].replace(/\//g,'');
		        params[temp[0]] = temp[1];
		    }

		}

		return params;
	}

	function setname(){

		self.username = document.getElementById("username").value;

		var	data = {};
			data.username = self.username;

		self.connections.sendData(data);

	}

	document.querySelector('#usernameButton').addEventListener('click', setname);

	return self;
}
