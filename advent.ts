//const matrix = require('node-sense-hat').Leds;
import senseLeds from 'sense-hat-led';

import { drawPixel, hoursDiff, varyColor } from './utils';
import { ADVENT_CANDLES } from './constants';

senseLeds.lowLight = true;

const CANDLE_COLOR: Color = [255, 0, 0];
const FIRE_COLOR: Color = [240, 240, 10];

const DONE_TIME = new Date('2025-12-24T15:00:00')

function drawCandle(progress: number, offset: number = 0, onFire: bool = false) {
    const height = Math.ceil(progress * 7)
    for (let i = 0; i <= 7; i++) {
        if (i == height && onFire) {
            drawPixel([offset, 7 - i], varyColor(FIRE_COLOR, 20), senseLeds)
        } else if (i <= height) {
            drawPixel([offset, 7 - i], CANDLE_COLOR, senseLeds)
        } else {
            drawPixel([offset, 7 - i], [0, 0, 0], senseLeds) // Turn forget to blow it out!
        }
    }
}

export const advent = () => {
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

            interval_id = setInterval(() => {
                const now = new Date();
                ADVENT_CANDLES.forEach((candleTime, index) => {
                    const hasStarted = now >= candleTime;
                    let progress = 1;
                    if (hasStarted) {
                        let hoursOnFire = hoursDiff(candleTime, now);
                        let totalHours = hoursDiff(candleTime, DONE_TIME);
                        progress = 1 - (hoursOnFire / totalHours)
                    }
                    drawCandle(progress, index * 2, hasStarted);
                })

                onTick()
            }, 500)
        }
    }
}

// advent().start()

export default advent