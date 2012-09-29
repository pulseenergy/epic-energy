function ViewModel(game) {
	this.game = game;

	this.budget = ko.observable();
	this.month = ko.observable();
	this.energy = ko.observable();
	this.occupants = ko.observable();
	this.weather = ko.observable();

	this.update();
}

ViewModel.prototype.update = function () {
	var monthNames = 'January February March April May June July August September October November December'.split(' ');

	this.budget(this.game.budget);
	this.month(monthNames[this.game.month]);
	this.energy(-this.game.consumed);
	this.occupants(_.map(this.game.occupants, function(occupant) {
		return occupant.happiness;
	}));
	var weather = {};
	_.each(this.game.weather, function (v, k) {
		weather[k] = v[this.game.month];
	});
	this.weather(weather);
};

ViewModel.prototype.advanceToNextMonth = function () {
	this.game.month++;
	game.monthDelta();
	this.update();
};
