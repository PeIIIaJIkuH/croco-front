import { clsx } from '@mantine/core'
import { FC, useEffect, useRef } from 'react'
import s from './Canvas.module.css'

export const Canvas: FC = () => {
	const cursorRef = useRef<HTMLCanvasElement | null>(null)
	const paintRef = useRef<HTMLCanvasElement | null>(null)
	const cursorCtx = cursorRef.current?.getContext('2d')
	const paintCtx = paintRef.current?.getContext('2d')

	useEffect(() => {
		const onMouseMove = (e: MouseEvent) => {
			if (cursorRef.current) {
				const { left, top, width, height } = cursorRef.current?.getBoundingClientRect()
				if (cursorCtx) {
					const size = Math.min(window.innerWidth, window.innerHeight)
					cursorCtx.clearRect(0, 0, size, size)
					cursorCtx.beginPath()
					cursorCtx.arc((e.clientX - left) * (size / width), (e.clientY - top) *
						(size / height), 10, 0, Math.PI * 2)
					cursorCtx.stroke()
				}
			}
		}

		const resize = () => {
			if (cursorCtx && paintCtx) {
				const size = Math.min(window.innerWidth, window.innerHeight)
				cursorCtx.canvas.width =
					cursorCtx.canvas.height = paintCtx.canvas.height = paintCtx.canvas.height = size
			}
		}

		resize()
		document.addEventListener('mousemove', onMouseMove)
		window.addEventListener('resize', resize)

		return () => {
			document.removeEventListener('mousemove', onMouseMove)
		}
	}, [cursorCtx, paintCtx])

	return (
		<div className={s.wrapper}>
			<canvas className={clsx(s.canvas, s.cursor)} ref={cursorRef} />
			<canvas className={clsx(s.canvas, s.paint)} ref={paintRef} />
		</div>
	)
}
