var vancouverWeather = {
	recordHigh: [15.6, 16.4, 19.1, 23.9, 32.7, 30, 31.7, 31.7, 28.5, 24.2, 17, 15, 32.7],
	averageHigh: [6.8, 8.4, 10.6, 13.5, 16.8, 19.6, 22.0, 22.3, 19.0, 13.9, 9.3, 6.8, 14.1],
	mean: [4.8, 5.9, 7.6, 10, 13.2, 15.9, 18.1, 18.3, 15.4, 11.1, 7.1, 4.8, 11],
	averageLow: [2.7, 3.4, 4.6, 6.5, 9.5, 12.2, 14.1, 14.4, 11.6, 8.2, 4.8, 2.8, 7.9],
	recordLow: [-13.3, -6.7, -5, -1.1, 1.1, 2.8, 2.8, 5, 1.7, -3.2, -9.9, -15.6, -15.6]
};

var startingBudget = 10000;
var vancouverOfficeEnergy = [50985, 43655, 42752, 37045, 35019, 34887, 38875, 39735, 33185, 35012, 48868, 53010]; // kwh
var occupantNames = ["Rohit", "Bob", "Suzie", "Cher", "Ryan", "Carlos", "Shane", "Dan", "Donalda", "Angie", "Theresa", "John", "Gorp"];

function Game() {
	this.budget = startingBudget;
	this.consumed = 0;
	this.equipment = {
		boiler: new CrappyBoiler(),
		airCon: new AirCon(),
		lighting: new T12Lighting(),
		hotWater: new CrappyHotWater(),
		elevator: new CrappyElevator(),
		plugLoad: new PlugLoad()
	};
	this.occupants = [];
	for (var i = 0; i < 10; i++) {
		this.occupants[i] = new Occupant();
	}
	this.month = 0;

	// later: these could be dynamic for a given location
	// disaggregated data down below would require using fixed end use percentages
	this.weather = vancouverWeather;
	this.baselineEnergy = vancouverOfficeEnergy;
	this.disaggregatedBaseline = this.disaggregate(this.baselineEnergy, this.baselineEnergy);
	this.messages = [];
	this.appendMessages(this.messages, ["It's cold in here. I'm not getting enough heat."]);
}

Game.prototype.monthDelta = function () {
	var weather = this.thisMonthsWeather();
	var total = { money: 0, happy: 0, energy: 0 };
	this.messages = [];
	_.each(this.equipment, function (equip, type) {
		var baselineEnergy = this.disaggregatedBaseline[this.month][type];
		var partial = equip.monthDelta(this, baselineEnergy, weather);
		total.money += partial.money;
		total.happy += partial.happy;
		total.energy += partial.energy;
		if (debug) console.log('adding energy', type, partial.energy);
		this.appendMessages(this.messages, partial.messages);
	}, this);
	if (debug) console.log('total energy', total.energy);
	this.applyCost(total);
	return total;
};

Game.prototype.applyCost = function (total) {
	this.budget += total.money || 0;
	this.consumed += total.energy || 0;
	this.applyHappiness(total.happy || 0);
};

Game.prototype.applyHappiness = function (deltaHappiness) {
	var occupant, occupantIndex;
	var sign = deltaHappiness < 0 ? -1 : 1;
	if (deltaHappiness >= 0) {
		deltaHappiness++;
	}
	for (var i = 0; i < Math.abs(deltaHappiness); i++) {
		var notUnhappy = this.notUnhappyOccupants();
		if (notUnhappy.length === 0) {
			break;
		}
		occupantIndex = _.random(0, notUnhappy.length - 1);
		occupant = notUnhappy[occupantIndex];
		occupant.updateHappiness(sign);
	}
};

Game.prototype.appendMessages = function(messages, newMessages) {
	_.each(newMessages, function(message) {
		var occupant = occupantNames[_.random(0, occupantNames.length -1)];
		messages.push(occupant + " says: \"" + message + "\"");
	});
};

Game.prototype.notUnhappyOccupants = function () {
	return _.filter(this.occupants, function(occupant) {
		return occupant.happiness > 0;
	});
};

Game.prototype.thisMonthsWeather = function () {
	var weather = {};
	_.each(this.weather, function (v, k) {
		weather[k] = v[this.month];
	}, this);
	return weather;
};

Game.prototype.thisMonthsBaseline = function () {
	return this.baselineEnergy[this.month];
};

