const entityRadius = 10;
const eyeRange = 100;




const Game = new function() {
  const This = {
    walls: WallConstructor(),
    entities: EntityConstructor(),
    update: update,
    run: run,
    runXUpdates: runXUpdates,

    turboTrain: turboTrain,
    train: train,

    running: true,
    updates: 0,
    generation: 0,
    frameRate: 10,

    turboMode: false,
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
    
    if (This.updates % NeuralDrawer.settings.updateEveryXFrames == 0) 
    {
      This.generation = Math.round(This.updates / Trainer.settings.updatesPerSession * 10) / 10;
      debugHolder.innerHTML = 
        Math.round(window.fps * 10) / 10 + " fps <br>" + 
        This.generation + " generations"; 
      // NeuralDrawer.drawNetwork(Game.entities[0].brain.layers);

      window.fps = (This.updates - lastUpdateCount) / (new Date() - lastDate) * 1000;
      lastDate = new Date();
      lastUpdateCount = This.updates;

      if (This.turboMode) 
      {
        let timeRunning = new Date() - timeSinceStart;
        let deltaGeneration = This.generation - generationAtStart;

        turbo_timePerGenHolder.innerHTML = "Time per generation: " + Math.round(timeRunning / deltaGeneration / 10) / 100 + "s";
        turbo_runningFor.innerHTML = "Running for: " + Math.round(timeRunning / 1000) + "s";
      }
    }

    This.updates++;
  }

  function run() {
    update();
    
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
    return run();

    async function run() {
      if (!Game.running) {mainContent.classList.remove('turboMode'); return DNA;}
      DNA = await Trainer.doTrainingRound(DNA);
      return run();
    }
  }


  function train(_DNA) {
    Game.running = true; 
    Game.turboMode = false;
    
    let DNA = _DNA;
    return run();

    async function run() {
      if (!Game.running) return DNA;
      DNA = await Trainer.animateTrainingRound(DNA);
      return run();
    }
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
Game.walls.addWall(0, -wallThickness - 1, Drawer.canvas.width * 2, wallThickness);
Game.walls.addWall(0, Drawer.canvas.height + 1, Drawer.canvas.width, wallThickness);

Game.walls.addWall(-wallThickness - 1, 0, wallThickness, Drawer.canvas.height);
Game.walls.addWall(Drawer.canvas.width + 1, 0, wallThickness, Drawer.canvas.height);


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




let DNA = Trainer.createRandomDNA(30);

