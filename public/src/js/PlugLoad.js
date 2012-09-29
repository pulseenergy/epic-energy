function PlugLoad() {
	this.upgradeTitle = this.name = "Occupant Plug Load";
	this.upgrades = function () {
		return [ [new ThrowParty(this), { money: -100, happy: 3 }] ];
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

function ThrowParty(base) {
	this.name = base.name;
	this.upgradeTitle = "Throw Party";
	this.upgrades = function () {
		return base.upgrades();
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return base.monthDelta(game, baselineEnergy, weather);
	};
};
