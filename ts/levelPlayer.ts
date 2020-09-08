import { Level } from "./level.js";
import { Level1 } from "./levels/level01.js";
import { Camera } from "./camera.js";
import { Rect } from "./functions.js";

export class LevelPlayer
{
	private level: Level | null = new Level1();
	// private camera: Camera = Camera.create.inCenter("XY", new Rect(-100, -100, 1000, 800));
	private camera: Camera = Camera.create.inZone(new Rect(200, 100, 300, 200), "XY", new Rect(-100, 0, 1000, 800));
	private active = true;

	constructor()
	{
		document.addEventListener("keydown", this.keydown.bind(this));
		document.addEventListener("keyup", this.keyup.bind(this));
	}



	public update()
	{
		if (this.level != null)
		{
			this.level.platforms.forEach(pl => pl.preUpdate());
			this.level.character.update();
			this.level.platforms.forEach(pl => pl.update());
		}
	}
	public redraw(ctx: CanvasRenderingContext2D)
	{
		const canvas = ctx.canvas;
		ctx.save();
		ctx.fillStyle = "red";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		if (this.level != null)
		{
			ctx.fillStyle = this.level.backgroundColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			this.camera.translate(ctx, this.level.character);

			this.level.platforms.forEach(pl => pl.draw(ctx));

			this.level.character.draw(ctx);
		}
		ctx.restore();
	}

	private keydown(e: KeyboardEvent)
	{
		if (this.active && this.level != null)
		{
			switch (e.code)
			{
				case "ArrowUp":
					this.level.character.jump();
					break;

				case "ArrowRight":
					this.level.character.startMoving("right");
					break;

				case "ArrowLeft":
					this.level.character.startMoving("left");
					break;

				default:
					break;
			}
		}
	}
	private keyup(e: KeyboardEvent)
	{
		if (this.active && this.level != null)
		{
			switch (e.code)
			{
				case "ArrowRight":
					this.level.character.endMoving("right");
					break;

				case "ArrowLeft":
					this.level.character.endMoving("left");
					break;

				default:
					break;
			}
		}
	}
}