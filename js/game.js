const NoTeam = .5;
const TeamA = -5;
const TeamB = 5;


// 0 = Player A
// .5 = Empty
// 1 = Player B


const Game = new function() {
  const This = {
    walls: WallConstructor(),
    entities: EntityConstructor()
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
    let entity = {
      x: _x,
      y: _y,
      angle: _angle,
      eyes: _eyes
    }

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


Game.entities.addEntity(100, 100, Math.PI * .8, 10);

Drawer.drawWalls(Game.walls);
Drawer.drawEntities(Game.entities);























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


