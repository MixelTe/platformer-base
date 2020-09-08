export function MinMax(num: number, min: number, max: number)
{
	return Math.min(Math.max(num, min), max);
}

export class Rect
{
	public x: number;
	public y: number;
	public width: number;
	public height: number;

	constructor(x: number, y: number, width: number, height: number)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	public copy()
	{
		return new Rect(this.x, this.y, this.width, this.height);
	}
}