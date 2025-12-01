
type Position = [number, number];
type Color = [number, number, number];
type Direction = number

type JOYSTICK_DIR = "UP" | "DOWN" | "LEFT" | "RIGHT" | "ENTER"
type JOYSTICK_STATE = 1 | 0
type JOYSTICK_EVENT = {
    key: JOYSTICK_DIR,
    state: JOYSTICK_STATE
}

type MOTION_EVENT = {
    acceleration: {
        x: number, y: number, z: number
    }
    gyroscope: {
        x: number, y: number, z: number
    }
    orientation: {
        roll: number, pitch: number, yaw: number
    }
    compass: number
}

type ENVIRONMENT_EVENT = {
    temperature: number,
    humidity: number,
    pressure: number
}
