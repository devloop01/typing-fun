console.clear();

const { gsap } = window;

import SVGShape from "./SVGShape.js";
import SVGElement from "./SVGElement.js";

class App {
	constructor(word) {
		this.svg = this.selectSVG("svg");
		this.text = document.getElementById("text");
		this.offscreenText = document.getElementById("offscreen-text");
		this.input = document.getElementById("input");
		this.input.value = "";
		this.button = document.getElementById("btn");
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.textSize = 0;
		this.textCenter = 0;
		this.letters = [];
		this.prompt = word.split("");
		this.runPrompt = true;
		this.colorPalletes = [
			{ background: "#00121a", palletes: ["#00F3FE", "#006FFE", "#693DFE", "#FFFDFF"] },
			{ background: "#264653", palletes: ["#2a9d8f", "#f4a261", "#e76f51", "#FFFDFF"] },
			{ background: "#1d3557", palletes: ["#e63946", "#457b9d", "#a8dadc", "#FFFDFF"] },
			{ background: "#000000", palletes: ["#14213d", "#fca311", "#e5e5e5", "#ffffff"] },
			{ background: "#3d405b", palletes: ["#e07a5f", "#81b29a", "#f2cc8f", "#FFFDFF"] },
			{ background: "#9b5de5", palletes: ["#00bbf9", "#00f5d4", "#fee440", "#FFFDFF"] },
			{ background: "#22223b", palletes: ["#4a4e69", "#9a8c98", "#c9ada7", "#f2e9e4"] },
			{ background: "#114b5f", palletes: ["#1a936f", "#88d498", "#c6dabf", "#f3e9d2"] },
		];
		this.letterStaggerCount = 4;
	}

	init() {
		this.selectRandomPallete();
		this.resizePage();
		window.addEventListener("resize", this.resizePage.bind(this));
		this.input.addEventListener("keyup", this.keyup.bind(this));
		this.button.addEventListener("click", this.selectRandomPallete.bind(this));
		this.input.focus();
		this.addPrompt(0);
	}

	selectSVG(id) {
		const el = document.getElementById(id);
		return new SVGElement(el);
	}

	addLetter(char, i, n) {
		const letterEl = document.createElement("span");
		const oLetter = document.createElement("span");
		oLetter.innerHTML = char;
		this.offscreenText.appendChild(oLetter);
		this.letters[i] = { offScreen: oLetter, onScreen: letterEl, char: char };
		for (let j = 0; j < n; j++) {
			const span = document.createElement("span");
			span.innerHTML = char;
			letterEl.appendChild(span);
			text.appendChild(letterEl);
			span.style.color = this.colors[j % this.colors.length];
		}
		this.animateLetterIn(letterEl, () => {
			this.addDecor(oLetter);
		});
	}

	addLetters(value) {
		value.forEach((char, i) => {
			if (this.letters[i] && this.letters[i].char !== char) {
				this.letters[i].onScreen.innerHTML = char;
				this.letters[i].offScreen.innerHTML = char;
				this.letters[i].char = char;
			}
			if (this.letters[i] === undefined) {
				this.addLetter(char, i, this.letterStaggerCount);
			}
		});
	}

	addDecor(letter) {
		setTimeout(() => {
			const x = letter.offsetLeft + letter.offsetWidth / 2;
			const y = this.textCenter + this.textSize * 0.5;
			for (var i = 0; i < 16; i++) {
				let rand = Math.random();
				let color = this.colors[Math.floor(Math.random() * this.colors.length)];
				let svgDefaults = {
					parentSVG: this.svg,
					color,
					position: {
						x,
						y,
					},
					textSize: this.textSize,
				};
				if (rand < 0.3)
					new SVGShape({
						type: "circle",
						...svgDefaults,
					});
				else if (rand > 0.3 && rand <= 0.6)
					new SVGShape({
						type: "triangle",
						...svgDefaults,
					});
				else
					new SVGShape({
						type: "rect",
						...svgDefaults,
					});
			}
		}, 100);
	}

	removeLetters(value) {
		for (let i = this.letters.length - 1; i >= 0; i--) {
			const letter = this.letters[i];
			if (value[i] === undefined) this.animateLetterOut(letter, i);
		}
	}

