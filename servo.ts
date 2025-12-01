import Gpio from 'pigpio';

const motor = new Gpio.Gpio(18, { mode: Gpio.OUTPUT });

// Test

let state = 0; // 0 = nothing, 1 = countdown, 2 = snake

(async () => {
    let servoInterval: number | undefined
    let pulseWidth = 1500;
    let toggle = false
    servoInterval = setInterval(() => {
        toggle = !toggle
        motor.servoWrite(toggle ? 500 : 2500);
    }, 2000)

})();

