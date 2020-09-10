import { Rect } from "./functions.js";

export class WorldObject
{
	public Active_physics = true;
	public Active_interaction = true;
	public Active_draw = true;
	public get ActiveFull(): boolean
	{
		return this.Active_draw && this.Active_physics && this.Active_interaction;
	}
	public set ActiveFull(v: boolean) {
		this.Active_physics = v;
		this.Active_interaction = v;
		this.Active_draw = v;
	}



	public x: number;
	public y: number;
	public width: number;
	public height: number;
	protected color: string;

	constructor(x: number, y: number, width: number, height: number, color: string = "red")
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
	}

	public preUpdate() { }
	public update() { }

	public getRect()
	{
		return new Rect(this.x, this.y, this.width, this.height);
	}
	public draw(ctx: CanvasRenderingContext2D)
	{
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}
}
export class WorldObject_Movable extends WorldObject
{
	public nextPos: Rect | null = null;
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
}
