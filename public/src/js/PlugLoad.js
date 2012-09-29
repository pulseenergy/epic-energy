
function PlugLoad() {
	this.name = "Occupant Plug Load";
	this.upgrades = function () {
		return [ [new OffAirCon(this), {}] ];
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