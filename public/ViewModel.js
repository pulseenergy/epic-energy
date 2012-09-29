function ViewModel(game) {
	this.game = game;

	this.budget = ko.observable();
	this.month = ko.observable();

	this.update();
}

ViewModel.prototype.update = function () {
	var monthNames = 'January February March April May June July August September October November December'.split(' ');

	this.budget(this.game.budget);
	this.month(monthNames[this.game.month]);
};

ViewModel.prototype.advanceToNextMonth = function () {
	this.game.month++;
	this.update();
};