	resizePage() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.svg.set("height", this.height);
		this.svg.set("width", this.width);
		this.svg.set("viewBox", `0 0 ${this.width} ${this.height}`);
		this.resizeLetters();
	}

	resizeLetters() {
		this.textSize = this.width / (this.letters.length + 2);
		if (this.textSize > 100) this.textSize = 100;
		this.text.style.fontSize = `${this.textSize}px`;
		this.text.style.height = `${this.textSize}px`;
		this.text.style.lineHeight = `${this.textSize}px`;
		this.offscreenText.style.fontSize = `${this.textSize}px`;
		const textRect = text.getBoundingClientRect();
		this.textCenter = textRect.top + textRect.height / 2;
		this.positionLetters();
	}

	positionLetters() {
		this.letters.forEach((letter) => {
			gsap.to(letter.onScreen, 0.1, {
				x: letter.offScreen.offsetLeft + "px",
				ease: Power3.easeInOut,
			});
			letter.shift = true;
		});
	}

	animateLetterIn(letter, callback) {
		const randomRotationDirection = Math.random() < 0.5 ? "-" : "+";
		let tl = gsap.timeline({
			ease: "elastic.inOut",
			defaults: {
				stagger: -0.0125,
			},
		});
		const childs = letter.querySelectorAll("span");
		gsap.set(childs, { translateY: "100%" });
		tl.to(childs, {
			keyframes: [
				{
					duration: 0.07,
					translateY: "120%",
					rotation: 0,
				},
				{
					duration: 0.1,
					translateY: "-180%",
					rotation: randomRotationDirection + 60,
				},
				{
					duration: 0.1,
					translateY: "-200%",
					rotation: randomRotationDirection + 120,
				},
				{
					duration: 0.06,
					translateY: "-200%",
					rotation: randomRotationDirection + 240,
				},
				{
					duration: 0.06,
					translateY: "-200%",
					rotation: randomRotationDirection + 300,
					onComplete: callback,
				},
				{
					duration: 0.1,
					translateY: "10%",
					rotation: randomRotationDirection + 360,
				},
				{
					duration: 0.05,
					translateY: "0%",
					rotation: randomRotationDirection + 360,
				},
				{
					duration: 0,
					rotation: 0,
				},
			],
		});
	}

	animateLetterOut(letter, i) {
		gsap.to(letter.onScreen.querySelectorAll("span"), 0.45, {
			translateY: "150%",
			rotation: -60 + Math.random() * 100,
			opacity: 0,
			scale: 0,
			ease: Power2.easeOut,
			stagger: 0.015,
			onComplete: () => {
				this.offscreenText.removeChild(letter.offScreen);
				this.text.removeChild(letter.onScreen);
				this.positionLetters();
			},
		});
		this.letters.splice(i, 1);
	}

	selectRandomPallete() {
		this.colorPalletesIndex = Math.floor(Math.random() * this.colorPalletes.length);
		this.colors = this.colorPalletes[this.colorPalletesIndex].palletes;
		document.documentElement.style.setProperty("--bg", this.colorPalletes[this.colorPalletesIndex].background);
		this.changeTextPallete();
	}

	changeTextPallete() {
		if (this.letters.length != 0) {
			for (let i = 0; i < this.letters.length; i++) {
				const childs = [...this.letters[i].onScreen.children];
				childs.forEach((child, index) => {
					child.style.color = this.colors[index % this.colors.length];
				});
			}
		}
	}

	onInputChange() {
		const value = this.input.value === "" ? [] : this.input.value.toUpperCase().split("");
		this.addLetters(value);
		this.removeLetters(value);
		this.resizeLetters();
	}

	keyup() {
		if (this.runPrompt) {
			this.input.value = "";
			this.runPrompt = false;
		}
		this.onInputChange();
	}

	addPrompt(i) {
		setTimeout(() => {
			if (this.runPrompt && this.prompt[i]) {
				this.input.value = this.input.value + this.prompt[i];
				this.onInputChange();
				this.addPrompt(i + 1);
			}
		}, 150);
	}
}

const app = new App("hello");
app.init();
