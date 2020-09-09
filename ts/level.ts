import { Character } from "./character.js";
import { Platform } from "./platforms/platform.js";
import { WorldObject } from "./worldObject.js";

export abstract class Level
{
	public GF = 0.1;
	public backgroundColor = "lightblue";
	public objects: WorldObject[] = [];

	protected abstract platforms: Platform[];
	protected characters: Character[] = [];
	public mainCharacter: Character;

	constructor()
	{
		this.mainCharacter = new Character(this);
		this.characters[0] = this.mainCharacter;
	}

	protected addCharacter()
	{
		const character = new Character(this);
		this.characters.push(character);
		return character;
	}
	protected assign()
	{
		this.objects = this.objects.concat(this.platforms, this.characters);
	}
}