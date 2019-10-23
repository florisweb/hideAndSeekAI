



const Drawer = new function() {
  const This = {
    canvas:     gameCanvas,
    
    drawWalls:  drawWalls,
    drawWall:   drawWall,

    drawEntities: drawEntities,
    drawEntity:   drawEntity,
    update:       update
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



  function update() {
    ctx.clearRect(0, 0, This.canvas.width, This.canvas.height);
    drawWalls(Game.walls);
    drawEntities(Game.entities);
  }




  function drawWalls(_walls) {
    for (wall of _walls) drawWall(wall);
  }

  function drawWall(_wall) {
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.strokeRect(_wall.x, _wall.y, _wall.width, _wall.height);
    ctx.closePath();
    ctx.stroke();
  }




  function drawEntities(_entities) {
    for (entity of _entities) drawEntity(entity);
  }


  function drawEntity(_entity) {
    ctx.strokeStyle = "#000";

    ctx.circle(_entity.x, _entity.y, entityRadius);
    ctx.stroke();
    drawEntityAngleArrow(_entity);

    let eyeData = _entity.getEyeData();
    for (let i = 0; i < _entity.eyes; i++) drawEntityEye(_entity, Math.PI * 2 / _entity.eyes * i, eyeData[i], i);
  }


  function drawEntityAngleArrow(_entity) {
    let rx1 = Math.cos(_entity.angle + Math.PI) * entityRadius / 2;
    let ry1 = -Math.sin(_entity.angle + Math.PI) * entityRadius / 2;

    let rx2 = Math.cos(_entity.angle) * entityRadius / 2;
    let ry2 = -Math.sin(_entity.angle) * entityRadius / 2;

    const arrowAngle = Math.PI / 0.85;
    let rxArrowR = Math.cos(_entity.angle - arrowAngle) * entityRadius / 2;
    let ryArrowR = -Math.sin(_entity.angle - arrowAngle) * entityRadius / 2;

    let rxArrowL = Math.cos(_entity.angle + arrowAngle) * entityRadius / 2;
    let ryArrowL = -Math.sin(_entity.angle + arrowAngle) * entityRadius / 2;
    
    ctx.beginPath();
    ctx.moveTo(rx1 + _entity.x, ry1 + _entity.y);
    ctx.lineTo(rx2 + _entity.x, ry2 + _entity.y);

    ctx.moveTo(rx2 + _entity.x, ry2 + _entity.y);
    ctx.lineTo(rxArrowR + rx2 + _entity.x, ryArrowR + ry2 + _entity.y);

    ctx.moveTo(rx2 + _entity.x, ry2 + _entity.y);
    ctx.lineTo(rxArrowL + rx2 + _entity.x, ryArrowL + ry2 + _entity.y);
    ctx.closePath();
    ctx.stroke();
  }

  function drawEntityEye(_entity, _angle, _eyeIndicatorValue, _index) {
    let angle = _entity.angle + _angle;

    let relativeEyeX = Math.cos(angle) * eyeRange;
    let relativeEyeY = -Math.sin(angle) * eyeRange;
    
    ctx.lineWidth = .1;
    ctx.beginPath();
    ctx.moveTo(_entity.x, _entity.y);
    ctx.lineTo(_entity.x + relativeEyeX, _entity.y + relativeEyeY);
    ctx.closePath();
    ctx.stroke();
    ctx.lineWidth = 1;


    let relativeIndicatorX = Math.cos(angle) * eyeRange * _eyeIndicatorValue;
    let relativeIndicatorY = -Math.sin(angle) * eyeRange * _eyeIndicatorValue;

    ctx.fillStyle = "#aaa";
    ctx.beginPath();
    ctx.circle(
      _entity.x + relativeIndicatorX, 
      _entity.y + relativeIndicatorY, 
      entityRadius / 4
    );
    ctx.closePath();
    ctx.fill();
    ctx.fillText(_index, _entity.x + relativeIndicatorX, _entity.y + relativeIndicatorY - 10);
  }



  return This;
}

