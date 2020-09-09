import { Character } from "./character.js";
export class Level {
    constructor() {
        this.GF = 0.1;
        this.backgroundColor = "lightblue";
        this.objects = [];
        this.characters = [];
        this.mainCharacter = new Character(this);
        this.characters[0] = this.mainCharacter;
    }
    addCharacter() {
        const character = new Character(this);
        this.characters.push(character);
        return character;
    }
    assign() {
        this.objects = this.objects.concat(this.platforms, this.characters);
    }
}
