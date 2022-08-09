import {makeAutoObservable} from 'mobx'
import {v4} from 'uuid'
import {UserType} from '../types'

class UserState {
	name: string | null = null
	type: UserType | null = null
	id = v4()

	constructor() {
		makeAutoObservable(this)
	}

	setName(name: string | null) {
		this.name = name
	}

	setType(type: UserType | null) {
		this.type = type
	}

	reset() {
		this.setName(null)
		this.setType(null)
	}
}

export default new UserState()
