import { COLORS, COUNTDOWN_TIMES } from './constants';
import { getClosestTime, maskProgress } from './countdown';
import snake from './snake';

import senseLeds from 'sense-hat-led';

function go(): void {
	const snake_process = snake();
	let secondsLeft = getClosestTime(new Date(), COUNTDOWN_TIMES)
	if (secondsLeft <= 64) { // Seconds left...
		snake_process.stop()
		for (let x = 0; x <= 7; x++) {
			for (let y = 0; y <= 7; y++) {
				senseLeds.setPixel(x, y, COLORS.RED)
			}
		}
		maskProgress(secondsLeft / 64)
		return
	}

	function onTick() {
		secondsLeft = getClosestTime(new Date(), COUNTDOWN_TIMES)
		if (secondsLeft <= (64 * 60)) { // Minutes left...
			maskProgress(secondsLeft / (64 * 60))
		}
	}

	if (!snake_process.isStarted()) {
		snake_process.start(onTick)
	}
}

export const countdown_snake = () => {
	let interval_id: number | undefined
	return {
		stop: () => {
			senseLeds.clear()
			clearInterval(interval_id)
			interval_id = undefined
		},
		isStarted: () => {
			return interval_id !== undefined
		},
		start: () => {
			clearInterval(interval_id)
			interval_id = setInterval(go, 1000)
		}
	}
}

export default countdown_snake