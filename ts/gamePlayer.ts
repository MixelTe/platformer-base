import { LevelPlayer } from "./levelPlayer.js";

export class GamePlayer
{
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private levelPlayer = new LevelPlayer();
	constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D)
	{
		this.canvas = canvas;
		this.ctx = ctx;

		ctx.translate(0, canvas.height);
		ctx.scale(1, -1);

		// window.setTimeSpeed = ((num: number) => { this.timeSpeed = num; }).bind(this);

		this.frame(0);
	}

	private pastTime = 0;
	private timeSpeed = 10;
	private frame(time: number)
	{
		if (time - this.pastTime > this.timeSpeed)
		{

			this.levelPlayer.update();

			this.levelPlayer.redraw(this.ctx);
			this.pastTime = time;
		}

		requestAnimationFrame(this.frame.bind(this));
	}
}