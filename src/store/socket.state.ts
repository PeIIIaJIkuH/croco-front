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

	setRoomId(id: string | null) {
		if (id === this.roomId) return
		this.roomId = id
		if (id) {
			this.socket?.emit('room', id)
		}
	}

	reset() {
		this.setRoomId(null)
	}

	initSocket() {
		this.socket = io('http://localhost:5000/canvas')
	}
}

export default new SocketState()
