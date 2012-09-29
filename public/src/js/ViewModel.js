function ViewModel(game) {
	this.game = game;

	this.budget = ko.observable();
	this.month = ko.observable();
	this.energy = ko.observable();
	this.occupants = ko.observable();
	this.weather = ko.observable();
	this.equipment = ko.observable();

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
	this.weather(this.game.thisMonthsWeather());
	this.equipment(_.map(this.game.equipment, function (equip, slot) {
		return {
			cssClass: slot,
			name: equip.name,
			upgrades: _.map(equip.upgrades(), function (upgrade) {
				return {
					upgradeTo: function () {
						alert("upgrading to " + upgrade);
					},
					name: upgrade[0].name,
					cost: upgrade[1]
				};
			})
		};
	}));
};

ViewModel.prototype.advanceToNextMonth = function () {
	this.game.month++;
	game.monthDelta();
	this.update();
};
