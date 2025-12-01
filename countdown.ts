//const matrix = require('node-sense-hat').Leds;
import senseLeds from 'sense-hat-led';

import { COLORS, COUNTDOWN_TIMES } from './constants';

async function displayMessage(message: string, speed: number = 0.1, color: ColorsType = COLORS.PURPLE): Promise<Any> {
	return new Promise((resolve, reject) => {
		senseLeds.showMessage(message, speed, color, resolve)
	})
}

function durationInSeconds(time_a: string, time_b: Date): number {
	let timeParts: string[] = time_a.split(':');
	if (!time_b) {
		time_b = new Date();
	}
	let hours: number = parseInt(timeParts[0]) - time_b.getHours();
	let minutes: number = parseInt(timeParts[1]) - time_b.getMinutes();
	let seconds: number = 60 - time_b.getSeconds();
	// Substract one minute since we added 60 secs above.
	minutes -= 1;

	if (minutes < 0) {
		hours -= 1;
		minutes += 60;
	}
	if (hours < 0) {
		hours += 24;
	}

	return hours * 60 * 60 + minutes * 60 + seconds;
}

export function getClosestTime(reference_time: Date, candidate_times: string[]): number {
	return candidate_times.reduce((bestCandidate: number, candidate_time: string) => {
		const candidate = durationInSeconds(candidate_time, reference_time);
		return candidate < bestCandidate ? candidate : bestCandidate;
	}, Number.MAX_SAFE_INTEGER)
}

/**
 * Turn off a number of pixels depending on progress. 100% = None pixels will be turned off.
 * @param progress Number between 0 and 1 indicating the progress. 0 = 0%, 1 = 100%.
 */
export function maskProgress(progress: number): void {
	let turn_off_pixel_count: number = 64 * (1 - progress)
	for (let x: number = 0; x < 8; x++) {
		for (let y: number = 0; y < 8; y++) {
			if (turn_off_pixel_count <= 0) {
				return // No more pixels to turn off, we are done.
			}
			senseLeds.setPixel(x, y, [0, 0, 0])
			turn_off_pixel_count -= 1
		}
	}
}

/**
 * Draw a number of pixels in a certain color depending on progress. 100% = All 64 pixels will be filled.
 * @param progress Number between 0 and 1 indicating the progress. 0 = 0%, 1 = 100%.
 * @param color Which color should be drawn? Defaults to blue.
 */
function drawProgress(progress: number, color = COLORS.BLUE): void {
	const target_on: number = progress * 64
	let current_on: number = 0
	for (let x: number = 0; x < 8; x++) {
		for (let y: number = 0; y < 8; y++) {
			current_on += 1
			if (current_on < target_on) {
				senseLeds.setPixel(x, y, color)
			} else if (current_on === target_on) {
				senseLeds.setPixel(x, y, [0, 0, 60])
			} else {
				senseLeds.setPixel(x, y, [0, 0, 0])
			}
		}
	}
}

function drawTimeLeft(): void {
	const secondsLeft = getClosestTime(new Date(), COUNTDOWN_TIMES)
	if (secondsLeft <= 64) { // Seconds left...
		drawProgress(secondsLeft / 64, COLORS.RED)
	} else if (secondsLeft <= (64 * 60)) { // Minutes left...
		drawProgress(secondsLeft / (64 * 60), COLORS.MINT)
	} else if (secondsLeft <= (64 * 60 * 60)) { // Hours left...
		drawProgress(secondsLeft / (64 * 60 * 60), COLORS.GREEN)
	}
}

export const countdown = () => {
	let interval_id: number | undefined
	return {
		stop: () => {
			clearInterval(interval_id)
			interval_id = undefined
		},
		isStarted: () => {
			return interval_id !== undefined
		},
		start: () => {
			clearInterval(interval_id)
			senseLeds.lowLight = true;
			interval_id = setInterval(drawTimeLeft, 1000)
		}
	}
}

export default countdown