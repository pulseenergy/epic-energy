function NothingBuilding() {
	this.upgradeTitle = this.name = "Building";
	this.upgrades = function () {
		return [ [new ThrowParty(), { money: -100, happy: 3 }] ];
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: 0,
			energy: 0,
			messages: []
		};
	};
};

function ThrowParty() {
	this.upgradeTitle = this.name = "Throw Party";
	this.upgrades = function () {
		return [];
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: 0,
			energy: 0,
			messages: []
		};
	};
};
