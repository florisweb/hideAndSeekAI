



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





function TwoDArrTo1D(_2dArr) {
	let newArr = [];
	for (arr of _2dArr) newArr = newArr.concat(arr);
	return newArr;
}



function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function angleTo2PIRange(_angle) {
  while (_angle > 2 * Math.PI) _angle -= Math.PI * 2;
  while (_angle < 0) _angle += Math.PI * 2;
  return _angle;
} 

function splitSeekersFromHiders(_arr) {
  let seekerArr = [];
  let hiderArr = [];
  for (entity of _arr)
  {
    if (entity.type == "seeker") 
    {
      seekerArr.push(entity);
      continue;
    }
    hiderArr.push(entity);
  }
  return {
    seekers: seekerArr,
    hiders: hiderArr
  }
}

