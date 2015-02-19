threeHelper = function(){

	var self = this;
		self.renderer = null;
		self.effect = null;
		self.scene = null;
		self.camera = null;
		self.player = null;
		self.sphere = null;
		self.earth = null;
		self.moon = null;
		self.station = null;
		self.Sun = null;

	var pi = 0;

	self.animate = function(){

		moveMoon();
		self.earth.rotation.x +=.0005;
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
		self.renderer = new THREE.WebGLRenderer( { antialias: true,  alpha: true } );
		self.renderer.setClearColor( 0x000000, 1);
		self.renderer.setSize(window.innerWidth, window.innerHeight);
		self.renderer.gammaInput = true;
		self.renderer.gammaOutput = true;
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
		//earth
 		var earthTexture = THREE.ImageUtils.loadTexture('../images/earthish.png');
 		self.earth = new THREE.Mesh(new THREE.SphereGeometry( 100, 60, 60 ), new THREE.MeshLambertMaterial({map: earthTexture}));
		self.earth.position.y = -100;
 		self.scene.add(self.earth);
 		//moon
 		var moonTexture = THREE.ImageUtils.loadTexture('../images/moon.jpg');
 		self.moon = new THREE.Mesh(new THREE.SphereGeometry( 15, 60, 60 ), new THREE.MeshLambertMaterial({map: moonTexture}));
 		self.moon.position.y = self.earth.position.y;
 		self.moon.position.z = -200;
 		self.scene.add(self.moon);
	 	//station
	 	/*
		 	var stationTexture = new THREE.MeshBasicMaterial( {color:0xFFFFFF} );
			var loader = new THREE.OBJLoader();
			loader.load( "../models/cassini.obj", function( object ) {

		  	// 	object.traverse( function ( child ) {

					// 	if ( child instanceof THREE.Mesh ) {

					// 		child.material.map = stationTexture;

					// 	}

					// } );

				object.position.y = - 80;
				self.scene.add( object );
	   	 	});
		*/

	 	// lighting
		// var directionalLight = new THREE.DirectionalLight( 0xFFFFFF, .5); 
		// 	directionalLight.position.set( 0, 2000, -20000 );
		// self.scene.add( directionalLight);

		// lens flares taken from examples

		var textureFlare0 = THREE.ImageUtils.loadTexture( "../images/lensflare0.png" );
		var textureFlare2 = THREE.ImageUtils.loadTexture( "../images/lensflare2.png" );
		var textureFlare3 = THREE.ImageUtils.loadTexture( "../images/lensflare3.png" );

		// addLight( 0.55, 0.9, 0.5, 0,  0, 1000);
		addLight( 0.08, 0.8, 0.5, 0,  200, 10000);
		addLight( 0.995, 0.5, 0.9, 0,  200, 14000 );

		function addLight( h, s, l, x, y, z ) {

			var light = new THREE.PointLight( 0xffffff, 1, 15000 );
			light.color.setHSL( h, s, l );
			light.position.set( x, y, z );
			self.scene.add( light );

			var flareColor = new THREE.Color( 0xffffff );
			flareColor.setHSL( h, s, l + 0.5 );

			var lensFlare = new THREE.LensFlare( textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor );

			// lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
			// lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
			// lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

			lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
			lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
			lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
			lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );

			lensFlare.customUpdateCallback = lensFlareUpdateCallback;
			lensFlare.position.copy( light.position );
			lensFlare.name = 'lensFlare';
			lensFlare.rightEye = true;

			self.scene.add( lensFlare );

		}

		/*
		additionals ripped from examples page
		 */
		var geometry = new THREE.Geometry();

			for ( var i = 0; i < 100; i ++ ) {

				var vertex = new THREE.Vector3();
				vertex.x = THREE.Math.randFloatSpread( 5000 );
				vertex.y = THREE.Math.randFloatSpread( 5000 );
				vertex.z = THREE.Math.randFloatSpread( 5000 );

				geometry.vertices.push( vertex );

			}


		var particles = new THREE.PointCloud( geometry, new THREE.PointCloudMaterial( { color: 0xffffff } ) );
		self.scene.add( particles );

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

	function lensFlareUpdateCallback( object ) {

			var f, fl = object.lensFlares.length;
			var flare;
			var vecX = -object.positionScreen.x * 2;
			var vecY = -object.positionScreen.y * 2;

			for( f = 0; f < fl; f++ ) {

				   flare = object.lensFlares[ f ];

				   flare.x = object.positionScreen.x + vecX * flare.distance;
				   flare.y = object.positionScreen.y + vecY * flare.distance;

				   flare.rotation = 0;

			}

			object.lensFlares[ 2 ].y += 0.025;
			object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );

		}

	function moveMoon(){
		pi += .001;
		self.moon.rotation.y += .02;
		self.moon.position.x += (2.5*Math.cos(pi));
		self.moon.position.z += (5*Math.sin(pi));

		if(pi>2*Math.PI) pi = 0;
	}

	return self;
}