import { Character } from "./character.js";
import { Rect } from "./functions.js";
import { Level } from "./level.js";

type ITranslateMode = "X" | "Y" | "XY";
export abstract class Camera
{
	protected translateMode: ITranslateMode;
	private bounds: Rect | undefined;

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
		return new Camera_inZone(zone, translateMode, bounds);
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
		return { dx, dy };
	}
}

class Camera_inCenter extends Camera
{
	public draw(ctx: CanvasRenderingContext2D, level: Level, character: Character)
	{
		const dxy = this.translate(ctx, character);
		const canvas = ctx.canvas;
		level.draw(ctx, new Rect(-dxy.dx, -dxy.dy, canvas.width, canvas.height));

		// level.draw(ctx);
	};

	public translate(ctx: CanvasRenderingContext2D, character: Character)
	{
		const canvas = ctx.canvas;
		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;

		const characterRect = character.getRect();
		const dx = centerX - characterRect.x - characterRect.width / 2;
		const dy = centerY - characterRect.y - characterRect.height / 2;

		return this.normalizeAndSetCoords(dx, dy, ctx, canvas.width, canvas.height);
	}
}
class Camera_inZone extends Camera
{
	private zone: Rect;
	private dX = 0;
	private dY = 0;

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
		const characterRect = character.getRect();
		const zone = this.zone.copy();
		zone.x -= this.dX;
		zone.y -= this.dY;

		let dx = this.dX;
		let dy = this.dY;

		if (characterRect.x < zone.x) dx += zone.x - characterRect.x;
		if (characterRect.y < zone.y) dy += zone.y - characterRect.y;

		if (characterRect.x > zone.x + zone.width - characterRect.width) dx += zone.x + zone.width - characterRect.width - characterRect.x;
		if (characterRect.y > zone.y + zone.height - characterRect.height) dy += zone.y + zone.height - characterRect.height - characterRect.y;

		if (!true)
		{
			ctx.save();
			ctx.strokeStyle = "red";
			ctx.lineWidth = 5;
			ctx.strokeRect(this.zone.x, this.zone.y, this.zone.width, this.zone.height);
			ctx.restore();
		}

		const normalized = this.normalizeAndSetCoords(dx, dy, ctx, ctx.canvas.width, ctx.canvas.height);
		this.dX = normalized.dx;
		this.dY = normalized.dy;
	}
}


abstract class Camera_splited extends Camera
{
	constructor(translateMode: ITranslateMode = "XY", bounds?: Rect)
	{
		super(translateMode, bounds);
	}

	protected drawSection(dxy: {dx: number, dy: number}, ctx: CanvasRenderingContext2D, level: Level)
	{
		const canvas = ctx.canvas;
		ctx.save();
		ctx.beginPath();
		ctx.rect(-dxy.dx, -dxy.dy, canvas.width / 2, canvas.height);
		ctx.clip();
		level.draw(ctx, new Rect(-dxy.dx, -dxy.dy, canvas.width, canvas.height));
		ctx.restore();
	}
}
class Camera_splited_inCenter extends Camera_splited
{
	public draw(ctx: CanvasRenderingContext2D, level: Level, character: Character)
	{
		const canvas = ctx.canvas;
		let character2;
		if (character = level.mainCharacter) character2 = level.secondCharacter;
		else character2 = level.mainCharacter;

		ctx.save();
		const dxy = this.translate(ctx, character, new Rect(0, 0, canvas.width / 2, canvas.height));
		this.drawSection(dxy, ctx, level);
		ctx.restore();

		ctx.save();
		const dxy2 = this.translate(ctx, character2, new Rect(canvas.width / 2, 0, canvas.width / 2, canvas.height));
		this.drawSection(dxy2, ctx, level);
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

	public translate(ctx: CanvasRenderingContext2D, character: Character, drawZone: Rect)
	{
		const centerX = drawZone.width / 2;
		const centerY = drawZone.height / 2;

		const characterRect = character.getRect();
		const dx = centerX - characterRect.x - characterRect.width / 2;
		const dy = centerY - characterRect.y - characterRect.height / 2;

		ctx.translate(drawZone.x, drawZone.y);
		return this.normalizeAndSetCoords(dx, dy, ctx, drawZone.width, drawZone.height);
	}
}
