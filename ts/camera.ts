import { Character } from "./character.js";
import { Rect } from "./functions.js";
import { Level } from "./level.js";

type ITranslateMode = "X" | "Y" | "XY";
export abstract class Camera
{
	protected translateMode: ITranslateMode;
	private bounds: Rect | undefined;

	protected dX = 0;
	protected dY = 0;

	constructor(translateMode: ITranslateMode = "XY", bounds?: Rect)
	{
		this.translateMode = translateMode;
		this.bounds = bounds;
	}

	public static create = {
		inCenter: Camera.CreateCamera_inCenter,
		inZone: Camera.CreateCamera_inZone,
		splited: {
			inCenter: Camera.CreateCamera_splited_inCenter,
			inZone: Camera.CreateCamera_splited_inZone,
		}
	}
	private static CreateCamera_inCenter(translateMode: ITranslateMode = "XY", bounds?: Rect)
	{
		return new Camera_inCenter(translateMode, bounds);
	}
	private static CreateCamera_inZone(zone: Rect, translateMode: ITranslateMode = "XY", bounds?: Rect)
	{
		return new Camera_inZone(zone, translateMode, bounds);
	}
	private static CreateCamera_splited_inCenter(translateMode: ITranslateMode = "XY", bounds?: Rect)
	{
		return new Camera_splited_inCenter(translateMode, bounds);
	}
	private static CreateCamera_splited_inZone(zone: Rect, translateMode: ITranslateMode = "XY", bounds?: Rect)
	{
		return new Camera_splited_inZone(zone, translateMode, bounds);
	}
	public abstract draw(ctx: CanvasRenderingContext2D, level: Level, character: Character): void;

	protected normalizeAndSetCoords(dx: number, dy: number, ctx: CanvasRenderingContext2D, width: number, height: number)
	{
		if (this.bounds != undefined)
		{
			dx = Math.min(dx, -this.bounds.x);
			dy = Math.min(dy, -this.bounds.y);

			dx = Math.max(dx, -(this.bounds.x + this.bounds.width - width));
			dy = Math.max(dy, -(this.bounds.y + this.bounds.height - height));
		}

		switch (this.translateMode) {
			case "XY": ctx.translate(dx, dy); break;
			case "X": ctx.translate(dx, 0); break;
			case "Y": ctx.translate(0, dy); break;
			default: ctx.translate(0, 0); break;
		}
		this.dX = dx;
		this.dY = dy;
	}
	protected getTranslate_inCenter(character: Character, width: number, height: number)
	{
		const centerX = width / 2;
		const centerY = height / 2;

		const characterRect = character.getRect();
		const dx = centerX - characterRect.x - characterRect.width / 2;
		const dy = centerY - characterRect.y - characterRect.height / 2;
		return { dx, dy };
	}
	protected getTranslate_inZone(character: Character, zone: Rect, dx: number, dy: number)
	{
		const characterRect = character.getRect();
		const _zone = zone.copy();
		_zone.x -= dx;
		_zone.y -= dy;

		if (characterRect.x < _zone.x) dx += _zone.x - characterRect.x;
		if (characterRect.y < _zone.y) dy += _zone.y - characterRect.y;

		if (characterRect.x > _zone.x + _zone.width - characterRect.width) dx += _zone.x + _zone.width - characterRect.width - characterRect.x;
		if (characterRect.y > _zone.y + _zone.height - characterRect.height) dy += _zone.y + _zone.height - characterRect.height - characterRect.y;

		return { dx, dy };
	}
	protected drawZone(ctx: CanvasRenderingContext2D, zone: Rect)
	{
		ctx.save();
		ctx.strokeStyle = "red";
		ctx.lineWidth = 5;
		ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
		ctx.restore();
	}
}

class Camera_inCenter extends Camera
{
	public draw(ctx: CanvasRenderingContext2D, level: Level, character: Character)
	{
		this.translate(ctx, character);
		const canvas = ctx.canvas;
		level.draw(ctx, new Rect(-this.dX, -this.dY, canvas.width, canvas.height));

		// level.draw(ctx);
	};

	public translate(ctx: CanvasRenderingContext2D, character: Character)
	{
		const canvas = ctx.canvas;
		const dxy = this.getTranslate_inCenter(character, canvas.width, canvas.height);

		return this.normalizeAndSetCoords(dxy.dx, dxy.dy, ctx, canvas.width, canvas.height);
	}
}
class Camera_inZone extends Camera
{
	private zone: Rect;

