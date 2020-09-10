import { Platform } from "./platform";

export class Platform_Moving extends Platform
{
	protected color = "darkgreen";

	private speed: number;
	private minPos: number;
	private maxPos: number;
	private axis: IAxis;
	private direction: IDirection;

	constructor(x: number, y: number, width: number, height: number, speed: number, minPos: number, maxPos: number, axis: IAxis, direction: IDirection = "right_up")
	{
		super(x, y, width, height);

		this.speed = speed;
		this.axis = axis;
		this.minPos = minPos;
		this.maxPos = maxPos;
		this.direction = direction;
	}

	public preUpdate()
	{
		this.nextPos = this.getRect();
		if (this.direction == "right_up")
		{
			this.nextPos[this.axis] += this.speed;
			if (this.nextPos[this.axis] >= this.maxPos)
			{
				this.nextPos[this.axis] = this.maxPos;
				this.direction = "left_down";
			}
		}
		else
		{
			this.nextPos[this.axis] -= this.speed;
			if (this.nextPos[this.axis] <= this.minPos)
			{
				this.nextPos[this.axis] = this.minPos;
				this.direction = "right_up";
			}
		}
	}
}

type IAxis = "x" | "y";
type IDirection = "left_down" | "right_up";