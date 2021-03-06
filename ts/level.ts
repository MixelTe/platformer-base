import { Character } from "./character.js";
import { Platform } from "./platforms/platform.js";
import { WorldObject } from "./worldObject.js";
import { Rect } from "./functions.js";
import { intersection } from "./littleLib.js";
// import { MovableObj } from "./platforms/movable.js";

export abstract class Level
{
	public GF = 0.1;
	public backgroundColor = "lightblue";
	public objects: WorldObject[] = [];

	protected abstract platforms: Platform[];
	// private movableObjs: MovableObj[] = [];
	private characters: Character[] = [];
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

	protected addMovableObj(x: number, y: number, width: number, height: number)
	{
		// const obj = new MovableObj(x, y, width, height, this);
		// this.movableObjs.push(obj);
		// return obj;
	}
	protected addSecondCharacter()
	{
		this.secondCharacter.ActiveFull = true;
	}
	protected assign()
	{
		// this.objects = this.objects.concat(this.platforms, this.movableObjs, this.characters);
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

	public draw(ctx: CanvasRenderingContext2D, bounds?: Rect)
	{
		this.objects.forEach(obj =>
		{
			if (obj.Active_draw)
			{
				if (bounds == undefined || intersection.rects(bounds, obj.getRect()))
				{
					obj.draw(ctx);
				}
			}
		});
	}
}