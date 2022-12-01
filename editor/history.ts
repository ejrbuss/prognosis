export class ActionKey {}

export type Action = {
	do: () => void;
	undo: () => void;
	merge?: ActionKey;
};

export class History {
	#actions: Action[] = [];
	#location: number = 0;
	#currentKey?: ActionKey;
	maxSize: number = 1000;

	do(action: Action): ActionKey {
		action.do();
		if (this.#currentKey && this.#currentKey === action.merge) {
			const actionToMerge = this.#actions[this.#location - 1];
			actionToMerge.do = action.do;
			return this.#currentKey;
		} else {
			this.#actions.length = this.#location;
			this.#actions.push(action);
			if (this.#actions.length > this.maxSize) {
				this.#actions.shift();
			}
			this.#location = this.#actions.length;
			return (this.#currentKey = new ActionKey());
		}
	}

	undo() {
		if (this.#location > 0) {
			const action = this.#actions[--this.#location];
			action.undo();
		}
	}

	redo() {
		if (this.#location !== this.#actions.length) {
			const action = this.#actions[this.#location++];
			action.do();
		}
	}
}
