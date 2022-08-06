import { Paper } from '@mantine/core'
import type { NextPage } from 'next'
import { CreateRoom } from '../components'
import s from '../styles/Home.module.css'

const Home: NextPage = () => {
	return (
		<Paper className={s.wrapper} radius={0}>
			<CreateRoom />
		</Paper>
	)
}

export default Home
