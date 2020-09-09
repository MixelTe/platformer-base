let Camera = /** @class */ (() => {
    class Camera {
        constructor(translateMode = "XY") {
            this.translateMode = translateMode;
        }
        static CreateCamera_inCenter(translateMode = "XY", bounds) {
            return new Camera_inCenter(translateMode, bounds);
        }
        static CreateCamera_inZone(zone, translateMode = "XY", bounds) {
            return new Camera_inZone(zone, translateMode, bounds);
        }
        normalizeAndSetCoords(dx, dy, ctx, bounds) {
            const canvas = ctx.canvas;
            if (bounds != undefined) {
                dx = Math.min(dx, -bounds.x);
                dy = Math.min(dy, -bounds.y);
                dx = Math.max(dx, -(bounds.x + bounds.width - canvas.width));
                dy = Math.max(dy, -(bounds.y + bounds.height - canvas.height));
            }
            switch (this.translateMode) {
                case "XY":
                    ctx.translate(dx, dy);
                    break;
                case "X":
                    ctx.translate(dx, 0);
                    break;
                case "Y":
                    ctx.translate(0, dy);
                    break;
                default:
                    ctx.translate(0, 0);
                    break;
            }
            return { dx, dy };
        }
    }
    Camera.create = {
        inCenter: Camera.CreateCamera_inCenter,
        inZone: Camera.CreateCamera_inZone,
    };
    return Camera;
})();
export { Camera };
class Camera_inCenter extends Camera {
    constructor(translateMode = "XY", bounds) {
        super(translateMode);
        this.bounds = bounds;
    }
    translate(ctx, character) {
        const canvas = ctx.canvas;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const characterRect = character.getRect();
        const dx = centerX - characterRect.x - characterRect.width / 2;
        const dy = centerY - characterRect.y - characterRect.height / 2;
        this.normalizeAndSetCoords(dx, dy, ctx, this.bounds);
    }
}
class Camera_inZone extends Camera {
    constructor(zone, translateMode = "XY", bounds) {
        super(translateMode);
        this.dX = 0;
        this.dY = 0;
        this.translateMode = translateMode;
        this.bounds = bounds;
        this.zone = zone;
    }
    translate(ctx, character) {
        const characterRect = character.getRect();
        const zone = this.zone.copy();
        zone.x -= this.dX;
        zone.y -= this.dY;
        let dx = this.dX;
        let dy = this.dY;
        if (characterRect.x < zone.x)
            dx += zone.x - characterRect.x;
        if (characterRect.y < zone.y)
            dy += zone.y - characterRect.y;
        if (characterRect.x > zone.x + zone.width - characterRect.width)
            dx += zone.x + zone.width - characterRect.width - characterRect.x;
        if (characterRect.y > zone.y + zone.height - characterRect.height)
            dy += zone.y + zone.height - characterRect.height - characterRect.y;
        if (!true) {
            ctx.save();
            ctx.strokeStyle = "red";
            ctx.lineWidth = 5;
            ctx.strokeRect(this.zone.x, this.zone.y, this.zone.width, this.zone.height);
            ctx.restore();
        }
        const normalized = this.normalizeAndSetCoords(dx, dy, ctx, this.bounds);
        this.dX = normalized.dx;
        this.dY = normalized.dy;
    }
}
