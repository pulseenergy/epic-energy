function OffBoiler(base) {
	this.name = base.name + " (Off)";
	this.upgradeTitle = "Turn Off " + base.name;
	base.upgradeTitle = "Turn On " + base.name;
	this.description = "Turn the heat off to save energy, but be cautious of tenant hapiness";
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
			messages.push(randomItem(["I'm turning on a space heater", "I bought a heater"]));
		} else if (weather.averageLow < 8) {
			messages.push(randomItem(["I'm freezing ... please turn back on the heat", "I'm sooooooo coooooold"]));
		} else if (weather.averageLow < 12) {
			messages.push(randomItem(["It's a bit nippy in here", "Brrr - it's cold in here"]));
		}
		return messages;
	};
	this.state = {name: "bad", description: "No Heating"};
};

function CrappyBoiler() {
	this.name = "Old Boiler";
	this.upgradeTitle = "Upgrade to " + this.name;
	this.upgrades = function () {
		return [ [new OffBoiler(this), {}], [new BetterBoiler(), { money: -1000 }] ];
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: (weather.averageLow < 8) ? -1 : 0,
			energy: baselineEnergy,
			messages: (weather.averageLow < 8) ? [randomItem(["Turn up the heat, please", "The thermostat is cranked, but I'm still cold"])] : [],
		};
	};
	this.state = {name: "warning", description: "Undersized Boiler"};
};

function BetterBoiler() {
	this.name = "Condensing Boiler";
	this.upgradeTitle = "Upgrade to " + this.name;
	this.description = "Condensing hot water heaters are the most energy-efficient tank-style water heater and thus cost less to operate. A condensing hot water heater recaptures the heat of the flue gases that normally get vented out, so less heat is lost out of the tank";
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
	this.state = {name: "good", description: ""};
};