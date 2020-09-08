import { Character } from "./character.js";
import { Platform } from "./platform.js";

export abstract class Level
{
	public GF = 0.1;
	public backgroundColor = "lightblue";
	public abstract platforms: Platform[];
	public character: Character;

	constructor()
	{
		this.character = new Character(this);
	}
}