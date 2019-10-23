const entityRadius = 10;
const eyeRange = 100;




const Game = new function() {
  const This = {
    walls: WallConstructor(),
    entities: EntityConstructor(),
    update: update,
  }

  function update() {
    for (entity of This.entities) entity.update();
    Drawer.update();
    setTimeout(Game.update, 10);
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


  Entities.addEntity = function(_x, _y, _angle, _eyes) {
   let entity = new entityConstructor({
      x: _x, 
      y: _y, 
      angle: _angle, 
      eyes: _eyes,
    }, 
    [3, 5, 5, 5]
    );

    Entities.push(entity);
    return entity;
  }

  
  return Entities;
}










// Add the world walls
Game.walls.addWall(0, 0, Drawer.canvas.height, 1);
Game.walls.addWall(0, Drawer.canvas.height - 1, Drawer.canvas.height, 1);

Game.walls.addWall(0, 0, 1, Drawer.canvas.height);
Game.walls.addWall(Drawer.canvas.width - 1, 0, 1, Drawer.canvas.height);





Game.walls.addWall(20, 20, 50, 30);
Game.walls.addWall(40, 70, 20, 70);


Game.entities.addEntity(100, 100, Math.PI, 200);
Game.entities.addEntity(200, 200, 0, 50);

Drawer.update();













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


