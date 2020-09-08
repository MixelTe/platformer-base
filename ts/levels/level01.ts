import { Level } from "../level.js";
import { Platform } from "../platforms/platform.js";
import { Platform_Movable } from "../platforms/movable.js";

export class Level1 extends Level
{
	public platforms = [
		new Platform(100, 0, 500, 10),
		new Platform(350, 10, 50, 30),
		new Platform(200, 50, 200, 40),
		new Platform_Movable(300, 90, 200, 40, 5, 0, 400, "y"),
	];

	constructor()
	{
		super();
		this.character.setCoords(200, 20);
	}
}