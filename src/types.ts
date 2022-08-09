import {MantineColor} from '@mantine/core'

export interface CanvasPoint {
	x: number
	y: number
}

export type CanvasType = 'pencil' | 'eraser'

export type CanvasThickness = 1 | 5 | 10 | 15

export interface CanvasDrawing {
	points: CanvasPoint[]
	thickness: CanvasThickness
	color: MantineColor
}
