class path {
	constructor(points, width){
		this.points = points;
		this.width = width;
		let totalx, totaly;
		for(let i = 0; i < points.length; i ++){
			totalx += points[i][0];
			totaly += points[i][1];
		}
		this.pos = [totalx / points.length, totaly / points.length];
	}
	draw(canvas){
		let c = canvas.getContext("2d");
		c.imageSmoothingEnabled = false;
		c.beginPath();
		c.lineWidth = this.width;
		c.lineCap = "round";
		c.strokeStyle = "white";
		for(let i = 0; i < this.points.length; i ++){
			c.moveTo(this.points[i][0], this.points[i][1]);
			c.lineTo(this.points[i + 1][0], this.points[i + 1][1]);
		}
		c.stroke();
	}
	calculatePos(){	
		let totalx = 0, totaly = 0;
		for(let i = 0; i < this.points.length; i ++){
			totalx += this.points[i][0];
			totaly += this.points[i][1];
		}
		this.pos = [totalx / this.points.length, totaly / this.points.length];
	}
	rotate(cx, cy, angle){
		var r = (cx, cy, x, y, angle) => {
			var radians = (Math.PI / 180) * angle,
				cos = (Math.cos(radians)),
				sin = (Math.sin(radians)),
				nnx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
				nny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
			return [nnx, nny]
		}
		for(let i = 0; i < this.points.length; i ++){
			this.points[i] = r(cx, cy, this.points[i][0], this.points[i][1], angle);
		}
	}
	translate(x, y){
		for(let i = 0; i < this.points.length; i ++){
			this.points[i][0] += x;
			this.points[i][1] += y;
		}
	}
	
}

class doodle {
	constructor(paths){
		this.paths = paths;
		let totalx = 0, totaly = 0;
		for(let i = 0; i < paths.length; i ++){
			paths[i].calculatePos();
			totalx += paths[i].pos[0];
			totaly += paths[i].pos[1];
		}
		this.pos = [totalx / paths.length, totaly / paths.length];
		this.limbs = [];
		this.speed = 50; // In pixels / millisecond
	}
	goto(x, y){
		var a = x - this.pos[0], b = y - this.pos[1], c = Math.hypot(a, b), d = c * this.speed, e = 0, f = setInterval(() => {
			if(e >= d){
				clearInterval(f);
				return;
			}
			for(let i = 0; i < this.limbs.length; i ++){
				this.limbs[i].calculatePos();
				this.limbs[i].rotate(this.limbs[i].pos[0], this.limbs[i].pos[1], 2);
			}
			this.translate(a / d, b / d);
			e ++;
		}, 1);
	}
	calculatePos(){
		let totalx = 0, totaly = 0;
		for(let i = 0; i < this.paths.length - 1; i ++){
			this.paths[i].calculatePos();
			totalx += this.paths[i].pos[0];
			totaly += this.paths[i].pos[1];
		}
		this.pos = [totalx / this.paths.length, totaly / this.paths.length];
	}
	draw(canvas){
		for(let i = 0; i < this.paths.length; i ++){
			this.paths[i].draw(canvas);
		}
	}
	findPaths(count){
		let r = [];
		if(count == this.paths.length){
			return this.paths;
		}else if(count > this.paths.length){
			throw(`count(${count}) > paths.length(${this.paths.length})`);
			return;
		}else if(count < 1){
			throw(`Negative or zero count(${count})`);
		}else{
			let used = [...this.paths.keys()];
			for(let i = 0; i < count; i ++){
				let t = Math.floor(Math.random() * used.length);
				r.push(this.paths[used.splice(t, 1)[0]]);
			}
		}
	}
	rotate(cx, cy, angle){
		for(let i = 0; i < this.paths.length; i ++){
			this.paths[i].rotate(cx, cy, angle);
		}
	}
	translate(x, y){
		for(let i = 0; i < this.paths.length; i ++){
			this.paths[i].translate(x, y);
		}
	}
}

class interaction {
	constructor(doodles, type, location){
		this.doodles = doodles;
		this.type = type;
		this.resolved = false;
		this.location = location
	}
	resolve(){
		for(let i = 0; i < this.doodles.length; i ++){
			this.doodles[i].goto(this.location[0] + Math.random() * 50, this.location[1] + Math.random() * 50);
		}
		let i = Math.floor(Math.random() * this.doodles.length);
		if(this.type == "violent"){
			this.doodles[i].paths.splice(Math.floor(Math.random() * this.doodles[i].paths.length), 1);
			// 0 path doodles still exist, caller of this function will have to remove them.
		}else if(this.type == "peaceful"){
			this.doodles[i].paths.push(new path([[this.doodles[i].pos[0], this.doodles[i].pos[1]], [this.doodles[i].pos[0] + (Math.random() * 20) - 10, this.doodles[i].pos[1] + (Math.random * 20) - 10]]));
		}
		this.resolved = true;
		return i;
	}
}
class collection {
	constructor(doodles){
		this.doodles = doodles;
		this.interactions = [];
	}
	interact(){
		if(this.doodles.length == 0){
			return false;
		}
		this.interactions.push(new interaction([this.doodles[Math.floor(Math.random() * this.doodles.length)], this.doodles[Math.floor(Math.random() * this.doodles.length)]]));
		return true;
	}
	deleteResolvedInteractions(){
		for(let i = 0; i < this.interactions.length; i ++){
			if(this.interactions[i].resolved){
				this.interactions.splice(i, 1);
			}
		}
	}
}
