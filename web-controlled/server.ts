
import express from "express"
import bodyParser from "body-parser"
import senseLeds from "sense-hat-led"
import path from "path"
import Gpio from 'pigpio';

import { drawPixel } from '../utils'

senseLeds.lowLight = true;
const motor = new Gpio.Gpio(18, { mode: Gpio.OUTPUT });

const app = express()
const port = 3000

const canvas = Array.from({ length: 8 }, () =>
    Array(8).fill([0, 0, 0])
);

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, "public")));

// app.get('/', (req, res) => {
//     const indexFile = path.join(__dirname, 'public', 'index.html')
//     res.sendFile(indexFile)
// })

app.get('/api/board', (req, res) => {
    res.send(canvas)
})

app.post('/api/board', (req, res) => {
    // Body json example:
    // [{x: 3, y: 5, color: [23,24,26] }]
    const data = req.body.data

    try {
        data.forEach((pixel: Any) => {
            if (!pixel.color) {
                throw Error(`(${pixel.x}, ${pixel.y}) has no valid color.`)
            }
            canvas[pixel.x][pixel.y] = pixel.color
            drawPixel([pixel.x, pixel.y], pixel.color, senseLeds)
        })
        motor.servoWrite(Math.floor(500 + 2000 * Math.random()));
    } catch (e) {
        res.status(400).send({ "status": "ERROR", "message": e.message })
        return
    }
    res.status(200).send({ "status": "OK" })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

export const webserver = () => {
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

        }
    }
}

export default webserver