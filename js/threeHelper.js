threeHelper = function(){

	var self = this;
		self.renderer = null;
		self.effect = null;
		self.scene = null;
		self.camera = null;
		self.player = null;

	self.animate = function(){

		self.player.update();
		self.playerControls.update();
		self.effect.render( self.scene, self.camera );
		requestAnimationFrame( self.animate );

	}

	makeScene = function(){

		/*
		threejs basics, create a renderer for the scene, make said scene, etc.
		 */

		 //renderer
		self.renderer = new THREE.WebGLRenderer( { antialias: true } );
		self.renderer.setClearColor( 0x19A3FF, 1);
		self.renderer.setSize(window.innerWidth, window.innerHeight);
		//effect
		self.effect = new THREE.VREffect( self.renderer );
		self.effect.setSize( window.innerWidth, window.innerHeight);
		//scene
		self.scene = new THREE.Scene();
		//camera
		self.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		self.camera.position.y = 5;
		self.camera.name = "camera";
 		self.scene.add( self.camera );
 		//player
 		self.player = new Player( true );

 		self.player.ready.then(function(results){
			var playerperson = results;
				playerperson.name = "myPlayer";
				playerperson.position.z = -20;
			self.scene.add(playerperson);
		});

		self.playerControls = new PlayerControls( self.player );

 		//ground
		var texture = THREE.ImageUtils.loadTexture('../images/napkin_texture_by_luiexs.jpg');
 		var ground = new THREE.Mesh(new THREE.PlaneGeometry( 100, 100, 10, 10 ), new THREE.MeshBasicMaterial({map: texture }));
 			ground.rotation.x = -Math.PI/2;
 			ground.position.z = -40;
 			ground.name = "ground";
 		self.scene.add(ground);
 		//light
		var ambientLight = new THREE.AmbientLight( 0xFFFFFF );
			ambientLight.name = "ambientLight";
		self.scene.add(ambientLight);

	};

	//when threeHelper is called, for every connection in the global object connections, create a player and add to scene/players object
	makePlayers = function(){

		Object.keys(connections.list).forEach(function(key) {
		 	var connection = connections.list[key];
			var player = new Player( false );
				player.ready.then(function(results){
					var playerperson = results;
						playerperson.name = connection.peer;
						playerperson.position.z = -20;
					self.scene.add(playerperson);
				});
			players[connection.peer] = player;
		});
	}

	makePlayers();
	makeScene();

	return self;
}