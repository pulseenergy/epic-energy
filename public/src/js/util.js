ko.bindingHandlers['class'] = {
	'update': function(element, valueAccessor) {
		if (element['__ko__previousClassValue__']) {
			ko.utils.toggleDomNodeCssClass(element, element['__ko__previousClassValue__'], false);
		}
		var value = ko.utils.unwrapObservable(valueAccessor());
		ko.utils.toggleDomNodeCssClass(element, value, true);
		element['__ko__previousClassValue__'] = value;
	}
};

ko.bindingHandlers['countup'] = {
	'update': function (element, valueAccessor) {
		var value = accounting.unformat(ko.utils.unwrapObservable(valueAccessor()));
		$({count: 0}).animate({count: value}, {
			duration: 5000,
			easing: 'easeInOutExpo',
			step: function() {
				ko.utils.setTextContent(element, accounting.formatNumber(this.count));
			}});
	}
};

function goFullScreen() {
	var docElm = document.documentElement;
	if (docElm.requestFullscreen) {
		docElm.requestFullscreen();
	} else if (docElm.mozRequestFullScreen) {
		docElm.mozRequestFullScreen();
	} else if (docElm.webkitRequestFullScreen) {
		docElm.webkitRequestFullScreen();
	}
}

function preload(images) {
	$(images).each(function() {
		(new Image()).src = this;
	});
}

function inheritedInstanceOf(obj, clazz) {
	if (obj instanceof clazz) {
		return true;
	} else if (obj.base) {
		return inheritedInstanceOf(obj.base, clazz);
	}
	
	return false;
}

function wrappedBaseUpgradeFunctions (parent, clazz) {
	return function() {
		var parentUpgrades = parent.upgrades();
		var myUpgrades = [];
		_.each(parentUpgrades, function(upgrade) {
			if (!inheritedInstanceOf(upgrade[0], clazz)) {
				var decorated = new clazz(upgrade[0]);
				decorated.upgradeTitle = upgrade[0].upgradeTitle;
				myUpgrades.push([decorated, upgrade[1]]);
			}
		});
		return myUpgrades;
	};
}

function randomItem(list) {
	if (list.length === 0) {
		return null;
	}
	return list[_.random(0, list.length-1)];
}