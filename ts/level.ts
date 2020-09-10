import { Character } from "./character.js";
import { Platform } from "./platforms/platform.js";
import { WorldObject } from "./worldObject.js";

export abstract class Level
{
	public GF = 0.1;
	public backgroundColor = "lightblue";
	public objects: WorldObject[] = [];

	protected abstract platforms: Platform[];
	public characters: Character[] = [];
	public mainCharacter: Character;
	public secondCharacter: Character;

	constructor()
	{
		this.mainCharacter = new Character(this);
		this.secondCharacter = new Character(this);
		this.secondCharacter.ActiveFull = false;
		this.characters[0] = this.mainCharacter;
		this.characters[1] = this.secondCharacter;
	}

	protected addSecondCharacter()
	{
		this.secondCharacter.ActiveFull = true;
	}
	protected assign()
	{
		this.objects = this.objects.concat(this.platforms, this.characters);
	}

	public update()
	{
		this.objects.forEach(obj =>
		{
			if (obj.Active_physics) obj.preUpdate();
		});
		this.objects.forEach(obj =>
		{
			if (obj.Active_physics) obj.update();
		});
	}

	public draw(ctx: CanvasRenderingContext2D)
	{
		this.objects.forEach(obj =>
		{
			if (obj.Active_draw) obj.draw(ctx)
		});
	}
}