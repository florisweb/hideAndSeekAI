



function createArray(_width, _height, _value) {
  let arr = [];
  for (let x = 0; x < _width; x++)
  {
    arr[x] = [];
    for (let y = 0; y < _height; y++)
    {
      arr[x][y] = _value;
    }
  }

  return arr;
}





function TwoDArrTo1D(_2dArr) {
	let newArr = [];
	for (arr of _2dArr) newArr = newArr.concat(arr);
	return newArr;
}



function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function angleTo2PIRange(_angle) {
  while (_angle > 2 * Math.PI) _angle -= Math.PI * 2;
  while (_angle < 0) _angle += Math.PI * 2;
  return _angle;
} 

function splitSeekersFromHiders(_arr) {
  let seekerArr = [];
  let hiderArr = [];
  for (entity of _arr)
  {
    if (entity.type == "seeker") 
    {
      seekerArr.push(entity);
      continue;
    }
    hiderArr.push(entity);
  }
  return {
    seekers: seekerArr,
    hiders: hiderArr
  }
}




function NeuralNetwork(_structure) {
	let This = {
		layers: [],
		feedForward: feedForward,
	}

	createLayersByStructure(_structure);

	return This;




	function createLayersByStructure(_structure) {
		for (let l = 0; l < _structure.length; l++)
		{
			let cLayerLength = _structure[l];

			let cLayer 	= {};
			cLayer.a 	= createRandomArray(cLayerLength);

			if (l == 0)
			{
				This.layers[l] = cLayer;
				continue;
			}
			let prevLayerLength = _structure[l - 1];

			cLayer.b 	= createRandomArray(cLayerLength);
			cLayer.w 	= [];

			for (let n = 0; n < cLayerLength; n++)
			{
				cLayer.w[n] = createRandomArray(prevLayerLength);
			}

			This.layers[l] = cLayer;
		}
	}
	

	function createRandomArray(_arrLength) {
		let arr = [];
		for (let i = 0; i < _arrLength; i++) arr.push(1 - Math.random() * 2);
		return arr;
	}



	function feedForward(_input) {
		This.layers[0].a = copyArr(_input).splice(0, This.layers[0].a.length);
		for (let l = 1; l < This.layers.length; l++) This.layers[l].a = calcActivationsByLayer(l);	
		return This.layers[This.layers.length - 1].a;

		function calcActivationsByLayer(L) {
			let activations = [];
			for (let neuron = 0; neuron < This.layers[L].a.length; neuron++)
			{
				let sum = This.layers[L].b[neuron];
				for (let w = 0; w < This.layers[L - 1].a.length; w++)
				{
					sum += This.layers[L - 1].a[w] * This.layers[L].w[neuron][w];
				}

				activations[neuron] = sigmoid(sum);
			}

			return activations;
		}
	}
}



function copyArr(_arr) {
	return JSON.parse(JSON.stringify(_arr));
}

function sigmoid(t) {
    return 1 / (1 + Math.pow(Math.E, -t));
}



function createArrayWithValues(_length, _value) {
	let arr = [];
	for (let i = 0; i < _length; i++) arr.push(_value);
	return arr;
}	


const Collision = new function() {
	const This = {
		calcFactor: calcFactor,
		addFactors: addFactors,
		apply: apply,
		getAllEntityFactors: getAllEntityFactors,
	}

	function apply(_entity) {
		let factor = calcFactor(_entity);
		let coords = applyFactor(_entity, factor);

		_entity.x = coords.x;
		_entity.y = coords.y;
	}

	function applyFactor(_entity, _factor) {
		const applyConstant = 1;
		let fx = Math.cos(_factor.angle) * _factor.power * applyConstant;
		let fy = -Math.sin(_factor.angle) * _factor.power * applyConstant;

		return {x: _entity.x + fx, y: _entity.y + fy};
	}

	function calcFactor(_entity) {
		let factors = getAllEntityFactors(_entity);
		return averageFactors(factors);
	}


	function averageFactors(_factors) {
		let sumFactor = {
			angle: 0,
			power: 0
		};

		for (factor of _factors)
		{
			sumFactor = addFactors(sumFactor, factor);
		}

		if (_factors.length > 0) sumFactor.power /= _factors.length;
		return sumFactor;
	}

	function addFactors(_factor1, _factor2) {
		let f1x = Math.cos(_factor1.angle) 	* _factor1.power;
		let f1y = -Math.sin(_factor1.angle) * _factor1.power;
		let f2x = Math.cos(_factor2.angle) 	* _factor2.power;
		let f2y = -Math.sin(_factor2.angle) * _factor2.power;

		let newX = f1x + f2x;
		let newY = f1y + f2y;

		return {
			angle: atanWithDX(newX, newY),
			power: Math.sqrt(newX * newX + newY * newY)
		}
	}


	function getAllEntityFactors(_self) {
		const factorAngleRange = .4 * Math.PI;
		const samples = 10;

		let factors = [];

		for (let i = 0; i < samples; i++)
		{
			let curAngle = _self.angle - factorAngleRange + factorAngleRange * 2 / samples * i;
			let value = _self.getEyeValue(curAngle) * eyeRange;
			
			if (value >= entityRadius) continue;
						
			let factor = {
				angle: curAngle,
				power: -(entityRadius - value)
			}

			factors.push(factor);
		}

		return factors;
	}

	return This;
}


