import { MinMax, Rect } from "./functions.js";
import { intersection } from "./littleLib.js";
import { Level } from "./level.js";
import { WorldObject, WorldObject_Moving } from "./worldObject.js";
import { Character } from "./character.js";

export class PhysicsObject extends WorldObject_Moving
{
	private level: Level;
	protected speedMax = 10;
	protected acc = 1;
	protected mass = 5;

	private platformBelow: null | WorldObject = null;
	private platformBelowX: null | number = null;
	private platformBelowPastX: null | number = null;
	protected inAir = false;
	protected speedCurX = 0;
	private speedAddX = 0;
	protected speedCurY = 0;
	protected accCur = 0;

	constructor(x: number, y: number, width: number, height: number, level: Level, color?: string)
	{
		super(x, y, width, height, color);
		this.level = level;
	}

	public preUpdate()
	{
		this.calcAcc();
		this.move();
	}
	protected calcAcc()
	{
		if (-this.acc <= this.speedCurX && this.speedCurX <= this.acc) this.speedCurX = 0;
		else if (this.speedCurX > 0) this.accCur = -this.acc;
		else if (this.speedCurX < 0) this.accCur = this.acc;
	}
	private calcY()
	{
		this.speedCurY -= this.mass * this.level.GF;
		return this.y + this.speedCurY;
	}
	private calcX()
	{
		this.speedCurX += this.accCur;
		this.speedCurX = MinMax(this.speedCurX, -this.speedMax, this.speedMax);

		let nextX = this.x + this.speedCurX + this.speedAddX;

		if (this.platformBelow instanceof PhysicsObject)
		{
			this.speedAddX = this.platformBelow.speedCurX;
		}
		else
		{
			this.speedAddX = 0;

			if (this.platformBelowX != null)
			{
				if (this.platformBelowPastX != null)
				{
					nextX += this.platformBelowX - this.platformBelowPastX;
				}
				this.platformBelowPastX = this.platformBelowX;
			}
			else this.platformBelowPastX = null;
		}
		return nextX;
	}
	private intersectionY(nextY: number, rect: Rect, el: WorldObject)
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
	private intersectionX(nextX: number, rect: Rect, el: WorldObject)
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
		this.inAir = false;
		let platformBelow: WorldObject | null | false = null;
		for (const el of this.level.objects)
		{
			if (el == this) continue;
			if (!el.Active_interaction) continue;
			let _nextY = { nextY, intersected: false };
			let _nextX = { nextX, intersected: false };


			rect1.x = this.x + 1;
			_nextY = this.intersectionY(nextY, rect1, el);
			rect2.y = _nextY.nextY + 1;
			_nextX = this.intersectionX(nextX, rect2, el);

			if (el instanceof WorldObject_Moving && el.nextPos != null)
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
					this.inAir = true;
					if (platformBelowXSet == null) platformBelowXSet = true;
					else platformBelowXSet = false;
				}
				else
				{
					if (el instanceof Character)
					{
						el.jump();
					}
				}
			}

			nextY = _nextY.nextY;
			nextX = _nextX.nextX;
		};

		if (platformBelow instanceof WorldObject)
		{
			if (platformBelow instanceof WorldObject_Moving && platformBelow.nextPos != null) nextY = platformBelow.nextPos.y + platformBelow.height;

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

		this.nextPos = this.getRect();
		this.nextPos.y = nextY;
		this.nextPos.x = nextX;
		// this.y = Math.max(this.y, 0);
	}

	public setCoords(x: number, y: number)
	{
		this.x = x;
		this.y = y;
	}
}

type IDirection = "left" | "right";