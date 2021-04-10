const fs = require('fs')


const App = new function() {
	this.settings = {
		updateEveryXFrames: 30,
		dataStoragePath: "data.json"
	}

  	this.setup = async function() {
  		await this.importData();
  		generationAtStart = Game.generation;
    	this.turboTrain(DNA);
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


	this.turboTrain = async function(_DNA) {
		console.log("== Started turbo-training ==");
		let result = await Game.turboTrain(_DNA);
		console.log("== Stopped turbo-training ==");
		return result;
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

	    fs.readFile(App.settings.dataStoragePath, 'utf8', function (err,_string) {
		  if (err) {
		    return console.log(err);
		  }
		  let data = JSON.parse(_string);
		  console.log(Game.importData(data) ? "[!] Successfully loaded data" : "[!] A problem accured while loading the data.");
		  resolve();
		});
  	});
  }
}



App.setup();