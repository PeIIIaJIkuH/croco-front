import { clsx } from '@mantine/core'
import { FC, useEffect, useRef } from 'react'
import s from './Canvas.module.css'

export const Canvas: FC = () => {
	const cursorRef = useRef<HTMLCanvasElement>(null)
	const tempRef = useRef<HTMLCanvasElement>(null)
	const paintRef = useRef<HTMLCanvasElement>(null)

	let isDrawing = false
	const coords = {
		x: 0,
		y: 0,
	}

	const updatePosition = (e: MouseEvent, { left, top, width, height }: DOMRect) => {
		const size = Math.min(window.innerWidth, window.innerHeight)
		coords.x = (e.clientX - left) * (size / width)
		coords.y = (e.clientY - top) * (size / height)
	}

	const draw = (e: MouseEvent) => {
		const tempCtx = tempRef.current!.getContext('2d')
		tempCtx && (tempCtx.lineWidth = 20)
		tempCtx && (tempCtx.lineCap = 'round')
		tempCtx?.beginPath()
		tempCtx?.moveTo(coords.x, coords.y)
		updatePosition(e, tempRef.current!.getBoundingClientRect())
		tempCtx?.lineTo(coords.x, coords.y)
		tempCtx?.stroke()
	}

	const onMouseMove = (e: MouseEvent) => {
		const cursorCtx = cursorRef.current!.getContext('2d')
		if (isDrawing) {
			draw(e)
		} else {
			updatePosition(e, cursorRef.current!.getBoundingClientRect())
		}
		const size = Math.min(window.innerWidth, window.innerHeight)
		cursorCtx?.clearRect(0, 0, size, size)
		cursorCtx?.beginPath()
		cursorCtx?.arc(coords.x, coords.y, 10, 0, Math.PI * 2)
		cursorCtx?.stroke()
	}

	const onMouseDown = (e: MouseEvent) => {
		draw(e)
		isDrawing = true
	}

	const onMouseUp = (e: MouseEvent) => {
		const tempCtx = tempRef.current!.getContext('2d')
		const size = Math.min(window.innerWidth, window.innerHeight)
		tempCtx?.clearRect(0, 0, size, size)
		isDrawing = false
	}

	const resize = () => {
		const cursorCtx = cursorRef.current!.getContext('2d')
		const tempCtx = tempRef.current!.getContext('2d')
		const paintCtx = paintRef.current!.getContext('2d')
		if (cursorCtx && tempCtx && paintCtx) {
			const size = Math.min(window.innerWidth, window.innerHeight)
			cursorCtx.canvas.width = cursorCtx.canvas.height = size
			tempCtx.canvas.width = tempCtx.canvas.height = size
			paintCtx.canvas.height = paintCtx.canvas.height = size
		}
	}

	useEffect(() => {
		resize()
		document.addEventListener('mousemove', onMouseMove)
		document.addEventListener('mousedown', onMouseDown)
		document.addEventListener('mouseup', onMouseUp)
		window.addEventListener('resize', resize)

		return () => {
			document.removeEventListener('mousemove', onMouseMove)
			document.removeEventListener('mousedown', onMouseDown)
			document.removeEventListener('mouseup', onMouseUp)
			window.removeEventListener('resize', resize)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cursorRef.current, tempRef.current, paintRef.current])

	return (
		<div className={s.wrapper}>
			<canvas className={clsx(s.canvas, s.cursor)} ref={cursorRef} />
			<canvas className={clsx(s.canvas, s.temp)} ref={tempRef} />
			<canvas className={clsx(s.canvas, s.paint)} ref={paintRef} />
		</div>
	)
}
