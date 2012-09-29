function Equipment() {
	this.monthDelta = function (game, weather) {
		return {
			money: 0,
			happy: 0,
			energy: 0
		};
	};
};

function OffBoiler(base) {
	this.name = "Disabled " + base.name;
	this.upgrades = function () {
		return _.map(base.upgrades(), function (upgrade) {
			if (upgrade[0] instanceof OffBoiler) {
				return [base, {}];
			}
			return upgrade;
		});
	};
	this.monthDelta = function (game, weather) {
		return {
			money: 0,
			happy: (weather.averageLow < 12) ? (weather.averageLow < 8) ? -2 : -1 : 0,
			energy: (weather.averageLow < 12) ? -200 : 0
		};
	};
};

function CrappyBoiler() {
	this.name = "Atmospheric Boiler";
	this.upgrades = function () {
		return [ [new OffBoiler(this), {}], [new BetterBoiler(), { money: -1000 }] ];
	};
	this.monthDelta = function (game, weather) {
		return {
			money: 0,
			happy: (weather.averageLow < 8) ? -1 : 0,
			energy: -100
		};
	};
};

function BetterBoiler() {
	this.name = "Condensing Boiler";
	this.upgrades = function () {
		return [ [new OffBoiler(this), {}] ];
	};
	this.monthDelta = function (game, weather) {
		return {
			money: 0,
			happy: 0,
			energy: (weather.averageLow < 8) ? -80 : -40
		};
	};
};
