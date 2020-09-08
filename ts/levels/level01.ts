import { Level } from "../level.js";
import { Platform } from "../platform.js";

export class Level1 extends Level
{
	public platforms = [
		new Platform(100, 0, 500, 10),
		new Platform(350, 10, 50, 30),
		new Platform(200, 50, 200, 40),
		new Platform(300, 90, 200, 40),
	];

	constructor()
	{
		super();
		this.character.setCoords(200, 20);
	}
}