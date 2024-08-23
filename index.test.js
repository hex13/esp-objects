import * as ESP from './index.js';
import * as assert from 'assert';

describe('ESP', () => {
	it('deep equals original', () => {
		const foo = {counter: 123, bar: {foo: 10}};
		const spy = ESP.spy(foo);
		assert.deepStrictEqual(spy, foo);
	});

	it('properties can be get', () => {
		const foo = {counter: 123, bar: {foo: 10}};
		const spy = ESP.spy(foo);
		assert.strictEqual(spy.counter, 123);
		assert.deepStrictEqual(spy.bar, {foo: 10});
	});

	it('methods can be called', () => {
		const events = [];
		const foo = {
			meth1(...args) {
				events.push([this, 'meth1', ...args])
				return args[0] + args[1];
			},
			meth2(...args) {
				events.push([this, 'meth2', ...args])
			},
		};
		const spy = ESP.spy(foo);
		const res = spy.meth1(123, 100);
		assert.strictEqual(res, 223);
		spy.meth2();
		spy.meth1();
		assert.deepStrictEqual(events.length, 3);

		const expected = [
			['meth1', 123, 100],
			['meth2'],
			['meth1'],
		];
		events.forEach(([self, ...rest], i) => {
			assert.strictEqual(self, foo);
			assert.deepStrictEqual(rest, expected[i]);
		});
	});

	it('methods can be spied', () => {
		const foo = {
			meth1(...args) {
				return args[0] + args[1];
			},
			meth2() {

			}
		};
		const spy = ESP.spy(foo);
		const info = ESP.on(spy, 'meth1');
		spy.meth1(100, 221);
		spy.meth2(300, 400);
		assert.deepStrictEqual(info, [
			{name: 'meth1', args: [100, 221], result: 321},
		]);
	});
});