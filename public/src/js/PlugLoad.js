function PlugLoad() {
	this.upgradeTitle = this.name = "Occupant Plug Load";
	this.upgrades = function () {
		return [ [new ThrowParty(this), { money: -100, happy: 3 }],
		         [new PowerBars(this), { money: -300 }],
		         [new ReplaceWithLaptops(this), { money: -3000 }]];
	};
	this.monthDelta = function (game, baselineEnergy, weather) {
		return {
			money: 0,
			happy: 0,
			energy: game.notUnhappyOccupants().length / game.occupants.length * baselineEnergy,
			messages: []
		};
	};
	this.state = {name: "good", description: ""};
}

function ThrowParty(base) {
	this.name = base.name;
	this.upgradeTitle = "Throw Party";
	this.description = "Morale booster for building occupants";
	this.upgrades = function () {
		return base.upgrades();
	};
	var partyHappened = false;
	this.monthDelta = function (game, baselineEnergy, weather) {
		var delta = base.monthDelta(game, baselineEnergy, weather);
		if (partyHappened == false) {
			delta.messages = (delta.messages || []).concat(randomItem(["Sweet party!", "I drank too much at the party", "We should have a party every month!"]));
			partyHappened = true;
		}
		return delta;
	};
	this.state = base.state;
}

function PowerBars(base) {
	this.base = base;
	this.name = base.name;
	this.upgradeTitle = "Add Power Bars to Reduce Phantom Load";
	this.upgrades = wrappedBaseUpgradeFunctions(base, PowerBars);
	this.monthDelta = function (game, baselineEnergy, weather) {
		var parent = base.monthDelta(game, baselineEnergy, weather);
		return {
			money: parent.money,
			happy: parent.happy,
			energy: 0.90 * parent.energy,
			messages: parent.messages
		};
	};
	this.state = base.state;
}

function ReplaceWithLaptops(base) {
	this.base = base;
	this.name = base.name;
	this.upgradeTitle = "Replace PCs with Laptops";
	this.upgrades = wrappedBaseUpgradeFunctions(base, ReplaceWithLaptops);
	this.monthDelta = function (game, baselineEnergy, weather) {
		var parent = base.monthDelta(game, baselineEnergy, weather);
		return {
			money: parent.money,
			happy: parent.happy,
			energy: 0.80 * parent.energy,
			messages: parent.messages
		};
	};
	this.state = base.state;
}
