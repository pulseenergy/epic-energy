var minHappiness = 0;
var maxHappiness = 3;

var happinessLabels = ['unhappy', 'discontent', 'content', 'happy'];

function Occupant() {
	this.happiness = 2;
	this.happinessLabel = 'content';
}

Occupant.prototype.updateHappiness = function (amount) {
	this.happiness = Math.max(Math.min(this.happiness + amount, maxHappiness), minHappiness);
	this.updateHappinessLabel();
};

Occupant.prototype.updateHappinessLabel = function () {
	this.happinessLabel = happinessLabels[this.happiness];
};