<!DOCTYPE html>
<html>
	<head>
		<style>
			body {
				margin: 0;
				padding: 0;
			}
			
			#mainContent {
				position: relative;
				float: left;
				width: calc(100vw - 450px);
				height: 100vh;
			}

			#gameCanvas {
				position: relative;
				top: 30px;
				left: calc((100% - (100vh - 30px * 2)) / 2);
				height: calc(100vh - 30px * 2);
				box-shadow: 5px 5px 20px 5px rgba(0, 0, 0, .1);
			}
			

			#sideBar {
				position: relative;
				float: left;

				width: calc(450px - 30px * 2 - 20px * 2);
				height: calc(100vh - 30px * 2 - 20px * 2);

				margin: 30px;
				padding: 20px;
				box-shadow: 5px 5px 20px 5px rgba(0, 0, 0, .1);
			}


				#networkCanvas {
					position: relative;
					float: right;
					height: calc(50vh);
				}


				#populationGraph {
					position: absolute;
					
					left: 0;
					float: bottom;
					bottom: 0;

					width: calc(100%);
					height: 250px;
				}
		</style>
		<title>Hide and Seek AI</title>
	</head>
	<body>

		<div id="mainContent"> 
			<canvas id="gameCanvas" width="800" height="800"></canvas>
		</div>
		
		<div id="sideBar">	
			<div id="header">
				<button onclick="Game.running = true; Trainer.animateTrainingRound(animatedList)">Run</button>
				<button onclick="Game.running = false;">Stop</button>
			</div>
			
			
			<canvas id="networkCanvas" width="500" height="800"></canvas>
			
			

			<canvas id="populationGraph" width="300" height="400"></canvas>

		</div>


		<script src="/JS/jQuery.js"></script>

		<script src="js/extraFunctions.js"></script>
		<script src="js/network/neuralNetwork.js"></script>
		<script src="js/statistics.js"></script>
		<script src="js/neuralDrawer.js"></script>
		<script src="js/collision.js"></script>
		<script src="js/entity.js"></script>
		<script src="js/draw.js"></script>
		<script src="js/trainer.js"></script>
		<script src="js/game.js"></script>
	</body>
</html>

