import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Room: NextPage = () => {
	const router = useRouter()
	const id = router.query.id

	return (
		<div>Room {id}</div>
	)
}

export default Room
