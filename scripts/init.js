(() => {
	var mousedown = false;
	var doodles = new collection([]);
	var mousepos = [0, 0]
	var creation = {paths : [], currentPath : null, pathInProgress : false};
	document.oncontextmenu = () => false;
	document.onmousedown = () => {
		mousedown = true;
	}
	document.onmouseup = () => {
		mousedown = false;
	}
	document.onmousemove = e => {
		mousepos[0] = e.clientX;
		mousepos[1] = e.clientY;
	}
	// Using css width resulted in blurry and stretched canvas.
	window.onresize = () => {
		document.getElementById("main").width = window.innerWidth;
		document.getElementById("main").height = window.innerHeight;
	};
	window.onresize();
	setInterval(() => { // Fast thread
		doodles.deleteResolvedInteractions();
		for(let i = 0; i < doodles.doodles.length; i ++){
			if(!doodles.doodles[i].interacting){
				doodles.doodles[i].idle();
			}
			doodles.doodles[i].backinside();
			doodles.doodles[i].calculatePos();
		}
		if(Math.random() < 0.0005){ // (Random) Slow thread
			doodles.interact();
			for(let i = 0; i < doodles.interactions.length; i ++){
				if(doodles.interactions[i].presences.every(Boolean)){
					doodles.interactions[i].resolve();
				}
			}
			console.log("doodles iteracted, [d] to dump");
		}
		document.getElementById("main").getContext("2d").clearRect(0, 0, window.innerWidth, window.innerHeight)
		doodles.draw(document.getElementById("main"));
		if(creation.pathInProgess){
			let c = new path(creation.currentPath, 10);
			c.draw(document.getElementById("main"), "red");
		}
		if(creation.paths.length > 0){
			for(let i = 0; i < creation.paths.length; i ++){
				let q = new path(creation.paths[i], 10);
				q.draw(document.getElementById("main"), "blue");
		 	}
		}
	});
	setInterval(() => { // Drawing thread
		// Render progress; not working right now
		if(creation.pathInProgess){
			let c = new path(creation.currentPath, 10);
			c.draw(document.getElementById("main"), "red");
		}
		if(creation.paths.length > 0){
			for(let i = 0; i < creation.paths.length; i ++){
				let q = new path(creation.paths[i], 10);
				q.draw(document.getElementById("main"), "blue");
		 	}
		}
		if(mousedown){
			if(creation.pathInProgress){
				creation.currentPath.points.push(JSON.parse(JSON.stringify(mousepos)));
			} else {
				creation.pathInProgress = true;
				creation.currentPath = new path([], 10);
			}
		} else {
			if(creation.pathInProgress){
				creation.paths.push(creation.currentPath);
				creation.currentPath = null;
				creation.pathInProgress = false;
			}
		}
	});
	document.addEventListener("keydown", e => {
		if(e.key == "g"){
			let n = new doodle(creation.paths);
			n.limbs = n.findPaths(Math.floor(creation.paths.length / 2));
			doodles.doodles.push(n);
			creation = {paths : [], currentPath : null, pathInProgress : false};
		} else if(e.key == "q"){
			for(let i = 0; i < doodles.interactions.length; i ++){
				doodles.interactions[i].resolve();
			}
		} else if(e.key == "d"){
			console.log(doodles);
		} else if(e.key == "w"){
			for(let i = 0; i < doodles.doodles.lenght; i ++){
				prompt("");
				doodles.doodles[i].goto(JSON.parse(prompt(`Doodle ${i} target?`)));
			}
		}
	});
})();
