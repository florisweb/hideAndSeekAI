const entityRadius = 10;
const eyeRange = 100;




const Game = new function() {
  const This = {
    walls: WallConstructor(),
    entities: EntityConstructor(),
    update: update,
    run: run,
    runXUpdates: runXUpdates,

    running: true,
    updates: 0,
    frameRate: 10,
  }


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

    Drawer.update();
    This.updates++;
  }

  function run() {
    update();
    
    if (This.running) setTimeout(Game.run, This.frameRate);
  }

  function runXUpdates(_x = 0, _onFinish) {
    update();

    if (This.running && _x > 0) 
      setTimeout(Game.runXUpdates, This.frameRate, _x - 1, _onFinish);
    else 
      try {
        _onFinish();
      }
      catch (e) {console.error("An error accured:", e)}
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
  
  return Entities;
}










// Add the world walls
const wallThickness = 50;
Game.walls.addWall(0, -wallThickness, Drawer.canvas.width * 2, wallThickness);
Game.walls.addWall(0, Drawer.canvas.height, Drawer.canvas.width, wallThickness);

Game.walls.addWall(-wallThickness, 0, wallThickness, Drawer.canvas.height);
Game.walls.addWall(Drawer.canvas.width, 0, wallThickness, Drawer.canvas.height);





Game.walls.addWall(50, 40, 150, 30);

Game.walls.addWall(40, 70, 20, 30);
Game.walls.addWall(40, 140, 20, 40);

Game.walls.addWall(120, 70, 20, 70);
Game.walls.addWall(40, 180, 90, 30);

Game.walls.addWall(180, 100, 20, 130);

Drawer.update();



animatedList = Trainer.createRandomDNA(100);







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


