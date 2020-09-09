import { WorldObject_Movable } from "../worldObject.js";
export class Platform extends WorldObject_Movable {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.color = "green";
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
