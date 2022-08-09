import {Button} from '@mantine/core'
import {useRouter} from 'next/router'
import {FC} from 'react'
import {v4} from 'uuid'

export const CreateRoom: FC = () => {
	const router = useRouter()

	const onClick = () => {
		router.push(`/room/${v4()}`)
	}

	return (
		<Button mt='md' variant='gradient' onClick={onClick}>
			Create room
		</Button>
	)
}
