
export const COLORS = {
    RED: [240, 10, 10],
    BLACK: [0, 0, 0],
    PURPLE: [233, 33, 100],
    GREEN: [33, 233, 100],
    BLUE: [33, 100, 233],
    MINT: [223, 240, 226],
}
type ColorsType = typeof COLORS[keyof typeof COLORS]

export const COUNTDOWN_TIMES = ['10:00', '12:00', '15:00']

export const ADVENT_CANDLES = [
    new Date('2025-12-01T09:00:00'),
    new Date('2025-12-08T09:00:00'),
    new Date('2025-12-15T09:00:00'),
    new Date('2025-12-22T09:00:00'),
]