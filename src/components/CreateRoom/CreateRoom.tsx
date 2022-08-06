import { Button, Input } from '@mantine/core'
import { useForm } from '@mantine/form'
import { FC } from 'react'

import s from './CreateRoom.module.css'

interface IFormValues {
	name: string
}

export const CreateRoom: FC = () => {
	const form = useForm<IFormValues>({
		initialValues: {
			name: '',
		},
	})

	const onSubmit = form.onSubmit(async ({ name }) => {
		if (!name) return
	})

	return (
		<form onSubmit={onSubmit} className={s.wrapper}>
			<Input {...form.getInputProps('name')} placeholder='Enter your name' />
			<Button mt='md' className={s.button} variant='gradient' type='submit'>
				Create room
			</Button>
		</form>
	)
}
