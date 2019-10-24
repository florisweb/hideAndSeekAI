<!DOCTYPE html>
<html>
	<head>
		<style>
			#gameCanvas {
				border: 1px solid red;
				width: 400px;
			}


			#populationGraph {
				position: absolute;
				left: 0;
				float: bottom;
				bottom: 0;

				width: 100%;
				height: 250px;
				
				background: rgba(0, 0, 0, 0.05);
				pointer-events: none;
			}
		</style>
		<title>Three in a row AI</title>
	</head>
	<body>

		<canvas id="gameCanvas" width="500" height="500"></canvas>
		<br>
		<a id="averageScoreHolder"></a>
		<br>
		<button onclick="Game.running = true; Trainer.animateTrainingRound(animatedList)">Run</button>
		<button onclick="Game.running = false;">Stop</button>

		<canvas id="populationGraph" width="1000" height="400"></canvas>


		<script src="/JS/jQuery.js"></script>

		<script src="js/extraFunctions.js"></script>
		<script src="js/network/neuralNetwork.js"></script>
		<script src="js/statistics.js"></script>
		<script src="js/collision.js"></script>
		<script src="js/entity.js"></script>
		<script src="js/draw.js"></script>
		<script src="js/trainer.js"></script>
		<script src="js/game.js"></script>
	</body>
</html>

