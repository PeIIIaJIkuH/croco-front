import type {NextPage} from 'next'
import {useRouter} from 'next/router'
import {Canvas} from '../../components/Canvas/Canvas'
import {RightActions} from '../../components/RightAcitons/RightActions'
import s from '../../styles/Room.module.css'

const Room: NextPage = () => {
	const router = useRouter()
	const id = router.query.id

	return (
		<div className={s.wrapper}>
			<Canvas/>
			<RightActions/>
		</div>
	)
}

export default Room
