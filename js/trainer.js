



const Trainer = new function() {
  const This = {
    doTrainingRound:      doTrainingRound,
    animateTrainingRound: animateTrainingRound,
    createRandomDNA:      createRandomDNA,

    runIndividualRound: runIndividualRound,

    settings: {
      seekerSpawn: {x: 230, y: 200},
      hiderSpawn: {x: 95, y: 90},
      updatesPerSession: 250,
    }
  }





  function createRandomDNA(_amount = 100) {
    let entities = [];

    for (let i = 0; i < _amount; i++)
    {
      entities.push(
        {
          DNA: [2, 5, 3],
          type: i >= _amount / 2 ? "seeker" : "hider"
        }
      );
    }

    return entities;
  }


  function runIndividualRound(_entity) {
    addEntities([
      _entity,
      _entity.target
    ]);
    Game.runXUpdates(This.settings.updatesPerSession);
  }

  function animateTrainingRound(_DNAlist) {
    addEntities(_DNAlist);

    Game.runXUpdates(This.settings.updatesPerSession, function () {
      window.animatedList = selectEntities();
      console.log(window.animatedList);

      if (!Game.running) return;
      Trainer.animateTrainingRound(window.animatedList);
    });
  }

  

  function doTrainingRound(_DNAlist) {
    addEntities(_DNAlist);

    for (let i = 0; i < This.settings.updatesPerSession; i++) Game.update();

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


    console.warn(
      "Best", window.best = Game.entities[0], 
      "Average seeker: " + totalSeekerScore / entities.seekers.length,
      "Average hider: " + totalHiderScore / entities.hiders.length
    );


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

    for (let i = 3; i < newDNA.length; i++) 
    {
      if (Math.random() > mutationChance) continue;
      newDNA[i] += mutationRate - 2 * mutationRate * Math.random();
    }

    return newDNA;
  }


  return This; 
}