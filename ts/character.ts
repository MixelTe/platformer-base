import { PhysicsObject } from "./physicsObject.js";
import { Level } from "./level.js";

export class Character extends PhysicsObject
{
	protected color = "blue";
	protected speedMax = 10;
	protected acc = 1;
	protected mass = 5;
	private jumpForce = 9;
	private jumpForce_SpeedMul = 0.2;

	private direction: IDirection = "right";
	private needMovingNow = false;

	constructor(level: Level)
	{
		super(0, 0, 30, 30, level);
	}

	protected calcAcc()
	{
		if (this.needMovingNow)
		{
			switch (this.direction)
			{
				case "left":
					this.accCur = -this.acc;
					break;

				case "right":
					this.accCur = this.acc;
					break;
				default:
					break;
			}
		}
		else
		{
			this.accCur = 0;
			if (-this.acc <= this.speedCurX && this.speedCurX <= this.acc) this.speedCurX = 0;
			else if (this.speedCurX > 0) this.accCur = -this.acc;
			else if (this.speedCurX < 0) this.accCur = this.acc;
		}
	}

	public jump(powerMult: number = 1)
	{
		if (this.inAir)
		{
			this.speedCurY = this.jumpForce + Math.abs(this.speedCurX) * this.jumpForce_SpeedMul;
			this.speedCurY *= powerMult;
		}
	}
	public startMoving(direction: IDirection)
	{
		this.needMovingNow = true;
		this.direction = direction;
	}
	public endMoving(direction: IDirection)
	{
		if (direction == this.direction) this.needMovingNow = false;
	}
}

type IDirection = "left" | "right";