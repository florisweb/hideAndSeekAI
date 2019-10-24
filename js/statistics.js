
const Statistics = new function() {
	let This = {
		canvas: $("#populationGraph")[0],
		update: update,
		shiftCanvas: shiftCanvas,
		settings: {
			updateEveryXFrames: 500
		}
	}

	let ctx = This.canvas.getContext("2d");

	
	let prefGraphLines = [];
	const colours = [
		"#f00",
		"#00f",
		"#a0a",
	];

	let drawCursorX = 0; 
	let canvasShift = 0;
	const xScale = 5;

	function update(_data) {
		console.log(_data, drawCursorX, canvasShift);		
		if (drawCursorX > This.canvas.width)
		{
			shiftCanvas(xScale);
			canvasShift += xScale;
		}

		drawCursorX += xScale;
		drawGraphLines(_data);
	}

	function drawGraphLines(_graphLineValues) {
		for (let i = 0; i < prefGraphLines.length; i++)
		{
			drawLine(prefGraphLines[i], _graphLineValues[i], colours[i]);
		}

		prefGraphLines = _graphLineValues;
	}

	function drawLine(_from, _to, _colour) {
		let startY = This.canvas.height - mapY(_from);
		let endY = This.canvas.height - mapY(_to);
		ctx.strokeStyle = _colour;
		ctx.beginPath();
		ctx.moveTo(drawCursorX - xScale - canvasShift, startY);
		ctx.lineTo(drawCursorX - canvasShift, endY);
		ctx.closePath();
		ctx.stroke();
	}

	function shiftCanvas(_px) {
		var imageData = ctx.getImageData(_px, 0, ctx.canvas.width - _px, ctx.canvas.height);
		ctx.putImageData(imageData, 0, 0);
		ctx.clearRect(ctx.canvas.width - _px, 0, _px, ctx.canvas.height);
	}


	function mapY(_valuePair) {//  0 = actual value, 1 = max value
		return _valuePair[0] / _valuePair[1] * This.canvas.height; // 200 is max population size
	}
	return This;
}


