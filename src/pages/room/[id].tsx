import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Canvas } from '../../components/Canvas/Canvas'
import s from '../../styles/Room.module.css'

const Room: NextPage = () => {
	const router = useRouter()
	const id = router.query.id

	return (
		<div className={s.wrapper}>
			<Canvas/>
		</div>
	)
}

export default Room
