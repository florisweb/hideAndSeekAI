<!DOCTYPE html>
<html>
	<head>
		<style>
			#gameCanvas {
				border: 1px solid red;
				width: 400px;
			}
		</style>
		<title>Three in a row AI</title>
	</head>
	<body>

		<canvas id="gameCanvas" width="300" height="300"></canvas>
		<br>
		<a id="averageScoreHolder"></a>
		<br>
		<button onclick="Game.running = true; Trainer.animateTrainingRound(list)">Run</button>
		<button onclick="Game.running = false;">Stop</button>


		<script src="js/extraFunctions.js"></script>
		<script src="js/network/neuralNetwork.js"></script>
		<script src="js/collision.js"></script>
		<script src="js/entity.js"></script>
		<script src="js/draw.js"></script>
		<script src="js/trainer.js"></script>
		<script src="js/game.js"></script>
	</body>
</html>