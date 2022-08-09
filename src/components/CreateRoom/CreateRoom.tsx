import {Button, Input} from '@mantine/core'
import {useForm} from '@mantine/form'
import {useRouter} from 'next/router'
import {FC} from 'react'
import {v4} from 'uuid'
import socketState from '../../store/socket.state'
import userState from '../../store/user.state'
import {IFormValues} from '../../types'

export const CreateRoom: FC = () => {
	const router = useRouter()
	const form = useForm<IFormValues>({
		initialValues: {
			name: '',
		},
	})

	const onSubmit = form.onSubmit(({name}) => {
		if (!name) return
		userState.setName(name)
		socketState.setRoomId(v4())
		router.push('/room')
	})

	return (
		<form onSubmit={onSubmit}>
			<Input {...form.getInputProps('name')} placeholder='Enter your name'/>
			<Button mt='md' variant='gradient' type='submit' fullWidth>
				Create room
			</Button>
		</form>
	)
}
