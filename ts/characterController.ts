import { Character } from "./character";

type IInputType = "arrows" | "wsad" | "numPad" | "arrows_wasd" | "arrows_wasd_numPad"

export class CharacterController
{
	private character: Character;
	private inputType: IInputType;
	constructor(character: Character, inputType: IInputType = "arrows")
	{
		this.character = character;
		this.inputType = inputType;
	}

	public keydown(e: KeyboardEvent)
	{
		switch (this.inputType) {
			case "arrows": this.keydown_arrows(e); break;
			case "wsad": this.keydown_wsad(e); break;
			case "numPad": this.keydown_numPad(e); break;
			case "arrows_wasd":
				this.keydown_arrows(e);
				this.keydown_wsad(e);
				break;
			case "arrows_wasd_numPad":
				this.keydown_arrows(e);
				this.keydown_wsad(e);
				this.keydown_numPad(e);
				break;
			default: throw new Error("Uncorrect inputType");
		}
	}
	public keyup(e: KeyboardEvent)
	{
		switch (this.inputType) {
			case "arrows": this.keyup_arrows(e); break;
			case "wsad": this.keyup_wsad(e); break;
			case "numPad": this.keyup_numPad(e); break;
			case "arrows_wasd":
				this.keyup_arrows(e);
				this.keyup_wsad(e);
				break;
			case "arrows_wasd_numPad":
				this.keyup_arrows(e);
				this.keyup_wsad(e);
				this.keyup_numPad(e);
				break;
			default: throw new Error("Uncorrect inputType");
		}
	}

	private keydown_arrows(e: KeyboardEvent)
	{
		switch (e.code)
		{
			case "ArrowUp":
				this.character.jump();
				break;

			case "ArrowRight":
				this.character.startMoving("right");
				break;

			case "ArrowLeft":
				this.character.startMoving("left");
				break;

			default:
				break;
		}
	}
	private keyup_arrows(e: KeyboardEvent)
	{
		switch (e.code)
		{
			case "ArrowRight":
				this.character.endMoving("right");
				break;

			case "ArrowLeft":
				this.character.endMoving("left");
				break;

			default:
				break;
		}
	}

	private keydown_wsad(e: KeyboardEvent)
	{
		switch (e.code)
		{
			case "KeyW":
				this.character.jump();
				break;

			case "KeyD":
				this.character.startMoving("right");
				break;

			case "KeyA":
				this.character.startMoving("left");
				break;

			default:
				break;
		}
	}
	private keyup_wsad(e: KeyboardEvent)
	{
		switch (e.code)
		{
			case "KeyD":
				this.character.endMoving("right");
				break;

			case "KeyA":
				this.character.endMoving("left");
				break;

			default:
				break;
		}
	}

	private keydown_numPad(e: KeyboardEvent)
	{
		switch (e.code)
		{
			case "Numpad8":
				this.character.jump();
				break;

			case "Numpad6":
				this.character.startMoving("right");
				break;

			case "Numpad4":
				this.character.startMoving("left");
				break;

			default:
				break;
		}
	}
	private keyup_numPad(e: KeyboardEvent)
	{
		switch (e.code)
		{
			case "Numpad6":
				this.character.endMoving("right");
				break;

			case "Numpad4":
				this.character.endMoving("left");
				break;

			default:
				break;
		}
	}
}