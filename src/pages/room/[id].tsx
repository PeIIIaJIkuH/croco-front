import {Button, Input} from '@mantine/core'
import {useForm} from '@mantine/form'
import {observer} from 'mobx-react-lite'
import type {NextPage} from 'next'
import {useRouter} from 'next/router'
import {useEffect} from 'react'
import socketState from '../../store/socket.state'
import userState from '../../store/user.state'
import {IFormValues} from '../../types'

const JoinRoom: NextPage = observer(() => {
	const router = useRouter()
	const id = router.query.id as string | undefined
	const form = useForm<IFormValues>({
		initialValues: {
			name: '',
		},
	})

	const onSubmit = form.onSubmit(({name}) => {
		if (!name) return
		userState.setName(name)
		router.push('/room')
	})

	useEffect(() => {
		if (id) {
			// check if this room id exists in backend
			// if it doesn't exist, then raise eror or go to main page
			socketState.setRoomId(id)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userState.name, id])

	return (
		<form onSubmit={onSubmit}>
			<Input {...form.getInputProps('name')} placeholder='Enter your name'/>
			<Button mt='md' variant='gradient' type='submit' fullWidth>
				Join room
			</Button>
		</form>
	)
})

export default JoinRoom