	constructor(zone: Rect, translateMode: ITranslateMode = "XY", bounds?: Rect)
	{
		super(translateMode, bounds);
		this.translateMode = translateMode;
		this.zone = zone;
	}

	public draw(ctx: CanvasRenderingContext2D, level: Level, character: Character)
	{
		this.translate(ctx, character);
		const canvas = ctx.canvas;
		level.draw(ctx, new Rect(-this.dX, -this.dY, canvas.width, canvas.height));

		// level.draw(ctx);
	};

	public translate(ctx: CanvasRenderingContext2D, character: Character)
	{
		const dxy = this.getTranslate_inZone(character, this.zone, this.dX, this.dY);
		this.normalizeAndSetCoords(dxy.dx, dxy.dy, ctx, ctx.canvas.width, ctx.canvas.height);

		if (!true) this.drawZone(ctx, this.zone);
	}
}


abstract class Camera_splited extends Camera
{
	constructor(translateMode: ITranslateMode = "XY", bounds?: Rect)
	{
		super(translateMode, bounds);
	}
	public draw(ctx: CanvasRenderingContext2D, level: Level, character: Character)
	{
		const canvas = ctx.canvas;
		let character2;
		if (character = level.mainCharacter) character2 = level.secondCharacter;
		else character2 = level.mainCharacter;

		ctx.save();
		this.translate(ctx, character, new Rect(0, 0, canvas.width / 2, canvas.height), true);
		this.drawSection(ctx, level);
		ctx.restore();

		ctx.save();
		this.translate(ctx, character2, new Rect(canvas.width / 2, 0, canvas.width / 2, canvas.height), false);
		this.drawSection(ctx, level);
		ctx.restore();

		ctx.save();
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(canvas.width / 2, 0);
		ctx.lineTo(canvas.width / 2, canvas.height);
		ctx.stroke();
		ctx.restore();

		// level.draw(ctx);
	};
	protected abstract translate(ctx: CanvasRenderingContext2D, character: Character, drawZone: Rect, first: boolean): void
	protected drawSection(ctx: CanvasRenderingContext2D, level: Level)
	{
		const canvas = ctx.canvas;
		ctx.save();
		ctx.beginPath();
		ctx.rect(-this.dX, -this.dY, canvas.width / 2, canvas.height);
		ctx.clip();
		level.draw(ctx, new Rect(-this.dX, -this.dY, canvas.width, canvas.height));
		ctx.restore();
	}
}

class Camera_splited_inCenter extends Camera_splited
{
	public translate(ctx: CanvasRenderingContext2D, character: Character, drawZone: Rect)
	{
		const canvas = ctx.canvas;
		const dxy = this.getTranslate_inCenter(character, drawZone.width, drawZone.height);

		ctx.translate(drawZone.x, drawZone.y);
		this.normalizeAndSetCoords(dxy.dx, dxy.dy, ctx, canvas.width, canvas.height);
	}
}
class Camera_splited_inZone extends Camera_splited
{
	private dX1 = this.dX;
	private dY1 = this.dY;
	private dX2 = this.dX;
	private dY2 = this.dY;
	private zone1: Rect;
	private zone2: Rect;

	constructor(zone: Rect, translateMode: ITranslateMode = "XY", bounds?: Rect)
	{
		super(translateMode, bounds);
		this.translateMode = translateMode;
		this.zone1 = zone;
		this.zone2 = zone;
	}

	public translate(ctx: CanvasRenderingContext2D, character: Character, drawZone: Rect, first: boolean)
	{
		let dxy;
		if (first) dxy = this.getTranslate_inZone(character, this.zone1, this.dX1, this.dY1);
		else dxy = this.getTranslate_inZone(character, this.zone2, this.dX2, this.dY2);

		ctx.translate(drawZone.x, drawZone.y);
		this.normalizeAndSetCoords(dxy.dx, dxy.dy, ctx, ctx.canvas.width, ctx.canvas.height);

		if (first)
		{
			this.dX1 = this.dX;
			this.dY1 = this.dY;
		}
		else
		{
			this.dX2 = this.dX;
			this.dY2 = this.dY;
		}

		if (!true) this.drawZone(ctx, this.zone1);
	}
}
