import { Platform } from "./platform";
export class Platform_Movable extends Platform {
    constructor(x, y, width, height, speed, minPos, maxPos, axis, direction = "right_up") {
        super(x, y, width, height);
        this.color = "darkgreen";
        this.speed = speed;
        this.axis = axis;
        this.minPos = minPos;
        this.maxPos = maxPos;
        this.direction = direction;
    }
    preUpdate() {
        this.nextPos = this.getRect();
        if (this.direction == "right_up") {
            this.nextPos[this.axis] += this.speed;
            if (this.nextPos[this.axis] >= this.maxPos) {
                this.nextPos[this.axis] = this.maxPos;
                this.direction = "left_down";
            }
        }
        else {
            this.nextPos[this.axis] -= this.speed;
            if (this.nextPos[this.axis] <= this.minPos) {
                this.nextPos[this.axis] = this.minPos;
                this.direction = "right_up";
            }
        }
    }
}
