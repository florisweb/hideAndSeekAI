<!DOCTYPE html>
<html>
	<head>

		<link rel="stylesheet" type="text/css" href="css/main.css?a=2">
		<link rel="stylesheet" type="text/css" href="css/mainContent.css">
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
				<button onclick="Game.turboTrain(DNA).then(function (_DNA) {DNA = _DNA});">Turbo</button>
				<button onclick="Game.train(DNA).then(function (_DNA) {DNA = _DNA});">Run</button>
				<button onclick="Game.stop()" disabled='true'>Stop</button>
				<br>
				<button onclick="Game.downloadData()">Download DNA</button>
				<input type='file' id="dataInput" oninput='Game.loadData()'>
				<br>
				<div class='text' id="debugHolder"></div>
			</div>
			
			
			<canvas id="networkCanvas" width="900" height="800"></canvas>
			
			

			<canvas id="populationGraph" width="300" height="400"></canvas>

		</div>


		<script src="/JS/jQuery.js"></script>

		<script src="../js/extraFunctions.js?a=2"></script>
		<script src="../js/network/neuralNetwork.js"></script>
		<script src="js/statistics.js"></script>
		<script src="js/neuralDrawer.js?a=2"></script>
		<script src="../js/collision.js"></script>
		<script src="../js/entity.js"></script>
		<script src="js/draw.js"></script>
		<script src="../js/trainer.js?a=1"></script>
		<script src="../js/game.js?a=3"></script>
	</body>
</html>

