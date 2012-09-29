
function T12Lighting() {
	this.upgradeTitle = this.name = "T12 Light Bulbs";
	this.upgrades = function () {
		return [ [new T8Lighting(), { money: -1000 }] ];
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: 0,
			energy: baselineEnergy,
			messages: []
		};
	};
};

function T8Lighting() {
	this.upgradeTitle = this.name = "T8 Light Bulbs";
	this.upgrades = function () {
		return [ ];
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: 0,
			energy: baselineEnergy * 0.6,
			messages: []
		};
	};
};