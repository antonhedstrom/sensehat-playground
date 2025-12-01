//const matrix = require('node-sense-hat').Leds;
import senseLeds from 'sense-hat-led';

import { rand, diffuseDraw, clamp, clampPos, varyColor } from './utils';

senseLeds.lowLight = true;


function walk(pos: Position, direction: Direction): Position {
	const [x, y] = pos
	let dx = 0, dy = 0
	switch (direction) {
		case 0: // North
			dy = 1;
			break;
		case 1: // East
			dx = 1;
			break;
		case 2: // South
			dy = -1;
			break;
		case 3: // West
			dx = -1;
			break;
		default:
			console.log('Unhandled direction', direction)
	}
	return [x + dx, y + dy]
}

export const snake = () => {
	let snakePos: Position = [3, 3];
	let snakeDir: Direction = 0;

	let interval_id: number | undefined
	return {
		stop: () => {
			clearInterval(interval_id);
			interval_id = undefined;
		},
		isStarted: (): boolean => {
			return interval_id !== undefined
		},
		start: (onTick: () => void = () => { }) => {
			clearInterval(interval_id);

			// Initial state
			let snakeColor: Color = [
				rand(0, 255),
				rand(0, 255),
				rand(0, 255),
			];
			for (let x = 0; x <= 7; x++) {
				for (let y = 0; y <= 7; y++) {
					diffuseDraw([x, y], snakeColor, senseLeds)
				}
			}
			// Start walking and colorize
			interval_id = setInterval(() => {
				snakeDir = (4 + snakeDir + rand(-1, 1, false)) % 4
				snakePos = clampPos(1, 6, walk(snakePos, snakeDir))
				snakeColor = varyColor(snakeColor, 80)

				diffuseDraw(snakePos, snakeColor, senseLeds)
				onTick()
			}, 500)
		}
	}
}

export default snake