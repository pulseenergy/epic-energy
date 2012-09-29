function OffElevator(base) {
	this.upgradeTitle = "Turn Off " + base.name;
	base.upgradeTitle = "Turn On " + base.name
	this.name = base.name + " (Off)";
	this.upgrades = function () {
		return _.map(base.upgrades(), function (upgrade) {
			if (upgrade[0] instanceof OffElevator) {
				return [base, {}];
			}
			return upgrade;
		});
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: -1,
			energy: 0,
			messages: ["WTF? You expect me to climb stairs?"]
		};
	};
};

function CrappyElevator() {
	this.name = "Inefficient Elevator";
	this.upgradeTitle = "Downgrade to " + this.name;
	this.upgrades = function () {
		return [
			[new OffElevator(this), {}],
			[new RegenerativeDriveElevator(), { money: -1900 }],
			[new HibernatingElevator(), { money: -500 }],
			[new HibernatingRegenerativeDriveElevator(), { money: -2400 }],
			[new LEDElevatorLighting(this), { money: -250}]
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

function HibernatingElevator() {
	this.name = "Hibernating Elevator";
	this.upgradeTitle = "Upgrade to " + this.name;
	this.upgrades = function () {
		return [
			[new OffElevator(this), {}],
			[new HibernatingRegenerativeDriveElevator(), { money: -1900 }],
			[new LEDElevatorLighting(this), { money: -250}]
		];
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: 0,
			energy: baselineEnergy * 0.8,
			messages: []
		};
	};
};

function RegenerativeDriveElevator() {
	this.name = "Elevator with Regenerative Drive";
	this.upgradeTitle = "Upgrade to " + this.name;
	this.upgrades = function () {
		return [
			[new OffElevator(this), {}],
			[new HibernatingRegenerativeDriveElevator(), { money: -500 }],
			[new LEDElevatorLighting(this), { money: -250}]
		];
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: 0,
			energy: baselineEnergy * 0.25,
			messages: []
		};
	};
};

function HibernatingRegenerativeDriveElevator() {
	this.name = "Hibernating Elevator with Regenerative Drive";
	this.upgradeTitle = "Upgrade to " + this.name;
	this.upgrades = function () {
		return [
	        	[new OffElevator(this), {}],
				[new LEDElevatorLighting(this), { money: -250}]
	    ];
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: 0,
			energy: baselineEnergy * 0.2,
			messages: []
		};
	};
};

function LEDElevatorLighting(elevator) {
	this.name = elevator.name;
	this.upgradeTitle = "Replace bulbs with LED lighting";
	this.upgrades = function () {
		var parentUpgrades = elevator.upgrades();
		var myUpgrades = [];
		_.each(parentUpgrades, function(upgrade) {
			if (!(upgrade[0] instanceof LEDElevatorLighting)) {
				var decorated = new LEDElevatorLighting(upgrade[0]);
				decorated.upgradeTitle = upgrade[0].upgradeTitle;
				myUpgrades.push([decorated, upgrade[1]]);
			}
		});
		return myUpgrades;
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		var parent = elevator.monthDelta(game, baselineEnergy, weather)
		return {
			money: parent.money,
			happy: parent.happy,
			energy: 0.9 * parent.energy,
			messages: parent.messages
		};
	};
};
