<!DOCTYPE html>
<html>
	<head>

		<link rel="stylesheet" type="text/css" href="css/main.css?a=3">
		<link rel="stylesheet" type="text/css" href="css/mainContent.css?a=2">
		<style>
		</style>
		<title>Hide and Seek AI</title>
	</head>
	<body>

		<div id="mainContent">
			<div id="turboMenu">
				
				<a class="text header" style="font-size: 15px">SPEEDMODE</a>
				<br>
				<br>
				<img src="images/loadingDark.gif" class="loadIcon">
				<br>
				<a class="text" id="turbo_timePerGenHolder">Time per generation: 12s</a>
				<br>
				<a class="text" id="turbo_runningFor">Running for: </a>
			</div>
			<div id="gameCanvasHolder">
				<canvas id="gameCanvas" width="800" height="800"></canvas>
			</div>
		</div>
		
		<div id="sideBar">	
			<div id="header">
				<button onclick="App.turboTrain()">Turbo</button>
				<button onclick="App.train()">Run</button>
				<button onclick="App.stop()" disabled='true'>Stop</button>
				<br>
				<button onclick="App.downloadData()">Download DNA</button>
				<input type='file' id="dataInput" oninput='App.loadData()'>
				<br>
				<div class='text' id="debugHolder"></div>
			</div>
			
			
			<canvas id="networkCanvas" width="800" height="900"></canvas>

			<canvas id="populationGraph" width="500" height="400"></canvas>

		</div>


		<script src="https://florisweb.tk/JS/jQuery.js"></script>

		<script src="../js/extraFunctions.js?a=3"></script>
		<script src="../js/network/neuralNetwork.js"></script>
		<script src="js/statistics.js"></script>
		<script src="js/neuralDrawer.js?a=3"></script>
		<script src="../js/collision.js"></script>
		<script src="../js/entity.js?a=3"></script>
		<script src="js/draw.js"></script>
		<script src="../js/trainer.js?a=4"></script>
		<script src="../js/game.js?a=9"></script>
		<script src="js/app.js?a=9"></script>
	</body>
</html>

