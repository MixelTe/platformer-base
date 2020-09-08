import { MinMax } from "./functions.js";
import { intersection, Rect } from "./littleLib.js";
import { Level } from "./level.js";
import { Platform } from "./platforms/platform.js";

export class Character
{
	private level: Level;
	private x = 0;
	private y = 0;
	private width = 30;
	private height = 30;
	private color = "blue";
	private speedMax = 10;
	private acc = 1;
	private jumpForce = 9;
	private jumpForce_SpeedMul = 0.2;
	private mass = 5;

	private direction: IDirection = "right";
	private needMovingNow = false;
	private canJump = false;
	private platformBelow: null | Platform = null;
	private platformBelowX: null | number = null;
	private platformBelowPastX: null | number = null;
	private speedCurX = 0;
	private speedCurY = 0;
	private accCur = 0;

	constructor(level: Level)
	{
		this.level = level;
	}

	public update()
	{
		this.move();
	}
	private calcY()
	{
		this.speedCurY -= this.mass * this.level.GF;
		return this.y + this.speedCurY;
	}
	private calcX()
	{
		if (this.needMovingNow)
		{
			switch (this.direction) {
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
		this.speedCurX += this.accCur;
		this.speedCurX = MinMax(this.speedCurX, -this.speedMax, this.speedMax);

		let nextX = this.x + this.speedCurX;

		if (this.platformBelowX != null)
		{
			if (this.platformBelowPastX != null)
			{
				nextX += this.platformBelowX - this.platformBelowPastX;
			}
			this.platformBelowPastX = this.platformBelowX;
		}
		else this.platformBelowPastX = null;
		return nextX;
	}
	private intersectionY(nextY: number, rect: Rect, el: Platform)
	{
		let intersected = false;
		if (intersection.rects(rect, el))
		{
			intersected = true;
			if (this.y >= el.y + el.height / 2) nextY = el.y + el.height;
			else nextY = el.y - this.height;
		}
		return { nextY, intersected };
	}
	private intersectionX(nextX: number, rect: Rect, el: Platform)
	{
		let intersected = false;
		if (intersection.rects(rect, el))
		{
			intersected = true;
			if (this.x > el.x + el.width / 2) nextX = el.x + el.width;
			else nextX = el.x - this.width;
		}
		return { nextX, intersected };
	}
	private move()
	{
		let nextY = this.calcY();
		let nextX = this.calcX();

		const rect1 = this.getRect();
		rect1.y = nextY;
		rect1.x += 1;
		rect1.width -= 2;

		const rect2 = this.getRect();
		rect2.x = nextX;
		rect2.y += 1;
		rect2.height -= 2;

		this.platformBelowX = null;
		let platformBelowXSet: null | boolean = null;
		this.canJump = false;
		let platformBelow: Platform | null | false = null;
		for (const el of this.level.platforms)
		{
			let _nextY = { nextY, intersected: false };
			let _nextX = { nextX, intersected: false };


			rect1.x = this.x + 1;
			_nextY = this.intersectionY(nextY, rect1, el);
			rect2.y = _nextY.nextY + 1;
			_nextX = this.intersectionX(nextX, rect2, el);

			if (el.nextPos != null)
			{
				const rect = this.getRect();
				rect.x = _nextX.nextX + 1;
				rect.y = _nextY.nextY + 1;
				rect.width -= 2;
				rect.height -= 2;
				if (intersection.rects(rect, el.nextPos))
				{
					const dx = el.nextPos.x - el.x;
					const dy = el.nextPos.y - el.y;
					_nextY.nextY += dy;
					_nextX.nextX += dx;

					const rect = this.getRect();
					if (intersection.rects(rect, el))
					{
						const dy = el.nextPos.y - el.y;
						if (dy < 0) _nextY.nextY += dy;
					}
				}
			}

			if (_nextX.intersected)
			{
				this.speedCurX = 0;
			};
			if (_nextY.intersected)
			{
				this.speedCurY = 0;
				if (this.y >= el.y + el.height / 2)
				{
					if (platformBelow == null) platformBelow = el;
					else platformBelow = false;
					this.canJump = true;
					if (platformBelowXSet == null) platformBelowXSet = true;
					else platformBelowXSet = false;
				}
			}

			nextY = _nextY.nextY;
			nextX = _nextX.nextX;
		};

		if (platformBelow instanceof Platform)
		{
			if (platformBelow.nextPos != null) nextY = platformBelow.nextPos.y + platformBelow.height;

			if (platformBelowXSet)
			{
				if (this.platformBelow == platformBelow)
				{
					this.platformBelowX = platformBelow.x;
				}
				this.platformBelow = platformBelow;
			}
			else
			{
				this.platformBelow = null;
				this.platformBelowPastX = null;
				this.platformBelowX = null;
			}
		}

		this.y = nextY;
		this.x = nextX;
		// this.y = Math.max(this.y, 0);
	}
	private getRect()
	{
		return { x: this.x, y: this.y, width: this.width, height: this.height };
	}
	public jump()
	{
		if (this.canJump)
		{
			this.speedCurY = this.jumpForce + Math.abs(this.speedCurX) * this.jumpForce_SpeedMul;
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


	public draw(ctx: CanvasRenderingContext2D)
	{
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}


	public setCoords(x: number, y: number)
	{
		this.x = x;
		this.y = y;
	}
}

type IDirection = "left" | "right";