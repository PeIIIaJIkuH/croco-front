import {observer} from 'mobx-react-lite'
import {NextPage} from 'next'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import {Canvas} from '../../components/Canvas/Canvas'
import {RightActions} from '../../components/RightAcitons/RightActions'
import canvasState from '../../store/canvas.state'
import userState from '../../store/user.state'
import s from '../../styles/Room.module.css'

const Room: NextPage = observer(() => {
	const router = useRouter()

	useEffect(() => {
		if (userState.name === null) {
			router.push('/')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userState.name])

	return (
		<div className={s.wrapper} style={{transform: `scale(${canvasState.scale})`}}>
			<Canvas/>
			<RightActions/>
		</div>
	)
})

export default Room
