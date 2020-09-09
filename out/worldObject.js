import { Rect } from "./functions.js";
export class WorldObject {
    constructor(x, y, width, height, color = "red") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    preUpdate() { }
    update() { }
    getRect() {
        return new Rect(this.x, this.y, this.width, this.height);
    }
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}
export class WorldObject_Movable extends WorldObject {
    constructor() {
        super(...arguments);
        this.nextPos = null;
    }
    update() {
        if (this.nextPos != null) {
            this.x = this.nextPos.x;
            this.y = this.nextPos.y;
            this.width = this.nextPos.width;
            this.height = this.nextPos.height;
        }
    }
}
