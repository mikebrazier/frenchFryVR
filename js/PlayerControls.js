PlayerControls = function (player){

	self = this;
	self.person = player.person;
	self.camera = player.camera;
	self.body = player.body;

	self.moveForward, self.moveLeft, self.moveRight, self.moveBackward = false;

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				self.moveForward = true;
				break;

			case 37: // left
			case 65: // a
				self.moveLeft = true;
				break;

			case 40: // down
			case 83: // s
				self.moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				self.moveRight = true;
				break;

		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				self.moveForward = false;
				break;

			case 37: // left
			case 65: // a
				self.moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				self.moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				self.moveRight = false;
				break;

		}

	};

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
}

PlayerControls.prototype.update = function(){

	var cameraVector = new THREE.Vector3( 0, 0, 1 ).applyQuaternion(this.camera.quaternion.clone());
	// var forward = cameraVector.projectOnPlane(new THREE.Vector3( 0, 1, 0 )).normalize();
	var forward = cameraVector;

	if(this.moveForward) {

		this.person.translateOnAxis(forward, -0.5);

	}

	if(this.moveBackward) {

		this.person.translateOnAxis(forward, 0.5);

	}

}