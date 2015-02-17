Player = function ( myPlayer ){

	var self = this;
		self.myPlayer = myPlayer || false;
		self.name = null;
		self.camera = null;
		self.cameraControls = null;
		self.head = null;
		self.body = null;
		self.person = null;
		self.position = null;
		self.data = {};

	self.ready = new Promise(function (resolve) {

		//Object3D that holds the meshes of the "person"
		self.person = new THREE.Object3D();

		//Camera
		self.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );

		if(self.myPlayer){
			self.cameraControls = new THREE.VRControls(self.camera);
			self.name = peerHelper.id;
		}

		//Box representing the head
		self.head = new THREE.Mesh( new THREE.BoxGeometry( 2, 5, 2 ), new THREE.MeshPhongMaterial({color:0xFFEB99, shading:THREE.FlatShading}));

		//Make the head a child of the camera.  This will allow it to rotate with the camera's movement
		self.camera.add(self.head);
		self.camera.position.y = 20;

		self.person.add(self.camera);

		//the mesh representing the body
		self.body = new THREE.Mesh(new THREE.BoxGeometry( 2, 15, 2), new THREE.MeshPhongMaterial({color:0xFFEB99, shading:THREE.FlatShading}));
		self.body.position.y = 7.5;
		self.person.add(self.body);

		//the data which will be sent via Peerjs.
		self.data = {

			cameraRotation: self.camera.rotation.toArray(),
			position: self.person.position.toArray(),
			name: self.name

		}

		resolve(self.person);

	});

	return this;

}

Player.prototype.update = function(){

	//update the heads position, if controls are provided
	if(this.cameraControls){
		this.cameraControls.update();
	}

	//update the data object with the present state
	this.data.cameraRotation = this.camera.rotation.toArray();
	this.data.position = this.person.position.toArray();

}

Player.prototype.getData = function(){

	return this.data;

}




