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
			messages: [randomItem(["WTF? The hot water is broken!", "I can't bike to work with cold showers!"])]
		};
	};
	this.state = {name: "bad", description: "No Hot Water"};
}

function CrappyHotWater() {
	this.name = "Old Hot Water Heater";
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
	this.state = {name: "good", description: ""};
}

function OnDemandHotWater() {
	this.name = "On Demand Hot Water Heater";
	this.upgradeTitle = "Upgrade to " + this.name;
	this.description = "On demand water heaters are smaller (because they are tankless) and more efficient than conventional heaters";
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
	this.state = {name: "good", description: ""};
}

function SolarHotWater() {
	this.name = "Solar Hot Water Heater";
	this.upgradeTitle = "Upgrade to " + this.name;
	this.description = "In order to heat water using solar energy, a collector, often fastened to a roof or a wall facing the sun, heats working fluid that is either pumped (active system) or driven by natural convection (passive system) through it";
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
	this.state = {name: "good", description: ""};
}

function CondensingHotWater() {
	this.name = "Condensing Hot Water Heater";
	this.upgradeTitle = "Upgrade to " + this.name;
	this.description = "Gas condensing water heaters are highly efficient water heaters, with efficiency ratings around 90%";
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
	this.state = {name: "good", description: ""};
}