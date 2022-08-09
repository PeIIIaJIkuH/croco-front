import {makeAutoObservable} from 'mobx'

class UserState {
	name: string | null = null
	isHost: boolean = false

	constructor() {
		makeAutoObservable(this)
	}

	setName(name: string | null) {
		this.name = name
	}

	setIsHost(isHost: boolean) {
		this.isHost = isHost
	}

	reset() {
		this.setName(null)
		this.setIsHost(false)
	}
}

export default new UserState()
