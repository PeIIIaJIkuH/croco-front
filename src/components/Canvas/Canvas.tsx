import {clsx} from '@mantine/core'
import {useHotkeys} from '@mantine/hooks'
import {observer} from 'mobx-react-lite'
import {FC, useEffect, useRef} from 'react'
import canvasState from '../../store/canvas.state'
import socketState from '../../store/socket.state'
import userState from '../../store/user.state'
import {CanvasDrawing, CanvasPoint, RoomActions} from '../../types'
import s from './Canvas.module.css'

export const Canvas: FC = observer(() => {
	const cursorRef = useRef<HTMLCanvasElement>(null)
	const tempRef = useRef<HTMLCanvasElement>(null)
	const paintRef = useRef<HTMLCanvasElement>(null)

	let isDrawing = false
	let point: CanvasPoint
	let drawing: CanvasDrawing

	const resize = () => {
		const size = Math.min(window.innerWidth, window.innerHeight)
		canvasState.setScale(0.7 * size / 1000)
	}

	const getPoint = (e: MouseEvent, {left, top}: DOMRect): CanvasPoint => {
		return {
			x: (e.clientX - left) / canvasState.scale,
			y: (e.clientY - top) / canvasState.scale,
		}
	}

	const drawTemp = (e: MouseEvent) => {
		if (!tempRef.current) return
		const tempCtx = tempRef.current.getContext('2d')
		tempCtx && (tempCtx.lineWidth = (Math.max(canvasState.thickness - 1, 1)) * 2)
		tempCtx && (tempCtx.lineCap = 'round')
		tempCtx && (tempCtx.strokeStyle = canvasState.type === 'eraser' ? 'white' : canvasState.color)
		tempCtx?.beginPath()
		tempCtx?.moveTo(point.x, point.y)
		drawing.points.push({...point})
		point = getPoint(e, tempRef.current.getBoundingClientRect())
		drawing.points.push({...point})
		tempCtx?.lineTo(point.x, point.y)
		tempCtx?.stroke()
		tempCtx?.closePath()
	}

	const drawCursor = () => {
		if (!cursorRef.current) return
		const cursorCtx = cursorRef.current.getContext('2d')
		cursorCtx?.clearRect(0, 0, cursorCtx.canvas.width, cursorCtx.canvas.height)
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

	const drawPaint = (d?: CanvasDrawing) => {
		const draw = d || drawing
		if (!draw?.points?.length || !paintRef.current) return
		draw && canvasState.addUndoAction(draw, true)
		const paintCtx = paintRef.current.getContext('2d')
		paintCtx && (paintCtx.lineCap = 'round')
		paintCtx && (paintCtx.lineWidth = Math.max(draw.thickness - 1, 1) * 2)
		paintCtx && (paintCtx.strokeStyle = canvasState.type === 'eraser' ? 'white' : draw.color)
		paintCtx?.beginPath()
		paintCtx?.moveTo(draw.points[0].x, draw.points[1].y)
		paintCtx?.lineTo(draw.points[0].x, draw.points[1].y)
		for (let i = 1; i < draw.points.length; i++) {
			const point = draw.points[i]
			paintCtx?.lineTo(point.x, point.y)
			paintCtx?.moveTo(point.x, point.y)
		}
		paintCtx?.stroke()
		paintCtx?.closePath()
		if (drawing && userState.isHost) {
			socketState.socket?.emit('drawToServer', {roomId: socketState.roomId, drawing})
		}
	}

	const move = (e: MouseEvent) => {
		if (!userState.isHost) return
		if (isDrawing) {
			drawTemp(e)
		} else if (cursorRef.current) {
			point = getPoint(e, cursorRef.current.getBoundingClientRect())
		}
		drawCursor()
	}

	const start = (e: MouseEvent) => {
		if (!cursorRef.current || !userState.isHost) return
		const {left, top, right, bottom} = cursorRef.current.getBoundingClientRect()
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
		if (!cursorRef.current || !tempRef.current || !userState.isHost) return
		const {left, top, right, bottom} = cursorRef.current.getBoundingClientRect()
		if ((e.clientX < left || e.clientY < top || e.clientX > right || e.clientY > bottom) && !isDrawing) return
		isDrawing = false
		const tempCtx = tempRef.current.getContext('2d')
		tempCtx?.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height)
		drawPaint()
	}

	const onRightClick = (e: MouseEvent) => {
		e.preventDefault()
	}

	useEffect(() => {
		canvasState.setPaintCanvas(paintRef.current)
		const cursorCanvasElement = cursorRef.current!

		resize()
		document.addEventListener('mousemove', move)
		document.addEventListener('mousedown', start)
		document.addEventListener('mouseup', end)
		window.addEventListener('resize', resize)
		cursorCanvasElement.addEventListener('contextmenu', onRightClick)

		return () => {
			canvasState.setPaintCanvas(null)
			document.removeEventListener('mousemove', move)
			document.removeEventListener('mousedown', start)
			document.removeEventListener('mouseup', end)
			window.removeEventListener('resize', resize)
			cursorCanvasElement.removeEventListener('contextmenu', onRightClick)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cursorRef.current, tempRef.current, paintRef.current])

	useEffect(() => {
		if (!socketState.socket) return
		socketState.socket.on('drawToClient', (drawing: CanvasDrawing) => {
			drawPaint(drawing)
		})

		socketState.socket.on('undoToClient', () => {
			canvasState.undo()
		})

		socketState.socket.on('redoToClient', () => {
			canvasState.redo()
		})

		socketState.socket.on('resetToClient', () => {
			canvasState.reset()
		})

		socketState.socket.on('loadActionsToClient', (actions: RoomActions) => {
			actions && canvasState.setActions(actions)
		})

		return () => {
			socketState.socket?.off('drawToClient')
			socketState.socket?.off('undoToClient')
			socketState.socket?.off('redoToClient')
			socketState.socket?.off('resetToClient')
			socketState.socket?.off('loadActions')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socketState.socket])

	useEffect(() => {
		const onUnload = () => {
			socketState.socket?.emit('leaveRoom')
		}

		socketState.socket?.emit('joinRoom', socketState.roomId)
		window.addEventListener('beforeunload', onUnload)

		return () => {
			window.removeEventListener('beforeunload', onUnload)
		}
	}, [])

	useEffect(() => {
		if (!userState.isHost) {
			socketState.socket?.emit('loadActionsToServer', socketState.roomId)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userState.isHost])

	useHotkeys([
		['ctrl+Z', () => {
			if (userState.isHost) {
				canvasState.undo()
				socketState.socket?.emit('undoToServer', socketState.roomId)
			}
		}],
		['ctrl+shift+Z', () => {
			if (userState.isHost) {
				canvasState.redo()
				socketState.socket?.emit('redoToServer', socketState.roomId)
			}
		}],
	])

	return (
		<div className={s.wrapper}>
			<canvas className={clsx(s.canvas, s.cursor, !userState.isHost && s.guest)} ref={cursorRef} height='1000'
				width='1000'
			/>
			<canvas className={clsx(s.canvas, s.temp, !userState.isHost && s.guest)} ref={tempRef} height='1000'
				width='1000'
			/>
			<canvas className={clsx(s.canvas, s.paint, !userState.isHost && s.guest)} ref={paintRef} height='1000'
				width='1000'
			/>
		</div>
	)
})
