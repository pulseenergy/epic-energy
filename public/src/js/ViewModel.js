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

function vowel(char) {
	char = char.toLowerCase();
	return char == 'a' || char == 'e' || char == 'i' || char == 'o' || char == 'u';
}

ViewModel.prototype.update = function () {
	var monthNames = 'January February March April May June July August September October November December'.split(' ');
	var viewModel = this;

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
				var name = upgrade[0].name;
				var cost = upgrade[1];
				return {
					upgradeTo: function () {
						var a = vowel(name[0]) ? 'a ' : 'an ';
						var message = cost.money > 0
							? 'Spend $' + cost.money + ' to change to ' + a + name + '?'
							: 'Change to ' + a + name + '?';
						if (confirm(message)) {
							viewModel.game.applyCost(cost);
							viewModel.game.equipment[slot] = upgrade[0];
							viewModel.advanceToNextMonth();
						}
					},
					name: name,
					cost: cost
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
