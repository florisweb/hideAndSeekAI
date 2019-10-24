const Target = {x: 85, y: 100}
const Spawn = {x: 230, y: 200}


const Trainer = new function() {
  const This = {
    doTrainingRound: doTrainingRound,
    animateTrainingRound: animateTrainingRound,
    createRandomDNA: createRandomDNA
  }







  function createRandomDNA(_amount = 100) {
    let entities = [];

    for (let i = 0; i < _amount; i++)
    {
      entities.push([2, 5, 3]);
    }

    return entities;
  }


  function animateTrainingRound(_DNAlist) {
    Game.entities.clear();
    for (DNA of _DNAlist)
    {
      Game.entities.addEntity(Spawn.x, Spawn.y, Math.PI, 10, DNA);
    }

    Game.runXUpdates(250, function () {
      window.list = selectEntities();
      console.log(window.list);

      if (!Game.running) return;
      Trainer.animateTrainingRound(list);
    });
  }

  function doTrainingRound(_DNAlist) {
    Game.entities.clear();
    for (DNA of _DNAlist)
    {
      Game.entities.addEntity(Spawn.x, Spawn.y, Math.PI, 10, DNA);
    }

    for (let i = 0; i < 250; i++) Game.update();

    return selectEntities();
  }



  function selectEntities() {
    let totalScore = 0;
    for (entity of Game.entities)
    {
      entity.score = evaluateEntity(entity);
      totalScore += entity.score;
    }    

    Game.entities.sort(function (a, b) {
      if (a.score < b.score) return 1;
      return -1;
    });
    
    console.warn("Best", window.best = Game.entities[0], "Average: ", totalScore / Game.entities.length);

    let newDNA = [];
    
    let topEntities = Game.entities.splice(0, Math.round(Game.entities.length / 2));
    for (entity of topEntities) 
    {
      newDNA.push(entity.DNA);
      newDNA.push(mutateBrain(entity.DNA));
    }
    return newDNA;
  }







  function evaluateEntity(_entity) {
    // let distance = Math.sqrt(
    //   Math.pow((_entity.x - Target.x), 2) + Math.pow((_entity.y - Target.y), 2)
    // );

    // return 100 / distance;
    return 100 / _entity.totalDistanceToTarget;
  }








  function mutateBrain(_brainDNA) {
    const mutationRate = .1;
    const mutationChance = .5;
    let newDNA = Object.assign([], _brainDNA);

    for (let i = 3; i < newDNA.length; i++) 
    {
      if (Math.random() > mutationChance) continue;
      newDNA[i] += mutationRate - 2 * mutationRate * Math.random();
    }

    return newDNA;
  }


  return This; 
}