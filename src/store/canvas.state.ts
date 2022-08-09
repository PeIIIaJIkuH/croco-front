import {MantineColor} from '@mantine/core'
import {makeAutoObservable} from 'mobx'
import {CanvasAction, CanvasThickness, CanvasType} from '../types'

class CanvasState {
	paintCanvas: HTMLCanvasElement | null = null
	type: CanvasType = 'pencil'
	thickness: CanvasThickness = 5
	color: MantineColor = 'black'
	undoList: CanvasAction[] = []
	redoList: CanvasAction[] = []

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

	setColor(color: MantineColor) {
		this.color = color
	}

	resetRedoList() {
		this.redoList = []
	}

	addUndoAction(action?: CanvasAction, clearRedoList = false) {
		action && this.undoList.push(action)
		clearRedoList && this.resetRedoList()
	}

	addRedoAction(action?: CanvasAction) {
		action && this.redoList.push(action)
	}

	drawFromUndoList() {
		if (this.undoList.length === 0) return
		const ctx = this.paintCanvas?.getContext('2d')
		if (!ctx) return
		for (const action of this.undoList) {
			if (action === 'reset') {
				this.clearPaintCanvas()
			} else {
				ctx.lineCap = 'round'
				ctx.lineWidth = Math.max(action.thickness - 1, 1) * 2
				ctx.strokeStyle = action.color
				ctx.beginPath()
				ctx.moveTo(action.points[0].x, action.points[0].y)
				ctx.lineTo(action.points[0].x, action.points[0].y)
				for (let i = 1; i < action.points.length; i++) {
					const point = action.points[i]
					ctx.lineTo(point.x, point.y)
					ctx.moveTo(point.x, point.y)
				}
				ctx.stroke()
				ctx.closePath()
			}
		}
	}

	clearPaintCanvas() {
		const ctx = this.paintCanvas?.getContext('2d')
		const size = Math.min(window.innerWidth, window.innerHeight)
		ctx?.clearRect(0, 0, size, size)
	}

	undo() {
		if (this.undoList.length === 0) return
		const action = this.undoList.pop()
		this.addRedoAction(action)
		this.clearPaintCanvas()
		this.drawFromUndoList()
	}

	redo() {
		if (this.redoList.length === 0) return
		const action = this.redoList.pop()
		this.addUndoAction(action, false)
		this.clearPaintCanvas()
		this.drawFromUndoList()
	}

	reset() {
		this.clearPaintCanvas()
		this.addUndoAction('reset', true)
	}
}

export default new CanvasState()
