import {DefaultMantineColor, MantineColor} from '@mantine/core'
import {makeAutoObservable} from 'mobx'
import {CanvasDrawing, CanvasThickness, CanvasType} from '../types'

class CanvasState {
	paintCanvas: HTMLCanvasElement | null = null
	type: CanvasType = 'pencil'
	thickness: CanvasThickness = 5
	color: MantineColor = 'black'
	undoList: CanvasDrawing[] = []
	redoList: CanvasDrawing[] = []

	constructor() {
		makeAutoObservable(this)
	}

	setPaintCanvas(canvas: HTMLCanvasElement | null) {
		this.paintCanvas = canvas
	}

	setType(type: CanvasType) {
		this.type = type
	}

	setThickness(thickness: CanvasThickness) {
		this.thickness = thickness
	}

	setColor(color: DefaultMantineColor) {
		this.color = color
	}

	resetRedoList() {
		this.redoList = []
	}

	addUndoDrawing(drawing: CanvasDrawing, clearRedoList = false) {
		this.undoList.push(drawing)
		clearRedoList && this.resetRedoList()
	}

	addRedoPoints(drawing: CanvasDrawing) {
		this.redoList.push(drawing)
	}

	drawFromUndoList() {
		if (this.undoList.length === 0) return
		const ctx = this.paintCanvas?.getContext('2d')
		if (!ctx) return
		for (const drawing of this.undoList) {
			ctx.lineCap = 'round'
			ctx.lineWidth = Math.max(drawing.thickness - 1, 1) * 2
			ctx.strokeStyle = ctx.fillStyle = drawing.color
			ctx.beginPath()
			ctx.moveTo(drawing.points[0].x, drawing.points[0].y)
			ctx.lineTo(drawing.points[0].x, drawing.points[0].y)
			for (let i = 1; i < drawing.points.length; i++) {
				const point = drawing.points[i]
				ctx.lineTo(point.x, point.y)
				ctx.moveTo(point.x, point.y)
			}
			ctx.stroke()
			ctx.closePath()
		}
	}

	clearPaintCanvas() {
		const ctx = this.paintCanvas?.getContext('2d')
		const size = Math.min(window.innerWidth, window.innerHeight)
		ctx?.clearRect(0, 0, size, size)
	}

	undo() {
		if (this.undoList.length === 0) return
		this.clearPaintCanvas()
		const points = this.undoList.splice(this.undoList.length - 1, 1)[0]
		this.addRedoPoints(points)
		this.drawFromUndoList()
	}

	redo() {
		if (this.redoList.length === 0) return
		this.clearPaintCanvas()
		const points = this.redoList.splice(this.redoList.length - 1, 1)[0]
		this.addUndoDrawing(points, false)
		this.drawFromUndoList()
	}
}

export default new CanvasState()
