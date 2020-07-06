const { gsap } = window;

import SVGElement from "./SVGElement.js";

export default class SVGShape {
	constructor(options) {
		this.parentSVG = options.parentSVG;
		this.type = options.type;
		this.svgType = this.returnSvgType(this.type);
		this.textSize = options.textSize;
		this.size = options.textSize * 0.05;
		this.position = options.position;
		this.color = options.color;
		this.addShape();
	}

	createSVG(type) {
		const el = document.createElementNS("http://www.w3.org/2000/svg", type);
		return new SVGElement(el);
	}

	returnSvgType(type) {
		if (type === "rect") return "rect";
		if (type === "triangle") return "polygon";
		if (type === "circle") return "circle";
	}

	createShape() {
		const svg = this.createSVG(this.svgType);
		if (this.type === "triangle") {
			svg.set("points", `0,0 ${this.size * 2},0 ${this.size},${this.size * 2}`);
			svg.style("fill", this.color);
		} else if (this.type === "circle") {
			svg.set("r", this.size);
			svg.style("fill", this.color);
		} else if (this.type === "rect") {
			svg.set("height", this.size);
			svg.set("width", this.size);
			svg.style("fill", this.color);
		}
		return svg;
	}

	addShape() {
		const randomRatio = Math.random();
		const initialRadius = this.textSize * 0.15;
		const finalRadius = initialRadius + this.textSize * 0.6;
		const scale = 0.3 + Math.random() * 0.6;
		const offset = this.size * scale;
		const initialPosition = {
			x: this.position.x + initialRadius * Math.cos(-Math.PI * randomRatio) - offset,
			y: this.position.y + initialRadius * Math.sin(-Math.PI * randomRatio) - offset,
		};
		const finalPosition = {
			x: this.position.x + finalRadius * Math.cos(-Math.PI * randomRatio) - offset,
			y: this.position.y + finalRadius * Math.sin(-Math.PI * randomRatio) - offset,
		};
		this.shape = this.createShape();
		this.parentSVG.element.appendChild(this.shape.element);
		gsap.fromTo(
			this.shape.element,
			0.2 + Math.random() * 0.3,
			{ rotation: Math.random() * 360, scale, x: initialPosition.x, y: initialPosition.y, opacity: 1 },
			{
				x: finalPosition.x,
				y: finalPosition.y,
				opacity: 0,
				ease: Power1.easeInOut,
				onComplete: () => {
					this.parentSVG.element.removeChild(this.shape.element);
				},
			}
		);
	}
}
