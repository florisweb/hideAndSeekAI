

function entityConstructor(_data, _brainDNA) {
  let This = {
    x: _data.x,
    y: _data.y,
    angle: _data.angle,
    eyes: _data.eyes,

    DNA: _brainDNA,

    getEyeData: getEyeData,
    getEyeValue: getEyeValue,
    update: update,
  }
  
  This.brain = createBrain(_brainDNA);




  function update() {
    const turnConstant = .5;
    const movementConstant = 5;

    let eyeData = getEyeData();
    let outputs = This.brain.feedForward(eyeData);

    This.angle += (.5 - outputs[1]) * turnConstant;
   
    let rx = Math.cos(This.angle) * outputs[0] * movementConstant;
    let ry = -Math.sin(This.angle) * outputs[0] * movementConstant;
    This.x += rx;
    This.y += ry;
    Collision.apply(This);
  }
  










  function getEyeData() {
    let eyeData = [];
    for (let e = 0; e < This.eyes; e++)
    {
      eyeData[e] = getEyeValue(This.angle + Math.PI * 2 / This.eyes * e);
    }

    return eyeData;
  }



  function getEyeValue(_angle) {
    let lowest = eyeRange;

    for (wall of Game.walls) 
    {
      let value = projectRayOnWall(_angle, wall);
      if (value < lowest) lowest = value;
    }

    return lowest / eyeRange;
  }



  function projectRayOnWall(_rayAngle, _wall) {
    let rayAngle = angleTo2PIRange(_rayAngle);

    for (let rayS = 0; rayS < eyeRange; rayS++)
    {
      let rayX = Math.cos(rayAngle) * rayS;
      let rayY = -Math.sin(rayAngle) * rayS;

      let absoluteX = This.x + rayX;
      let absoluteY = This.y + rayY;
      
      if (
        _wall.x <= absoluteX && 
        _wall.x + _wall.width >= absoluteX && 
        _wall.y <= absoluteY && 
        _wall.y + _wall.height >= absoluteY
      ) return rayS;
    }

    return eyeRange;
  }








  function createBrain(_brainDNA) {
    const outputNeurons = 2;

    let brainStructure = [This.eyes]; 
    let layers = Math.abs(Math.round(_brainDNA[0]));

    let newBrainDNA = Object.assign([], _brainDNA);
    let curBrainIndex = layers;

    let supposedBrainDNASize = layers + 1;

    for (let l = 1; l < layers + 2; l++)
    {
      let prevLayerLength = brainStructure[l - 1];
      let curLayerLength = Math.abs(Math.round(_brainDNA[l]));
      if (curLayerLength <= 0) curLayerLength = 1; 

      if (l != layers + 1) 
      {
        brainStructure.push(curLayerLength);
      } else curLayerLength = outputNeurons;
      
      supposedBrainDNASize += curLayerLength + prevLayerLength * curLayerLength;

      for (let n = 0; n < curLayerLength; n++)
      {
        curBrainIndex++;
        if (!newBrainDNA[curBrainIndex])
        {
          newBrainDNA[curBrainIndex] = 1 - Math.random() * 2;
        }
      
        for (let w = 0; w < prevLayerLength; w++)
        {
          curBrainIndex++;
          if (newBrainDNA[curBrainIndex]) continue;
          newBrainDNA[curBrainIndex] = 1 - Math.random() * 2;
        }
      } 
    }

    brainStructure.push(outputNeurons); // outputs


    if (supposedBrainDNASize > newBrainDNA.length)
    {
      console.warn("Brain-error", This, supposedBrainDNASize, newBrainDNA.length, brainStructure);
      Main.running = false;
    }

    let brain = new NeuralNetwork(brainStructure);
    let brainData = Object.assign([], newBrainDNA).splice(layers + 1, newBrainDNA.length);
    This.DNA = newBrainDNA;
    return populateBrain(brain, brainData, brainStructure);
  }

  function populateBrain(_brain, _brainData, _brainStructure) {
    for (let l = 1; l < _brain.layers.length; l++)
    {
      let cLayer  = _brain.layers[l];
      cLayer.b  = _brainData.splice(0, _brainStructure[l]);

      for (let n = 0; n < cLayer.w.length; n++)
      {
        cLayer.w[n] = _brainData.splice(0, _brainStructure[l - 1]);
      }
    }

    return _brain;
  }




  return This;
}