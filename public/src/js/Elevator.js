function OffElevator(base) {
	this.upgradeTitle = this.name = "Disabled " + base.name;
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
	this.upgradeTitle = this.name = "Inefficient Elevator";
	this.upgrades = function () {
		return [
			[new OffElevator(this), {}],
			[new RegenerativeDriveElevator(), { money: -1900 }],
			[new HibernatingElevator(), { money: -500 }],
			[new HibernatingRegenerativeDriveElevator(), { money: -2400 }]
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
	this.upgradeTitle = this.name = "Hibernating Elevator";
	this.upgrades = function () {
		return [
			[new OffElevator(this), {}],
			[new HibernatingRegenerativeDriveElevator(), { money: -1900 }]
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
	this.upgradeTitle = this.name = "Elevator with Regenerative Drive";
	this.upgrades = function () {
		return [
			[new OffElevator(this), {}],
			[new HibernatingRegenerativeDriveElevator(), { money: -500 }]
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
	this.upgradeTitle = this.name = "Hibernating Elevator with Regenerative Drive";
	this.upgrades = function () {
		return [ [new OffElevator(this), {}] ];
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
