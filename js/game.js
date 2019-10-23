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
    for (entity of This.entities) entity.update();
    Drawer.update();
    This.updates++;
  }

  function run() {
    update();
    
    if (This.running) setTimeout(Game.run, This.frameRate);
  }

  function runXUpdates(_x = 0) {
    update();

    if (This.running && _x > 0) setTimeout(Game.runXUpdates, This.frameRate, _x - 1);
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

  Entities.addEntity = function(_x, _y, _angle, _eyes, _brainDNA) {
    let entity = new entityConstructor({
      x: _x, 
      y: _y, 
      angle: _angle, 
      eyes: _eyes,
    }, 
    _brainDNA
    );

    Entities.push(entity);
    return entity;
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





Game.walls.addWall(40, 40, 90, 30);
Game.walls.addWall(40, 70, 20, 70);
Game.walls.addWall(120, 70, 20, 70);
Game.walls.addWall(40, 180, 90, 30);


Game.entities.addEntity(100, 100, Math.PI, 100, [3, 5, 5, 5]);

Drawer.update();


list = Trainer.createRandomDNA(100);















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


