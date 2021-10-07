export const Properties = {
	velocity: Number,
};

export const onUpdate = ({ input, delta }, gameObject) => {
	if (input.keyW) {
		gameObject.position.y += (gameObject.velocity * delta) / 1000;
	}
	if (input.keyA) {
		gameObject.position.x -= (gameObject.velocity * delta) / 1000;
	}
	if (input.keyS) {
		gameObject.position.y -= (gameObject.velocity * delta) / 1000;
	}
	if (input.keyD) {
		gameObject.position.x += (gameObject.velocity * delta) / 1000;
	}
	if (input.arrowUp) {
		gameObject.scale.x += 0.1;
		gameObject.scale.y += 0.1;
	}
	if (input.arrowDown) {
		gameObject.scale.x -= 0.1;
		gameObject.scale.y -= 0.1;
	}
	if (input.arrowRight) {
		gameObject.rotation += 1;
	}
	if (input.arrowLeft) {
		gameObject.rotation -= 1;
	}
};
