
const Collision = new function() {
	const This = {
		calcFactor: calcFactor,
		addFactors: addFactors,
		apply: apply,
		getAllEntityFactors: getAllEntityFactors,
	}

	function apply(_entity) {
		let factor = calcFactor(_entity);
		let coords = applyFactor(_entity, factor);

		_entity.x = coords.x;
		_entity.y = coords.y;
	}

	function applyFactor(_entity, _factor) {
		const applyConstant = 1;
		let fx = Math.cos(_factor.angle) * _factor.power * applyConstant;
		let fy = -Math.sin(_factor.angle) * _factor.power * applyConstant;

		return {x: _entity.x + fx, y: _entity.y + fy};
	}

	function calcFactor(_entity) {
		let factors = getAllEntityFactors(_entity);
		return averageFactors(factors);
	}


	function averageFactors(_factors) {
		let sumFactor = {
			angle: 0,
			power: 0
		};

		for (factor of _factors)
		{
			sumFactor = addFactors(sumFactor, factor);
		}

		if (_factors.length > 0) sumFactor.power /= _factors.length;
		return sumFactor;
	}

	function addFactors(_factor1, _factor2) {
		let f1x = Math.cos(_factor1.angle) 	* _factor1.power;
		let f1y = -Math.sin(_factor1.angle) * _factor1.power;
		let f2x = Math.cos(_factor2.angle) 	* _factor2.power;
		let f2y = -Math.sin(_factor2.angle) * _factor2.power;

		let newX = f1x + f2x;
		let newY = f1y + f2y;

		return {
			angle: atanWithDX(newX, newY),
			power: Math.sqrt(newX * newX + newY * newY)
		}
	}


	function getAllEntityFactors(_self) {
		const factorAngleRange = .4 * Math.PI;
		const samples = 10;

		let factors = [];

		for (let i = 0; i < samples; i++)
		{
			let curAngle = _self.angle - factorAngleRange + factorAngleRange * 2 / samples * i;
			let value = _self.getEyeValue(curAngle) * eyeRange;
			
			if (value >= entityRadius) continue;
						
			let factor = {
				angle: curAngle,
				power: -(entityRadius - value)
			}

			factors.push(factor);
		}

		return factors;
	}

	return This;
}


function atanWithDX(dx, dy) {
	let angle = -Math.atan(dy / dx);
	if (isNaN(angle)) angle = 0;
	if (dx < 0) angle += Math.PI;
	return angle;
}