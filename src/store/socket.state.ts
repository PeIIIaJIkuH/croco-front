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
		this.roomId = id
	}

	reset() {
		this.setRoomId(null)
	}

	initSocket() {
		this.socket = io('http://localhost:5000/canvas')

		this.socket.on('connect', () => {
			this.socket?.emit('room', this.roomId)
		})
	}
}

export default new SocketState()
