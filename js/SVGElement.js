export default class SVGElement {
	constructor(element) {
		this.element = element;
	}

	set(attributeName, value) {
		this.element.setAttribute(attributeName, value);
	}

	style(property, value) {
		this.element.style[property] = value;
	}
}
