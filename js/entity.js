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









  return This;
}