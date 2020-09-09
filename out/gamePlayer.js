import { LevelPlayer } from "./levelPlayer.js";
export class GamePlayer {
    constructor(canvas, ctx) {
        this.levelPlayer = new LevelPlayer();
        this.pastTime = 0;
        this.timeSpeed = 10;
        this.canvas = canvas;
        this.ctx = ctx;
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
        // window.setTimeSpeed = ((num: number) => { this.timeSpeed = num; }).bind(this);
        this.frame(0);
    }
    frame(time) {
        if (time - this.pastTime > this.timeSpeed) {
            this.levelPlayer.update();
            this.levelPlayer.redraw(this.ctx);
            this.pastTime = time;
        }
        requestAnimationFrame(this.frame.bind(this));
    }
}
