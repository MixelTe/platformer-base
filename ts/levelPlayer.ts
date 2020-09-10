import { Level } from "./level.js";
import { Level1 } from "./levels/level01.js";
import { Camera } from "./camera.js";
import { Rect } from "./functions.js";
import { CharacterController } from "./characterController.js";

export class LevelPlayer
{
	private level: Level | null = null;
	// private camera: Camera = Camera.create.inCenter("XY", new Rect(-100, -100, 1000, 800));
	// private camera: Camera = Camera.create.inZone(new Rect(200, 100, 300, 200), "XY", new Rect(-100, 0, 1000, 800));
	private camera: Camera = Camera.create.splited.inCenter("XY", new Rect(-100, -100, 1000, 800));
	private chrControllers: CharacterController[] = [];
	private active = true;

	constructor()
	{
		document.addEventListener("keydown", this.keydown.bind(this));
		document.addEventListener("keyup", this.keyup.bind(this));
		this.setLevel();
	}

	public setLevel()
	{
		this.level = new Level1();
		this.chrControllers = [];
		this.chrControllers[0] = new CharacterController(this.level.mainCharacter);
		if (this.level.characters[1]) this.chrControllers[1] = new CharacterController(this.level.characters[1], "wsad");
	}


	public update()
	{
		if (this.level != null) this.level.update();
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

			this.camera.draw(ctx, this.level, this.level.mainCharacter);
		}
		ctx.restore();
	}

	private keydown(e: KeyboardEvent)
	{
		if (this.active && this.level != null)
		{
			this.chrControllers.forEach(ctrl =>
			{
				ctrl.keydown(e);
			});
		}
	}
	private keyup(e: KeyboardEvent)
	{
		if (this.active && this.level != null)
		{
			this.chrControllers.forEach(ctrl =>
			{
				ctrl.keyup(e);
			});
		}
	}
}