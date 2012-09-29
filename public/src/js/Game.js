var vancouverWeather = {
	recordHigh: [15.6, 16.4, 19.1, 23.9, 32.7, 30, 31.7, 31.7, 28.5, 24.2, 17, 15, 32.7],
	averageHigh: [6.8, 8.4, 10.6, 13.5, 16.8, 19.6, 22.0, 22.3, 19.0, 13.9, 9.3, 6.8, 14.1],
	mean: [4.8, 5.9, 7.6, 10, 13.2, 15.9, 18.1, 18.3, 15.4, 11.1, 7.1, 4.8, 11],
	averageLow: [2.7, 3.4, 4.6, 6.5, 9.5, 12.2, 14.1, 14.4, 11.6, 8.2, 4.8, 2.8, 7.9],
	recordLow: [-13.3, -6.7, -5, -1.1, 1.1, 2.8, 2.8, 5, 1.7, -3.2, -9.9, -15.6, -15.6]
};

function Game() {
	this.budget = 1000;
	this.consumed = 0;
	this.equipment = {
		boiler: new CrappyBoiler()
	};
	this.occupants = [];
	for (var i = 0; i < 10; i++) {
		this.occupants[i] = new Occupant();
	}
	this.month = 0;

	this.weather = vancouverWeather;
}

Game.prototype.monthDelta = function () {
	var weather = this.thisMonthsWeather();
	var total = { money: 0, happy: 0, energy: 0 };
	_.each(this.equipment, function (equip) {
		var partial = equip.monthDelta(this, weather);
		total.money += partial.money;
		total.happy += partial.happy;
		total.energy += partial.energy;
	});
	this.applyCost(total);
};

Game.prototype.applyCost = function (total) {
	this.budget += total.money || 0;
	this.consumed += total.energy || 0;
	this.applyHappiness(total.happy || 0);
};

Game.prototype.applyHappiness = function (deltaHappiness) {
	var occupant;
	var sign = deltaHappiness < 0 ? -1 : 1;
	for (var i = 0; i < Math.abs(deltaHappiness); i++) {
		occupant = this.occupants[_.random(0, this.occupants.length - 1)];
		occupant.updateHappiness(sign);
	}
};

Game.prototype.thisMonthsWeather = function () {
	var weather = {};
	_.each(this.weather, function (v, k) {
		weather[k] = v[this.month];
	}, this);
	return weather;
};