import * as Lib from "./littleLib.js";
import { GamePlayer } from "./gamePlayer.js";

const canvas = Lib.get.canvas("canvas");
Lib.canvas.fitToParent.BCR(canvas);

new GamePlayer(canvas, Lib.canvas.getContext2d(canvas));