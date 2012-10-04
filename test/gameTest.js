
describe('game', function () {

	describe('score', function () {

		it('max theoretical', function () {
			// consume nothing, everyone happy
			var game = new Game();
			_.each(game.occupants, function (occupant) {
				occupant.happiness = maxHappiness;
			});

			expect(game.computeScore()).to.be(50403);
		});

		it('consuming 0 energy (somehow)', function () {
			var game = new Game();
			expect(game.computeScore()).to.be(50303);
		});

		it('spending nothing is worth a little', function () {
			var game = new Game();
			game.consumed = getBaselineTotal();

			expect(game.computeScore()).to.be(1000);
		});

		it('content occupants are worth nothing', function () {
			var game = new Game();
			game.consumed = getBaselineTotal();
			game.budget = 0;

			expect(game.computeScore()).to.be(0);
		});

		it('happy occupants are worth a little', function () {
			var game = new Game();
			game.consumed = getBaselineTotal();
			game.budget = 0;
			_.each(game.occupants, function (occupant) {
				occupant.happiness = maxHappiness;
			});

			expect(game.computeScore()).to.be(100);
		});

		it('unhappy occupants incur penalty', function () {
			var game = new Game();
			game.consumed = getBaselineTotal();
			game.budget = 0;
			_.each(game.occupants, function (occupant) {
				occupant.happiness = 0;
			});

			expect(game.computeScore()).to.be(-200);
		});

	});
});