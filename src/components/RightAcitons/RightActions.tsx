import {ActionIcon, Button, clsx} from '@mantine/core'
import {useClipboard} from '@mantine/hooks'
import {
	IconArrowBackUp,
	IconArrowForwardUp,
	IconCheck,
	IconCopy,
	IconEraser,
	IconPencil,
	IconPoint,
	IconTrash,
	TablerIcon,
} from '@tabler/icons'
import {observer} from 'mobx-react-lite'
import {FC} from 'react'
import {COLORS} from '../../constants'
import canvasState from '../../store/canvas.state'
import socketState from '../../store/socket.state'
import {CanvasThickness} from '../../types'
import s from './RightActions.module.css'

type Type = 'pencil' | 'eraser' | 'undo' | 'redo' | 'reset' | 'copy'

type Button = {
	name: Type
	Icon: TablerIcon
	size?: number
	onClick: () => void
}

export const RightActions: FC = observer(() => {
	const {copy, copied} = useClipboard()

	const actions: Button[] = [{
		name: 'pencil',
		Icon: IconPencil,
		onClick: () => {
			canvasState.setType('pencil')
		},
	}, {
		name: 'eraser',
		Icon: IconEraser,
		onClick: () => {
			canvasState.setType('eraser')
		},
	}, {
		name: 'undo',
		Icon: IconArrowBackUp,
		onClick: () => {
			canvasState.undo()
			// send strings to api just to signal this type of action
		},
	}, {
		name: 'redo',
		Icon: IconArrowForwardUp,
		onClick: () => {
			canvasState.redo()
			// send strings to api just to signal this type of action
		},
	}, {
		name: 'reset',
		Icon: IconTrash,
		onClick: () => {
			canvasState.reset()
			// send strings to api just to signal this type of action
		},
	}, {
		name: 'copy',
		Icon: copied ? IconCheck : IconCopy,
		onClick: () => {
			copy(`http://localhost:3000/room/${socketState.roomId}`)
		},
	}]

	const thicknesses: CanvasThickness[] = [1, 5, 10, 15]

	return (
		<div className={s.wrapper}>
			<div className={s.buttons}>
				{actions.map(({name, Icon, onClick}) => (
					<ActionIcon
						key={name} size='lg' onClick={onClick}
						className={clsx(s.button, name === canvasState.type && s.active)}
						variant={name === canvasState.type ? 'filled' : 'subtle'}
					>
						<Icon/>
					</ActionIcon>
				))}
			</div>
			<div className={s.buttons}>
				{thicknesses.map((thickness) => (
					<ActionIcon
						key={thickness} className={clsx(s.button, thickness === canvasState.thickness && s.active)}
						variant={thickness === canvasState.thickness ? 'filled' : 'subtle'} size='lg'
						onClick={() => canvasState.setThickness(thickness)}
					>
						<IconPoint size={thickness + 10} color='white'/>
					</ActionIcon>
				))}
			</div>
			<div className={s.buttons}>
				{COLORS.map((color, index) => (
					<ActionIcon
						key={index} className={clsx(s.button, color === canvasState.color && s.active)}
						variant={color === canvasState.color ? 'filled' : 'subtle'} size='lg'
						onClick={() => canvasState.setColor(color)}
					>
						<IconPoint size={40} color={color} fill={color}/>
					</ActionIcon>
				))}
			</div>
		</div>
	)
})
