import {makeAutoObservable} from 'mobx'

class SocketState {
	roomId: string | null = null

	constructor() {
		makeAutoObservable(this)
	}

	setRoomId(id: string | null) {
		this.roomId = id
	}

	reset() {
		this.setRoomId(null)
	}
}

export default new SocketState()
