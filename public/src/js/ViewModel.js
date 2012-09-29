var debug = false;
var monthNames = 'January February March April May June July August September October November December -'.split(' ');

function ViewModel(game) {
	this.game = game;

	this.budget = ko.observable();
	this.month = ko.observable();
	this.monthName = ko.observable();
	this.energy = ko.observable();
	this.occupants = ko.observable();

	this.weather = ko.observable();
	this.equipment = ko.observable();
	this.messages = ko.observable();

	if (debug) {
		this.occupants.subscribe(function (newValue) {
			console.log('occ has changed', JSON.stringify(_.map(newValue, function (val) {
				return val.happiness;
			})));
		});
	}

	this.gameOver = ko.observable(false);
	this.pendingAction = ko.observable();
	this.availableActionsByCategory = ko.observable();

	this.update();
}

function vowel(char) {
	char = char.toLowerCase();
	return char == 'a' || char == 'e' || char == 'i' || char == 'o' || char == 'u';
}

ViewModel.prototype.update = function () {
	this.budget(this.game.budget);
	this.month(this.game.month);
	this.monthName(monthNames[this.game.month]);
	this.energy(-this.game.consumed);

	this.occupants([]); // force template update
	this.occupants(this.game.occupants);

	this.weather(this.game.thisMonthsWeather());
	this.equipment(_.map(this.game.equipment, function (equip, slot) {
		return {
			cssClass: slot,
			name: equip.name
		};
	}));
	
	this.messages(this.game.messages);

	this.availableActionsByCategory(_.map(this.game.equipment, function (equip, slot) {
		return {
			category: slot,
			upgrades: _.map(equip.upgrades(), function (upgrade) {
				var name = upgrade[0].name;
				var cost = upgrade[1];
				var a = vowel(name[0]) ? 'a ' : 'an ';
				var message = cost.money < 0
						? 'Spend $' + -cost.money + ' to change to ' + a + name + '?'
						: 'Change to ' + a + name + '?';
				return {
					category: slot,
					name: name,
					cost: cost,
					formattedCost: cost.money < 0 ? '$' + -cost.money : 'Free',
					message: message,
					apply: function (game) {
						game.equipment[slot] = upgrade[0];
						game.applyCost(upgrade[1]);
					}
				};
			})
		};
	}));


	this.gameOver(this.game.isGameOver());
};

ViewModel.prototype.advanceToNextMonth = function () {
	if (this.pendingAction()) {
		this.pendingAction().apply(this.game);
		this.pendingAction(null);
	}
	this.game.monthDelta();
	this.game.nextMonth();

	this.update();
};
