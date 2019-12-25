



const Trainer = new function() {
  const This = {
    doTrainingRound:      doTrainingRound,
    animateTrainingRound: animateTrainingRound,
    createRandomDNA:      createRandomDNA,

    addEntities:          addEntities,
    settings: {
      seekerSpawn: {x: 400, y: 400},
      hiderSpawn: {x: 95, y: 90},
      updatesPerSession: 500,
    }
  }



  function createRandomDNA(_amount = 100) {
    let entities = [];

    for (let i = 0; i < _amount; i++)
    {
      entities.push(
        {
          DNA: [2, 5, 4],
          type: i >= _amount / 2 ? "seeker" : "hider"
        }
      );
    }

    return entities;
  }

  function animateTrainingRound(_DNAlist) {
    return new Promise(function (resolve, error) {
      addEntities(_DNAlist);

      Game.runXUpdates(This.settings.updatesPerSession, function () {
        resolve(selectEntities());
      });
    });
  }

  async function doTrainingRound(_DNAlist) {
    addEntities(_DNAlist);

    const updatesPerRun = 10;
    let totalUpdates = 0;
    
    let promise = new Promise(function (resolve, error) {
      run(resolve);
    });

    function run(resolver) {
      if (totalUpdates > This.settings.updatesPerSession) return resolver();

      totalUpdates += updatesPerRun;
      for (let i = 0; i < updatesPerRun; i++) Game.update();
      
      requestAnimationFrame(function () {run(resolver)});
    }

    await promise;
    return selectEntities();
  }




  function addEntities(_DNAlist) {
    Game.entities.clear();
    for (entity of _DNAlist)
    {
      if (entity.type == "seeker") Game.entities.addEntity(Trainer.settings.seekerSpawn.x, Trainer.settings.seekerSpawn.y, Math.PI, 10, entity.DNA, entity.type);
      if (entity.type == "hider") Game.entities.addEntity(Trainer.settings.hiderSpawn.x, Trainer.settings.hiderSpawn.y, Math.PI, 10, entity.DNA, entity.type);
    }
  }



  function selectEntities() {
    let totalSeekerScore = 0;
    let totalHiderScore = 0;
    for (entity of Game.entities)
    {
      entity.score = evaluateEntity(entity);
      switch (entity.type)
      {
        case "seeker":  totalSeekerScore  += entity.score; break;
        default:        totalHiderScore   += entity.score; break;
      }
    }    

    let entities = splitSeekersFromHiders(Game.entities);

    entities.seekers.sort(function (a, b) {
      if (a.score < b.score) return 1;
      return -1;
    });

    entities.hiders.sort(function (a, b) {
      if (a.score < b.score) return 1;
      return -1;
    });


    let bestSeekerScore = 1 / entities.seekers[0].score;
    let bestHiderScore = entities.hiders[0].score;
    let averageScore = totalHiderScore / entities.hiders.length;
    
    Statistics.update([
      [bestSeekerScore, Drawer.canvasDiagonal], 
      [bestHiderScore, Drawer.canvasDiagonal], 
      [averageScore, Drawer.canvasDiagonal]
    ]);

    let newDNA = [];
    
    let topEntities = entities.seekers.splice(0, Math.round(entities.seekers.length / 2));
    topEntities = topEntities.concat(entities.hiders.splice(0, Math.round(entities.hiders.length / 2)));

    for (entity of topEntities) 
    {
      newDNA.push({type: entity.type, DNA: entity.DNA});
      newDNA.push({type: entity.type, DNA: mutateBrain(entity.DNA)});
    }
    return newDNA;
  }


  function evaluateEntity(_entity) {
    if (_entity.type == "seeker") return Trainer.settings.updatesPerSession / _entity.totalDistanceToTarget;
    return _entity.totalDistanceToTarget / Trainer.settings.updatesPerSession;
  }




  function mutateBrain(_brainDNA) {
    const mutationRate = .1;
    const mutationChance = .5;

    let newDNA = Object.assign([], _brainDNA);

    for (let i = 0; i < newDNA.length; i++) 
    {
      if (Math.random() > mutationChance) continue;
      newDNA[i] += mutationRate - 2 * mutationRate * Math.random();
    }

    return newDNA;
  }


  return This; 
}