const ESP_LISTENERS = Symbol('ESP_LISTENERS');

export function spy(object) {
	const listeners = Object.create(null);
	return new Proxy(object, {
		get(target, prop) {
			if (prop == ESP_LISTENERS) {
				return listeners;
			}
			const value = target[prop];
			if (typeof value == 'function') {
				return (...args) => {
					const result = value.apply(target, args);
					listeners[prop]?.forEach(listener => {
						listener(args, result);
					});
					return result;
				};
			}
			return target[prop];
		}
	});
}

export function on(spy, meth) {
	const info = [];
	const listeners = spy[ESP_LISTENERS];
	listeners[meth] = listeners[meth] || [];
	listeners[meth].push((args, result) => {
		info.push({ name: meth, args, result })
	});

	return info;
}