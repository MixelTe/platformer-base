export const get = {
	div: getDiv,
	button: getButton,
	canvas: getCanvas,
	input: getInput,
}
export const canvas = {
	getContext2d: getCanvasContext,
	fitToParent: {
		BCR: CanvasFitToParentBCR,
		ClientWH: CanvasFitToParentClientWH, },
	drawGrid: drawGridOnCanvas,
	drawCoords: drawMouseCoordsOnCanvas,
}
export const intersection = {
	rectPoint: rectPointIntersect,
	rects: rectIntersect,
	circlePoint: circlePointIntersect,
	circles: circlesIntersect,
}
export const random = {
	int: randomInt,
	intFrom: randomIntFrom,
	boolean: random_boolean,
	asbOrNot: random_asbOrNot,
}




//get
function getButton(id: string)
{
	const el = <unknown | null>document.getElementById(id);
	if (el == null) throw new Error(`${id} not found`);
	if (el instanceof HTMLButtonElement) return el;
	throw new Error(`${id} element not Button`);
}
function getDiv(id: string)
{
	const el = <unknown | null>document.getElementById(id);
	if (el == null) throw new Error(`${id} not found`);
	if (el instanceof HTMLDivElement) return el;
	throw new Error(`${id} element not Div`);
}
function getCanvas(id: string)
{
	const el = <unknown | null>document.getElementById(id);
	if (el == null) throw new Error(`${id} not found`);
	if (el instanceof HTMLCanvasElement) return el;
	throw new Error(`${id} element not Canvas`);
}
function getInput(id: string)
{
	const el = <unknown | null>document.getElementById(id);
	if (el == null) throw new Error(`${id} not found`);
	if (el instanceof HTMLInputElement) return el;
	throw new Error(`${id} element not Input`);
}



//canvas
function getCanvasContext(canvas: HTMLCanvasElement)
{
	const ctx = canvas.getContext("2d");
	if (ctx == null) throw new Error(`Context is null`);
	return ctx;
}
function CanvasFitToParentBCR(canvas: HTMLCanvasElement)
{
	const parent = canvas.parentElement;
	if (parent == null) throw new Error("Canvas parent not found");
	const bcr = parent.getBoundingClientRect();
	const w = bcr.width;
	const h = bcr.height;
	canvas.width = w;
	canvas.style.width = `${w}px`;
	canvas.height = h;
	canvas.style.height = `${h}px`;
}
function CanvasFitToParentClientWH(canvas: HTMLCanvasElement)
{
	const parent = canvas.parentElement;
	if (parent == null) throw new Error("Canvas parent not found");
	const w = parent.clientWidth;
	const h = parent.clientHeight;
	canvas.width = w;
	canvas.style.width = `${w}px`;
	canvas.height = h;
	canvas.style.height = `${h}px`;
}
function drawGridOnCanvas(ctx: CanvasRenderingContext2D, cellSize: number, color = "black")
{
	const canvasWidth = ctx.canvas.width;
	const canvasHeight = ctx.canvas.height;

    ctx.save();
	ctx.strokeStyle = color;
	ctx.lineWidth = 2;
	ctx.beginPath();
    for (let x = cellSize; x < canvasWidth; x += cellSize)
	{
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvasHeight);
	}
    for (let y = cellSize; y < canvasWidth; y += cellSize)
	{
		ctx.moveTo(0, y);
		ctx.lineTo(canvasWidth, y);
	}
	ctx.stroke();
    ctx.restore();
}
function drawMouseCoordsOnCanvas(ctx: CanvasRenderingContext2D, x: number, y: number)
{
	const space = 2;
	const width = ctx.canvas.width;
	const height = ctx.canvas.height;

	ctx.save();
	ctx.strokeStyle = "black";
	ctx.beginPath();

	ctx.moveTo(0, y);
	ctx.lineTo(x - space, y);

	ctx.moveTo(x + space, y);
	ctx.lineTo(width, y);

	ctx.moveTo(x, 0);
	ctx.lineTo(x, y - space);

	ctx.moveTo(x, y + space);
	ctx.lineTo(x, height);

	ctx.stroke();

	ctx.font = "12px Arial";
	ctx.fillStyle = "black";
	const text = `x: ${x}, y: ${y}`;
	ctx.fillText(text, width - ctx.measureText(text).width - 2, height - 3);
	ctx.restore();
}


