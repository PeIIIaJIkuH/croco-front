import {ActionIcon, clsx} from '@mantine/core'
import {useClipboard} from '@mantine/hooks'
import {
	IconArrowBackUp,
	IconArrowForwardUp,
	IconClipboardCheck,
	IconClipboardCopy,
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
import userState from '../../store/user.state'
import {CanvasThickness} from '../../types'
import s from './RightActions.module.css'

type Type = 'pencil' | 'eraser' | 'undo' | 'redo' | 'reset' | 'copy'

type ActionButton = {
	name: Type
	Icon: TablerIcon
	size?: number
	onClick: () => void
}

export const RightActions: FC = observer(() => {
	const {copy, copied} = useClipboard()

	const actions: ActionButton[] = [{
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
			userState.isHost && socketState.socket?.emit('undoToServer', socketState.roomId)
		},
	}, {
		name: 'redo',
		Icon: IconArrowForwardUp,
		onClick: () => {
			canvasState.redo()
			userState.isHost && socketState.socket?.emit('redoToServer', socketState.roomId)
		},
	}, {
		name: 'reset',
		Icon: IconTrash,
		onClick: () => {
			canvasState.reset()
			userState.isHost && socketState.socket?.emit('resetToServer', socketState.roomId)
		},
	}]

	const thicknesses: CanvasThickness[] = [1, 5, 10, 15]

	return (
		<div className={s.wrapper}>
			{userState.isHost && (
				<>
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
								key={thickness}
								className={clsx(s.button, thickness === canvasState.thickness && s.active)}
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
				</>
			)}
			<div className={s.copyButton}>
				<ActionIcon
					size='lg' color='white' className={s.button}
					onClick={() => copy(`https://croco-draw.netlify.app/room/${socketState.roomId}`)}
				>
					{copied ? <IconClipboardCheck color='white'/> : <IconClipboardCopy color='white'/>}
				</ActionIcon>
			</div>
		</div>
	)
})
