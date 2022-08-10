import {observer} from 'mobx-react-lite'
import type {NextPage} from 'next'
import {useEffect} from 'react'
import {CreateRoom} from '../components'
import socketState from '../store/socket.state'
import userState from '../store/user.state'

const Home: NextPage = observer(() => {
	useEffect(() => {
		userState.reset()
		socketState.reset()
	}, [])

	useEffect(() => {
		const id = window.setInterval(() => {
			fetch('https://croco-back.herokuapp.com/ping')
		}, 29 * 30000)

		return () => {
			window.clearInterval(id)
		}
	}, [])

	return (
		<CreateRoom/>
	)
})

export default Home
