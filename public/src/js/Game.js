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

	this.weather = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

Game.prototype.monthDelta = function () {
	var weather = this.weather[this.month];
	var total = { money: 0, happy: 0, energy: 0 };
	_.each(this.equipment, function (equip) {
		var partial = equip.monthDelta(this, weather);
		total.money += partial.money;
		total.happy += partial.happy;
		total.energy += partial.energy;
	});
	this.budget += total.money;
	this.consumed += total.energy;
	this.applyHappiness(total.happy);
};

Game.prototype.applyHappiness = function (deltaHappiness) {
	var occupant;
	var sign = deltaHappiness < 0 ? -1 : 1;
	for (var i = 0; i < Math.abs(deltaHappiness); i++) {
		occupant = this.occupants[_.random(0, this.occupants.length - 1)];
		occupant.happiness += sign;
	}
};