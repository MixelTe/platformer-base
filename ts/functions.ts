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

	public intersect(rect: Rect)
	{
		const rect1 = this.copy();
		this.normalizeRect(rect1);
		this.normalizeRect(rect);
		return (
			rect1.x + rect1.width >= rect.x &&
			rect.x + rect.width >= rect1.x &&
			rect1.y + rect1.height >= rect.y &&
			rect.y + rect.height >= rect1.y
		);
	}
	private normalizeRect(rect: Rect)
	{
		if (rect.width < 0)
		{
			rect.x += rect.width;
			rect.width = Math.abs(rect.width);
		}
		if (rect.height < 0)
		{
			rect.y += rect.height;
			rect.height = Math.abs(rect.height);
		}
	}
}