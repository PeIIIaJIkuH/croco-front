import {clsx} from '@mantine/core'
import {useHotkeys} from '@mantine/hooks'
import {observer} from 'mobx-react-lite'
import {FC, useEffect, useRef} from 'react'
import canvasState from '../../store/canvas-state'
import {CanvasDrawing, CanvasPoint} from '../../types'
import s from './Canvas.module.css'

export const Canvas: FC = observer(() => {
	const cursorRef = useRef<HTMLCanvasElement>(null)
	const tempRef = useRef<HTMLCanvasElement>(null)
	const paintRef = useRef<HTMLCanvasElement>(null)

	let isDrawing = false
	let point: CanvasPoint
	let drawing: CanvasDrawing

	const init = () => {
		const cursorCtx = cursorRef.current!.getContext('2d')
		const tempCtx = tempRef.current!.getContext('2d')
		const paintCtx = paintRef.current!.getContext('2d')
		if (cursorCtx && tempCtx && paintCtx) {
			const size = Math.min(window.innerWidth, window.innerHeight)
			cursorCtx.canvas.width = cursorCtx.canvas.height = size
			tempCtx.canvas.width = tempCtx.canvas.height = size
			paintCtx.canvas.height = paintCtx.canvas.width = size
		}
	}

	const getPoint = (e: MouseEvent, {left, top, width, height}: DOMRect): CanvasPoint => {
		const size = Math.min(window.innerWidth, window.innerHeight)
		return {
			x: (e.clientX - left) * (size / width),
			y: (e.clientY - top) * (size / height),
		}
	}

	const drawTemp = (e: MouseEvent) => {
		const tempCtx = tempRef.current!.getContext('2d')
		tempCtx && (tempCtx.lineWidth = (Math.max(canvasState.thickness - 1, 1)) * 2)
		tempCtx && (tempCtx.lineCap = 'round')
		tempCtx && (tempCtx.strokeStyle = canvasState.type === 'eraser' ? 'white' : canvasState.color)
		tempCtx?.beginPath()
		tempCtx?.moveTo(point.x, point.y)
		drawing.points.push({...point})
		point = getPoint(e, tempRef.current!.getBoundingClientRect())
		drawing.points.push({...point})
		tempCtx?.lineTo(point.x, point.y)
		tempCtx?.stroke()
		tempCtx?.closePath()
	}

	const drawCursor = () => {
		const cursorCtx = cursorRef.current!.getContext('2d')
		const size = Math.min(window.innerWidth, window.innerHeight)
		cursorCtx && (cursorCtx.lineWidth = 2)
		cursorCtx?.clearRect(0, 0, size, size)
		cursorCtx?.beginPath()
		cursorCtx?.arc(point.x, point.y, canvasState.thickness, 0, Math.PI * 2)
		cursorCtx?.moveTo(point.x + canvasState.thickness + 5, point.y)
		cursorCtx?.lineTo(point.x + canvasState.thickness + 20, point.y)
		cursorCtx?.moveTo(point.x - canvasState.thickness - 5, point.y)
		cursorCtx?.lineTo(point.x - canvasState.thickness - 20, point.y)
		cursorCtx?.moveTo(point.x, point.y + canvasState.thickness + 5)
		cursorCtx?.lineTo(point.x, point.y + canvasState.thickness + 20)
		cursorCtx?.moveTo(point.x, point.y - canvasState.thickness - 5)
		cursorCtx?.lineTo(point.x, point.y - canvasState.thickness - 20)
		cursorCtx?.stroke()
		cursorCtx?.closePath()
	}

	const drawPaint = () => {
		if (!drawing?.points?.length) return
		const paintCtx = paintRef.current!.getContext('2d')
		paintCtx && (paintCtx.lineCap = 'round')
		paintCtx && (paintCtx.lineWidth = Math.max(drawing.thickness - 1, 1) * 2)
		paintCtx && (paintCtx.strokeStyle = drawing.color)
		paintCtx?.beginPath()
		paintCtx?.moveTo(drawing.points[0].x, drawing.points[1].y)
		paintCtx?.lineTo(drawing.points[0].x, drawing.points[1].y)
		for (let i = 1; i < drawing.points.length; i++) {
			const point = drawing.points[i]
			paintCtx?.lineTo(point.x, point.y)
			paintCtx?.moveTo(point.x, point.y)
		}
		paintCtx?.stroke()
		paintCtx?.closePath()
	}

	const move = (e: MouseEvent) => {
		if (isDrawing) {
			drawTemp(e)
		} else {
			point = getPoint(e, cursorRef.current!.getBoundingClientRect())
		}
		drawCursor()
	}

	const start = (e: MouseEvent) => {
		const {left, top, right, bottom} = cursorRef.current!.getBoundingClientRect()
		if (e.clientX < left || e.clientY < top || e.clientX > right || e.clientY > bottom) return
		drawing = {
			points: [],
			color: canvasState.color,
			thickness: canvasState.thickness,
		}
		isDrawing = true
		drawTemp(e)
	}

	const end = (e: MouseEvent) => {
		const {left, top, right, bottom} = cursorRef.current!.getBoundingClientRect()
		if ((e.clientX < left || e.clientY < top || e.clientX > right || e.clientY > bottom) && !isDrawing) return
		isDrawing = false
		const tempCtx = tempRef.current!.getContext('2d')
		const size = Math.min(window.innerWidth, window.innerHeight)
		tempCtx?.clearRect(0, 0, size, size)
		drawing && canvasState.addUndoAction(drawing, true)
		drawPaint()
	}

	const onRightClick = (e: MouseEvent) => {
		e.preventDefault()
	}

	useEffect(() => {
		canvasState.setPaintCanvas(paintRef.current)
		const cursorCanvasElement = cursorRef.current!

		init()
		document.addEventListener('mousemove', move)
		document.addEventListener('mousedown', start)
		document.addEventListener('mouseup', end)
		cursorCanvasElement.addEventListener('contextmenu', onRightClick)

		return () => {
			canvasState.setPaintCanvas(null)
			document.removeEventListener('mousemove', move)
			document.removeEventListener('mousedown', start)
			document.removeEventListener('mouseup', end)
			cursorCanvasElement.removeEventListener('contextmenu', onRightClick)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cursorRef.current, tempRef.current, paintRef.current])

	useHotkeys([
		['ctrl+Z', () => canvasState.undo()],
		['ctrl+shift+Z', () => canvasState.redo()],
	])

	return (
		<div className={s.wrapper}>
			<canvas className={clsx(s.canvas, s.cursor)} ref={cursorRef}/>
			<canvas className={clsx(s.canvas, s.temp)} ref={tempRef}/>
			<canvas className={clsx(s.canvas, s.paint)} ref={paintRef}/>
		</div>
	)
})