Game.prototype.disaggregate = function (monthlyEnergy, weather) {
	var disaggregateMonthlyEnergy = [];
	// TODO - base on weather
	disaggregateMonthlyEnergy[0] = {
			plugLoad : 8217,
			elevator : 1233,
			lighting : 10682,
			hotWater : 863,
			airCon   : 0,
			boiler   : 29990
	};
	disaggregateMonthlyEnergy[1] = {
			plugLoad : 8217,
			elevator : 1233,
			lighting : 10682,
			hotWater : 863,
			airCon   : 0,
			boiler   : 22660
	};
	disaggregateMonthlyEnergy[2] = {
			plugLoad : 8217,
			elevator : 1233,
			lighting : 10271,
			hotWater : 822,
			airCon   : 0,
			boiler   : 22209
	};
	disaggregateMonthlyEnergy[3] = {
			plugLoad : 8217,
			elevator : 1233,
			lighting : 10271,
			hotWater : 822,
			airCon   : 0,
			boiler   : 16502
	};
	disaggregateMonthlyEnergy[4] = {
			plugLoad : 8217,
			elevator : 1233,
			lighting : 9860,
			hotWater : 822,
			airCon   : 7000,
			boiler   : 7886
	};
	disaggregateMonthlyEnergy[5] = {
			plugLoad : 8217,
			elevator : 1233,
			lighting : 9860,
			hotWater : 781,
			airCon   : 14796,
			boiler   : 0
	};
	disaggregateMonthlyEnergy[6] = {
			plugLoad : 8217,
			elevator : 1233,
			lighting : 9860,
			hotWater : 781,
			airCon   : 18784,
			boiler   : 0
	};
	disaggregateMonthlyEnergy[7] = {
			plugLoad : 8217,
			elevator : 1233,
			lighting : 9860,
			hotWater : 781,
			airCon   : 19644,
			boiler   : 0
	};
	disaggregateMonthlyEnergy[8] = {
			plugLoad : 8217,
			elevator : 1233,
			lighting : 10271,
			hotWater : 822,
			airCon   : 6000,
			boiler   : 6643
	};
	disaggregateMonthlyEnergy[9] = {
			plugLoad : 8217,
			elevator : 1233,
			lighting : 10271,
			hotWater : 822,
			airCon   : 0,
			boiler   : 14469
	};
	disaggregateMonthlyEnergy[10] = {
			plugLoad : 8217,
			elevator : 1233,
			lighting : 10682,
			hotWater : 863,
			airCon   : 0,
			boiler   : 27873
	};
	disaggregateMonthlyEnergy[11] = {
			plugLoad : 8217,
			elevator : 1233,
			lighting : 10682,
			hotWater : 863,
			airCon   : 0,
			boiler   : 32015
	};
	return disaggregateMonthlyEnergy;
};

Game.prototype.nextMonth = function () {
	if (this.month < 12) {
		this.month++;
	}
};

Game.prototype.isGameOver = function () {
	return this.month === 12;
};

Game.prototype.youLose = function () {
	return _.isEmpty(this.notUnhappyOccupants());
};

Game.prototype.computeFinalEnergyPercent = function () {
	return 100 * (getBaselineTotal() - this.consumed) / getBaselineTotal();
};

Game.prototype.computeFinalEnergy = function () {
	return getBaselineTotal() - this.consumed;
};

Game.prototype.computeFinalOccupantHappiness = function () {
	var counts = _.countBy(this.occupants, function (occupant) {
		if (occupant.happiness === 3) { return 'happy'; }
		if (occupant.happiness === 2) { return 'content'; }
		if (occupant.happiness === 1) { return 'discontent'; }
		if (occupant.happiness === 0) { return 'unhappy'; }
	});
	return _.defaults(counts, { happy: 0, content: 0, discontent: 0, unhappy: 0 });
};

Game.prototype.computeScore = function () {
	var occupant = _.reduce(this.occupants, function (sum, occupant) {
		return sum + (occupant.happiness - 2) * 10;
	}, 0);
	var energy = this.computeFinalEnergy() / 10;
	var budget = this.budget / 10; // max 100
	if (debug) console.log(energy, budget, occupant);
	return Math.round(energy + budget + occupant);
};

function getBaselineTotal() {
	return _.reduce(vancouverOfficeEnergy, function (sum, amount) {
		return sum + amount;
	}, 0);
}

