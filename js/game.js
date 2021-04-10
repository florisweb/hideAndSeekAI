
const entityRadius = 10;
const eyeRange = 100;


const Game = new function() {
  const This = {
    worldSize: [800, 800],

    walls:    WallConstructor(),
    entities: EntityConstructor(),
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
      return run();
    }
  }

  function stop() {
    This.running = false;
  }




  function exportData() {
    let obj = {
      DNA:          DNA,
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

