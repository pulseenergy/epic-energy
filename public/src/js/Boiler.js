function OffBoiler(base) {
	this.upgradeTitle = this.name = "Disabled " + base.name;
	this.upgrades = function () {
		return _.map(base.upgrades(), function (upgrade) {
			if (upgrade[0] instanceof OffBoiler) {
				return [base, {}];
			}
			return upgrade;
		});
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: (weather.averageLow < 12) ? (weather.averageLow < 8) ? -2 : -1 : 0,
			energy: (weather.mean < 7) ? 2 * baselineEnergy : 0,
			messages: this.getMessages(game, baselineEnergy, weather)
		};
	};
	this.getMessages = function(game, baselineEnergy, weather) {
		var messages = [];
		if (weather.mean < 7) {
			messages.push("I'm turning on a space heater");
		} else if (weather.averageLow < 8) {
			messages.push("I'm freezing ... please turn back on the heat");
		} else if (weather.averageLow < 12) {
			messages.push("Brrr - it's cold in here");
		}
		return messages;
	};
};

function CrappyBoiler() {
	this.upgradeTitle = this.name = "Atmospheric Boiler";
	this.upgrades = function () {
		return [ [new OffBoiler(this), {}], [new BetterBoiler(), { money: -1000 }] ];
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: (weather.averageLow < 8) ? -1 : 0,
			energy: baselineEnergy,
			messages: []
		};
	};
};

function BetterBoiler() {
	this.upgradeTitle = this.name = "Condensing Boiler";
	this.upgrades = function () {
		return [ [new OffBoiler(this), {}] ];
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: 0,
			energy: (weather.averageLow < 8) ? 0.80 * baselineEnergy : 0.40 * baselineEnergy,
			messages: []
		};
	};
};