//intersection
function circlePointIntersect(circle: Circle, point: Point)
{
	return circle.r * circle.r >= (circle.x - point.x) * (circle.x - point.x) + (circle.y - point.y) * (circle.y - point.y);
}
function rectPointIntersect(rect: Rect, point: Point)
{
	normalizeRect(rect);
	return (
		rect.x + rect.width >= point.x &&
		point.x >= rect.x &&
		rect.y + rect.height >= point.y &&
		point.y >= rect.y
	);
}
function circlesIntersect(circle1: Circle, circle2: Circle)
{
	const dx = circle1.x - circle2.x;
	const dy = circle1.y - circle2.y;

	return square(dx) + square(dy) < square(circle1.r + circle2.r);
}
function rectIntersect(rect1: Rect, rect2: Rect)
{
	normalizeRect(rect1);
	normalizeRect(rect2);
    return (
        rect1.x + rect1.width >= rect2.x &&
        rect2.x + rect2.width >= rect1.x &&
        rect1.y + rect1.height >= rect2.y &&
        rect2.y + rect2.height >= rect1.y
    );
}
function normalizeRect(rect: Rect)
{
	if (rect.width < 0)
	{
		rect.x += rect.width;
		rect.width = Math.abs(rect.width);
	}
	if (rect.height < 0)
	{
		rect.y += rect.height;
		rect.height = Math.abs(rect.height);
	}
}



//random
function random_asbOrNot(num: number)
{
	if (Math.random() < 0.5) return num;
	return -num;
}

function random_boolean()
{
    if (Math.random() < 0.5) return true;
    return false;
}

function randomInt(bound: number)
{
	return Math.floor(Math.random() * bound);
}

function randomIntFrom(start: number, bound: number)
{
	return Math.floor(Math.random() * (bound - start)) + start;
}



//other
export function square(num: number)
{
	return num * num;
}
export function loadScript(scriptPath: string)
{
    const el = document.createElement("script");
    el.src = scriptPath;
    document.head.appendChild(el);
}
export function addButtonListener(id: string, f: (e: MouseEvent) => void)
{
	const button = getButton(id);
	button.addEventListener("click", f);
}

export class MoveAnimator
{
	private x: number;
	private y: number;
	private shiftX: number;
	private shiftY: number;
	private maxX: number;
	private maxY: number;
	private stepX: number | (() => number);
	private stepY: number | (() => number);

	constructor(x: number, y: number, shiftX: number, shiftY: number, maxX: number, maxY: number, stepX: number | (() => number), stepY: number | (() => number))
	{
		this.x = x;
		this.y = y;
		this.shiftX = shiftX;
		this.shiftY = shiftY;
		this.maxX = maxX;
		this.maxY = maxY;
		this.stepX = stepX;
		this.stepY = stepY;
	}
	X()
	{
		if (this.x > this.maxX) return this.maxX - (this.x - this.maxX) + this.shiftX;
		return this.x + this.shiftX;
	}
	Y()
	{
		if (this.y > this.maxY) return this.maxY - (this.y - this.maxY) + this.shiftY;
		return this.y + this.shiftY;
	}

	nextX(step?: number)
	{
		if (step == undefined)
		{
			if (typeof this.stepX == "number") this.x += this.stepX;
			else this.x += this.stepX();
		}
		else this.x += step;

		this.x %= this.maxX;
		return this.x + this.shiftX;
	}
	nextY(step?: number)
	{
		if (step == undefined)
		{
			if (typeof this.stepY == "number") this.y += this.stepY;
			else this.y += this.stepY();
		}
		else this.y += step;

		this.y %= this.maxY;
		return this.y + this.shiftY;
	}

	nextBounceX(step?: number)
	{
		if (step == undefined)
		{
			if (typeof this.stepX == "number") this.x += this.stepX;
			else this.x += this.stepX();
		}
		else this.x += step;

		this.x %= this.maxX * 2;
		if (this.x > this.maxX) return this.maxX - (this.x - this.maxX) + this.shiftX;
		return this.x + this.shiftX;
	}
	nextBounceY(step?: number)
	{
		if (step == undefined)
		{
			if (typeof this.stepY == "number") this.y += this.stepY;
			else this.y += this.stepY();
		}
		else this.y += step;

		this.y %= this.maxY * 2;
		if (this.y > this.maxY) return this.maxY - (this.y - this.maxY) + this.shiftY;
		return this.y + this.shiftY;
	}
}


interface Rect {
	x: number,
	y: number,
	width: number,
	height: number
}
interface Point {
	x: number,
	y: number,
}
interface Circle {
	x: number,
	y: number,
	r: number,
}