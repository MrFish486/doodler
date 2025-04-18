(() => {
	var mousedown = false;
	document.oncontextmenu = () => false;
	document.onmousedown = () => {
		mousedown = true;
	}
	document.onmouseup = () => {
		mousedown = false;
	}
	// Using css width resulted in blurry and stretched canvas.
	window.onresize = () => {
		document.getElementById("main").width = window.innerWidth;
		document.getElementById("main").height = window.innerHeight;
	};
	window.onresize();
})();
