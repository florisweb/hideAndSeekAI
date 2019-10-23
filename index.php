<!DOCTYPE html>
<html>
	<head>
		<style>
			#gameCanvas {
				border: 1px solid red;
				width: 300px;
			}
		</style>
		<title>Three in a row AI</title>
	</head>
	<body>

		<canvas id="gameCanvas" width="250" height="250"></canvas>
		<br>
		<a id="averageScoreHolder"></a>
		<br>
		<button onclick="running = true; run()">Run</button>
		<button onclick="running = false;">Stop</button>


		<script src="js/extraFunctions.js"></script>
		<script src="js/network/neuralNetwork.js"></script>
		<script src="js/AI.js"></script>
		<script src="js/draw.js"></script>
		<script src="js/game.js"></script>


	</body>
</html>