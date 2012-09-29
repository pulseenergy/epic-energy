
function T12Lighting() {
	this.name = "T12 Light Bulbs";
	this.upgrades = function () {
		return [ ];
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: 0,
			energy: game.notUnhappyOccupants().length / game.occupants.length * baselineEnergy,
			messages: []
		};
	};
};