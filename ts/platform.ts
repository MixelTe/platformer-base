import { Rect } from "./littleLib";

export class Platform
{
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	private color = "green";

	public nextPos: Rect | null = null;
	private counter = 0;

	constructor(x: number, y: number, width: number, height: number)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	public preUpdate()
	{
		this.nextPos = { x: this.x, y: this.y, width: this.width, height: this.height };
		const l = 10;
		const s = 1;
		// this.nextPos.x += s;
		// if (this.counter < l) this.nextPos.y += s;
		// else this.nextPos.y -= s;
		this.counter++;
		this.counter %= l * 2;
	}
	public update()
	{
		if (this.nextPos != null)
		{
			this.x = this.nextPos.x;
			this.y = this.nextPos.y;
			this.width = this.nextPos.width;
			this.height = this.nextPos.height;
		}
	}

	public draw(ctx: CanvasRenderingContext2D)
	{
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}
}