function OffAirCon(base) {
	this.name = base.name + " (Off)";
	this.upgradeTitle = "Turn Off " + base.name;
	base.upgradeTitle = "Turn On " + base.name;
	this.description = "Air Conditioning has a big impact on energy consumption, but also effects the happiness of occupants";
	this.upgrades = function () {
		return _.map(base.upgrades(), function (upgrade) {
			if (upgrade[0] instanceof OffAirCon) {
				return [base, {}];
			}
			return upgrade;
		});
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: (weather.averageHigh > 20) ? -1: 0,
			energy: 0,
			messages: (weather.averageHigh > 20) ? ["It's hotter than two hampsters farting in a wool sock"]: []
		};
	};
};

function AirCon() {
	this.upgradeTitle = this.name = "Air Conditioning";
	this.upgrades = function () {
		return [ [new OffAirCon(this), {}] ];
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: (weather.averageHigh > 25) ? 1: 0,
			energy: baselineEnergy,
			messages: (weather.averageHigh > 25) ? ["Thank God for A/C!"]: []
		};
	};
};