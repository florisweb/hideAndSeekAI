function entityConstructor(_data) {
  let This = {
    x: _data.x,
    y: _data.y,
    angle: _data.angle,
    eyes: _data.eyes,

    getEyeData: getEyeData,
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
    for (let rayX = 0; rayX < eyeRange; rayX++)
    {
      let rayY = Math.tan(_rayAngle) * rayX;

      let absoluteX = This.x + rayX;
      if (_rayAngle > .5 * Math.PI && _rayAngle < 1.5 * Math.PI) absoluteX -= 2 * rayX;

      let absoluteY = This.y + rayY;
      if (_rayAngle > 0 && _rayAngle < Math.PI) absoluteY -= 2 * rayY;

      if (
        _wall.x <= absoluteX && 
        _wall.x + _wall.width >= absoluteX && 
        _wall.y <= absoluteY && 
        _wall.y + _wall.height >= absoluteY
      ) return Math.sqrt(rayX * rayX + rayY * rayY);
    }

    return eyeRange;
  }









  return This;
}