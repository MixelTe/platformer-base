import { Level } from "../level.js";
import { Platform } from "../platforms/platform.js";
import { Platform_Movable } from "../platforms/movable.js";

export class Level1 extends Level
{
	public platforms = [
		new Platform(100, 90, 100, 10),
		new Platform(400, 180, 200, 10),
		new Platform(200, 270, 150, 10),
		new Platform(500, 360, 180, 10),

		new Platform(-200, 380, 180, 10),
		new Platform(850, 340, 180, 10),

		new Platform(0, 0, 800, 10),
		new Platform(0, 0, 10, 600),
		new Platform(790, 0, 10, 600),
		new Platform(0, 590, 800, 10),
		];

	constructor()
	{
		super();
		this.mainCharacter.setCoords(200, 120);

		this.addSecondCharacter();
		this.secondCharacter.setCoords(400, 120);

		this.assign();
	}
}