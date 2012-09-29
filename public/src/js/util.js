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