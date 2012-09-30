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
		return 'season-' + seasons[Math.floor(this.month() / 3)] || seasons[0];
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

	this.lastMonthDelta = {
		energy: 53010
	};

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
	this.year(new Date().getFullYear() + Math.floor(this.game.month / 12));
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

	var msgs = [];
	if (this.lastMonthDelta.energy !== undefined) {
		var body = 'Last month, you used ' + accounting.formatNumber(this.lastMonthDelta.energy) + ' kWh';
		if (this.lastMonthChangePercent !== undefined && this.lastMonthChangePercent > 0) {
			body += ' (extra ' + this.lastMonthChangePercent + '% compared to last year)';
		} else if (this.lastMonthChangePercent !== undefined && this.lastMonthChangePercent < 0) {
			body += ' (saving ' + Math.abs(this.lastMonthChangePercent) + '% compared to last year)';
		}
		msgs.push({
			type: 'spreadsheet',
			body: body
		});
	}
	this.messages(msgs.concat(_.map(this.game.messages, function (message) {
		return {
			type: 'gossip',
			body: message
		};
	})));

	var budget = game.budget;

	var actions = {};
	_.each(this.game.equipment, function (equip, slot) {
		actions[slot] = _.map(equip.upgrades(), function (upgrade) {
			var name = upgrade[0].name;
			var cost = upgrade[1];
			return {
				category: slot,
				name: name,
				upgradeTitle: upgrade[0].upgradeTitle,
				description: upgrade[0].description,
				cost: cost,
				available: cost.money == null || (budget + cost.money) >= 0,
				formattedCost: cost.money < 0 ? '$' + accounting.formatNumber(-cost.money) : 'Free',
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
		$('#twitter-button-container').html('<a href="https://twitter.com/share" class="twitter-share-button" data-size="large" data-text="I just scored ' + this.finalScore() + ' in Epic Energy, a building energy sim created during @CleanwebYVR #epicenergy #html5" data-count="none" data-related="pulseenergy" data-lang="en"></a>');
		$.getScript('http://platform.twitter.com/widgets.js');
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
	this.lastMonthDelta = this.game.monthDelta();
	this.lastMonthChangePercent = Math.round(100 * (this.lastMonthDelta.energy - this.game.thisMonthsBaseline()) / this.game.thisMonthsBaseline());
	this.game.nextMonth();

	this.update();
};
