function NoLighting(base) {
	this.upgradeTitle = "Turn Off " + base.name + " (Provide Candles)";
	base.upgradeTitle = "Turn On " + base.name;
	this.name = "Candles";
	this.upgrades = function () {
		return _.map(base.upgrades(), function (upgrade) {
			if (upgrade[0] instanceof NoLighting) {
				return [base, {}];
			}
			return upgrade;
		});
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		var positive = _.random(0,100) > 90;
		return {
			money: 0,
			happy: positive ? 1 : -1,
			energy: 0,
			messages: positive ? ["The candles are romantic"] : ["I'm afraid of the dark"]
		};
	};
	this.state = {name: "warning", description: "Romantic But Not Productive"};
}

function T12Lighting() {
	this.name = "T12 Light Bulbs";
	this.upgradeTitle = "Upgrade to " + this.name;
	this.upgrades = function () {
		return [ [new NoLighting(this), { money: -10 }], [new T8Lighting(), { money: -1000 }], [new EmergencyLEDs(this), { money: -100 }], [new OccupancySensor(this), { money: -800 }] ];
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

function T8Lighting() {
	this.name = "T8 Light Bulbs";
	this.upgradeTitle = "Upgrade to " + this.name;
	this.description = "Replacing T12 lamps and ballasts with high efficiency electronic ballasts and T8 lamps can provide savings greater than 40%";
	this.upgrades = function () {
		return [ [new NoLighting(this), { money: -10 }], [new EmergencyLEDs(this), { money: -100 }], [new OccupancySensor(this), { money: -800 }]  ];
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

function EmergencyLEDs(base) {
	this.base = base;
	this.name = base.name;
	this.upgradeTitle = "Replace Emergency Exit Sign Bulbs With LEDs";
	this.upgrades = wrappedBaseUpgradeFunctions(base, EmergencyLEDs);
	this.monthDelta = function (game, baselineEnergy, weather) {
		var parent = base.monthDelta(game, baselineEnergy, weather)
		return {
			money: parent.money,
			happy: parent.happy,
			energy: 0.95 * parent.energy,
			messages: parent.messages
		};
	};
	this.state = base.state;
}

function OccupancySensor(base) {
	this.base = base;
	this.name = base.name;
	this.upgradeTitle = "Install Occupancy-Sensing Light Switches in Common Areas";
	this.upgrades = wrappedBaseUpgradeFunctions(base, OccupancySensor);
	this.monthDelta = function (game, baselineEnergy, weather) {
		var parent = base.monthDelta(game, baselineEnergy, weather)
		return {
			money: parent.money,
			happy: parent.happy,
			energy: 0.65 * parent.energy,
			messages: parent.messages
		};
	};
	this.state = base.state;
}
