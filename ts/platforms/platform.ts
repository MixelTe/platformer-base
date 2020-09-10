import { WorldObject_Moving } from "../worldObject.js";

export class Platform extends WorldObject_Moving
{
	protected color = "green";

	constructor(x: number, y: number, width: number, height: number)
	{
		super(x, y, width, height)
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}