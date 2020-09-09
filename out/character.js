import { MinMax } from "./functions.js";
import { intersection } from "./littleLib.js";
import { WorldObject, WorldObject_Movable } from "./worldObject.js";
export class Character extends WorldObject_Movable {
    constructor(level) {
        super(0, 0, 30, 30);
        this.color = "blue";
        this.speedMax = 10;
        this.acc = 1;
        this.jumpForce = 9;
        this.jumpForce_SpeedMul = 0.2;
        this.mass = 5;
        this.direction = "right";
        this.needMovingNow = false;
        this.canJump = false;
        this.platformBelow = null;
        this.platformBelowX = null;
        this.platformBelowPastX = null;
        this.speedCurX = 0;
        this.speedAddX = 0;
        this.speedCurY = 0;
        this.accCur = 0;
        this.level = level;
    }
    preUpdate() {
        this.move();
    }
    calcY() {
        this.speedCurY -= this.mass * this.level.GF;
        return this.y + this.speedCurY;
    }
    calcX() {
        if (this.needMovingNow) {
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
        else {
            this.accCur = 0;
            if (-this.acc <= this.speedCurX && this.speedCurX <= this.acc)
                this.speedCurX = 0;
            else if (this.speedCurX > 0)
                this.accCur = -this.acc;
            else if (this.speedCurX < 0)
                this.accCur = this.acc;
        }
        this.speedCurX += this.accCur;
        this.speedCurX = MinMax(this.speedCurX, -this.speedMax, this.speedMax);
        let nextX = this.x + this.speedCurX + this.speedAddX;
        if (this.platformBelow instanceof Character) {
            this.speedAddX = this.platformBelow.speedCurX;
        }
        else {
            this.speedAddX = 0;
            if (this.platformBelowX != null) {
                if (this.platformBelowPastX != null) {
                    nextX += this.platformBelowX - this.platformBelowPastX;
                }
                this.platformBelowPastX = this.platformBelowX;
            }
            else
                this.platformBelowPastX = null;
        }
        return nextX;
    }
    intersectionY(nextY, rect, el) {
        let intersected = false;
        if (intersection.rects(rect, el)) {
            intersected = true;
            if (this.y >= el.y + el.height / 2)
                nextY = el.y + el.height;
            else
                nextY = el.y - this.height;
        }
        return { nextY, intersected };
    }
    intersectionX(nextX, rect, el) {
        let intersected = false;
        if (intersection.rects(rect, el)) {
            intersected = true;
            if (this.x > el.x + el.width / 2)
                nextX = el.x + el.width;
            else
                nextX = el.x - this.width;
        }
        return { nextX, intersected };
    }
    move() {
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
        let platformBelowXSet = null;
        this.canJump = false;
        let platformBelow = null;
        for (const el of this.level.objects) {
            if (el == this)
                continue;
            let _nextY = { nextY, intersected: false };
            let _nextX = { nextX, intersected: false };
            rect1.x = this.x + 1;
            _nextY = this.intersectionY(nextY, rect1, el);
            rect2.y = _nextY.nextY + 1;
            _nextX = this.intersectionX(nextX, rect2, el);
            if (el instanceof WorldObject_Movable && el.nextPos != null) {
                const rect = this.getRect();
                rect.x = _nextX.nextX + 1;
                rect.y = _nextY.nextY + 1;
                rect.width -= 2;
                rect.height -= 2;
                if (intersection.rects(rect, el.nextPos)) {
                    const dx = el.nextPos.x - el.x;
                    const dy = el.nextPos.y - el.y;
                    _nextY.nextY += dy;
                    _nextX.nextX += dx;
                    const rect = this.getRect();
                    if (intersection.rects(rect, el)) {
                        const dy = el.nextPos.y - el.y;
                        if (dy < 0)
                            _nextY.nextY += dy;
                    }
                }
            }
            if (_nextX.intersected) {
                this.speedCurX = 0;
            }
            ;
            if (_nextY.intersected) {
                this.speedCurY = 0;
                if (this.y >= el.y + el.height / 2) {
                    if (platformBelow == null)
                        platformBelow = el;
                    else
                        platformBelow = false;
                    this.canJump = true;
                    if (platformBelowXSet == null)
                        platformBelowXSet = true;
                    else
                        platformBelowXSet = false;
                }
                else {
                    if (el instanceof Character) {
                        el.jump(1);
                    }
                }
            }
            nextY = _nextY.nextY;
            nextX = _nextX.nextX;
        }
        ;
        if (platformBelow instanceof WorldObject) {
            if (platformBelow instanceof WorldObject_Movable && platformBelow.nextPos != null)
                nextY = platformBelow.nextPos.y + platformBelow.height;
            if (platformBelowXSet) {
                if (this.platformBelow == platformBelow) {
                    this.platformBelowX = platformBelow.x;
                }
                this.platformBelow = platformBelow;
            }
            else {
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
    jump(powerMult = 1) {
        if (this.canJump) {
            this.speedCurY = this.jumpForce + Math.abs(this.speedCurX) * this.jumpForce_SpeedMul;
            this.speedCurY *= powerMult;
        }
    }
    startMoving(direction) {
        this.needMovingNow = true;
        this.direction = direction;
    }
    endMoving(direction) {
        if (direction == this.direction)
            this.needMovingNow = false;
    }
    setCoords(x, y) {
        this.x = x;
        this.y = y;
    }
}