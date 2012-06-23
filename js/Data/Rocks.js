rocks={
	// Orange rocks
	orange:{
		description:"A regular piece of orange cliff.",
		prefix:"Orange",
		onDestroy:function() {
			for (var i=0;i<5;i++) {
				var speed=100+Math.random()*100;
				var dir=Math.random()*2*Math.PI;
				var dX=Math.cos(dir)*speed;
				var dY=Math.sin(dir)*speed;
				new Particle(pImg+'Particles/OrangeFracture.png',4,this.x,this.y,dir,300+Math.random()*300,{gravity:500,dX:dX,dY:dY})
			}
		},
		levels:[
			// Level 1
			{
				life:100,
				value:400,
				gravity:150,
				maxSpeed:120
			},
			// Level 2
			{
				life:350,
				value:1600,
				gravity:80,
				maxSpeed:100
			}
		]
	},

	// Magnetic rocks
	magnetic:{
		description:"A solid and magnetic rock.",
		prefix:"Magnetic",
		onDestroy:function() {
			for (var i=0;i<5;i++) {
				var speed=100+Math.random()*100;
				var dir=Math.random()*2*Math.PI;
				var dX=Math.cos(dir)*speed;
				var dY=Math.sin(dir)*speed;
				new Particle(pImg+'Particles/MagneticFracture.png',4,this.x,this.y,dir,300+Math.random()*300,{gravity:500,dX:dX,dY:dY})
			}
		},
		onStep:function() {
			// Only check every second frame
			if (frames%2) {return;}

			//Check for collisions
			if (!this.alive) {return;}
			
			for (var i in depth[3]) {
				var cObj=depth[3][i];
				if (!cObj.alive) {continue;}
				
				var dist=Math.sqrt(Math.pow(cObj.x-this.x,2)+Math.pow(cObj.y-this.y,2))
				var dir=Math.atan2(this.y-cObj.y,this.x-cObj.x);
				
				var b=0.9;
				var acc=100*Math.pow(b,dist/5);
				
				this.dX += Math.cos(dir)*acc;
				this.dY += Math.sin(dir)*acc;
			}
		},
		levels:[
			// Level 1
			{
				life:150,
				value:600,
				gravity:200,
				maxSpeed:150
			},
			// Level 2
			{
				life:500,
				value:2000,
				gravity:100,
				maxSpeed:130
			}
		]
	},

	// Fast rocks
	fast:{
		description:"A fast but not very solid rock.",
		prefix:"Fast",
		onDestroy:function() {
			for (var i=0;i<5;i++) {
				var speed=100+Math.random()*100;
				var dir=Math.random()*2*Math.PI;
				var dX=Math.cos(dir)*speed;
				var dY=Math.sin(dir)*speed;
				new Particle(pImg+'Particles/OrangeFracture.png',4,this.x,this.y,dir,300+Math.random()*300,{gravity:500,dX:dX,dY:dY})
			}
		},
		levels:[
			// Level 1
			{
				life:70,
				value:500,
				gravity:200,
				maxSpeed:200
			},
			// Level 2
			{
				life:200,
				value:1200,
				gravity:200,
				maxSpeed:150
			}
		]
	},
}