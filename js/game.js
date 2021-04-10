const entityRadius = 10;
const eyeRange = 100;




const Game = new function() {
  const HTML = {
    turboButton:  $("#header button")[0],
    startButton:  $("#header button")[1],
    stopButton:   $("#header button")[2],

    dataInput:    dataInput,
  }

  const This = {
    walls:    WallConstructor(),
    entities: EntityConstructor(),
    update: update,
    run: run,
    stop: stopRunning,
    runXUpdates: runXUpdates,

    turboTrain: turboTrain,
    train: train,

    downloadData: downloadData,
    loadData:     loadData,

    running: true,
    updates: 0,
    generation: 0,
    frameRate: 10,

    turboMode: true,
  }


  let lastDate = new Date();
  let lastUpdateCount = 0;
  let timeSinceStart = new Date();
  let generationAtStart = 0;

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

    if (!This.turboMode) Drawer.update();
    
    This.updates++;
    if (This.updates % (NeuralDrawer.settings.updateEveryXFrames * (1 + 4 * This.turboMode)) != 0) return;
  
    This.generation       =   Math.round(This.updates / Trainer.settings.updatesPerSession * 10) / 10;
    debugHolder.innerHTML =   Math.round(window.fps * 10) / 10 + " fps <br>" + 
                              This.generation + " generations"; 
    

    window.fps      = (This.updates - lastUpdateCount) / (new Date() - lastDate) * 1000;
    lastDate        = new Date();
    lastUpdateCount = This.updates;

    
    if (!This.turboMode) 
    {
      NeuralDrawer.drawNetwork(Game.entities[0].brain.layers);
      return;
    }
    
    let timeRunning                   = new Date() - timeSinceStart;
    let deltaGeneration               = This.generation - generationAtStart;

    turbo_timePerGenHolder.innerHTML  = "Time per generation: " + Math.round(timeRunning / deltaGeneration / 10) / 100 + "s";
    turbo_runningFor.innerHTML        = "Running for: " + Math.round(timeRunning / 1000) + "s";  
  }

  function run() {
    update();
    setButtonRunStatus(true);
  
    if (This.running) setTimeout(Game.run, This.frameRate);
  }

  function runXUpdates(_x = 0, _onFinish) {
    update();

    if (_x > 0) 
      setTimeout(Game.runXUpdates, This.frameRate, _x - 1, _onFinish);
    else 
      try {
        _onFinish();
      }
      catch (e) {console.error("An error accured:", e)}
  }



  function turboTrain(_DNA) {
    Game.running = true;
    Game.turboMode = true;
    mainContent.classList.add('turboMode');
    timeSinceStart = new Date();
    generationAtStart = This.generation;

    
    let DNA = _DNA;
    setButtonRunStatus(true);
    return run();

    async function run() {
      if (!Game.running) 
      {
        setButtonRunStatus(false);
        mainContent.classList.remove('turboMode'); 
        return DNA;
      }

      DNA = await Trainer.doTrainingRound(DNA);
      return run();
    }
  }


  function train(_DNA) {
    Game.running = true; 
    Game.turboMode = false;
    
    let DNA = _DNA;
    setButtonRunStatus(true);
    return run();

    async function run() {
      if (!Game.running) 
      {
        setButtonRunStatus(false);
        return DNA;
      }

      DNA = await Trainer.animateTrainingRound(DNA);
      return run();
    }
  }



  function stopRunning() {
    This.running = false;
  }


  function setButtonRunStatus(_running = false) {
    HTML.turboButton.disabled = _running;
    HTML.startButton.disabled = _running;
    HTML.stopButton.disabled  = !_running;
  }








  function downloadData() {
    let obj = {
      DNA:          DNA,
      generation:   This.generation,
      walls:        This.walls
    };

    let data = [JSON.stringify(obj)];
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob(data, {type: 'text/txt'}));
    a.download = 'DNA.txt';

    // Append anchor to body.
    document.body.appendChild(a);
    a.click();

    // Remove anchor from body
    document.body.removeChild(a);
  }

  function loadData() {
    let file = HTML.dataInput.files[0];
    if (!file) return;

    let reader = new FileReader();
    reader.addEventListener('load', function(e) { 
        let data = JSON.parse(e.target.result);
        if (!data) return;
        if (!data.DNA.length || data.DNA.length % 2 != 0) return alert("Invalid data-format");
        
        console.log(data);

        DNA = data.DNA;
        This.updates = Trainer.settings.updatesPerSession * data.generation;

        This.walls = new WallConstructor();
        for (wall of data.walls)
        {
          This.walls.addWall(
            wall.x,
            wall.y,
            wall.width,
            wall.height
          );
        }
        Drawer.update();
        alert("Successfully loaded DNA.")
    });

    // file reading failed
    reader.addEventListener('error', function() {alert('Error : Failed to read file');});

    // read as text file
    reader.readAsText(file);
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
Game.walls.addWall(-wallThickness, -wallThickness - 1, Drawer.canvas.width + 2 * wallThickness, wallThickness);
Game.walls.addWall(-wallThickness, Drawer.canvas.height + 1, Drawer.canvas.width + 2 * wallThickness, wallThickness);

Game.walls.addWall(-wallThickness - 1, -wallThickness, wallThickness, Drawer.canvas.height + 2 * wallThickness);
Game.walls.addWall(Drawer.canvas.width + 1, -wallThickness, wallThickness, Drawer.canvas.height + 2 * wallThickness);


const walls = Math.round(20 * Math.random());
for (let i = 0; i < walls; i++) 
{
  Game.walls.addWall(
    Drawer.canvas.width * Math.random(), 
    Drawer.canvas.height * Math.random(),
    200 * Math.random(),
    200 * Math.random(),
  );
}


Drawer.update();


let DNA = Trainer.createRandomDNA(32);

