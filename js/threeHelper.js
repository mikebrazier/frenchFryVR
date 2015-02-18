threeHelper = function(){

	var self = this;
		self.renderer = null;
		self.effect = null;
		self.scene = null;
		self.camera = null;
		self.player = null;
		self.sphere = null;

	self.animate = function(){

		self.sphere.rotation.y+=.0005;
		self.player.update();
		self.playerControls.update();
		self.effect.render( self.scene, self.player.camera );
		requestAnimationFrame( self.animate );

	}

	self.addPlayer = function( name ){
		var player = new Player( false );
			player.ready.then(function(results){
				var playerperson = results;
					playerperson.name = name;
					playerperson.position.z = -20;
				self.scene.add(playerperson);
			});
		players[name] = player;
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
		var texture = THREE.ImageUtils.loadTexture('../images/grass.jpg');
 		var ground = new THREE.Mesh(new THREE.PlaneGeometry( 600, 600, 10, 10 ), new THREE.MeshLambertMaterial({map: texture }));
 			ground.rotation.x = -Math.PI/2;
 			ground.name = "ground";
 		self.scene.add(ground);

 		//space sphere
 		var texture = THREE.ImageUtils.loadTexture('../images/space.jpg');
 		self.sphere = new THREE.Mesh(new THREE.SphereGeometry( 300, 30, 30 ), new THREE.MeshLambertMaterial({map: texture, side: THREE.DoubleSide }));
 		self.scene.add(self.sphere);
 		// lighting
		var topPointLight = new THREE.PointLight( 0xEBF5FF, 2, 400 );
			topPointLight.position.y = 250;
		self.scene.add(topPointLight);

		var directionalLight = new THREE.DirectionalLight( 0x000099, 1 ); 
			directionalLight.position.set( 0, 1, 0 ); 
			self.scene.add( directionalLight );

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