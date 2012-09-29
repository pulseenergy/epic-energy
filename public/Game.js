
function Game() {
	this.budget = 1000;
	this.consumed = 0;
	this.equipment = {};
	this.occupants = [];
	for (var i = 0; i < 10; i++) {
		this.occupants[i] = new Occupant();
	}
	this.month = 0;
}

Game.prototype.monthDelta = function (weather) {
	var total = { money: 0, happy: 0, energy: 0 };
	_.each(this.equipment, function (equip) {
		var partial = equp.monthDelta(this, weather);
		total.money += partial.money;
		total.happy += partial.happy;
		total.energy += partial.energy;
	});
	this.budget += total.money;
	this.consumed += total.energy;
	this.applyHappiness(total.happy);
};