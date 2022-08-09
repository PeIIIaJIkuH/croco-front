import {NextPage} from 'next'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import {Canvas} from '../../components/Canvas/Canvas'
import {RightActions} from '../../components/RightAcitons/RightActions'
import userState from '../../store/user.state'
import s from '../../styles/Room.module.css'

const Room: NextPage = () => {
	const router = useRouter()

	useEffect(() => {
		if (userState.name === null) {
			router.push('/')
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userState.name])

	return (
		<div className={s.wrapper}>
			<Canvas/>
			<RightActions/>
		</div>
	)
}

export default Room
