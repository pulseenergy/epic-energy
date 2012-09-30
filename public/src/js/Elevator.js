function OffElevator(base) {
	this.name = base.name + " (Off)";
	this.upgradeTitle = "Turn Off " + base.name;
	base.upgradeTitle = "Turn On " + base.name;
	this.description = "Turning off the elevator will save energy, but will require tenants to walk up stairs! Good for health, but not for happiness levels";
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
			messages: [randomItem(["WTF? You expect me to climb stairs?", "The broken elevator is an accessibility hazard"])]
		};
	};
	this.state = {name: "bad", description: "Elevator Turned Off"};
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
	this.state = {name: "good", description: ""};
};

function HibernatingElevator() {
	this.name = "Hibernating Elevator";
	this.upgradeTitle = "Upgrade to " + this.name;
	this.description = "Hibernation controls will shut off lighting and fans when the elevator is not in use";
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
	this.state = {name: "good", description: ""};
};

function RegenerativeDriveElevator() {
	this.name = "Elevator with Regenerative Drive";
	this.upgradeTitle = "Upgrade to " + this.name;
	this.description = "By using regenerative technology, the elevator utilises this wasted energy and transfers it back into the building’s electrical system for use in other areas or to further power the lift at later intervals.";
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
	this.state = {name: "good", description: ""};
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
	this.state = {name: "good", description: ""};
};

function LEDElevatorLighting(base) {
	this.base = base;
	this.name = base.name;
	this.upgradeTitle = "Replace bulbs with LED lighting";
	this.description = "LEDs are a more efficient way to light elevators and can save 80% of lighting load";
	this.upgrades = wrappedBaseUpgradeFunctions(base, LEDElevatorLighting);
	this.monthDelta = function (game, baselineEnergy, weather) {
		var parent = base.monthDelta(game, baselineEnergy, weather);
		return {
			money: parent.money,
			happy: parent.happy,
			energy: 0.9 * parent.energy,
			messages: parent.messages
		};
	};
	this.state = base.state;
};
