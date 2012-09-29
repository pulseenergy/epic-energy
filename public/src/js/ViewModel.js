var debug = false;
var monthNames = 'January February March April May June July August September October November December -'.split(' ');
var seasons = ['winter', 'spring', 'summer', 'fall'];

function categoryFriendlyName(category) {
	return {
		boiler: 'Boiler',
		hotWater: 'Hot Water',
		elevator: 'Elevator',
		airCon: 'Air Cond.',
		lighting: 'Lighting',
		plugLoad: 'Building'
	}[category] || category;
}

function ViewModel(game) {
	this.game = game;

	this.budget = ko.observable();
	this.year = ko.observable();
	this.month = ko.observable();
	this.season = ko.computed(function () {
		return seasons[Math.floor(this.month() / 3)] || seasons[0];
	}, this);
	this.monthName = ko.observable();
	this.energy = ko.observable();
	this.occupants = ko.observable();

	this.weather = ko.observable();
	this.equipment = ko.observable();
	this.messages = ko.observable();

	this.gameOver = ko.observable(false);
	this.finalScore = ko.observable();
	this.pendingAction = ko.observable();
	this.availableActionsByCategory = ko.observable();

	this.selectedCategory = ko.observable();
	this.availableActionsForSelectedCategory = ko.computed(function () {
		var selected = this.selectedCategory();
		return (this.availableActionsByCategory() || {})[selected] || [];
	}, this);

	this.update();
}

function vowel(char) {
	char = char.toLowerCase();
	return char == 'a' || char == 'e' || char == 'i' || char == 'o' || char == 'u';
}

ViewModel.prototype.update = function () {
	this.budget(this.game.budget);
	this.month(this.game.month);
	this.monthName(monthNames[this.game.month % 12]);
	this.year(2012 + Math.floor(this.game.month / 12));
	this.energy(this.game.consumed);

	this.occupants([]); // force template update
	this.occupants(this.game.occupants);

	this.weather(this.game.thisMonthsWeather());
	this.equipment(_.map(this.game.equipment, function (equip, slot) {
		return {
			category: slot,
			name: equip.name
		};
	}));

	this.messages(this.game.messages);

	var actions = {};
	_.each(this.game.equipment, function (equip, slot) {
		actions[slot] = _.map(equip.upgrades(), function (upgrade) {
			var name = upgrade[0].name;
			var cost = upgrade[1];
			var a = vowel(name[0]) ? 'a ' : 'an ';
			return {
				category: slot,
				name: name,
				upgradeTitle: upgrade[0].upgradeTitle,
				cost: cost,
				formattedCost: cost.money < 0 ? '$' + -cost.money : 'Free',
				apply: function (game) {
					game.equipment[slot] = upgrade[0];
					game.applyCost(upgrade[1]);
				}
			};
		});
	});
	this.availableActionsByCategory(actions);

	this.gameOver(this.game.isGameOver());
	if (this.gameOver()) {
		this.finalScore(this.game.computeScore());
	}
};

ViewModel.prototype.selectCategory = function (equipment) {
	var category = equipment.category;
	if (this.selectedCategory() == category) {
		this.selectedCategory(null);
	} else {
		this.selectedCategory(category);
	}
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
