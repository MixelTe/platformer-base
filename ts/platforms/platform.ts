import { Rect } from "../littleLib.js";

export class Platform
{
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	protected color = "green";

	public nextPos: Rect | null = null;

	constructor(x: number, y: number, width: number, height: number)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	public preUpdate() { }
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
	protected getRect()
	{
		return { x: this.x, y: this.y, width: this.width, height: this.height };
	}

	public draw(ctx: CanvasRenderingContext2D)
	{
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}
}