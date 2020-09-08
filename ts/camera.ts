import { Character } from "./character";

export abstract class Camera
{
	public static create = {
		inCenter: Camera.CreateCamera_inCenter,
	}
	private static CreateCamera_inCenter(translateMode: ITranslateMode = "XY")
	{
		return new Camera_inCenter(translateMode);
	}
	public abstract translate(ctx: CanvasRenderingContext2D, character: Character): void;
}

class Camera_inCenter extends Camera
{
	private translateMode: ITranslateMode;

	constructor(translateMode: ITranslateMode = "XY")
	{
		super();
		this.translateMode = translateMode;
	}

	public translate(ctx: CanvasRenderingContext2D, character: Character)
	{
		const canvas = ctx.canvas;
		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;

		const characterRect = character.getRect();
		const dx = centerX - characterRect.x - characterRect.width / 2;
		const dy = centerY - characterRect.y - characterRect.height / 2;

		switch (this.translateMode) {
			case "XY": ctx.translate(dx, dy); break;
			case "X": ctx.translate(dx, 0); break;
			case "Y": ctx.translate(0, dy); break;
			default: ctx.translate(0, 0); break;
		}
	}
}

type ITranslateMode = "X" | "Y" | "XY";