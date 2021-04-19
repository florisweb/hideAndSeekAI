
const App = new function() {
  const HTML = {
    turboButton:  $("#header button")[0],
    startButton:  $("#header button")[1],
    stopButton:   $("#header button")[2],

    dataInput:    dataInput,
  }

  this.setup = async function() {
    let result = await this.loadDataFromServer();
    if (!result) Game.curDNA = Trainer.createRandomDNA(30);
  }

  let lastDate = new Date();
  let lastUpdateCount = 0;
  let timeSinceStart = new Date();
  let generationAtStart = 0;
  
  this.update = function() {
    Game.update();

    if (!Game.turboMode) Drawer.update();
    if (Game.updates % (NeuralDrawer.settings.updateEveryXFrames * (1 + 4 * Game.turboMode)) != 0) return;
  
    debugHolder.innerHTML =   "<div style='width: 80px; float: left'>" + Math.round(window.fps * 10) / 10 + " fps</div>" + 
                              "<div style='float: left'>" + Game.generation + " generations</div>"; 
    

    window.fps      = (Game.updates - lastUpdateCount) / (new Date() - lastDate) * 1000;
    lastDate        = new Date();
    lastUpdateCount = Game.updates;
    
    if (!Game.turboMode) 
    {
      NeuralDrawer.drawNetwork(Game.entities[0].brain.layers);
      return;
    }
    
    let timeRunning                   = new Date() - timeSinceStart;
    let deltaGeneration               = Game.generation - generationAtStart;

    turbo_timePerGenHolder.innerHTML  = "Time per generation: " + Math.round(timeRunning / deltaGeneration / 10) / 100 + "s";
    turbo_runningFor.innerHTML        = "Running for: " + Math.round(timeRunning / 1000) + "s";  
  }



  this.stop = function() {
    Game.stop();
  }

  this.train = async function() {
    setButtonRunStatus(true);
    Game.curDNA = await Game.train(Game.curDNA);
    setButtonRunStatus(false);
    return Game.curDNA;
  }

  this.turboTrain = async function() {
    mainContent.classList.add('turboMode');
    timeSinceStart    = new Date();
    generationAtStart = Game.generation;

    setButtonRunStatus(true);
    Game.curDNA = await Game.turboTrain(Game.curDNA);
    
    setButtonRunStatus(false);
    mainContent.classList.remove('turboMode'); 
    return Game.curDNA;
  }











  this.downloadData = function() {
    let data = [Game.exportData()];
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob(data, {type: 'text/txt'}));
    a.download = 'DNA.txt';

    // Append anchor to body.
    document.body.appendChild(a);
    a.click();

    // Remove anchor from body
    document.body.removeChild(a);
  }

  this.loadData = function() {
    return new Promise(function (resolve) {

      let file = HTML.dataInput.files[0];
      if (!file) return;

      let reader = new FileReader();
      reader.addEventListener('load', function(e) { 
          let data = JSON.parse(e.target.result);
          let result = Game.importData(data);
          resolve(result);
          Drawer.update();
          alert(result ? "Successfully loaded DNA." : "Error while loading DNA.");
      });

      // file reading failed
      reader.addEventListener('error', function() {alert('Error : Failed to read file');});

      // read as text file
      reader.readAsText(file);
    });
  }

  this.loadDataFromServer = function() {
    return new Promise(function (resolve) {
      let xhttp = new XMLHttpRequest();

      xhttp.onerror = function(_e) {
        console.log("An error accured", _e)
      }

      xhttp.onload = function (_data) {
        let response = _data.target;
        if (response.status != 200) return;
        let data = JSON.parse(response.response);
        let result = Game.importData(data);
        resolve(result);
        
        if (result) App.train(Game.curDNA);
        alert(result ? "Successfully loaded DNA." : "Error while loading DNA.");
      }
     
      xhttp.open("POST", "../serverVersion/data.json?a=" + Math.round(Math.random() * 10000000), true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send();
    });
  }



  function setButtonRunStatus(_running = false) {
    HTML.turboButton.disabled = _running;
    HTML.startButton.disabled = _running;
    HTML.stopButton.disabled  = !_running;
  }



  this.updateStatistics = function(entities, totalHiderScore) {
    let bestSeekerScore = 1 / entities.seekers[0].score;
    let bestHiderScore = entities.hiders[0].score;
    let averageScore = totalHiderScore / entities.hiders.length;
    
    Statistics.update([
      [bestSeekerScore, Drawer.canvasDiagonal], 
      [bestHiderScore, Drawer.canvasDiagonal], 
      [averageScore, Drawer.canvasDiagonal]
    ]);
  }
}



App.setup();