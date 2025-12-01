export function rand(min: number, max: number, inclusive: boolean = true): number {
    return Math.floor((max - min + (inclusive ? 1 : 0)) * Math.random() + min)
}

export function clamp(min: number, max: number, value: number): number {
    return Math.min(max, Math.max(min, value))
}

export function clampPos(min: number, max: number, pos: Position): Position {
    return [clamp(min, max, pos[0]), clamp(min, max, pos[1])]
}

/**
 * Vary a color to make it more "alive".
 * @param color The color to use as a base color.
 * @param variation Number from 0 to 255. The number will be added/substracted from the r/g/b values respectively.
 */
export function varyColor(color: Color, variation: number = 20, part: str = 'all'): Color {
    const r = clamp(0, 255, color[0] + rand(-variation, variation))
    const g = clamp(0, 255, color[1] + rand(-variation, variation))
    const b = clamp(0, 255, color[2] + rand(-variation, variation))
    return [r, g, b]
}

export function drawPixel(pos: Position, color: number[], ledMatrix: any) {
    ledMatrix.setPixel(pos[0], pos[1], color)
}

export function diffuseDraw(pos: Position, color: Color, ledMatrix: any): None {
    const [x, y] = pos
    ledMatrix.setPixel(x, y, color)

    ledMatrix.setPixel((8 + x - 1) % 8, y, varyColor(color)) // West
    ledMatrix.setPixel((x + 1) % 8, y, varyColor(color)) // East
    ledMatrix.setPixel(x, (8 + y - 1) % 8, varyColor(color)) // South
    ledMatrix.setPixel(x, (y + 1) % 8, varyColor(color)) // North
    if (Math.random() < 0.2) {
        ledMatrix.setPixel((8 + x - 1) % 8, (y + 1) % 8, varyColor(color)) // NorthWest
    }
    if (Math.random() < 0.2) {
        ledMatrix.setPixel((8 + x - 1) % 8, (y - 1) % 8, varyColor(color)) // SouthWest
    }
    if (Math.random() < 0.2) {
        ledMatrix.setPixel((8 + x + 1) % 8, (y + 1) % 8, varyColor(color)) // NorthEast
    }
    if (Math.random() < 0.2) {
        ledMatrix.setPixel((8 + x + 1) % 8, (y - 1) % 8, varyColor(color)) // SouthEast
    }
}

export function leftPad(value: number | string): string {
    return String(value).padStart(2, '0');
}

const _MS_PER_HOUR = 1000 * 60 * 60;
export function hoursDiff(date1: Date, date2: Date): number {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate(), date2.getHours(), date2.getMinutes());

    if (utc2 < utc1) {
        return 0
    }

    return (utc2 - utc1) / _MS_PER_HOUR;
}