function atanWithDX(dx, dy) {
	let angle = -Math.atan(dy / dx);
	if (isNaN(angle)) angle = 0;
	if (dx < 0) angle += Math.PI;
	return angle;
}
function entityConstructor({x, y, angle, eyes, DNA, type, target}) {
  let This = {
    x: x,
    y: y,
    angle: angle,
    eyes: eyes,

    DNA: DNA,

    type: type,
    target: target,
    cought: false,


    getEyeData: getEyeData,
    getEyeValue: getEyeValue,
    update: update,
    totalDistanceToTarget: 0,
  }

  This.brain = createBrain(DNA);



  function update() {
    if (This.cought) return;

    const turnConstant = Math.PI * 2;
    const movementConstant = 5;


    let distanceToTarget = Math.sqrt(
      Math.pow((This.x - This.target.x), 2) + Math.pow((This.y - This.target.y), 2)
    );
    
    if (distanceToTarget < entityRadius * 2)
    {
      This.cought = true;
      This.target.cought = true;
    }
    
    This.totalDistanceToTarget += distanceToTarget;

    let inputs = [distanceToTarget / Game.worldDiagonal];
    

    inputs[1] = angleTo2PIRange(
      atanWithDX(This.target.x - This.x, This.target.y - This.y) - This.angle
    ) / Math.PI / 2;
    
    inputs[2] = angleTo2PIRange(
      This.angle
    ) / Math.PI / 2;



    let eyeData = getEyeData();
    inputs = inputs.concat(eyeData);


    let outputs = This.brain.feedForward(inputs);

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

    let brainStructure = [This.eyes + 3]; 
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

const Trainer = new function() {
  const This = {
    doTrainingRound:      doTrainingRound,
    animateTrainingRound: animateTrainingRound,
    createRandomDNA:      createRandomDNA,

    addEntities:          addEntities,
    settings: {
      seekerSpawn:        {x: 600, y: 100},
      hiderSpawn:         {x: 95, y: 90},
      updatesPerSession:  500,
    }
  }



  function createRandomDNA(_amount = 100) {
    let entities = [];

    for (let i = 0; i < _amount; i++)
    {
      entities.push(
        {
          DNA: [3, 10, 15, 8],
          type: i >= _amount / 2 ? "seeker" : "hider"
        }
      );
    }

    return entities;
  }

  function animateTrainingRound(_DNAlist) {
    return new Promise(function (resolve, error) {
      addEntities(_DNAlist);

      Game.runXUpdates(This.settings.updatesPerSession, function () {
        resolve(selectEntities());
      });
    });
  }

  async function doTrainingRound(_DNAlist) {
    addEntities(_DNAlist);

    const updatesPerRun = 10;
    let totalUpdates = 0;
    
    let promise = new Promise(function (resolve, error) {
      run(resolve);
    });

    function run(resolver) {
      if (totalUpdates > This.settings.updatesPerSession) return resolver();

      totalUpdates += updatesPerRun;
      for (let i = 0; i < updatesPerRun; i++) App.update();
      
      setTimeout(function () {run(resolver)}, 1);
    }

    await promise;
    return selectEntities();
  }




  function addEntities(_DNAlist) {
    Game.entities.clear();
    for (entity of _DNAlist)
    {
      if (entity.type == "seeker") Game.entities.addEntity(Trainer.settings.seekerSpawn.x, Trainer.settings.seekerSpawn.y, Math.PI, 10, entity.DNA, entity.type);
      if (entity.type == "hider") Game.entities.addEntity(Trainer.settings.hiderSpawn.x, Trainer.settings.hiderSpawn.y, Math.PI, 10, entity.DNA, entity.type);
    }
  }



  function selectEntities() {
    let totalSeekerScore = 0;
    let totalHiderScore = 0;
    for (entity of Game.entities)
    {
      entity.score = evaluateEntity(entity);
      switch (entity.type)
      {
        case "seeker":  totalSeekerScore  += entity.score; break;
        default:        totalHiderScore   += entity.score; break;
      }
    }    

    let entities = splitSeekersFromHiders(Game.entities);

    entities.seekers.sort(function (a, b) {
      if (a.score < b.score) return 1;
      return -1;
    });

    entities.hiders.sort(function (a, b) {
      if (a.score < b.score) return 1;
      return -1;
    });


    App.updateStatistics(entities, totalHiderScore);

    let newDNA = [];
    
    let topEntities = entities.seekers.splice(0, Math.round(entities.seekers.length / 2));
    topEntities = topEntities.concat(entities.hiders.splice(0, Math.round(entities.hiders.length / 2)));

    for (entity of topEntities) 
    {
      newDNA.push({type: entity.type, DNA: entity.DNA});
      newDNA.push({type: entity.type, DNA: mutateBrain(entity.DNA)});
    }
    return newDNA;
  }


  function evaluateEntity(_entity) {
    if (_entity.type == "seeker") return Trainer.settings.updatesPerSession / _entity.totalDistanceToTarget;
    return _entity.totalDistanceToTarget / Trainer.settings.updatesPerSession;
  }



  function mutateBrain(_brainDNA) {
    const mutationRate = .1;
    const mutationChance = .5;

    let newDNA = Object.assign([], _brainDNA);

    for (let i = 0; i < newDNA.length; i++) 
    {
      if (Math.random() > mutationChance) continue;
      newDNA[i] += mutationRate - 2 * mutationRate * Math.random();
    }

    return newDNA;
  }

  return This; 
}
const entityRadius = 10;
const eyeRange = 100;


const Game = new function() {
  const This = {
    worldSize: [800, 800],

    walls:    WallConstructor(),
    entities: EntityConstructor(),
    curDNA:   [],

    update: update,
    stop: stop,
    runXUpdates: runXUpdates,

    turboTrain: turboTrain,
    train: train,

    exportData: exportData,
    importData: importData,

    running: true,
    updates: 0,
    generation: 0,
    frameRate: 10,

    turboMode: false,
  }
  This.worldDiagonal = Math.sqrt(This.worldSize[0] * This.worldSize[0] + This.worldSize[1] * This.worldSize[1]);



  function update() {
    for (let i = This.entities.length - 1; i >= 0; i--)
    {
      if (!This.entities[i].target) 
      {
        This.entities.splice(i, 1);
        continue;
      }
      This.entities[i].update();
    }
    
    This.updates++;
    This.generation = Math.round(This.updates / Trainer.settings.updatesPerSession * 10) / 10;
  }


  function runXUpdates(_x = 0, _onFinish) {
    App.update();

    if (_x > 0) 
      setTimeout(Game.runXUpdates, Game.frameRate, _x - 1, _onFinish);
    else 
      try {
        _onFinish();
      }
      catch (e) {console.error("An error accured:", e)}
  }



 


  function train(_DNA) {
    Game.running = true; 
    Game.turboMode = false;
    
    let DNA = _DNA;
    return run();

    async function run() {
      if (!Game.running) return DNA;

      DNA = await Trainer.animateTrainingRound(DNA);
      This.curDNA = DNA;
      return run();
    }
  }

  function turboTrain(_DNA) {
    Game.running = true;
    Game.turboMode = true;    
    let DNA = _DNA;
    return run();

    async function run() {
      if (!Game.running) return DNA;

      DNA = await Trainer.doTrainingRound(DNA);
      This.curDNA = DNA;
      return run();
    }
  }

  function stop() {
    This.running = false;
  }




  function exportData() {
    let obj = {
      DNA:          Game.curDNA,
      generation:   Game.generation,
      walls:        Game.walls,
      config:       Trainer.settings,
    };

    return JSON.stringify(obj);
  }

  function importData(_data) {
      if (!_data) return;
      if (!_data.DNA.length || _data.DNA.length % 2 != 0) return alert("Invalid data-format");
      Trainer.settings = _data.config;
      Game.generation = _data.generation;
      Game.updates = Trainer.settings.updatesPerSession * _data.generation;

      DNA = _data.DNA;
      Game.walls = new WallConstructor();
      for (wall of _data.walls)
      {
        Game.walls.addWall(
          wall.x,
          wall.y,
          wall.width,
          wall.height
        );
      }
      return true;
  }


  return This;
}














function WallConstructor() {
  const Walls = [];


  Walls.addWall = function(_x, _y, _width, _height) {
    let wall = {
      x: _x,
      y: _y,
      width: _width,
      height: _height,
    }
    Walls.push(wall);
    return wall;
  }

  
  return Walls;
}


function EntityConstructor() {
  const Entities = [];

  Entities.addEntity = function(_x, _y, _angle, _eyes, _brainDNA, _type = "seeker") {
    let entity = new entityConstructor({
      x: _x, 
      y: _y, 
      angle: _angle, 
      eyes: _eyes,
      DNA: _brainDNA,
      type: _type,
    });
    
    entity.target = findTarget(entity);
    if (entity.target) entity.target.target = entity;

    Entities.push(entity);
    return entity;
  }


  function findTarget(_entity) {
    let entities = getAvailableTargets();
    let target = false;
    switch (_entity.type)
    {
      case "seeker": target = entities.hiders[0]; break;
      default: target = entities.seekers[0]; break;
    }
    if (!target) return false;
    return target;
  }

  
  function getAvailableTargets() {
    let availableEntities = [];
    for (entity of Entities)
    {
      if (entity.target) continue;
      availableEntities.push(entity);
    }

    return splitSeekersFromHiders(availableEntities);
  }



  Entities.clear = function() {
    Entities.splice(0, Entities.length);
  }

  Entities.export = function() {
    let entities = [];
    for (entity of Entities)
    {
      entities.push({
        DNA: entity.DNA,
        type: entity.type
      });
    }
    return entities;
  }
  
  return Entities;
}








// Add the world walls
const wallThickness = 50;
Game.walls.addWall(-wallThickness, -wallThickness - 1, Game.worldSize[0] + 2 * wallThickness, wallThickness);
Game.walls.addWall(-wallThickness, Game.worldSize[1] + 1, Game.worldSize[0] + 2 * wallThickness, wallThickness);

Game.walls.addWall(-wallThickness - 1, -wallThickness, wallThickness, Game.worldSize[1] + 2 * wallThickness);
Game.walls.addWall(Game.worldSize[0] + 1, -wallThickness, wallThickness, Game.worldSize[1] + 2 * wallThickness);


const walls = Math.round(20 * Math.random());
for (let i = 0; i < walls; i++) 
{
  Game.walls.addWall(
    Game.worldSize[0] * Math.random(), 
    Game.worldSize[1] * Math.random(),
    200 * Math.random(),
    200 * Math.random(),
  );
}


let DNA = Trainer.createRandomDNA(32);

// const fs = require('fs')


const App = new function() {
	this.settings = {
		updateEveryXFrames: 30,
		dataStoragePath: "data.json"
	}

  	this.setup = async function() {
  		// await this.importData();
  		generationAtStart = Game.generation;
    	this.turboTrain(DNA);
  	}
  	this.updateStatistics = function() {}


	let lastDate = new Date();
	let lastUpdateCount = 0;
	let timeSinceStart = new Date();
	let generationAtStart = 0;

	this.update = function() {
		Game.update();
		if (Game.updates % this.settings.updateEveryXFrames != 0) return;

		let fps = (Game.updates - lastUpdateCount) / (new Date() - lastDate) * 1000;
		console.log(Game.generation + " generations " + Math.round(fps * 10) / 10 + " fps");

		let timeRunning     = new Date() - timeSinceStart;
		let deltaGeneration = Game.generation - generationAtStart;
		console.log("Time per generation: " + Math.round(timeRunning / deltaGeneration / 10) / 100 + "s " + "Running for: " + Math.round(timeRunning / 1000) + "s");

		lastDate        = new Date();
		lastUpdateCount = Game.updates;
		// if (Game.generation % 1 == 0) this.exportData();
	}


	this.turboTrain = async function(_DNA) {
		console.log("== Started turbo-training ==");
		let result = await Game.turboTrain(_DNA);
		console.log("== Stopped turbo-training ==");
		return result;
	}











  this.exportData = function() {
  	console.log("- Export data -");
    let data = Game.exportData();

	fs.writeFile(App.settings.dataStoragePath, data, err => {
  		if (err) {
    		console.error(err)
    		return
  		}
	})
  }

  this.importData = function() {
  	return new Promise(function (resolve) {
  		console.log("- Import data - ");

	    fs.readFile(App.settings.dataStoragePath, 'utf8', function (err,_string) {
		  if (err) {
		    return console.log(err);
		  }
		  let data = JSON.parse(_string);
		  console.log(Game.importData(data) ? "[!] Successfully loaded data" : "[!] A problem accured while loading the data.");
		  resolve();
		});
  	});
  }
}



App.setup();