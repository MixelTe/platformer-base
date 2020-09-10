import { Character } from "./character.js";
import { Rect } from "./functions.js";
import { Level } from "./level.js";

export abstract class Camera
{
	protected translateMode: ITranslateMode;

	constructor(translateMode: ITranslateMode = "XY")
	{
		this.translateMode = translateMode;
	}

	public static create = {
		inCenter: Camera.CreateCamera_inCenter,
		inZone: Camera.CreateCamera_inZone,
	}
	private static CreateCamera_inCenter(translateMode: ITranslateMode = "XY", bounds?: Rect)
	{
		return new Camera_inCenter(translateMode, bounds);
	}
	private static CreateCamera_inZone(zone: Rect, translateMode: ITranslateMode = "XY", bounds?: Rect)
	{
		return new Camera_inZone(zone, translateMode, bounds);
	}
	public abstract draw(ctx: CanvasRenderingContext2D, level: Level): void;

	protected normalizeAndSetCoords(dx: number, dy: number, ctx: CanvasRenderingContext2D, bounds?: Rect)
	{
		const canvas = ctx.canvas;
		if (bounds != undefined)
		{
			dx = Math.min(dx, -bounds.x);
			dy = Math.min(dy, -bounds.y);

			dx = Math.max(dx, -(bounds.x + bounds.width - canvas.width));
			dy = Math.max(dy, -(bounds.y + bounds.height - canvas.height));
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
	private bounds: Rect | undefined;

	constructor(translateMode: ITranslateMode = "XY", bounds?: Rect)
	{
		super(translateMode);
		this.bounds = bounds;
	}
	public draw(ctx: CanvasRenderingContext2D, level: Level)
	{
		const dxy = this.translate(ctx, level.mainCharacter);
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

		return this.normalizeAndSetCoords(dx, dy, ctx, this.bounds);
	}
}

class Camera_inZone extends Camera
{
	private bounds: Rect | undefined;
	private zone: Rect;
	private dX = 0;
	private dY = 0;

	constructor(zone: Rect, translateMode: ITranslateMode = "XY", bounds?: Rect)
	{
		super(translateMode);
		this.translateMode = translateMode;
		this.bounds = bounds;
		this.zone = zone;
	}

	public draw(ctx: CanvasRenderingContext2D, level: Level)
	{
		this.translate(ctx, level.mainCharacter);
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

		const normalized = this.normalizeAndSetCoords(dx, dy, ctx, this.bounds);
		this.dX = normalized.dx;
		this.dY = normalized.dy;
	}
}

type ITranslateMode = "X" | "Y" | "XY";