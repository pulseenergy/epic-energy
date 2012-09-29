function Equipment() {
	this.monthDelta = function (game, weather) {
		return {
			money: 0,
			happy: 0,
			energy: 0
		};
	};
};


function CrappyBoiler() {
	this.monthDelta = function (game, weather) {
		return {
			money: 0,
			happy: -1,
			energy: -100
		};
	};
};