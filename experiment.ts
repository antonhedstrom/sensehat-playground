import events from 'events';
import { SenseHat } from 'pi-sense-hat'

function sensehat_events() {
    let senseHat = new SenseHat();
    let temp = 0;
    const event_emitter = new events.EventEmitter()
    senseHat.displayMessage("Ready!", "green");

    senseHat.on("joystick", (event: JOYSTICK_EVENT) => {
        event_emitter.emit("joystick", event)
    });
    senseHat.on("environment", (event: ENVIRONMENT_EVENT) => {
        event_emitter.emit("environment", event)
        temp = event.temperature;
    });
    senseHat.on("motion", (event: MOTION_EVENT) => {
        event_emitter.emit("motion", event)
        const acc_x = Math.abs(event.acceleration.x)
        const acc_y = Math.abs(event.acceleration.y)
        const acc_z = Math.abs(event.acceleration.z)
        if (acc_x > 0.2 || acc_y > 0.2 || acc_z > 0.2) {
            event_emitter.emit("accelerating", event)
        }
    });
    process.on('SIGTERM', function () {
        process.exit(0);
    });

    return event_emitter
}


export default sensehat_events