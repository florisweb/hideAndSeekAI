




function NeuralNetwork(_structure) {
	let This = {
		layers: [],
		feedForward: feedForward,
	}

	createLayersByStructure(_structure);

	return This;




	function createLayersByStructure(_structure) {
		for (let l = 0; l < _structure.length; l++)
		{
			let cLayerLength = _structure[l];

			let cLayer 	= {};
			cLayer.a 	= createRandomArray(cLayerLength);

			if (l == 0)
			{
				This.layers[l] = cLayer;
				continue;
			}
			let prevLayerLength = _structure[l - 1];

			cLayer.b 	= createRandomArray(cLayerLength);
			cLayer.w 	= [];

			for (let n = 0; n < cLayerLength; n++)
			{
				cLayer.w[n] = createRandomArray(prevLayerLength);
			}

			This.layers[l] = cLayer;
		}
	}
	

	function createRandomArray(_arrLength) {
		let arr = [];
		for (let i = 0; i < _arrLength; i++) arr.push(1 - Math.random() * 2);
		return arr;
	}



	function feedForward(_input) {
		This.layers[0].a = copyArr(_input).splice(0, This.layers[0].a.length);
		for (let l = 1; l < This.layers.length; l++) This.layers[l].a = calcActivationsByLayer(l);	
		return This.layers[This.layers.length - 1].a;

		function calcActivationsByLayer(L) {
			let activations = [];
			for (let neuron = 0; neuron < This.layers[L].a.length; neuron++)
			{
				let sum = This.layers[L].b[neuron];
				for (let w = 0; w < This.layers[L - 1].a.length; w++)
				{
					sum += This.layers[L - 1].a[w] * This.layers[L].w[neuron][w];
				}

				activations[neuron] = sigmoid(sum);
			}

			return activations;
		}
	}
}



function copyArr(_arr) {
	return JSON.parse(JSON.stringify(_arr));
}

function sigmoid(t) {
    return 1 / (1 + Math.pow(Math.E, -t));
}



function createArrayWithValues(_length, _value) {
	let arr = [];
	for (let i = 0; i < _length; i++) arr.push(_value);
	return arr;
}	

