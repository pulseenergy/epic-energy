
function Game() {
	this.budget = 1000;
	this.equipment = {};
	this.occupants = [];
	for (var i = 0; i < 10; i++) {
		this.occupants[i] = new Occupant();
	}
	this.month = 0;
}
