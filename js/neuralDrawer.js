



const NeuralDrawer = new function() {
  const This = {
    canvas:     networkCanvas,
    
  	drawNetwork: drawNetwork,
  	settings: {
  		updateEveryXFrames: 20
  	}
  }
  
  const ctx = This.canvas.getContext("2d");
  ctx.constructor.prototype.circle = function(x, y, size) {
    if (size < 0) return;

    this.beginPath();
    this.ellipse(
      x, 
      y, 
      size,
      size,
      0,
      0,
      2 * Math.PI
    );
    this.closePath();
  }

  const layerWidth = 180;
  const indexHeight = 50;
  const nodeRadius = 22;
  const offsetX = 30;

  let curNetwork;
  function drawNetwork(_network) {
  	curNetwork = _network;
  	ctx.clearRect(0, 0, This.canvas.width, This.canvas.height);

  	for (let l = 1; l < _network.length; l++)
  	{
  		for (let i = 0; i < _network[l].a.length; i++)
  		{
  			let weights = _network[l].w[i];
  			for (let w = 0; w < weights.length; w++)
  			{	

  				drawWeight(
  					l - 1, 
  					w,
  					i,
  					weights[w]
  				);
  			}
  		}
  	}

  	for (let l = 0; l < _network.length; l++)
  	{
  		for (let i = 0; i < _network[l].a.length; i++)
  		{
  			drawNode(l, i, _network[l].a[i]);
  		}
  	}
  }



  function drawNode(_layer, _index, _value) {  	
  	ctx.strokeStyle = "#000"
  	ctx.fillStyle = valToColour(_value);

  	let coords = getXYFromLayerIndex(_layer, _index);
  	ctx.circle(
  		coords.x,
  		coords.y,
  		nodeRadius
  	);
  	ctx.stroke();
  	ctx.fill();


  	ctx.fillStyle = "#fff";  	
  	ctx.font = Math.round(nodeRadius / 1.3) + "px Arial"; 
  	ctx.textAlign = "center";
  	ctx.beginPath();

    let text = Math.round(_value * 100) / 100;
    if (text < 1 && text > 0) text = String(text).substr(1, 10);
  	ctx.fillText(
  		text,
  		coords.x,
  		coords.y + nodeRadius / 3 - 1
  	);
  	ctx.closePath();
  	ctx.fill();
  }


  function drawWeight(_startLayer, _indexA, _indexB, _value) {
  	let startCoords = getXYFromLayerIndex(_startLayer, _indexA);
  	let endCoords = getXYFromLayerIndex(_startLayer + 1, _indexB);
  	
  	ctx.strokeStyle = valToColour(_value);
  	ctx.lineWidth = _value;
  	ctx.beginPath();
  	ctx.moveTo(
  		startCoords.x,
  		startCoords.y
  	);
  	ctx.lineTo(
  		endCoords.x,
  		endCoords.y
  	);
  	ctx.closePath();
  	ctx.stroke();
  }


  

  function valToColour(_value) {
  	let scaledVal = 127.5 - 255 * (_value / 2);
  	return "rgb(" + scaledVal + ", " + scaledVal + "," + scaledVal + ")";
  }

  function getXYFromLayerIndex(_layer, _index) {
  	let layerLength = curNetwork[_layer].a.length;
  	let centeredY = (_index - layerLength / 2) * indexHeight + This.canvas.height / 2;

  	return {
  		x: _layer * layerWidth + offsetX,
  		y: centeredY,
  	}
  }




  return This;
}

