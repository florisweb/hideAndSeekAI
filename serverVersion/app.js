
const fs = require('fs')


const App = new function() {
	this.settings = {
		updateEveryXFrames: 500,
		dataStoragePath: __dirname + "/data.json"
	}

  	this.setup = async function() {
  		let result = await this.importData();
  		generationAtStart = Game.generation;
  		if (!result) Game.curDNA = Trainer.createRandomDNA(30);
  		if (!result) console.log("[!] Successfully created new DNA");
    	await this.turboTrain();
  	}
  	this.updateStatistics = function() {}

	let lastDate = new Date();
	let lastUpdateCount = 0;
	let timeSinceStart = new Date();
	let generationAtStart = 0;

	this.update = function() {
		Game.update();
		if (Game.updates % this.settings.updateEveryXFrames != 0) return;

		let fps = (Game.updates - lastUpdateCount) / (new Date() - lastDate) * 1000;
		console.log(Game.generation + " generations " + Math.round(fps * 10) / 10 + " fps");

		let timeRunning     = new Date() - timeSinceStart;
		let deltaGeneration = Game.generation - generationAtStart;
		console.log("Time per generation: " + Math.round(timeRunning / deltaGeneration / 10) / 100 + "s");

		lastDate        = new Date();
		lastUpdateCount = Game.updates;
		if (Game.generation % 5 == 0) this.exportData();
	}


	this.turboTrain = async function() {
		console.log("== Started turbo-training ==");
		Game.curDNA = await Game.turboTrain(Game.curDNA);
		console.log("== Stopped turbo-training ==");
		return Game.curDNA;
	}








  this.exportData = function() {
  	console.log("- Export data -");
    let data = Game.exportData();

	fs.writeFile(App.settings.dataStoragePath, data, err => {
  		if (err) {
    		console.error(err)
    		return
  		}
	})
  }

  this.importData = function() {
  	return new Promise(function (resolve) {
  		console.log("- Import data - ");
  		if (!fs.existsSync(App.settings.dataStoragePath)) return resolve(false);

	    fs.readFile(App.settings.dataStoragePath, 'utf8', function (err,_string) {
		  if (err) {
		    return console.log(err);
		  }
		  let data = JSON.parse(_string);
		  let result = Game.importData(data);
		  console.log(result ? "[!] Successfully loaded data" : "[!] A problem accured while loading the data.");
		  resolve(result);
		});
  	});
  }
}



App.setup();