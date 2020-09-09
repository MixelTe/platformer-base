import { Level1 } from "./levels/level01.js";
import { Camera } from "./camera.js";
import { Rect } from "./functions.js";
import { CharacterController } from "./characterController.js";
export class LevelPlayer {
    constructor() {
        this.level = null;
        // private camera: Camera = Camera.create.inCenter("XY", new Rect(-100, -100, 1000, 800));
        this.camera = Camera.create.inZone(new Rect(200, 100, 300, 200), "XY", new Rect(-100, 0, 1000, 800));
        this.chrControllers = [];
        this.active = true;
        document.addEventListener("keydown", this.keydown.bind(this));
        document.addEventListener("keyup", this.keyup.bind(this));
        this.setLevel();
    }
    setLevel() {
        this.level = new Level1();
        this.chrControllers = [];
        this.chrControllers[0] = new CharacterController(this.level.mainCharacter);
        if (this.level.characters[1])
            this.chrControllers[1] = new CharacterController(this.level.characters[1], "wsad");
    }
    update() {
        if (this.level != null) {
            this.level.objects.forEach(obj => obj.preUpdate());
            this.level.objects.forEach(obj => obj.update());
        }
    }
    redraw(ctx) {
        const canvas = ctx.canvas;
        ctx.save();
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (this.level != null) {
            ctx.fillStyle = this.level.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.camera.translate(ctx, this.level.mainCharacter);
            this.level.objects.forEach(obj => obj.draw(ctx));
        }
        ctx.restore();
    }
    keydown(e) {
        if (this.active && this.level != null) {
            this.chrControllers.forEach(ctrl => {
                ctrl.keydown(e);
            });
        }
    }
    keyup(e) {
        if (this.active && this.level != null) {
            this.chrControllers.forEach(ctrl => {
                ctrl.keyup(e);
            });
        }
    }
}
