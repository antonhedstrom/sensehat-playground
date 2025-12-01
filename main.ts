// import Gpio from 'pigpio';

import countdown from './countdown';
import snake from './snake';
import countdown_snake from './countdown_snake';
import advent from './advent';
import sensehat_events from './experiment';

// const motor = new Gpio.Gpio(18, { mode: Gpio.OUTPUT });

// Test
import senseLeds from 'sense-hat-led';

const countdown_process = countdown();
const snake_process = snake();
const countdown_snake_process = countdown_snake();
const advent_process = advent();
const interactions = sensehat_events();

let pulseWidth = 500;

interactions.on("accelerating", (event: MOTION_EVENT) => {
	const compassRatio = (180 - Math.abs(event.compass)) / 180
	// motor.servoWrite(Math.floor(500 + 2000 * compassRatio));

	console.log(event.acceleration.x, event.acceleration.y)
	if (event.acceleration.x > 0.8) {
		senseLeds.sync.setRotation(90, true)
	} else if (event.acceleration.x < -0.8) {
		senseLeds.sync.setRotation(270, true)
	} else if (event.acceleration.y > 0.8) {
		senseLeds.sync.setRotation(0, true)
	} else if (event.acceleration.y < -0.8) {
		senseLeds.sync.setRotation(180, true)
	}
})

interactions.on("joystick", (event: JOYSTICK_EVENT) => {
	if (event.state === 1) {
		if (event.key === "LEFT") {
			pulseWidth += 100
			if (pulseWidth > 2500) {
				pulseWidth = 2500;
			}
		}

		if (event.key === "RIGHT") {
			pulseWidth -= 100
			if (pulseWidth < 500) {
				pulseWidth = 500;
			}
		}
	}
})

const nothing_process = {
	stop: () => {
		// Noop
		console.log("nothing stopped")
	},
	isStarted: (): boolean => {
		return false
	},
	start: () => {
		console.log("Nothing started.")
		senseLeds.clear()
	}
}

// Toggle around among these
// const views = [nothing_process, countdown_process, snake_process, countdown_snake_process, advent_process]
const views = [nothing_process, countdown_process, advent_process]
let current_view_index = 0
nothing_process.start()

interactions.on("joystick", (event: JOYSTICK_EVENT) => {
	let new_state = null;
	if (event.state == 0) {
		if (event.key == "UP") {
			new_state = current_view_index + 1;
		}
		else if (event.key == "DOWN") {
			new_state = current_view_index - 1;
		}
	}

	if (new_state && current_view_index != new_state) {
		current_view_index = (new_state + views.length) % views.length;
		// Stop all
		views.forEach((view) => view.stop())
		senseLeds.clear()

		// Start correct
		const process = views[current_view_index];
		process.start()

		// Notify we will show nothing
		if (current_view_index == 0) {
			senseLeds.showMessage("X", 0.1, [220, 20, 20])
		}
	}
})

