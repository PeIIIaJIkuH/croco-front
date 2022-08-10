import {DefaultEventsMap} from '@socket.io/component-emitter'
import {makeAutoObservable} from 'mobx'
import {io, Socket} from 'socket.io-client'

class SocketState {
	roomId: string | null = null
	socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null

	constructor() {
		makeAutoObservable(this)
		this.initSocket()
	}

	setRoomId(roomId: string | null) {
		this.roomId = roomId
	}

	reset() {
		this.setRoomId(null)
	}

	initSocket() {
		this.socket = io(`${process.env.CROCO_API_URL || 'http://localhost:5000'}/canvas`)
	}
}

export default new SocketState()
