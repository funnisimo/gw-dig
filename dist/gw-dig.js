(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GW = global.GW || {}));
}(this, (function (exports) { 'use strict';

	const NOTHING = 0;
	const FLOOR = 1;
	const DOOR = 2;
	const WALL = 3;
	const LAKE = 4;
	const BRIDGE = 5;

	exports.BRIDGE = BRIDGE;
	exports.DOOR = DOOR;
	exports.FLOOR = FLOOR;
	exports.LAKE = LAKE;
	exports.NOTHING = NOTHING;
	exports.WALL = WALL;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=gw-dig.js.map
