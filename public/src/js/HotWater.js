function OffHotWater(base) {
	this.upgradeTitle = "Turn Off " + base.name;
	base.upgradeTitle = "Turn On " + base.name;
	this.name = base.name + " (Off)";
	this.upgrades = function () {
		return _.map(base.upgrades(), function (upgrade) {
			if (upgrade[0] instanceof OffHotWater) {
				return [base, {}];
			}
			return upgrade;
		});
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: -2,
			energy: 0,
			messages: ["WTF? The hot water is broken!"]
		};
	};
};

function CrappyHotWater() {
	this.name = "Atmospheric Hot Water Heater";
	this.upgradeTitle = "Upgrade to " + this.name;
	this.upgrades = function () {
		return [
			[new OffHotWater(this), {}],
			[new OnDemandHotWater(), { money: -600 }],
			[new CondensingHotWater(), { money: -1200 }],
			[new SolarHotWater(), { money: -3000 }]
		];
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

function OnDemandHotWater() {
	this.name = "On Demand Hot Water Heater";
	this.upgradeTitle = "Upgrade to " + this.name;
	this.description = "Tankless On-demand Water-Heater also is more efficient than conventional heater, at around 60%";
	this.upgrades = function () {
		return [ [new OffHotWater(this), {}] ];
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

function SolarHotWater() {
	this.name = "Solar Hot Water Heater";
	this.upgradeTitle = "Upgrade to " + this.name;
	this.description = "In order to heat water using solar energy, a collector, often fastened to a roof or a wall facing the sun, heats working fluid that is either pumped (active system) or driven by natural convection (passive system) through it.";
	this.upgrades = function () {
		return [ [new OffHotWater(this), {}] ];
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: 0,
			energy: (weather.averageHigh > 10) ? baselineEnergy * 0.45 : baselineEnergy * 0.75,
			messages: (weather.averageHigh > 15) ? ["The solar hot water tank is sizzling"] : []
		};
	};
};

function CondensingHotWater() {
	this.name = "Condensing Hot Water Heater";
	this.upgradeTitle = "Upgrade to " + this.name;
	this.description = "Gas condensing water heaters are high efficient water heaters, with over 90% in energy efficiency, much higher than conventional tank-type";
	this.upgrades = function () {
		return [ [new OffHotWater(this), {}] ];
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: 0,
			energy: baselineEnergy * 0.5,
			messages: []
		};
	};
};