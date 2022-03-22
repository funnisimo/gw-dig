(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GWU = {}));
})(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	/**
	 * The base implementation of `_.clamp` which doesn't coerce arguments.
	 *
	 * @private
	 * @param {number} number The number to clamp.
	 * @param {number} [lower] The lower bound.
	 * @param {number} upper The upper bound.
	 * @returns {number} Returns the clamped number.
	 */

	function baseClamp$1(number, lower, upper) {
	  if (number === number) {
	    if (upper !== undefined) {
	      number = number <= upper ? number : upper;
	    }
	    if (lower !== undefined) {
	      number = number >= lower ? number : lower;
	    }
	  }
	  return number;
	}

	var _baseClamp = baseClamp$1;

	/** Used to match a single whitespace character. */

	var reWhitespace = /\s/;

	/**
	 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
	 * character of `string`.
	 *
	 * @private
	 * @param {string} string The string to inspect.
	 * @returns {number} Returns the index of the last non-whitespace character.
	 */
	function trimmedEndIndex$1(string) {
	  var index = string.length;

	  while (index-- && reWhitespace.test(string.charAt(index))) {}
	  return index;
	}

	var _trimmedEndIndex = trimmedEndIndex$1;

	var trimmedEndIndex = _trimmedEndIndex;

	/** Used to match leading whitespace. */
	var reTrimStart = /^\s+/;

	/**
	 * The base implementation of `_.trim`.
	 *
	 * @private
	 * @param {string} string The string to trim.
	 * @returns {string} Returns the trimmed string.
	 */
	function baseTrim$1(string) {
	  return string
	    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
	    : string;
	}

	var _baseTrim = baseTrim$1;

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */

	function isObject$3(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	var isObject_1 = isObject$3;

	/** Detect free variable `global` from Node.js. */

	var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	var _freeGlobal = freeGlobal$1;

	var freeGlobal = _freeGlobal;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root$3 = freeGlobal || freeSelf || Function('return this')();

	var _root = root$3;

	var root$2 = _root;

	/** Built-in value references. */
	var Symbol$3 = root$2.Symbol;

	var _Symbol = Symbol$3;

	var Symbol$2 = _Symbol;

	/** Used for built-in method references. */
	var objectProto$4 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString$1 = objectProto$4.toString;

	/** Built-in value references. */
	var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag$1(value) {
	  var isOwn = hasOwnProperty$3.call(value, symToStringTag$1),
	      tag = value[symToStringTag$1];

	  try {
	    value[symToStringTag$1] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString$1.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag$1] = tag;
	    } else {
	      delete value[symToStringTag$1];
	    }
	  }
	  return result;
	}

	var _getRawTag = getRawTag$1;

	/** Used for built-in method references. */

	var objectProto$3 = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto$3.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString$1(value) {
	  return nativeObjectToString.call(value);
	}

	var _objectToString = objectToString$1;

	var Symbol$1 = _Symbol,
	    getRawTag = _getRawTag,
	    objectToString = _objectToString;

	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag$2(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? getRawTag(value)
	    : objectToString(value);
	}

	var _baseGetTag = baseGetTag$2;

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */

	function isObjectLike$1(value) {
	  return value != null && typeof value == 'object';
	}

	var isObjectLike_1 = isObjectLike$1;

	var baseGetTag$1 = _baseGetTag,
	    isObjectLike = isObjectLike_1;

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol$4(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && baseGetTag$1(value) == symbolTag);
	}

	var isSymbol_1 = isSymbol$4;

	var baseTrim = _baseTrim,
	    isObject$2 = isObject_1,
	    isSymbol$3 = isSymbol_1;

	/** Used as references for various `Number` constants. */
	var NAN = 0 / 0;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber$1(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol$3(value)) {
	    return NAN;
	  }
	  if (isObject$2(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject$2(other) ? (other + '') : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = baseTrim(value);
	  var isBinary = reIsBinary.test(value);
	  return (isBinary || reIsOctal.test(value))
	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	    : (reIsBadHex.test(value) ? NAN : +value);
	}

	var toNumber_1 = toNumber$1;

	var baseClamp = _baseClamp,
	    toNumber = toNumber_1;

	/**
	 * Clamps `number` within the inclusive `lower` and `upper` bounds.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Number
	 * @param {number} number The number to clamp.
	 * @param {number} [lower] The lower bound.
	 * @param {number} upper The upper bound.
	 * @returns {number} Returns the clamped number.
	 * @example
	 *
	 * _.clamp(-10, -5, 5);
	 * // => -5
	 *
	 * _.clamp(10, -5, 5);
	 * // => 5
	 */
	function clamp$1(number, lower, upper) {
	  if (upper === undefined) {
	    upper = lower;
	    lower = undefined;
	  }
	  if (upper !== undefined) {
	    upper = toNumber(upper);
	    upper = upper === upper ? upper : 0;
	  }
	  if (lower !== undefined) {
	    lower = toNumber(lower);
	    lower = lower === lower ? lower : 0;
	  }
	  return baseClamp(toNumber(number), lower, upper);
	}

	var clamp_1 = clamp$1;

	/**
	 * GW.utils
	 * @module utils
	 */
	function NOOP() { }
	function TRUE() {
	    return true;
	}
	function FALSE() {
	    return false;
	}
	function ONE() {
	    return 1;
	}
	function ZERO() {
	    return 0;
	}
	function IDENTITY(x) {
	    return x;
	}
	function IS_ZERO(x) {
	    return x == 0;
	}
	function IS_NONZERO(x) {
	    return x != 0;
	}
	/**
	 * clamps a value between min and max (inclusive)
	 * @param v {Number} the value to clamp
	 * @param min {Number} the minimum value
	 * @param max {Number} the maximum value
	 * @returns {Number} the clamped value
	 */
	const clamp = clamp_1;
	// export function clamp(v: number, min: number, max: number) {
	//     if (v < min) return min;
	//     if (v > max) return max;
	//     return v;
	// }
	function lerp$1(from, to, pct) {
	    if (pct > 1)
	        pct = 1;
	    if (pct < 0)
	        pct = 0;
	    return Math.floor(from + (to - from) * pct);
	}
	function ERROR(message) {
	    throw new Error(message);
	}
	function WARN(...args) {
	    console.warn(...args);
	}
	function first(...args) {
	    return args.find((v) => v !== undefined);
	}
	function arraysIntersect(a, b) {
	    return a.some((av) => b.includes(av));
	}
	function arrayIncludesAll(a, b) {
	    return b.every((av) => a.includes(av));
	}
	function arrayRevEach(a, fn) {
	    for (let i = a.length - 1; i > -1; --i) {
	        fn(a[i], i, a);
	    }
	}
	function arrayDelete(a, b) {
	    const index = a.indexOf(b);
	    if (index < 0)
	        return false;
	    a.splice(index, 1);
	    return true;
	}
	function arrayNullify(a, b) {
	    const index = a.indexOf(b);
	    if (index < 0)
	        return false;
	    a[index] = null;
	    return true;
	}
	function arrayInsert(a, b, beforeFn) {
	    if (!beforeFn) {
	        a.push(b);
	        return;
	    }
	    const index = a.findIndex(beforeFn);
	    if (index < 0) {
	        a.push(b);
	    }
	    else {
	        a.splice(index, 0, b);
	    }
	}
	function arrayFindRight(a, fn) {
	    for (let i = a.length - 1; i >= 0; --i) {
	        const e = a[i];
	        if (fn(e))
	            return e;
	    }
	    return undefined;
	}
	function sum(arr) {
	    return arr.reduce((a, b) => a + b);
	}
	function arrayNext(a, current, fn, wrap = true, forward = true) {
	    const len = a.length;
	    if (len <= 1)
	        return undefined;
	    const startIndex = a.indexOf(current);
	    if (startIndex < 0)
	        return undefined;
	    const dx = forward ? 1 : -1;
	    let startI = wrap ? (len + startIndex + dx) % len : startIndex + dx;
	    let endI = wrap ? startIndex : forward ? len : -1;
	    for (let index = startI; index !== endI; index = wrap ? (len + index + dx) % len : index + dx) {
	        const e = a[index];
	        if (fn(e))
	            return e;
	    }
	    return undefined;
	}
	function arrayPrev(a, current, fn, wrap = true) {
	    return arrayNext(a, current, fn, wrap, false);
	}
	function nextIndex(index, length, wrap = true) {
	    ++index;
	    if (index >= length) {
	        if (wrap)
	            return index % length;
	        return -1;
	    }
	    return index;
	}
	function prevIndex(index, length, wrap = true) {
	    if (index < 0)
	        return length - 1; // start in back
	    --index;
	    if (index < 0) {
	        if (wrap)
	            return length - 1;
	        return -1;
	    }
	    return index;
	}

	// DIRS are organized clockwise
	// - first 4 are arrow directions
	//   >> rotate 90 degrees clockwise ==>> newIndex = (oldIndex + 1) % 4
	//   >> opposite direction ==>> oppIndex = (index + 2) % 4
	// - last 4 are diagonals
	//   >> rotate 90 degrees clockwise ==>> newIndex = 4 + (oldIndex + 1) % 4;
	//   >> opposite diagonal ==>> newIndex = 4 + (index + 2) % 4;
	const DIRS$2 = [
	    [0, -1],
	    [1, 0],
	    [0, 1],
	    [-1, 0],
	    [1, -1],
	    [1, 1],
	    [-1, 1],
	    [-1, -1],
	];
	const NO_DIRECTION = -1;
	const UP = 0;
	const RIGHT = 1;
	const DOWN = 2;
	const LEFT = 3;
	const RIGHT_UP = 4;
	const RIGHT_DOWN = 5;
	const LEFT_DOWN = 6;
	const LEFT_UP = 7;
	// CLOCK DIRS are organized clockwise, starting at UP
	// >> opposite = (index + 4) % 8
	// >> 90 degrees rotate right = (index + 2) % 8
	// >> 90 degrees rotate left = (8 + index - 2) % 8
	const CLOCK_DIRS = [
	    [0, 1],
	    [1, 1],
	    [1, 0],
	    [1, -1],
	    [0, -1],
	    [-1, -1],
	    [-1, 0],
	    [-1, 1],
	];
	function isLoc(a) {
	    return (Array.isArray(a) &&
	        a.length == 2 &&
	        typeof a[0] === 'number' &&
	        typeof a[1] === 'number');
	}
	function isXY(a) {
	    return a && typeof a.x === 'number' && typeof a.y === 'number';
	}
	function x(src) {
	    // @ts-ignore
	    return src.x || src[0] || 0;
	}
	function y(src) {
	    // @ts-ignore
	    return src.y || src[1] || 0;
	}
	function contains(size, x, y) {
	    return x >= 0 && y >= 0 && x < size.width && y < size.height;
	}
	class Bounds {
	    constructor(x = 0, y = 0, w = 0, h = 0) {
	        if (typeof x !== 'number') {
	            const opts = x;
	            h = opts.height || 0;
	            w = opts.width || 0;
	            y = opts.y || 0;
	            x = opts.x || 0;
	        }
	        this.x = x;
	        this.y = y;
	        this.width = w;
	        this.height = h;
	    }
	    get left() {
	        return this.x;
	    }
	    set left(v) {
	        this.x = v;
	    }
	    get right() {
	        return this.x + this.width;
	    }
	    set right(v) {
	        this.x = v - this.width;
	    }
	    get top() {
	        return this.y;
	    }
	    set top(v) {
	        this.y = v;
	    }
	    get bottom() {
	        return this.y + this.height;
	    }
	    set bottom(v) {
	        this.y = v - this.height;
	    }
	    get center() {
	        return this.x + Math.floor(this.width / 2);
	    }
	    set center(v) {
	        this.x += v - this.center;
	    }
	    get middle() {
	        return this.y + Math.floor(this.height / 2);
	    }
	    set middle(v) {
	        this.y += v - this.middle;
	    }
	    clone() {
	        return new Bounds(this.x, this.y, this.width, this.height);
	    }
	    copy(other) {
	        this.x = other.x;
	        this.y = other.y;
	        this.width = other.width;
	        this.height = other.height;
	    }
	    contains(...args) {
	        let i = args[0];
	        let j = args[1];
	        if (typeof i !== 'number') {
	            j = y(i);
	            i = x(i);
	        }
	        return (this.x <= i &&
	            this.y <= j &&
	            this.x + this.width > i &&
	            this.y + this.height > j);
	    }
	    include(xy) {
	        const left = Math.min(x(xy), this.x);
	        const top = Math.min(y(xy), this.y);
	        const right = Math.max(xy instanceof Bounds ? xy.right : left, this.right);
	        const bottom = Math.max(xy instanceof Bounds ? xy.bottom : top, this.bottom);
	        this.left = left;
	        this.top = top;
	        this.width = right - left;
	        this.height = bottom - top;
	    }
	    pad(n = 1) {
	        this.x -= n;
	        this.y -= n;
	        this.width += n * 2;
	        this.height += n * 2;
	    }
	    forEach(cb) {
	        forRect(this.x, this.y, this.width, this.height, cb);
	    }
	    toString() {
	        return `[${this.x},${this.y} -> ${this.right},${this.bottom}]`;
	    }
	}
	function copy(dest, src) {
	    dest.x = x(src);
	    dest.y = y(src);
	}
	function addTo(dest, src) {
	    dest.x += x(src);
	    dest.y += y(src);
	}
	function add(a, b) {
	    if (Array.isArray(a)) {
	        return [a[0] + x(b), a[1] + y(b)];
	    }
	    return { x: a.x + x(b), y: a.y + y(b) };
	}
	function equals(dest, src) {
	    if (!dest && !src)
	        return true;
	    if (!dest || !src)
	        return false;
	    return x(dest) == x(src) && y(dest) == y(src);
	}
	function isDiagonal(xy) {
	    return x(xy) != 0 && y(xy) != 0;
	}
	function lerp(a, b, pct) {
	    if (pct > 1) {
	        pct = pct / 100;
	    }
	    pct = clamp(pct, 0, 1);
	    const dx = x(b) - x(a);
	    const dy = y(b) - y(a);
	    const x2 = x(a) + Math.floor(dx * pct);
	    const y2 = y(a) + Math.floor(dy * pct);
	    return [x2, y2];
	}
	function eachNeighbor(x, y, fn, only4dirs = false) {
	    const max = only4dirs ? 4 : 8;
	    for (let i = 0; i < max; ++i) {
	        const dir = DIRS$2[i];
	        const x1 = x + dir[0];
	        const y1 = y + dir[1];
	        fn(x1, y1, dir);
	    }
	}
	async function eachNeighborAsync(x, y, fn, only4dirs = false) {
	    const max = only4dirs ? 4 : 8;
	    for (let i = 0; i < max; ++i) {
	        const dir = DIRS$2[i];
	        const x1 = x + dir[0];
	        const y1 = y + dir[1];
	        await fn(x1, y1, dir);
	    }
	}
	function matchingNeighbor(x, y, matchFn, only4dirs = false) {
	    const maxIndex = only4dirs ? 4 : 8;
	    for (let d = 0; d < maxIndex; ++d) {
	        const dir = DIRS$2[d];
	        const i = x + dir[0];
	        const j = y + dir[1];
	        if (matchFn(i, j, dir))
	            return [i, j];
	    }
	    return [-1, -1];
	}
	function straightDistanceBetween(x1, y1, x2, y2) {
	    const x = Math.abs(x1 - x2);
	    const y = Math.abs(y1 - y2);
	    return x + y;
	}
	function maxAxisFromTo(a, b) {
	    const xa = Math.abs(x(a) - x(b));
	    const ya = Math.abs(y(a) - y(b));
	    return Math.max(xa, ya);
	}
	function maxAxisBetween(x1, y1, x2, y2) {
	    const xa = Math.abs(x1 - x2);
	    const ya = Math.abs(y1 - y2);
	    return Math.max(xa, ya);
	}
	function distanceBetween(x1, y1, x2, y2) {
	    const x = Math.abs(x1 - x2);
	    const y = Math.abs(y1 - y2);
	    const min = Math.min(x, y);
	    return x + y - 0.6 * min;
	}
	function distanceFromTo(a, b) {
	    return distanceBetween(x(a), y(a), x(b), y(b));
	}
	function calcRadius(x, y) {
	    return distanceBetween(0, 0, x, y);
	}
	function dirBetween(x, y, toX, toY) {
	    let diffX = toX - x;
	    let diffY = toY - y;
	    if (diffX && diffY) {
	        const absX = Math.abs(diffX);
	        const absY = Math.abs(diffY);
	        if (absX >= 2 * absY) {
	            diffY = 0;
	        }
	        else if (absY >= 2 * absX) {
	            diffX = 0;
	        }
	    }
	    return [Math.sign(diffX), Math.sign(diffY)];
	}
	function dirFromTo(a, b) {
	    return dirBetween(x(a), y(a), x(b), y(b));
	}
	function dirIndex(dir) {
	    const x0 = x(dir);
	    const y0 = y(dir);
	    return DIRS$2.findIndex((a) => a[0] == x0 && a[1] == y0);
	}
	function isOppositeDir(a, b) {
	    if (Math.sign(a[0]) + Math.sign(b[0]) != 0)
	        return false;
	    if (Math.sign(a[1]) + Math.sign(b[1]) != 0)
	        return false;
	    return true;
	}
	function isSameDir(a, b) {
	    return (Math.sign(a[0]) == Math.sign(b[0]) && Math.sign(a[1]) == Math.sign(b[1]));
	}
	function dirSpread(dir) {
	    const result = [dir];
	    if (dir[0] == 0) {
	        result.push([1, dir[1]]);
	        result.push([-1, dir[1]]);
	    }
	    else if (dir[1] == 0) {
	        result.push([dir[0], 1]);
	        result.push([dir[0], -1]);
	    }
	    else {
	        result.push([dir[0], 0]);
	        result.push([0, dir[1]]);
	    }
	    return result;
	}
	function stepFromTo(a, b, fn) {
	    const x0 = x(a);
	    const y0 = y(a);
	    const diff = [x(b) - x0, y(b) - y0];
	    const steps = Math.abs(diff[0]) + Math.abs(diff[1]);
	    const c = [0, 0];
	    const last = [99999, 99999];
	    for (let step = 0; step <= steps; ++step) {
	        c[0] = x0 + Math.floor((diff[0] * step) / steps);
	        c[1] = y0 + Math.floor((diff[1] * step) / steps);
	        if (c[0] != last[0] || c[1] != last[1]) {
	            fn(c[0], c[1]);
	        }
	        last[0] = c[0];
	        last[1] = c[1];
	    }
	}
	// LINES
	function forLine(x, y, dir, length, fn) {
	    for (let l = 0; l < length; ++l) {
	        fn(x + l * dir[0], y + l * dir[1]);
	    }
	}
	const FP_BASE = 16;
	const FP_FACTOR = 1 << 16;
	function forLineBetween(fromX, fromY, toX, toY, stepFn) {
	    let targetVector = [], error = [], currentVector = [], previousVector = [], quadrantTransform = [];
	    let largerTargetComponent, i;
	    let currentLoc = [-1, -1], previousLoc = [-1, -1];
	    if (fromX == toX && fromY == toY) {
	        return true;
	    }
	    const originLoc = [fromX, fromY];
	    const targetLoc = [toX, toY];
	    // Neither vector is negative. We keep track of negatives with quadrantTransform.
	    for (i = 0; i <= 1; i++) {
	        targetVector[i] = (targetLoc[i] - originLoc[i]) << FP_BASE; // FIXME: should use parens?
	        if (targetVector[i] < 0) {
	            targetVector[i] *= -1;
	            quadrantTransform[i] = -1;
	        }
	        else {
	            quadrantTransform[i] = 1;
	        }
	        currentVector[i] = previousVector[i] = error[i] = 0;
	        currentLoc[i] = originLoc[i];
	    }
	    // normalize target vector such that one dimension equals 1 and the other is in [0, 1].
	    largerTargetComponent = Math.max(targetVector[0], targetVector[1]);
	    // targetVector[0] = Math.floor( (targetVector[0] << FP_BASE) / largerTargetComponent);
	    // targetVector[1] = Math.floor( (targetVector[1] << FP_BASE) / largerTargetComponent);
	    targetVector[0] = Math.floor((targetVector[0] * FP_FACTOR) / largerTargetComponent);
	    targetVector[1] = Math.floor((targetVector[1] * FP_FACTOR) / largerTargetComponent);
	    do {
	        for (i = 0; i <= 1; i++) {
	            previousLoc[i] = currentLoc[i];
	            currentVector[i] += targetVector[i] >> FP_BASE;
	            error[i] += targetVector[i] == FP_FACTOR ? 0 : targetVector[i];
	            if (error[i] >= Math.floor(FP_FACTOR / 2)) {
	                currentVector[i]++;
	                error[i] -= FP_FACTOR;
	            }
	            currentLoc[i] = Math.floor(quadrantTransform[i] * currentVector[i] + originLoc[i]);
	        }
	        const r = stepFn(...currentLoc);
	        if (r === false) {
	            return false;
	        }
	        else if (r !== true &&
	            currentLoc[0] === toX &&
	            currentLoc[1] === toY) {
	            return true;
	        }
	    } while (true);
	}
	function forLineFromTo(a, b, stepFn) {
	    return forLineBetween(x(a), y(a), x(b), y(b), stepFn);
	}
	// ADAPTED FROM BROGUE 1.7.5
	// Simple line algorithm (maybe this is Bresenham?) that returns a list of coordinates
	// that extends all the way to the edge of the map based on an originLoc (which is not included
	// in the list of coordinates) and a targetLoc.
	// Returns the number of entries in the list, and includes (-1, -1) as an additional
	// terminus indicator after the end of the list.
	function getLine(fromX, fromY, toX, toY) {
	    const line = [];
	    forLineBetween(fromX, fromY, toX, toY, (x, y) => {
	        line.push([x, y]);
	    });
	    return line;
	}
	// ADAPTED FROM BROGUE 1.7.5
	// Simple line algorithm (maybe this is Bresenham?) that returns a list of coordinates
	// that extends all the way to the edge of the map based on an originLoc (which is not included
	// in the list of coordinates) and a targetLoc.
	function getLineThru(fromX, fromY, toX, toY, width, height) {
	    const line = [];
	    forLineBetween(fromX, fromY, toX, toY, (x, y) => {
	        if (x < 0 || y < 0 || x >= width || y >= height)
	            return false;
	        line.push([x, y]);
	        return true;
	    });
	    return line;
	}
	// CIRCLE
	function forCircle(x, y, radius, fn) {
	    let i, j;
	    for (i = x - radius - 1; i < x + radius + 1; i++) {
	        for (j = y - radius - 1; j < y + radius + 1; j++) {
	            if ((i - x) * (i - x) + (j - y) * (j - y) <
	                radius * radius + radius) {
	                // + radius softens the circle
	                fn(i, j);
	            }
	        }
	    }
	}
	function forRect(...args) {
	    let left = 0;
	    let top = 0;
	    if (arguments.length > 3) {
	        left = args.shift();
	        top = args.shift();
	    }
	    const right = left + args[0];
	    const bottom = top + args[1];
	    const fn = args[2];
	    for (let i = left; i < right; ++i) {
	        for (let j = top; j < bottom; ++j) {
	            fn(i, j);
	        }
	    }
	}
	function forBorder(...args) {
	    let left = 0;
	    let top = 0;
	    if (arguments.length > 3) {
	        left = args.shift();
	        top = args.shift();
	    }
	    const right = left + args[0] - 1;
	    const bottom = top + args[1] - 1;
	    const fn = args[2];
	    for (let x = left; x <= right; ++x) {
	        fn(x, top);
	        fn(x, bottom);
	    }
	    for (let y = top; y <= bottom; ++y) {
	        fn(left, y);
	        fn(right, y);
	    }
	}
	// ARC COUNT
	// Rotates around the cell, counting up the number of distinct strings of neighbors with the same test result in a single revolution.
	//		Zero means there are no impassable tiles adjacent.
	//		One means it is adjacent to a wall.
	//		Two means it is in a hallway or something similar.
	//		Three means it is the center of a T-intersection or something similar.
	//		Four means it is in the intersection of two hallways.
	//		Five or more means there is a bug.
	function arcCount(x, y, testFn) {
	    let oldX, oldY, newX, newY;
	    // brogueAssert(grid.hasXY(x, y));
	    let arcCount = 0;
	    let matchCount = 0;
	    for (let dir = 0; dir < CLOCK_DIRS.length; dir++) {
	        oldX = x + CLOCK_DIRS[(dir + 7) % 8][0];
	        oldY = y + CLOCK_DIRS[(dir + 7) % 8][1];
	        newX = x + CLOCK_DIRS[dir][0];
	        newY = y + CLOCK_DIRS[dir][1];
	        // Counts every transition from passable to impassable or vice-versa on the way around the cell:
	        const newOk = testFn(newX, newY);
	        const oldOk = testFn(oldX, oldY);
	        if (newOk)
	            ++matchCount;
	        if (newOk != oldOk) {
	            arcCount++;
	        }
	    }
	    if (arcCount == 0 && matchCount)
	        return 1;
	    return Math.floor(arcCount / 2); // Since we added one when we entered a wall and another when we left.
	}

	var xy = /*#__PURE__*/Object.freeze({
		__proto__: null,
		DIRS: DIRS$2,
		NO_DIRECTION: NO_DIRECTION,
		UP: UP,
		RIGHT: RIGHT,
		DOWN: DOWN,
		LEFT: LEFT,
		RIGHT_UP: RIGHT_UP,
		RIGHT_DOWN: RIGHT_DOWN,
		LEFT_DOWN: LEFT_DOWN,
		LEFT_UP: LEFT_UP,
		CLOCK_DIRS: CLOCK_DIRS,
		isLoc: isLoc,
		isXY: isXY,
		x: x,
		y: y,
		contains: contains,
		Bounds: Bounds,
		copy: copy,
		addTo: addTo,
		add: add,
		equals: equals,
		isDiagonal: isDiagonal,
		lerp: lerp,
		eachNeighbor: eachNeighbor,
		eachNeighborAsync: eachNeighborAsync,
		matchingNeighbor: matchingNeighbor,
		straightDistanceBetween: straightDistanceBetween,
		maxAxisFromTo: maxAxisFromTo,
		maxAxisBetween: maxAxisBetween,
		distanceBetween: distanceBetween,
		distanceFromTo: distanceFromTo,
		calcRadius: calcRadius,
		dirBetween: dirBetween,
		dirFromTo: dirFromTo,
		dirIndex: dirIndex,
		isOppositeDir: isOppositeDir,
		isSameDir: isSameDir,
		dirSpread: dirSpread,
		stepFromTo: stepFromTo,
		forLine: forLine,
		forLineBetween: forLineBetween,
		forLineFromTo: forLineFromTo,
		getLine: getLine,
		getLineThru: getLineThru,
		forCircle: forCircle,
		forRect: forRect,
		forBorder: forBorder,
		arcCount: arcCount
	});

	// CHAIN
	function length$1(root) {
	    let count = 0;
	    while (root) {
	        count += 1;
	        root = root.next;
	    }
	    return count;
	}
	function at(root, index) {
	    while (root && index) {
	        root = root.next;
	        --index;
	    }
	    return root;
	}
	function includes(root, entry) {
	    while (root && root !== entry) {
	        root = root.next;
	    }
	    return root === entry;
	}
	function forEach(root, fn) {
	    let index = 0;
	    while (root) {
	        const next = root.next;
	        fn(root, index++);
	        root = next;
	    }
	    return index; // really count
	}
	function push(obj, name, entry) {
	    entry.next = obj[name] || null;
	    obj[name] = entry;
	    return true;
	}
	function remove(obj, name, entry) {
	    const root = obj[name];
	    if (root === entry) {
	        obj[name] = entry.next || null;
	        entry.next = null;
	        return true;
	    }
	    else if (!root) {
	        return false;
	    }
	    else {
	        let prev = root;
	        let current = prev.next;
	        while (current && current !== entry) {
	            prev = current;
	            current = prev.next;
	        }
	        if (current === entry) {
	            prev.next = current.next;
	            entry.next = null;
	            return true;
	        }
	    }
	    return false;
	}
	function find(root, cb) {
	    while (root && !cb(root)) {
	        root = root.next;
	    }
	    return root;
	}
	function insert(obj, name, entry, sort) {
	    let root = obj[name];
	    sort = sort || (() => -1); // always insert first
	    if (!root || sort(root, entry) < 0) {
	        entry.next = root;
	        obj[name] = entry;
	        return true;
	    }
	    let prev = root;
	    let current = root.next;
	    while (current && sort(current, entry) > 0) {
	        prev = current;
	        current = current.next;
	    }
	    entry.next = current;
	    prev.next = entry;
	    return true;
	}
	function reduce(root, cb, out) {
	    let current = root;
	    if (out === undefined) {
	        if (!current)
	            throw new TypeError('Empty list reduce without initial value not allowed.');
	        out = current;
	        current = current.next;
	    }
	    while (current) {
	        out = cb(out, current);
	        current = current.next;
	    }
	    return out;
	}
	function some(root, cb) {
	    let current = root;
	    while (current) {
	        if (cb(current))
	            return true;
	        current = current.next;
	    }
	    return false;
	}
	function every(root, cb) {
	    let current = root;
	    while (current) {
	        if (!cb(current))
	            return false;
	        current = current.next;
	    }
	    return true;
	}

	var list = /*#__PURE__*/Object.freeze({
		__proto__: null,
		length: length$1,
		at: at,
		includes: includes,
		forEach: forEach,
		push: push,
		remove: remove,
		find: find,
		insert: insert,
		reduce: reduce,
		some: some,
		every: every
	});

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */

	var isArray$3 = Array.isArray;

	var isArray_1 = isArray$3;

	var isArray$2 = isArray_1,
	    isSymbol$2 = isSymbol_1;

	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey$1(value, object) {
	  if (isArray$2(value)) {
	    return false;
	  }
	  var type = typeof value;
	  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
	      value == null || isSymbol$2(value)) {
	    return true;
	  }
	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	    (object != null && value in Object(object));
	}

	var _isKey = isKey$1;

	var baseGetTag = _baseGetTag,
	    isObject$1 = isObject_1;

	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction$1(value) {
	  if (!isObject$1(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}

	var isFunction_1 = isFunction$1;

	var root$1 = _root;

	/** Used to detect overreaching core-js shims. */
	var coreJsData$1 = root$1['__core-js_shared__'];

	var _coreJsData = coreJsData$1;

	var coreJsData = _coreJsData;

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked$1(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	var _isMasked = isMasked$1;

	/** Used for built-in method references. */

	var funcProto$1 = Function.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString$1 = funcProto$1.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource$1(func) {
	  if (func != null) {
	    try {
	      return funcToString$1.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	var _toSource = toSource$1;

	var isFunction = isFunction_1,
	    isMasked = _isMasked,
	    isObject = isObject_1,
	    toSource = _toSource;

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto$2 = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative$1(value) {
	  if (!isObject(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}

	var _baseIsNative = baseIsNative$1;

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */

	function getValue$2(object, key) {
	  return object == null ? undefined : object[key];
	}

	var _getValue = getValue$2;

	var baseIsNative = _baseIsNative,
	    getValue$1 = _getValue;

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative$2(object, key) {
	  var value = getValue$1(object, key);
	  return baseIsNative(value) ? value : undefined;
	}

	var _getNative = getNative$2;

	var getNative$1 = _getNative;

	/* Built-in method references that are verified to be native. */
	var nativeCreate$4 = getNative$1(Object, 'create');

	var _nativeCreate = nativeCreate$4;

	var nativeCreate$3 = _nativeCreate;

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear$1() {
	  this.__data__ = nativeCreate$3 ? nativeCreate$3(null) : {};
	  this.size = 0;
	}

	var _hashClear = hashClear$1;

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */

	function hashDelete$1(key) {
	  var result = this.has(key) && delete this.__data__[key];
	  this.size -= result ? 1 : 0;
	  return result;
	}

	var _hashDelete = hashDelete$1;

	var nativeCreate$2 = _nativeCreate;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

	/** Used for built-in method references. */
	var objectProto$1 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet$1(key) {
	  var data = this.__data__;
	  if (nativeCreate$2) {
	    var result = data[key];
	    return result === HASH_UNDEFINED$1 ? undefined : result;
	  }
	  return hasOwnProperty$1.call(data, key) ? data[key] : undefined;
	}

	var _hashGet = hashGet$1;

	var nativeCreate$1 = _nativeCreate;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas$1(key) {
	  var data = this.__data__;
	  return nativeCreate$1 ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
	}

	var _hashHas = hashHas$1;

	var nativeCreate = _nativeCreate;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet$1(key, value) {
	  var data = this.__data__;
	  this.size += this.has(key) ? 0 : 1;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}

	var _hashSet = hashSet$1;

	var hashClear = _hashClear,
	    hashDelete = _hashDelete,
	    hashGet = _hashGet,
	    hashHas = _hashHas,
	    hashSet = _hashSet;

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash$1(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `Hash`.
	Hash$1.prototype.clear = hashClear;
	Hash$1.prototype['delete'] = hashDelete;
	Hash$1.prototype.get = hashGet;
	Hash$1.prototype.has = hashHas;
	Hash$1.prototype.set = hashSet;

	var _Hash = Hash$1;

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */

	function listCacheClear$1() {
	  this.__data__ = [];
	  this.size = 0;
	}

	var _listCacheClear = listCacheClear$1;

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */

	function eq$1(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	var eq_1 = eq$1;

	var eq = eq_1;

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf$4(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	var _assocIndexOf = assocIndexOf$4;

	var assocIndexOf$3 = _assocIndexOf;

	/** Used for built-in method references. */
	var arrayProto = Array.prototype;

	/** Built-in value references. */
	var splice = arrayProto.splice;

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete$1(key) {
	  var data = this.__data__,
	      index = assocIndexOf$3(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  --this.size;
	  return true;
	}

	var _listCacheDelete = listCacheDelete$1;

	var assocIndexOf$2 = _assocIndexOf;

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet$1(key) {
	  var data = this.__data__,
	      index = assocIndexOf$2(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	var _listCacheGet = listCacheGet$1;

	var assocIndexOf$1 = _assocIndexOf;

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas$1(key) {
	  return assocIndexOf$1(this.__data__, key) > -1;
	}

	var _listCacheHas = listCacheHas$1;

	var assocIndexOf = _assocIndexOf;

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet$1(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    ++this.size;
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	var _listCacheSet = listCacheSet$1;

	var listCacheClear = _listCacheClear,
	    listCacheDelete = _listCacheDelete,
	    listCacheGet = _listCacheGet,
	    listCacheHas = _listCacheHas,
	    listCacheSet = _listCacheSet;

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache$1(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `ListCache`.
	ListCache$1.prototype.clear = listCacheClear;
	ListCache$1.prototype['delete'] = listCacheDelete;
	ListCache$1.prototype.get = listCacheGet;
	ListCache$1.prototype.has = listCacheHas;
	ListCache$1.prototype.set = listCacheSet;

	var _ListCache = ListCache$1;

	var getNative = _getNative,
	    root = _root;

	/* Built-in method references that are verified to be native. */
	var Map$1 = getNative(root, 'Map');

	var _Map = Map$1;

	var Hash = _Hash,
	    ListCache = _ListCache,
	    Map = _Map;

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear$1() {
	  this.size = 0;
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}

	var _mapCacheClear = mapCacheClear$1;

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */

	function isKeyable$1(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	var _isKeyable = isKeyable$1;

	var isKeyable = _isKeyable;

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData$4(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	var _getMapData = getMapData$4;

	var getMapData$3 = _getMapData;

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete$1(key) {
	  var result = getMapData$3(this, key)['delete'](key);
	  this.size -= result ? 1 : 0;
	  return result;
	}

	var _mapCacheDelete = mapCacheDelete$1;

	var getMapData$2 = _getMapData;

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet$1(key) {
	  return getMapData$2(this, key).get(key);
	}

	var _mapCacheGet = mapCacheGet$1;

	var getMapData$1 = _getMapData;

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas$1(key) {
	  return getMapData$1(this, key).has(key);
	}

	var _mapCacheHas = mapCacheHas$1;

	var getMapData = _getMapData;

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet$1(key, value) {
	  var data = getMapData(this, key),
	      size = data.size;

	  data.set(key, value);
	  this.size += data.size == size ? 0 : 1;
	  return this;
	}

	var _mapCacheSet = mapCacheSet$1;

	var mapCacheClear = _mapCacheClear,
	    mapCacheDelete = _mapCacheDelete,
	    mapCacheGet = _mapCacheGet,
	    mapCacheHas = _mapCacheHas,
	    mapCacheSet = _mapCacheSet;

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache$1(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `MapCache`.
	MapCache$1.prototype.clear = mapCacheClear;
	MapCache$1.prototype['delete'] = mapCacheDelete;
	MapCache$1.prototype.get = mapCacheGet;
	MapCache$1.prototype.has = mapCacheHas;
	MapCache$1.prototype.set = mapCacheSet;

	var _MapCache = MapCache$1;

	var MapCache = _MapCache;

	/** Error message constants. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/**
	 * Creates a function that memoizes the result of `func`. If `resolver` is
	 * provided, it determines the cache key for storing the result based on the
	 * arguments provided to the memoized function. By default, the first argument
	 * provided to the memoized function is used as the map cache key. The `func`
	 * is invoked with the `this` binding of the memoized function.
	 *
	 * **Note:** The cache is exposed as the `cache` property on the memoized
	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
	 * constructor with one whose instances implement the
	 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
	 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to have its output memoized.
	 * @param {Function} [resolver] The function to resolve the cache key.
	 * @returns {Function} Returns the new memoized function.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': 2 };
	 * var other = { 'c': 3, 'd': 4 };
	 *
	 * var values = _.memoize(_.values);
	 * values(object);
	 * // => [1, 2]
	 *
	 * values(other);
	 * // => [3, 4]
	 *
	 * object.a = 2;
	 * values(object);
	 * // => [1, 2]
	 *
	 * // Modify the result cache.
	 * values.cache.set(object, ['a', 'b']);
	 * values(object);
	 * // => ['a', 'b']
	 *
	 * // Replace `_.memoize.Cache`.
	 * _.memoize.Cache = WeakMap;
	 */
	function memoize$1(func, resolver) {
	  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  var memoized = function() {
	    var args = arguments,
	        key = resolver ? resolver.apply(this, args) : args[0],
	        cache = memoized.cache;

	    if (cache.has(key)) {
	      return cache.get(key);
	    }
	    var result = func.apply(this, args);
	    memoized.cache = cache.set(key, result) || cache;
	    return result;
	  };
	  memoized.cache = new (memoize$1.Cache || MapCache);
	  return memoized;
	}

	// Expose `MapCache`.
	memoize$1.Cache = MapCache;

	var memoize_1 = memoize$1;

	var memoize = memoize_1;

	/** Used as the maximum memoize cache size. */
	var MAX_MEMOIZE_SIZE = 500;

	/**
	 * A specialized version of `_.memoize` which clears the memoized function's
	 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
	 *
	 * @private
	 * @param {Function} func The function to have its output memoized.
	 * @returns {Function} Returns the new memoized function.
	 */
	function memoizeCapped$1(func) {
	  var result = memoize(func, function(key) {
	    if (cache.size === MAX_MEMOIZE_SIZE) {
	      cache.clear();
	    }
	    return key;
	  });

	  var cache = result.cache;
	  return result;
	}

	var _memoizeCapped = memoizeCapped$1;

	var memoizeCapped = _memoizeCapped;

	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;

	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	var stringToPath$1 = memoizeCapped(function(string) {
	  var result = [];
	  if (string.charCodeAt(0) === 46 /* . */) {
	    result.push('');
	  }
	  string.replace(rePropName, function(match, number, quote, subString) {
	    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});

	var _stringToPath = stringToPath$1;

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */

	function arrayMap$1(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	var _arrayMap = arrayMap$1;

	var Symbol = _Symbol,
	    arrayMap = _arrayMap,
	    isArray$1 = isArray_1,
	    isSymbol$1 = isSymbol_1;

	/** Used as references for various `Number` constants. */
	var INFINITY$1 = 1 / 0;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;

	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString$1(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isArray$1(value)) {
	    // Recursively convert values (susceptible to call stack limits).
	    return arrayMap(value, baseToString$1) + '';
	  }
	  if (isSymbol$1(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY$1) ? '-0' : result;
	}

	var _baseToString = baseToString$1;

	var baseToString = _baseToString;

	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString$2(value) {
	  return value == null ? '' : baseToString(value);
	}

	var toString_1 = toString$2;

	var isArray = isArray_1,
	    isKey = _isKey,
	    stringToPath = _stringToPath,
	    toString$1 = toString_1;

	/**
	 * Casts `value` to a path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {Array} Returns the cast property path array.
	 */
	function castPath$1(value, object) {
	  if (isArray(value)) {
	    return value;
	  }
	  return isKey(value, object) ? [value] : stringToPath(toString$1(value));
	}

	var _castPath = castPath$1;

	var isSymbol = isSymbol_1;

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/**
	 * Converts `value` to a string key if it's not a string or symbol.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {string|symbol} Returns the key.
	 */
	function toKey$1(value) {
	  if (typeof value == 'string' || isSymbol(value)) {
	    return value;
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	var _toKey = toKey$1;

	var castPath = _castPath,
	    toKey = _toKey;

	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet$1(object, path) {
	  path = castPath(path, object);

	  var index = 0,
	      length = path.length;

	  while (object != null && index < length) {
	    object = object[toKey(path[index++])];
	  }
	  return (index && index == length) ? object : undefined;
	}

	var _baseGet = baseGet$1;

	var baseGet = _baseGet;

	/**
	 * Gets the value at `path` of `object`. If the resolved value is
	 * `undefined`, the `defaultValue` is returned in its place.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.7.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
	 * @returns {*} Returns the resolved value.
	 * @example
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.get(object, 'a[0].b.c');
	 * // => 3
	 *
	 * _.get(object, ['a', '0', 'b', 'c']);
	 * // => 3
	 *
	 * _.get(object, 'a.b.c', 'default');
	 * // => 'default'
	 */
	function get(object, path, defaultValue) {
	  var result = object == null ? undefined : baseGet(object, path);
	  return result === undefined ? defaultValue : result;
	}

	var get_1 = get;

	const getValue = get_1;
	// export function extend(obj, name, fn) {
	//   const base = obj[name] || NOOP;
	//   const newFn = fn.bind(obj, base.bind(obj));
	//   newFn.fn = fn;
	//   newFn.base = base;
	//   obj[name] = newFn;
	// }
	// export function rebase(obj, name, newBase) {
	//   const fns = [];
	//   let fn = obj[name];
	//   while(fn && fn.fn) {
	//     fns.push(fn.fn);
	//     fn = fn.base;
	//   }
	//   obj[name] = newBase;
	//   while(fns.length) {
	//     fn = fns.pop();
	//     extend(obj, name, fn);
	//   }
	// }
	// export function cloneObject(obj:object) {
	//   const other = Object.create(obj.__proto__);
	//   assignObject(other, obj);
	//   return other;
	// }
	function assignField(dest, src, key) {
	    const current = dest[key];
	    const updated = src[key];
	    if (current && current.copy && updated) {
	        current.copy(updated);
	    }
	    else if (current && current.clear && !updated) {
	        current.clear();
	    }
	    else if (current && current.nullify && !updated) {
	        current.nullify();
	    }
	    else if (updated && updated.clone) {
	        dest[key] = updated.clone(); // just use same object (shallow copy)
	    }
	    else if (updated && Array.isArray(updated)) {
	        dest[key] = updated.slice();
	    }
	    else if (current && Array.isArray(current)) {
	        current.length = 0;
	    }
	    else if (updated !== undefined) {
	        dest[key] = updated;
	    }
	}
	function copyObject(dest, src) {
	    Object.keys(dest).forEach((key) => {
	        assignField(dest, src, key);
	    });
	    return dest;
	}
	function assignObject(dest, src) {
	    Object.keys(src).forEach((key) => {
	        assignField(dest, src, key);
	    });
	    return dest;
	}
	function assignOmitting(omit, dest, src) {
	    if (typeof omit === 'string') {
	        omit = omit.split(/[,|]/g).map((t) => t.trim());
	    }
	    Object.keys(src).forEach((key) => {
	        if (omit.includes(key))
	            return;
	        assignField(dest, src, key);
	    });
	    return dest;
	}
	function setDefault(obj, field, val) {
	    if (obj[field] === undefined) {
	        obj[field] = val;
	    }
	}
	function setDefaults(obj, def, custom = null) {
	    let dest;
	    if (!def)
	        return;
	    Object.keys(def).forEach((key) => {
	        const origKey = key;
	        let defValue = def[key];
	        dest = obj;
	        // allow for => 'stats.health': 100
	        const parts = key.split('.');
	        while (parts.length > 1) {
	            key = parts.shift();
	            if (dest[key] === undefined) {
	                dest = dest[key] = {};
	            }
	            else if (typeof dest[key] !== 'object') {
	                ERROR('Trying to set default member on non-object config item: ' +
	                    origKey);
	            }
	            else {
	                dest = dest[key];
	            }
	        }
	        key = parts.shift();
	        let current = dest[key];
	        // console.log('def - ', key, current, defValue, obj, dest);
	        if (custom && custom(dest, key, current, defValue)) ;
	        else if (current === undefined) {
	            if (defValue === null) {
	                dest[key] = null;
	            }
	            else if (Array.isArray(defValue)) {
	                dest[key] = defValue.slice();
	            }
	            else if (typeof defValue === 'object') {
	                dest[key] = defValue; // Object.assign({}, defValue); -- this breaks assigning a Color object as a default...
	            }
	            else {
	                dest[key] = defValue;
	            }
	        }
	    });
	}
	function setOptions(obj, opts) {
	    setDefaults(obj, opts, (dest, key, _current, opt) => {
	        if (opt === null) {
	            dest[key] = null;
	        }
	        else if (Array.isArray(opt)) {
	            dest[key] = opt.slice();
	        }
	        else if (typeof opt === 'object') {
	            dest[key] = opt; // Object.assign({}, opt); -- this breaks assigning a Color object as a default...
	        }
	        else {
	            dest[key] = opt;
	        }
	        return true;
	    });
	}
	function kindDefaults(obj, def) {
	    function custom(dest, key, current, defValue) {
	        if (key.search(/[fF]lags$/) < 0)
	            return false;
	        if (!current) {
	            current = [];
	        }
	        else if (typeof current == 'string') {
	            current = current.split(/[,|]/).map((t) => t.trim());
	        }
	        else if (!Array.isArray(current)) {
	            current = [current];
	        }
	        if (typeof defValue === 'string') {
	            defValue = defValue.split(/[,|]/).map((t) => t.trim());
	        }
	        else if (!Array.isArray(defValue)) {
	            defValue = [defValue];
	        }
	        // console.log('flags', key, defValue, current);
	        dest[key] = defValue.concat(current);
	        return true;
	    }
	    return setDefaults(obj, def, custom);
	}
	function pick(obj, ...fields) {
	    const data = {};
	    fields.forEach((f) => {
	        const v = obj[f];
	        if (v !== undefined) {
	            data[f] = v;
	        }
	    });
	    return data;
	}
	function clearObject(obj) {
	    Object.keys(obj).forEach((key) => (obj[key] = undefined));
	}
	function getOpt(obj, member, _default) {
	    const v = obj[member];
	    if (v === undefined)
	        return _default;
	    return v;
	}
	function firstOpt(field, ...args) {
	    for (let arg of args) {
	        if (typeof arg !== 'object' || Array.isArray(arg)) {
	            return arg;
	        }
	        if (arg && arg[field] !== undefined) {
	            return arg[field];
	        }
	    }
	    return undefined;
	}

	var object = /*#__PURE__*/Object.freeze({
		__proto__: null,
		getValue: getValue,
		copyObject: copyObject,
		assignObject: assignObject,
		assignOmitting: assignOmitting,
		setDefault: setDefault,
		setDefaults: setDefaults,
		setOptions: setOptions,
		kindDefaults: kindDefaults,
		pick: pick,
		clearObject: clearObject,
		getOpt: getOpt,
		firstOpt: firstOpt
	});

	const DIRS$1 = DIRS$2;
	function makeArray(l, fn) {
	    if (fn === undefined)
	        return new Array(l).fill(0);
	    let initFn;
	    if (typeof fn !== 'function') {
	        initFn = () => fn;
	    }
	    else {
	        initFn = fn;
	    }
	    const arr = new Array(l);
	    for (let i = 0; i < l; ++i) {
	        arr[i] = initFn(i);
	    }
	    return arr;
	}
	function _formatGridValue(v) {
	    if (v === false) {
	        return ' ';
	    }
	    else if (v === true) {
	        return 'T';
	    }
	    else if (v < 10) {
	        return '' + v;
	    }
	    else if (v < 36) {
	        return String.fromCharCode('a'.charCodeAt(0) + v - 10);
	    }
	    else if (v < 62) {
	        return String.fromCharCode('A'.charCodeAt(0) + v - 10 - 26);
	    }
	    else if (typeof v === 'string') {
	        return v[0];
	    }
	    else {
	        return '#';
	    }
	}
	class Grid extends Array {
	    constructor(w, h, v) {
	        super(w);
	        const grid = this;
	        for (let x = 0; x < w; ++x) {
	            if (typeof v === 'function') {
	                this[x] = new Array(h)
	                    .fill(0)
	                    .map((_, i) => v(x, i, grid));
	            }
	            else {
	                this[x] = new Array(h).fill(v);
	            }
	        }
	        this._width = w;
	        this._height = h;
	    }
	    get width() {
	        return this._width;
	    }
	    get height() {
	        return this._height;
	    }
	    get(x, y) {
	        if (!this.hasXY(x, y))
	            return undefined;
	        return this[x][y];
	    }
	    set(x, y, v) {
	        if (!this.hasXY(x, y))
	            return false;
	        this[x][y] = v;
	        return true;
	    }
	    /**
	     * Calls the supplied function for each cell in the grid.
	     * @param fn - The function to call on each item in the grid.
	     * TSIGNORE
	     */
	    // @ts-ignore
	    forEach(fn) {
	        let i, j;
	        for (i = 0; i < this.width; i++) {
	            for (j = 0; j < this.height; j++) {
	                fn(this[i][j], i, j, this);
	            }
	        }
	    }
	    async forEachAsync(fn) {
	        let i, j;
	        for (i = 0; i < this.width; i++) {
	            for (j = 0; j < this.height; j++) {
	                await fn(this[i][j], i, j, this);
	            }
	        }
	    }
	    eachNeighbor(x, y, fn, only4dirs = false) {
	        eachNeighbor(x, y, (i, j) => {
	            if (this.hasXY(i, j)) {
	                fn(this[i][j], i, j, this);
	            }
	        }, only4dirs);
	    }
	    async eachNeighborAsync(x, y, fn, only4dirs = false) {
	        const maxIndex = only4dirs ? 4 : 8;
	        for (let d = 0; d < maxIndex; ++d) {
	            const dir = DIRS$1[d];
	            const i = x + dir[0];
	            const j = y + dir[1];
	            if (this.hasXY(i, j)) {
	                await fn(this[i][j], i, j, this);
	            }
	        }
	    }
	    forRect(x, y, w, h, fn) {
	        forRect(x, y, w, h, (i, j) => {
	            if (this.hasXY(i, j)) {
	                fn(this[i][j], i, j, this);
	            }
	        });
	    }
	    randomEach(fn) {
	        const sequence = random.sequence(this.width * this.height);
	        for (let i = 0; i < sequence.length; ++i) {
	            const n = sequence[i];
	            const x = n % this.width;
	            const y = Math.floor(n / this.width);
	            if (fn(this[x][y], x, y, this) === true)
	                return true;
	        }
	        return false;
	    }
	    /**
	     * Returns a new Grid with the cells mapped according to the supplied function.
	     * @param fn - The function that maps the cell values
	     * TODO - Do we need this???
	     * TODO - Should this only be in NumGrid?
	     * TODO - Should it alloc instead of using constructor?
	     * TSIGNORE
	     */
	    // @ts-ignore
	    map(fn) {
	        // @ts-ignore
	        const other = new this.constructor(this.width, this.height);
	        other.copy(this);
	        other.update(fn);
	        return other;
	    }
	    /**
	     * Returns whether or not an item in the grid matches the provided function.
	     * @param fn - The function that matches
	     * TODO - Do we need this???
	     * TODO - Should this only be in NumGrid?
	     * TODO - Should it alloc instead of using constructor?
	     * TSIGNORE
	     */
	    // @ts-ignore
	    some(fn) {
	        return super.some((col, x) => col.some((data, y) => fn(data, x, y, this)));
	    }
	    forCircle(x, y, radius, fn) {
	        forCircle(x, y, radius, (i, j) => {
	            if (this.hasXY(i, j))
	                fn(this[i][j], i, j, this);
	        });
	    }
	    hasXY(x, y) {
	        return x >= 0 && y >= 0 && x < this.width && y < this.height;
	    }
	    isBoundaryXY(x, y) {
	        return (this.hasXY(x, y) &&
	            (x == 0 || x == this.width - 1 || y == 0 || y == this.height - 1));
	    }
	    calcBounds() {
	        const bounds = {
	            left: this.width,
	            top: this.height,
	            right: 0,
	            bottom: 0,
	        };
	        this.forEach((v, i, j) => {
	            if (!v)
	                return;
	            if (bounds.left > i)
	                bounds.left = i;
	            if (bounds.right < i)
	                bounds.right = i;
	            if (bounds.top > j)
	                bounds.top = j;
	            if (bounds.bottom < j)
	                bounds.bottom = j;
	        });
	        return bounds;
	    }
	    update(fn) {
	        forRect(this.width, this.height, (i, j) => {
	            this[i][j] = fn(this[i][j], i, j, this);
	        });
	    }
	    updateRect(x, y, width, height, fn) {
	        forRect(x, y, width, height, (i, j) => {
	            if (this.hasXY(i, j))
	                this[i][j] = fn(this[i][j], i, j, this);
	        });
	    }
	    updateCircle(x, y, radius, fn) {
	        forCircle(x, y, radius, (i, j) => {
	            if (this.hasXY(i, j)) {
	                this[i][j] = fn(this[i][j], i, j, this);
	            }
	        });
	    }
	    /**
	     * Fills the entire grid with the supplied value
	     * @param v - The fill value or a function that returns the fill value.
	     * TSIGNORE
	     */
	    // @ts-ignore
	    fill(v) {
	        const fn = typeof v === 'function' ? v : () => v;
	        this.update(fn);
	    }
	    fillRect(x, y, w, h, v) {
	        const fn = typeof v === 'function' ? v : () => v;
	        this.updateRect(x, y, w, h, fn);
	    }
	    fillCircle(x, y, radius, v) {
	        const fn = typeof v === 'function' ? v : () => v;
	        this.updateCircle(x, y, radius, fn);
	    }
	    replace(findValue, replaceValue) {
	        this.update((v) => (v == findValue ? replaceValue : v));
	    }
	    copy(from) {
	        // TODO - check width, height?
	        this.update((_, i, j) => from[i][j]);
	    }
	    count(match) {
	        const fn = typeof match === 'function'
	            ? match
	            : (v) => v == match;
	        let count = 0;
	        this.forEach((v, i, j) => {
	            if (fn(v, i, j, this))
	                ++count;
	        });
	        return count;
	    }
	    /**
	     * Finds the first matching value/result and returns that location as an xy.Loc
	     * @param v - The fill value or a function that returns the fill value.
	     * @returns xy.Loc | null - The location of the first cell matching the criteria or null if not found.
	     * TSIGNORE
	     */
	    // @ts-ignore
	    find(match) {
	        const fn = typeof match === 'function'
	            ? match
	            : (v) => v == match;
	        for (let x = 0; x < this.width; ++x) {
	            for (let y = 0; y < this.height; ++y) {
	                const v = this[x][y];
	                if (fn(v, x, y, this))
	                    return [x, y];
	            }
	        }
	        return null;
	    }
	    dump(fmtFn, log = console.log) {
	        this.dumpRect(0, 0, this.width, this.height, fmtFn, log);
	    }
	    dumpRect(left, top, width, height, fmtFn, log = console.log) {
	        let i, j;
	        fmtFn = fmtFn || _formatGridValue;
	        left = clamp(left, 0, this.width - 2);
	        top = clamp(top, 0, this.height - 2);
	        const right = clamp(left + width, 1, this.width - 1);
	        const bottom = clamp(top + height, 1, this.height - 1);
	        let output = [];
	        for (j = top; j <= bottom; j++) {
	            let line = ('' + j + ']').padStart(3, ' ');
	            for (i = left; i <= right; i++) {
	                if (i % 10 == 0) {
	                    line += ' ';
	                }
	                const v = this[i][j];
	                line += fmtFn(v, i, j)[0];
	            }
	            output.push(line);
	        }
	        log(output.join('\n'));
	    }
	    dumpAround(x, y, radius, fmtFn, log = console.log) {
	        this.dumpRect(x - radius, y - radius, 2 * radius, 2 * radius, fmtFn, log);
	    }
	    // TODO - Use for(radius) loop to speed this up (do not look at each cell)
	    closestMatchingLoc(x, y, v) {
	        let bestLoc = [-1, -1];
	        let bestDistance = 100 * (this.width + this.height);
	        const fn = typeof v === 'function'
	            ? v
	            : (val) => val == v;
	        this.forEach((v, i, j) => {
	            if (fn(v, i, j, this)) {
	                const dist = Math.floor(100 * distanceBetween(x, y, i, j));
	                if (dist < bestDistance) {
	                    bestLoc[0] = i;
	                    bestLoc[1] = j;
	                    bestDistance = dist;
	                }
	                else if (dist == bestDistance && random.chance(50)) {
	                    bestLoc[0] = i;
	                    bestLoc[1] = j;
	                }
	            }
	        });
	        return bestLoc;
	    }
	    firstMatchingLoc(v) {
	        const fn = typeof v === 'function'
	            ? v
	            : (val) => val == v;
	        for (let i = 0; i < this.width; ++i) {
	            for (let j = 0; j < this.height; ++j) {
	                if (fn(this[i][j], i, j, this)) {
	                    return [i, j];
	                }
	            }
	        }
	        return [-1, -1];
	    }
	    randomMatchingLoc(v) {
	        const fn = typeof v === 'function'
	            ? (x, y) => v(this[x][y], x, y, this)
	            : (x, y) => this.get(x, y) === v;
	        return random.matchingLoc(this.width, this.height, fn);
	    }
	    matchingLocNear(x, y, v) {
	        const fn = typeof v === 'function'
	            ? (x, y) => v(this[x][y], x, y, this)
	            : (x, y) => this.get(x, y) === v;
	        return random.matchingLocNear(x, y, fn);
	    }
	    // Rotates around the cell, counting up the number of distinct strings of neighbors with the same test result in a single revolution.
	    //		Zero means there are no impassable tiles adjacent.
	    //		One means it is adjacent to a wall.
	    //		Two means it is in a hallway or something similar.
	    //		Three means it is the center of a T-intersection or something similar.
	    //		Four means it is in the intersection of two hallways.
	    //		Five or more means there is a bug.
	    arcCount(x, y, testFn) {
	        return arcCount(x, y, (i, j) => {
	            return this.hasXY(i, j) && testFn(this[i][j], i, j, this);
	        });
	    }
	}
	const GRID_CACHE = [];
	const stats = {
	    active: 0,
	    alloc: 0,
	    create: 0,
	    free: 0,
	};
	class NumGrid extends Grid {
	    constructor(w, h, v = 0) {
	        super(w, h, v);
	    }
	    static alloc(...args) {
	        let w = args[0] || 0;
	        let h = args[1] || 0;
	        let v = args[2] || 0;
	        if (args.length == 1) {
	            // clone from NumGrid
	            w = args[0].width;
	            h = args[0].height;
	            v = args[0].get.bind(args[0]);
	        }
	        if (!w || !h)
	            throw new Error('Grid alloc requires width and height parameters.');
	        ++stats.active;
	        ++stats.alloc;
	        let grid = GRID_CACHE.pop();
	        if (!grid) {
	            ++stats.create;
	            return new NumGrid(w, h, v);
	        }
	        grid._resize(w, h, v);
	        return grid;
	    }
	    static free(grid) {
	        if (grid) {
	            if (GRID_CACHE.indexOf(grid) >= 0)
	                return;
	            GRID_CACHE.push(grid);
	            ++stats.free;
	            --stats.active;
	        }
	    }
	    _resize(width, height, v) {
	        const fn = typeof v === 'function' ? v : () => v;
	        while (this.length < width)
	            this.push([]);
	        this.length = width;
	        let x = 0;
	        let y = 0;
	        for (x = 0; x < width; ++x) {
	            const col = this[x];
	            for (y = 0; y < height; ++y) {
	                col[y] = fn(x, y, this);
	            }
	            col.length = height;
	        }
	        this._width = width;
	        this._height = height;
	        if (this.x !== undefined) {
	            this.x = undefined;
	            this.y = undefined;
	        }
	    }
	    findReplaceRange(findValueMin, findValueMax, fillValue) {
	        this.update((v) => {
	            if (v >= findValueMin && v <= findValueMax) {
	                return fillValue;
	            }
	            return v;
	        });
	    }
	    // Flood-fills the grid from (x, y) along cells that are within the eligible range.
	    // Returns the total count of filled cells.
	    floodFillRange(x, y, eligibleValueMin, eligibleValueMax, fillValue) {
	        let dir;
	        let newX, newY, fillCount = 1;
	        if (fillValue >= eligibleValueMin && fillValue <= eligibleValueMax) {
	            throw new Error('Invalid grid flood fill');
	        }
	        const ok = (x, y) => {
	            return (this.hasXY(x, y) &&
	                this[x][y] >= eligibleValueMin &&
	                this[x][y] <= eligibleValueMax);
	        };
	        if (!ok(x, y))
	            return 0;
	        this[x][y] = fillValue;
	        for (dir = 0; dir < 4; dir++) {
	            newX = x + DIRS$1[dir][0];
	            newY = y + DIRS$1[dir][1];
	            if (ok(newX, newY)) {
	                fillCount += this.floodFillRange(newX, newY, eligibleValueMin, eligibleValueMax, fillValue);
	            }
	        }
	        return fillCount;
	    }
	    invert() {
	        this.update((v) => (v ? 0 : 1));
	    }
	    leastPositiveValue() {
	        let least = Number.MAX_SAFE_INTEGER;
	        this.forEach((v) => {
	            if (v > 0 && v < least) {
	                least = v;
	            }
	        });
	        return least;
	    }
	    randomLeastPositiveLoc() {
	        const targetValue = this.leastPositiveValue();
	        return this.randomMatchingLoc(targetValue);
	    }
	    valueBounds(value, bounds) {
	        let foundValueAtThisLine = false;
	        let i, j;
	        let left = this.width - 1, right = 0, top = this.height - 1, bottom = 0;
	        // Figure out the top blob's height and width:
	        // First find the max & min x:
	        for (i = 0; i < this.width; i++) {
	            foundValueAtThisLine = false;
	            for (j = 0; j < this.height; j++) {
	                if (this[i][j] == value) {
	                    foundValueAtThisLine = true;
	                    break;
	                }
	            }
	            if (foundValueAtThisLine) {
	                if (i < left) {
	                    left = i;
	                }
	                if (i > right) {
	                    right = i;
	                }
	            }
	        }
	        // Then the max & min y:
	        for (j = 0; j < this.height; j++) {
	            foundValueAtThisLine = false;
	            for (i = 0; i < this.width; i++) {
	                if (this[i][j] == value) {
	                    foundValueAtThisLine = true;
	                    break;
	                }
	            }
	            if (foundValueAtThisLine) {
	                if (j < top) {
	                    top = j;
	                }
	                if (j > bottom) {
	                    bottom = j;
	                }
	            }
	        }
	        bounds = bounds || new Bounds(0, 0, 0, 0);
	        bounds.x = left;
	        bounds.y = top;
	        bounds.width = right - left + 1;
	        bounds.height = bottom - top + 1;
	        return bounds;
	    }
	    // Marks a cell as being a member of blobNumber, then recursively iterates through the rest of the blob
	    floodFill(x, y, matchValue, fillValue) {
	        const matchFn = typeof matchValue == 'function'
	            ? matchValue
	            : (v) => v == matchValue;
	        const fillFn = typeof fillValue == 'function' ? fillValue : () => fillValue;
	        let done = NumGrid.alloc(this.width, this.height);
	        let newX, newY;
	        const todo = [[x, y]];
	        const free = [];
	        let count = 1;
	        while (todo.length) {
	            const item = todo.pop();
	            [x, y] = item;
	            free.push(item);
	            if (!this.hasXY(x, y) || done[x][y])
	                continue;
	            if (!matchFn(this[x][y], x, y, this))
	                continue;
	            this[x][y] = fillFn(this[x][y], x, y, this);
	            done[x][y] = 1;
	            ++count;
	            // Iterate through the four cardinal neighbors.
	            for (let dir = 0; dir < 4; dir++) {
	                newX = x + DIRS$1[dir][0];
	                newY = y + DIRS$1[dir][1];
	                // If the neighbor is an unmarked region cell,
	                const item = free.pop() || [-1, -1];
	                item[0] = newX;
	                item[1] = newY;
	                todo.push(item);
	            }
	        }
	        NumGrid.free(done);
	        return count;
	    }
	}
	// Grid.fillBlob = fillBlob;
	const alloc = NumGrid.alloc.bind(NumGrid);
	const free = NumGrid.free.bind(NumGrid);
	function make$e(w, h, v) {
	    if (v === undefined)
	        return new NumGrid(w, h, 0);
	    if (typeof v === 'number')
	        return new NumGrid(w, h, v);
	    return new Grid(w, h, v);
	}
	function offsetZip(destGrid, srcGrid, srcToDestX, srcToDestY, value) {
	    const fn = typeof value === 'function'
	        ? value
	        : (_d, _s, dx, dy) => (destGrid[dx][dy] = value);
	    srcGrid.forEach((c, i, j) => {
	        const destX = i + srcToDestX;
	        const destY = j + srcToDestY;
	        if (!destGrid.hasXY(destX, destY))
	            return;
	        if (!c)
	            return;
	        fn(destGrid[destX][destY], c, destX, destY, i, j, destGrid, srcGrid);
	    });
	}
	// Grid.offsetZip = offsetZip;
	function intersection(onto, a, b) {
	    b = b || onto;
	    // @ts-ignore
	    onto.update((_, i, j) => (a[i][j] && b[i][j]) || 0);
	}
	// Grid.intersection = intersection;
	function unite(onto, a, b) {
	    b = b || onto;
	    // @ts-ignore
	    onto.update((_, i, j) => b[i][j] || a[i][j]);
	}

	var grid = /*#__PURE__*/Object.freeze({
		__proto__: null,
		makeArray: makeArray,
		Grid: Grid,
		stats: stats,
		NumGrid: NumGrid,
		alloc: alloc,
		free: free,
		make: make$e,
		offsetZip: offsetZip,
		intersection: intersection,
		unite: unite
	});

	/**
	 * The code in this function is extracted from ROT.JS.
	 * Source: https://github.com/ondras/rot.js/blob/v2.2.0/src/rng.ts
	 * Copyright (c) 2012-now(), Ondrej Zara
	 * All rights reserved.
	 * License: BSD 3-Clause "New" or "Revised" License
	 * See: https://github.com/ondras/rot.js/blob/v2.2.0/license.txt
	 */
	function Alea(seed) {
	    /**
	     * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baagøe.
	     * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
	     */
	    seed = Math.abs(seed || Date.now());
	    seed = seed < 1 ? 1 / seed : seed;
	    const FRAC = 2.3283064365386963e-10; /* 2^-32 */
	    let _s0 = 0;
	    let _s1 = 0;
	    let _s2 = 0;
	    let _c = 0;
	    /**
	     * Seed the number generator
	     */
	    _s0 = (seed >>> 0) * FRAC;
	    seed = (seed * 69069 + 1) >>> 0;
	    _s1 = seed * FRAC;
	    seed = (seed * 69069 + 1) >>> 0;
	    _s2 = seed * FRAC;
	    _c = 1;
	    /**
	     * @returns Pseudorandom value [0,1), uniformly distributed
	     */
	    return function alea() {
	        let t = 2091639 * _s0 + _c * FRAC;
	        _s0 = _s1;
	        _s1 = _s2;
	        _c = t | 0;
	        _s2 = t - _c;
	        return _s2;
	    };
	}
	const RANDOM_CONFIG = {
	    make: Alea,
	    // make: (seed?: number) => {
	    //     let rng = ROT.RNG.clone();
	    //     if (seed) {
	    //         rng.setSeed(seed);
	    //     }
	    //     return rng.getUniform.bind(rng);
	    // },
	};
	function configure$1(config = {}) {
	    if (config.make) {
	        RANDOM_CONFIG.make = config.make;
	        random.seed();
	        cosmetic.seed();
	    }
	}
	function lotteryDrawArray(rand, frequencies) {
	    let i, maxFreq, randIndex;
	    maxFreq = 0;
	    for (i = 0; i < frequencies.length; i++) {
	        maxFreq += frequencies[i];
	    }
	    if (maxFreq <= 0) {
	        // console.warn(
	        //     'Lottery Draw - no frequencies',
	        //     frequencies,
	        //     frequencies.length
	        // );
	        return -1;
	    }
	    randIndex = rand.range(0, maxFreq - 1);
	    for (i = 0; i < frequencies.length; i++) {
	        if (frequencies[i] > randIndex) {
	            return i;
	        }
	        else {
	            randIndex -= frequencies[i];
	        }
	    }
	    console.warn('Lottery Draw failed.', frequencies, frequencies.length);
	    return 0;
	}
	function lotteryDrawObject(rand, weights) {
	    const entries = Object.entries(weights);
	    const frequencies = entries.map(([_, weight]) => weight);
	    const index = lotteryDrawArray(rand, frequencies);
	    if (index < 0)
	        return -1;
	    return entries[index][0];
	}
	class Random {
	    // static configure(opts: Partial<RandomConfig>) {
	    //     if (opts.make) {
	    //         if (typeof opts.make !== 'function')
	    //             throw new Error('Random make parameter must be a function.');
	    //         if (typeof opts.make(12345) !== 'function')
	    //             throw new Error(
	    //                 'Random make function must accept a numeric seed and return a random function.'
	    //             );
	    //         RANDOM_CONFIG.make = opts.make;
	    //         random.seed();
	    //         cosmetic.seed();
	    //     }
	    // }
	    constructor(seed) {
	        this._fn = RANDOM_CONFIG.make(seed);
	    }
	    seed(val) {
	        val = val || Date.now();
	        this._fn = RANDOM_CONFIG.make(val);
	    }
	    value() {
	        return this._fn();
	    }
	    float() {
	        return this.value();
	    }
	    number(max = Number.MAX_SAFE_INTEGER) {
	        if (max <= 0)
	            return 0;
	        return Math.floor(this.value() * max);
	    }
	    int(max = 0) {
	        return this.number(max);
	    }
	    range(lo, hi) {
	        if (hi <= lo)
	            return hi;
	        const diff = hi - lo + 1;
	        return lo + this.number(diff);
	    }
	    /**
	     * @param mean Mean value
	     * @param stddev Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
	     * @returns A normally distributed pseudorandom value
	     * @see: https://github.com/ondras/rot.js/blob/v2.2.0/src/rng.ts
	     */
	    normal(mean = 0, stddev = 1) {
	        let u, v, r;
	        do {
	            u = 2 * this.value() - 1;
	            v = 2 * this.value() - 1;
	            r = u * u + v * v;
	        } while (r > 1 || r == 0);
	        let gauss = u * Math.sqrt((-2 * Math.log(r)) / r);
	        return mean + gauss * stddev;
	    }
	    dice(count, sides, addend = 0) {
	        let total = 0;
	        let mult = 1;
	        if (count < 0) {
	            count = -count;
	            mult = -1;
	        }
	        addend = addend || 0;
	        for (let i = 0; i < count; ++i) {
	            total += this.range(1, sides);
	        }
	        total *= mult;
	        return total + addend;
	    }
	    weighted(weights) {
	        if (Array.isArray(weights)) {
	            return lotteryDrawArray(this, weights);
	        }
	        return lotteryDrawObject(this, weights);
	    }
	    item(list) {
	        if (!Array.isArray(list)) {
	            list = Object.values(list);
	        }
	        return list[this.range(0, list.length - 1)];
	    }
	    key(obj) {
	        return this.item(Object.keys(obj));
	    }
	    shuffle(list, fromIndex = 0, toIndex = 0) {
	        if (arguments.length == 2) {
	            toIndex = fromIndex;
	            fromIndex = 0;
	        }
	        let i, r, buf;
	        toIndex = toIndex || list.length;
	        fromIndex = fromIndex || 0;
	        for (i = fromIndex; i < toIndex; i++) {
	            r = this.range(fromIndex, toIndex - 1);
	            if (i != r) {
	                buf = list[r];
	                list[r] = list[i];
	                list[i] = buf;
	            }
	        }
	        return list;
	    }
	    sequence(n) {
	        const list = [];
	        for (let i = 0; i < n; i++) {
	            list[i] = i;
	        }
	        return this.shuffle(list);
	    }
	    chance(percent, outOf = 100) {
	        if (percent <= 0)
	            return false;
	        if (percent >= outOf)
	            return true;
	        return this.number(outOf) < percent;
	    }
	    // Get a random int between lo and hi, inclusive, with probability distribution
	    // affected by clumps.
	    clumped(lo, hi, clumps) {
	        if (hi <= lo) {
	            return lo;
	        }
	        if (clumps <= 1) {
	            return this.range(lo, hi);
	        }
	        let i, total = 0, numSides = Math.floor((hi - lo) / clumps);
	        for (i = 0; i < (hi - lo) % clumps; i++) {
	            total += this.range(0, numSides + 1);
	        }
	        for (; i < clumps; i++) {
	            total += this.range(0, numSides);
	        }
	        return total + lo;
	    }
	    matchingLoc(width, height, matchFn) {
	        let locationCount = 0;
	        let i, j, index;
	        const grid$1 = alloc(width, height);
	        locationCount = 0;
	        grid$1.update((_v, x, y) => {
	            if (matchFn(x, y)) {
	                ++locationCount;
	                return 1;
	            }
	            return 0;
	        });
	        if (locationCount) {
	            index = this.range(0, locationCount - 1);
	            for (i = 0; i < width && index >= 0; i++) {
	                for (j = 0; j < height && index >= 0; j++) {
	                    if (grid$1[i][j]) {
	                        if (index == 0) {
	                            free(grid$1);
	                            return [i, j];
	                        }
	                        index--;
	                    }
	                }
	            }
	        }
	        free(grid$1);
	        return [-1, -1];
	    }
	    matchingLocNear(x, y, matchFn) {
	        let loc = [-1, -1];
	        let i, j, k, candidateLocs, randIndex;
	        candidateLocs = 0;
	        // count up the number of candidate locations
	        for (k = 0; k < 50 && !candidateLocs; k++) {
	            for (i = x - k; i <= x + k; i++) {
	                for (j = y - k; j <= y + k; j++) {
	                    if (Math.ceil(distanceBetween(x, y, i, j)) == k &&
	                        matchFn(i, j)) {
	                        candidateLocs++;
	                    }
	                }
	            }
	        }
	        if (candidateLocs == 0) {
	            return [-1, -1];
	        }
	        // and pick one
	        randIndex = 1 + this.number(candidateLocs);
	        --k;
	        // for (k = 0; k < 50; k++) {
	        for (i = x - k; i <= x + k; i++) {
	            for (j = y - k; j <= y + k; j++) {
	                if (Math.ceil(distanceBetween(x, y, i, j)) == k &&
	                    matchFn(i, j)) {
	                    if (--randIndex == 0) {
	                        loc[0] = i;
	                        loc[1] = j;
	                        return loc;
	                    }
	                }
	            }
	        }
	        // }
	        return [-1, -1]; // should never reach this point
	    }
	}
	const random = new Random();
	const cosmetic = new Random();
	function make$d(seed) {
	    return new Random(seed);
	}

	var rng = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Alea: Alea,
		configure: configure$1,
		Random: Random,
		random: random,
		cosmetic: cosmetic,
		make: make$d
	});

	class Range {
	    constructor(lower, upper = 0, clumps = 1) {
	        if (Array.isArray(lower)) {
	            clumps = lower[2];
	            upper = lower[1];
	            lower = lower[0];
	        }
	        if (upper < lower) {
	            [upper, lower] = [lower, upper];
	        }
	        this.lo = lower || 0;
	        this.hi = upper || this.lo;
	        this.clumps = clumps || 1;
	    }
	    value(rng) {
	        rng = rng || random;
	        return rng.clumped(this.lo, this.hi, this.clumps);
	    }
	    max() {
	        return this.hi;
	    }
	    contains(value) {
	        return this.lo <= value && this.hi >= value;
	    }
	    copy(other) {
	        this.lo = other.lo;
	        this.hi = other.hi;
	        this.clumps = other.clumps;
	        return this;
	    }
	    toString() {
	        if (this.lo >= this.hi) {
	            return '' + this.lo;
	        }
	        return `${this.lo}-${this.hi}`;
	    }
	}
	function make$c(config) {
	    if (!config)
	        return new Range(0, 0, 0);
	    if (config instanceof Range)
	        return config; // don't need to clone since they are immutable
	    // if (config.value) return config;  // calc or damage
	    if (typeof config == 'function')
	        throw new Error('Custom range functions not supported - extend Range');
	    if (config === undefined || config === null)
	        return new Range(0, 0, 0);
	    if (typeof config == 'number')
	        return new Range(config, config, 1);
	    // @ts-ignore
	    if (config === true || config === false)
	        throw new Error('Invalid random config: ' + config);
	    if (Array.isArray(config)) {
	        return new Range(config[0], config[1], config[2]);
	    }
	    if (typeof config !== 'string') {
	        throw new Error('Calculations must be strings.  Received: ' + JSON.stringify(config));
	    }
	    if (config.length == 0)
	        return new Range(0, 0, 0);
	    const RE = /^(?:([+-]?\d*)[Dd](\d+)([+-]?\d*)|([+-]?\d+)-(\d+):?(\d+)?|([+-]?\d+)~(\d+)|([+-]?\d+)\+|([+-]?\d+))$/g;
	    let results;
	    while ((results = RE.exec(config)) !== null) {
	        if (results[2]) {
	            let count = Number.parseInt(results[1]) || 1;
	            const sides = Number.parseInt(results[2]);
	            const addend = Number.parseInt(results[3]) || 0;
	            const lower = addend + count;
	            const upper = addend + count * sides;
	            return new Range(lower, upper, count);
	        }
	        else if (results[4] && results[5]) {
	            const min = Number.parseInt(results[4]);
	            const max = Number.parseInt(results[5]);
	            const clumps = Number.parseInt(results[6]);
	            return new Range(min, max, clumps);
	        }
	        else if (results[7] && results[8]) {
	            const base = Number.parseInt(results[7]);
	            const std = Number.parseInt(results[8]);
	            return new Range(base - 2 * std, base + 2 * std, 3);
	        }
	        else if (results[9]) {
	            const v = Number.parseInt(results[9]);
	            return new Range(v, Number.MAX_SAFE_INTEGER, 1);
	        }
	        else if (results[10]) {
	            const v = Number.parseInt(results[10]);
	            return new Range(v, v, 1);
	        }
	    }
	    throw new Error('Not a valid range - ' + config);
	}
	const from$4 = make$c;
	function asFn(config) {
	    const range = make$c(config);
	    return () => range.value();
	}
	function value(base) {
	    const r = make$c(base);
	    return r.value();
	}

	var range = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Range: Range,
		make: make$c,
		from: from$4,
		asFn: asFn,
		value: value
	});

	function make$b(base) {
	    if (!base)
	        return [];
	    if (typeof base === 'string') {
	        base = base.split(/[|,]/g);
	    }
	    return base.map((t) => t.trim()).filter((v) => v && v.length);
	}
	// TACO & !CHICKEN  << A -AND- NOT B
	// FOOD
	// TACO & STEAK << A -AND- B
	// TACO | STEAK << A -OR- B
	// TACO, STEAK  << SPLITS GROUPS - groups are -OR-
	function makeMatch(rules) {
	    if (!rules)
	        return () => true;
	    const fns = [];
	    if (typeof rules === 'string') {
	        const groups = rules.split(',').map((t) => t.trim());
	        groups.forEach((info) => {
	            const ors = info.split(/[|]/).map((t) => t.trim());
	            ors.forEach((orPart) => {
	                const ands = orPart.split(/[&]/).map((t) => t.trim());
	                const andFns = ands.map((v) => {
	                    if (v.startsWith('!')) {
	                        const id = v.substring(1);
	                        return (tags) => !tags.includes(id);
	                    }
	                    return (tags) => tags.includes(v);
	                });
	                fns.push((tags) => andFns.every((f) => f(tags)));
	            });
	        });
	        return (tags) => fns.some((f) => f(tags));
	    }
	    else {
	        if (typeof rules.tags === 'string') {
	            rules.tags = rules.tags.split(/[:,|]/g).map((t) => t.trim());
	        }
	        if (typeof rules.forbidTags === 'string') {
	            rules.forbidTags = rules.forbidTags
	                .split(/[:,|]/g)
	                .map((t) => t.trim());
	        }
	        const needTags = rules.tags;
	        const forbidTags = rules.forbidTags || [];
	        return (tags) => {
	            return (needTags.every((t) => tags.includes(t)) &&
	                !forbidTags.some((t) => tags.includes(t)));
	        };
	    }
	}
	function match(tags, matchRules) {
	    const matchFn = makeMatch(matchRules);
	    return matchFn(tags);
	}

	var tags = /*#__PURE__*/Object.freeze({
		__proto__: null,
		make: make$b,
		makeMatch: makeMatch,
		match: match
	});

	///////////////////////////////////
	// FLAG
	function fl(N) {
	    return 1 << N;
	}
	function toString(flagObj, value) {
	    const inverse = Object.entries(flagObj).reduce((out, entry) => {
	        const [key, value] = entry;
	        if (typeof value === 'number') {
	            if (out[value]) {
	                out[value] += ' | ' + key;
	            }
	            else {
	                out[value] = key;
	            }
	        }
	        return out;
	    }, []);
	    const out = [];
	    for (let index = 0; index < 32; ++index) {
	        const fl = 1 << index;
	        if (value & fl) {
	            out.push(inverse[fl]);
	        }
	    }
	    return out.join(' | ');
	}
	function from$3(obj, ...args) {
	    let result = 0;
	    for (let index = 0; index < args.length; ++index) {
	        let value = args[index];
	        if (value === undefined)
	            continue;
	        if (typeof value == 'number') {
	            result |= value;
	            continue; // next
	        }
	        else if (typeof value === 'string') {
	            value = value
	                .split(/[,|]/)
	                .map((t) => t.trim())
	                .map((u) => {
	                const n = Number.parseInt(u);
	                if (n >= 0)
	                    return n;
	                return u;
	            });
	        }
	        if (Array.isArray(value)) {
	            value.forEach((v) => {
	                if (typeof v == 'string') {
	                    v = v.trim();
	                    const parts = v.split(/[,|]/);
	                    if (parts.length > 1) {
	                        result = from$3(obj, result, parts);
	                    }
	                    else if (v.startsWith('!')) {
	                        // @ts-ignore
	                        const f = obj[v.substring(1)];
	                        result &= ~f;
	                    }
	                    else {
	                        const n = Number.parseInt(v);
	                        if (n >= 0) {
	                            result |= n;
	                            return;
	                        }
	                        // @ts-ignore
	                        const f = obj[v];
	                        if (f) {
	                            result |= f;
	                        }
	                    }
	                }
	                else if (v === 0) {
	                    // to allow clearing flags when extending objects
	                    result = 0;
	                }
	                else {
	                    result |= v;
	                }
	            });
	        }
	    }
	    return result;
	}
	function make$a(obj) {
	    const out = {};
	    if (Array.isArray(obj)) {
	        const arr = obj;
	        const flags = {};
	        let nextIndex = 0;
	        let used = [];
	        arr.forEach((v) => {
	            if (v.includes('=')) {
	                const [name, value] = v.split('=').map((t) => t.trim());
	                const values = value.split('|').map((t) => t.trim());
	                // console.log(`flag: ${v} >> ${name} = ${value} >> ${values}`);
	                let i = 0;
	                for (let n = 0; n < values.length; ++n) {
	                    const p = values[n];
	                    if (flags[p]) {
	                        i |= flags[p];
	                    }
	                    else {
	                        const num = Number.parseInt(p);
	                        if (num) {
	                            i |= num;
	                            for (let x = 0; x < 32; ++x) {
	                                if (i & (1 << x)) {
	                                    used[x] = 1;
	                                }
	                            }
	                        }
	                        else {
	                            throw new Error(`Failed to parse flag = ${v}`);
	                        }
	                    }
	                }
	                flags[name] = i;
	            }
	            else {
	                while (used[nextIndex]) {
	                    ++nextIndex;
	                }
	                if (nextIndex > 31) {
	                    throw new Error('Flag uses too many bits! [Max=32]');
	                }
	                flags[v] = fl(nextIndex);
	                used[nextIndex] = 1;
	            }
	        });
	        return flags;
	    }
	    Object.entries(obj).forEach(([key, value]) => {
	        out[key] = from$3(out, value);
	    });
	    return out;
	}

	var flag = /*#__PURE__*/Object.freeze({
		__proto__: null,
		fl: fl,
		toString: toString,
		from: from$3,
		make: make$a
	});

	class AsyncQueue {
	    constructor() {
	        this._waiting = null;
	        this._data = [];
	    }
	    get length() {
	        return this._data.length;
	    }
	    clear() {
	        this._data.length = 0;
	    }
	    get last() {
	        return this._data[this._data.length - 1];
	    }
	    get first() {
	        return this._data[0];
	    }
	    enqueue(obj) {
	        if (this._waiting) {
	            const fn = this._waiting;
	            this._waiting = null;
	            fn(obj);
	        }
	        else {
	            this._data.push(obj);
	        }
	    }
	    prepend(obj) {
	        if (this._waiting) {
	            this._waiting(obj);
	            this._waiting = null;
	        }
	        else {
	            this._data.unshift(obj);
	        }
	    }
	    dequeue() {
	        const t = this._data.shift();
	        if (t) {
	            return Promise.resolve(t);
	        }
	        if (this._waiting) {
	            throw new Error('Too many requesters.');
	        }
	        const p = new Promise((resolve) => {
	            this._waiting = resolve;
	        });
	        return p;
	    }
	}

	var queue = /*#__PURE__*/Object.freeze({
		__proto__: null,
		AsyncQueue: AsyncQueue
	});

	// function toColorInt(r: number, g: number, b: number, base256: boolean) {
	//     if (base256) {
	//         r = Math.max(0, Math.min(255, Math.round(r * 2.550001)));
	//         g = Math.max(0, Math.min(255, Math.round(g * 2.550001)));
	//         b = Math.max(0, Math.min(255, Math.round(b * 2.550001)));
	//         return (r << 16) + (g << 8) + b;
	//     }
	//     r = Math.max(0, Math.min(15, Math.round((r / 100) * 15)));
	//     g = Math.max(0, Math.min(15, Math.round((g / 100) * 15)));
	//     b = Math.max(0, Math.min(15, Math.round((b / 100) * 15)));
	//     return (r << 8) + (g << 4) + b;
	// }
	const colors = {};
	// All colors are const!!!
	class Color {
	    // values are 0-100 for normal RGBA
	    constructor(r = -1, g = 0, b = 0, a = 100) {
	        this._rand = null;
	        this.dances = false;
	        if (r < 0) {
	            a = 0;
	            r = 0;
	        }
	        this._data = [r, g, b, a];
	    }
	    rgb() {
	        return [this.r, this.g, this.b];
	    }
	    rgba() {
	        return [this.r, this.g, this.b, this.a];
	    }
	    get r() {
	        return Math.round(this._data[0] * 2.550001);
	    }
	    get _r() {
	        return this._data[0];
	    }
	    get _ra() {
	        return Math.round((this._data[0] * this._data[3]) / 100);
	    }
	    get g() {
	        return Math.round(this._data[1] * 2.550001);
	    }
	    get _g() {
	        return this._data[1];
	    }
	    get _ga() {
	        return Math.round((this._data[1] * this._data[3]) / 100);
	    }
	    get b() {
	        return Math.round(this._data[2] * 2.550001);
	    }
	    get _b() {
	        return this._data[2];
	    }
	    get _ba() {
	        return Math.round((this._data[2] * this._data[3]) / 100);
	    }
	    get a() {
	        return this._data[3];
	    }
	    get _a() {
	        return this.a;
	    }
	    rand(all, r = 0, g = 0, b = 0) {
	        this._rand = [all, r, g, b];
	        this.dances = false;
	        return this;
	    }
	    dance(all, r, g, b) {
	        this.rand(all, r, g, b);
	        this.dances = true;
	        return this;
	    }
	    isNull() {
	        return this._data[3] === 0;
	    }
	    alpha(v) {
	        return new Color(this._data[0], this._data[1], this._data[2], clamp(v, 0, 100));
	    }
	    // luminosity (0-100)
	    get l() {
	        return Math.round(0.5 *
	            (Math.min(this._r, this._g, this._b) +
	                Math.max(this._r, this._g, this._b)));
	    }
	    // saturation (0-100)
	    get s() {
	        if (this.l >= 100)
	            return 0;
	        return Math.round(((Math.max(this._r, this._g, this._b) -
	            Math.min(this._r, this._g, this._b)) *
	            (100 - Math.abs(this.l * 2 - 100))) /
	            100);
	    }
	    // hue (0-360)
	    get h() {
	        let H = 0;
	        let R = this.r;
	        let G = this.g;
	        let B = this.b;
	        if (R >= G && G >= B) {
	            H = 60 * ((G - B) / (R - B));
	        }
	        else if (G > R && R >= B) {
	            H = 60 * (2 - (R - B) / (G - B));
	        }
	        else if (G >= B && B > R) {
	            H = 60 * (2 + (B - R) / (G - R));
	        }
	        else if (B > G && G > R) {
	            H = 60 * (4 - (G - R) / (B - R));
	        }
	        else if (B > R && R >= G) {
	            H = 60 * (4 + (R - G) / (B - G));
	        }
	        else {
	            H = 60 * (6 - (B - G) / (R - G));
	        }
	        return Math.round(H) || 0;
	    }
	    equals(other) {
	        if (typeof other === 'string') {
	            if (other.startsWith('#')) {
	                other = from$2(other);
	                return other.equals(this);
	            }
	            if (this.name)
	                return this.name === other;
	        }
	        else if (typeof other === 'number') {
	            return this.toInt() === other;
	        }
	        const O = from$2(other);
	        if (this.isNull())
	            return O.isNull();
	        if (O.isNull())
	            return false;
	        return this.toInt() === O.toInt();
	    }
	    toInt(useRand = true) {
	        if (this.isNull())
	            return 0x0000;
	        let r = this._r;
	        let g = this._g;
	        let b = this._b;
	        let a = this._a;
	        if (useRand && (this._rand || this.dances)) {
	            const rand = cosmetic.number(this._rand[0]);
	            const redRand = cosmetic.number(this._rand[1]);
	            const greenRand = cosmetic.number(this._rand[2]);
	            const blueRand = cosmetic.number(this._rand[3]);
	            r = Math.round(((r + rand + redRand) * a) / 100);
	            g = Math.round(((g + rand + greenRand) * a) / 100);
	            b = Math.round(((b + rand + blueRand) * a) / 100);
	        }
	        r = Math.max(0, Math.min(15, Math.round((r / 100) * 15)));
	        g = Math.max(0, Math.min(15, Math.round((g / 100) * 15)));
	        b = Math.max(0, Math.min(15, Math.round((b / 100) * 15)));
	        a = Math.max(0, Math.min(15, Math.round((a / 100) * 15)));
	        return (r << 12) + (g << 8) + (b << 4) + a;
	    }
	    toLight() {
	        return [this._ra, this._ga, this._ba];
	    }
	    clamp() {
	        if (this.isNull())
	            return this;
	        return make$9(this._data.map((v) => clamp(v, 0, 100)));
	    }
	    blend(other) {
	        const O = from$2(other);
	        if (O.isNull())
	            return this;
	        if (O.a === 100)
	            return O;
	        const pct = O.a / 100;
	        const keepPct = 1 - pct;
	        const newColor = make$9(Math.round(this._data[0] * keepPct + O._data[0] * pct), Math.round(this._data[1] * keepPct + O._data[1] * pct), Math.round(this._data[2] * keepPct + O._data[2] * pct), Math.round(O.a + this._data[3] * keepPct));
	        if (this._rand) {
	            newColor._rand = this._rand.map((v) => Math.round(v * keepPct));
	            newColor.dances = this.dances;
	        }
	        if (O._rand) {
	            if (!newColor._rand) {
	                newColor._rand = [0, 0, 0, 0];
	            }
	            for (let i = 0; i < 4; ++i) {
	                newColor._rand[i] += Math.round(O._rand[i] * pct);
	            }
	            newColor.dances = newColor.dances || O.dances;
	        }
	        return newColor;
	    }
	    mix(other, percent) {
	        const O = from$2(other);
	        if (O.isNull())
	            return this;
	        if (percent >= 100)
	            return O;
	        const pct = clamp(percent, 0, 100) / 100;
	        const keepPct = 1 - pct;
	        const newColor = make$9(Math.round(this._data[0] * keepPct + O._data[0] * pct), Math.round(this._data[1] * keepPct + O._data[1] * pct), Math.round(this._data[2] * keepPct + O._data[2] * pct), (this.isNull() ? 100 : this._data[3]) * keepPct + O._data[3] * pct);
	        if (this._rand) {
	            newColor._rand = this._rand.slice();
	            newColor.dances = this.dances;
	        }
	        if (O._rand) {
	            if (!newColor._rand) {
	                newColor._rand = O._rand.map((v) => Math.round(v * pct));
	            }
	            else {
	                for (let i = 0; i < 4; ++i) {
	                    newColor._rand[i] = Math.round(newColor._rand[i] * keepPct + O._rand[i] * pct);
	                }
	            }
	            newColor.dances = newColor.dances || O.dances;
	        }
	        return newColor;
	    }
	    apply(other) {
	        const O = from$2(other);
	        if (O.isNull())
	            return this;
	        if (O.a >= 100)
	            return O;
	        if (O.a <= 0)
	            return this;
	        const pct = clamp(O.a, 0, 100) / 100;
	        const keepPct = ((1 - pct) * this.a) / 100;
	        const newColor = make$9(Math.round(this._data[0] * keepPct + O._data[0] * pct), Math.round(this._data[1] * keepPct + O._data[1] * pct), Math.round(this._data[2] * keepPct + O._data[2] * pct), Math.round(this._data[3] * keepPct + O._data[3] * pct));
	        if (this._rand) {
	            newColor._rand = this._rand.slice();
	            newColor.dances = this.dances;
	        }
	        if (O._rand) {
	            if (!newColor._rand) {
	                newColor._rand = O._rand.map((v) => Math.round(v * pct));
	            }
	            else {
	                for (let i = 0; i < 4; ++i) {
	                    newColor._rand[i] = Math.round(newColor._rand[i] * keepPct + O._rand[i] * pct);
	                }
	            }
	            newColor.dances = newColor.dances || O.dances;
	        }
	        return newColor;
	    }
	    // Only adjusts r,g,b
	    lighten(percent) {
	        if (this.isNull())
	            return this;
	        if (percent <= 0)
	            return this;
	        const pct = clamp(percent, 0, 100) / 100;
	        const keepPct = 1 - pct;
	        return make$9(Math.round(this._data[0] * keepPct + 100 * pct), Math.round(this._data[1] * keepPct + 100 * pct), Math.round(this._data[2] * keepPct + 100 * pct), this._a);
	    }
	    // Only adjusts r,g,b
	    darken(percent) {
	        if (this.isNull())
	            return this;
	        const pct = clamp(percent, 0, 100) / 100;
	        const keepPct = 1 - pct;
	        return make$9(Math.round(this._data[0] * keepPct + 0 * pct), Math.round(this._data[1] * keepPct + 0 * pct), Math.round(this._data[2] * keepPct + 0 * pct), this._a);
	    }
	    bake(clearDancing = false) {
	        if (this.isNull())
	            return this;
	        if (!this._rand)
	            return this;
	        if (this.dances && !clearDancing)
	            return this;
	        const d = this._rand;
	        const rand = cosmetic.number(d[0]);
	        const redRand = cosmetic.number(d[1]);
	        const greenRand = cosmetic.number(d[2]);
	        const blueRand = cosmetic.number(d[3]);
	        return make$9(this._r + rand + redRand, this._g + rand + greenRand, this._b + rand + blueRand, this._a);
	    }
	    // Adds a color to this one
	    add(other, percent = 100) {
	        const O = from$2(other);
	        if (O.isNull())
	            return this;
	        const alpha = (O.a / 100) * (percent / 100);
	        return make$9(Math.round(this._data[0] + O._data[0] * alpha), Math.round(this._data[1] + O._data[1] * alpha), Math.round(this._data[2] + O._data[2] * alpha), clamp(Math.round(this._a + alpha * 100), 0, 100));
	    }
	    scale(percent) {
	        if (this.isNull() || percent == 100)
	            return this;
	        const pct = Math.max(0, percent) / 100;
	        return make$9(Math.round(this._data[0] * pct), Math.round(this._data[1] * pct), Math.round(this._data[2] * pct), this._a);
	    }
	    multiply(other) {
	        if (this.isNull())
	            return this;
	        let data;
	        if (Array.isArray(other)) {
	            if (other.length < 3)
	                throw new Error('requires at least r,g,b values.');
	            data = other;
	        }
	        else {
	            if (other.isNull())
	                return this;
	            data = other._data;
	        }
	        const pct = (data[3] || 100) / 100;
	        return make$9(Math.round(this._ra * (data[0] / 100) * pct), Math.round(this._ga * (data[1] / 100) * pct), Math.round(this._ba * (data[2] / 100) * pct), 100);
	    }
	    // scales rgb down to a max of 100
	    normalize() {
	        if (this.isNull())
	            return this;
	        const max = Math.max(this._ra, this._ga, this._ba);
	        if (max <= 100)
	            return this;
	        return make$9(Math.round((100 * this._ra) / max), Math.round((100 * this._ga) / max), Math.round((100 * this._ba) / max), 100);
	    }
	    inverse() {
	        const other = new Color(100 - this.r, 100 - this.g, 100 - this.b, this.a);
	        return other;
	    }
	    /**
	     * Returns the css code for the current RGB values of the color.
	     */
	    css(useRand = true) {
	        if (this.a !== 100) {
	            const v = this.toInt(useRand);
	            if (v <= 0)
	                return 'transparent';
	            return '#' + v.toString(16).padStart(4, '0');
	        }
	        const v = this.toInt(useRand);
	        if (v <= 0)
	            return 'transparent';
	        return '#' + v.toString(16).padStart(4, '0').substring(0, 3);
	    }
	    toString() {
	        if (this.name)
	            return this.name;
	        if (this.isNull())
	            return 'null color';
	        return this.css();
	    }
	}
	function fromArray(vals, base256 = false) {
	    while (vals.length < 3)
	        vals.push(0);
	    if (base256) {
	        for (let i = 0; i < 3; ++i) {
	            vals[i] = Math.round(((vals[i] || 0) * 100) / 255);
	        }
	    }
	    return new Color(...vals);
	}
	function fromCss(css) {
	    if (!css.startsWith('#')) {
	        throw new Error('Color CSS strings must be of form "#abc" or "#abcdef" - received: [' +
	            css +
	            ']');
	    }
	    const c = Number.parseInt(css.substring(1), 16);
	    let r, g, b;
	    let a = 100;
	    if (css.length == 4) {
	        r = Math.round(((c >> 8) / 15) * 100);
	        g = Math.round((((c & 0xf0) >> 4) / 15) * 100);
	        b = Math.round(((c & 0xf) / 15) * 100);
	    }
	    else if (css.length == 5) {
	        r = Math.round(((c >> 12) / 15) * 100);
	        g = Math.round((((c & 0xf00) >> 8) / 15) * 100);
	        b = Math.round((((c & 0xf0) >> 4) / 15) * 100);
	        a = Math.round(((c & 0xf) / 15) * 100);
	    }
	    else if (css.length === 7) {
	        r = Math.round(((c >> 16) / 255) * 100);
	        g = Math.round((((c & 0xff00) >> 8) / 255) * 100);
	        b = Math.round(((c & 0xff) / 255) * 100);
	    }
	    else if (css.length === 9) {
	        r = Math.round(((c >> 24) / 255) * 100);
	        g = Math.round((((c & 0xff0000) >> 16) / 255) * 100);
	        b = Math.round((((c & 0xff00) >> 8) / 255) * 100);
	        a = Math.round(((c & 0xff) / 255) * 100);
	    }
	    return new Color(r, g, b, a);
	}
	function fromName(name) {
	    const c = colors[name];
	    if (!c) {
	        throw new Error('Unknown color name: ' + name);
	    }
	    return c;
	}
	function fromNumber(val, base256 = false) {
	    if (val < 0) {
	        return new Color();
	    }
	    else if (base256 || val > 0xfff) {
	        return new Color(Math.round((((val & 0xff0000) >> 16) * 100) / 255), Math.round((((val & 0xff00) >> 8) * 100) / 255), Math.round(((val & 0xff) * 100) / 255), 100);
	    }
	    else {
	        return new Color(Math.round((((val & 0xf00) >> 8) * 100) / 15), Math.round((((val & 0xf0) >> 4) * 100) / 15), Math.round(((val & 0xf) * 100) / 15), 100);
	    }
	}
	function make$9(...args) {
	    let arg = args[0];
	    let base256 = args[1];
	    if (args.length == 0)
	        return new Color();
	    if (args.length > 2) {
	        arg = args;
	        base256 = false; // TODO - Change this!!!
	    }
	    if (arg === undefined || arg === null)
	        return new Color();
	    if (arg instanceof Color) {
	        return arg;
	    }
	    if (typeof arg === 'string') {
	        if (arg.startsWith('#')) {
	            return fromCss(arg);
	        }
	        return fromName(arg);
	    }
	    else if (Array.isArray(arg)) {
	        return fromArray(arg, base256);
	    }
	    else if (typeof arg === 'number') {
	        return fromNumber(arg, base256);
	    }
	    throw new Error('Failed to make color - unknown argument: ' + JSON.stringify(arg));
	}
	function from$2(...args) {
	    const arg = args[0];
	    if (arg instanceof Color)
	        return arg;
	    if (arg === undefined)
	        return NONE;
	    if (arg === null)
	        return NONE;
	    if (typeof arg === 'string') {
	        if (!arg.startsWith('#')) {
	            return fromName(arg);
	        }
	    }
	    else if (arg === -1) {
	        return NONE;
	    }
	    return make$9(arg, args[1]);
	}
	// adjusts the luminosity of 2 colors to ensure there is enough separation between them
	function separate(a, b) {
	    if (a.isNull() || b.isNull())
	        return [a, b];
	    const A = a.clamp();
	    const B = b.clamp();
	    // console.log('separate');
	    // console.log('- a=%s, h=%d, s=%d, l=%d', A.toString(), A.h, A.s, A.l);
	    // console.log('- b=%s, h=%d, s=%d, l=%d', B.toString(), B.h, B.s, B.l);
	    let hDiff = Math.abs(A.h - B.h);
	    if (hDiff > 180) {
	        hDiff = 360 - hDiff;
	    }
	    if (hDiff > 45)
	        return [A, B]; // colors are far enough apart in hue to be distinct
	    const dist = 40;
	    if (Math.abs(A.l - B.l) >= dist)
	        return [A, B];
	    // Get them sorted by saturation ( we will darken the more saturated color and lighten the other)
	    const out = [A, B];
	    const lo = A.s <= B.s ? 0 : 1;
	    const hi = 1 - lo;
	    // console.log('- lo=%s, hi=%s', lo.toString(), hi.toString());
	    while (out[hi].l - out[lo].l < dist) {
	        out[hi] = out[hi].mix(WHITE, 5);
	        out[lo] = out[lo].mix(BLACK, 5);
	    }
	    // console.log('=>', a.toString(), b.toString());
	    return out;
	}
	function relativeLuminance(a, b) {
	    return Math.round((100 *
	        ((a.r - b.r) * (a.r - b.r) * 0.2126 +
	            (a.g - b.g) * (a.g - b.g) * 0.7152 +
	            (a.b - b.b) * (a.b - b.b) * 0.0722)) /
	        65025);
	}
	function distance(a, b) {
	    return Math.round((100 *
	        ((a.r - b.r) * (a.r - b.r) * 0.3333 +
	            (a.g - b.g) * (a.g - b.g) * 0.3333 +
	            (a.b - b.b) * (a.b - b.b) * 0.3333)) /
	        65025);
	}
	// Draws the smooth gradient that appears on a button when you hover over or depress it.
	// Returns the percentage by which the current tile should be averaged toward a hilite color.
	function smoothScalar(rgb, maxRgb = 255) {
	    return Math.floor(100 * Math.sin((Math.PI * rgb) / maxRgb));
	}
	function install$2(name, ...args) {
	    let info = args;
	    if (args.length == 1) {
	        info = args[0];
	    }
	    const c = info instanceof Color ? info : make$9(info);
	    // @ts-ignore
	    c._const = true;
	    colors[name] = c;
	    c.name = name;
	    return c;
	}
	function installSpread(name, ...args) {
	    let c;
	    if (args.length == 1) {
	        c = install$2(name, args[0]);
	    }
	    else {
	        c = install$2(name, ...args);
	    }
	    install$2('light_' + name, c.lighten(25));
	    install$2('lighter_' + name, c.lighten(50));
	    install$2('lightest_' + name, c.lighten(75));
	    install$2('dark_' + name, c.darken(25));
	    install$2('darker_' + name, c.darken(50));
	    install$2('darkest_' + name, c.darken(75));
	    return c;
	}
	const NONE = install$2('NONE', -1);
	const BLACK = install$2('black', 0x000);
	const WHITE = install$2('white', 0xfff);
	installSpread('teal', [30, 100, 100]);
	installSpread('brown', [60, 40, 0]);
	installSpread('tan', [80, 70, 55]); // 80, 67,		15);
	installSpread('pink', [100, 60, 66]);
	installSpread('gray', [50, 50, 50]);
	installSpread('yellow', [100, 100, 0]);
	installSpread('purple', [100, 0, 100]);
	installSpread('green', [0, 100, 0]);
	installSpread('orange', [100, 50, 0]);
	installSpread('blue', [0, 0, 100]);
	installSpread('red', [100, 0, 0]);
	installSpread('amber', [100, 75, 0]);
	installSpread('flame', [100, 25, 0]);
	installSpread('fuchsia', [100, 0, 100]);
	installSpread('magenta', [100, 0, 75]);
	installSpread('crimson', [100, 0, 25]);
	installSpread('lime', [75, 100, 0]);
	installSpread('chartreuse', [50, 100, 0]);
	installSpread('sepia', [50, 40, 25]);
	installSpread('violet', [50, 0, 100]);
	installSpread('han', [25, 0, 100]);
	installSpread('cyan', [0, 100, 100]);
	installSpread('turquoise', [0, 100, 75]);
	installSpread('sea', [0, 100, 50]);
	installSpread('sky', [0, 75, 100]);
	installSpread('azure', [0, 50, 100]);
	installSpread('silver', [75, 75, 75]);
	installSpread('gold', [100, 85, 0]);

	var index$9 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		colors: colors,
		Color: Color,
		fromArray: fromArray,
		fromCss: fromCss,
		fromName: fromName,
		fromNumber: fromNumber,
		make: make$9,
		from: from$2,
		separate: separate,
		relativeLuminance: relativeLuminance,
		distance: distance,
		smoothScalar: smoothScalar,
		install: install$2,
		installSpread: installSpread,
		NONE: NONE,
		BLACK: BLACK,
		WHITE: WHITE
	});

	class Mixer {
	    constructor(base = {}) {
	        this.ch = first(base.ch, null);
	        this.fg = make$9(base.fg);
	        this.bg = make$9(base.bg);
	    }
	    _changed() {
	        return this;
	    }
	    copy(other) {
	        this.ch = other.ch || null;
	        this.fg = from$2(other.fg);
	        this.bg = from$2(other.bg);
	        return this._changed();
	    }
	    fill(ch, fg, bg) {
	        if (ch !== null)
	            this.ch = ch;
	        if (fg !== null)
	            this.fg = from$2(fg);
	        if (bg !== null)
	            this.bg = from$2(bg);
	        return this._changed();
	    }
	    clone() {
	        const other = new Mixer();
	        other.copy(this);
	        return other;
	    }
	    equals(other) {
	        return (this.ch == other.ch &&
	            this.fg.equals(other.fg) &&
	            this.bg.equals(other.bg));
	    }
	    get dances() {
	        return this.fg.dances || this.bg.dances;
	    }
	    nullify() {
	        this.ch = null;
	        this.fg = NONE;
	        this.bg = NONE;
	        return this._changed();
	    }
	    blackOut() {
	        this.ch = null;
	        this.fg = BLACK;
	        this.bg = BLACK;
	        return this._changed();
	    }
	    draw(ch = null, fg = null, bg = null) {
	        if (ch !== null) {
	            this.ch = ch;
	        }
	        if (fg !== null) {
	            fg = from$2(fg);
	            this.fg = this.fg.blend(fg);
	        }
	        if (bg !== null) {
	            bg = from$2(bg);
	            this.bg = this.bg.blend(bg);
	        }
	        return this._changed();
	    }
	    drawSprite(src) {
	        if (src === this)
	            return this;
	        // @ts-ignore
	        // if (opacity === undefined) opacity = src.opacity;
	        // if (opacity === undefined) opacity = 100;
	        // if (opacity <= 0) return;
	        if (src.fg && src.fg !== -1) {
	            const fg = from$2(src.fg);
	            if (src.ch && fg.a) {
	                this.ch = src.ch;
	            }
	            this.fg = this.fg.apply(fg);
	        }
	        if (src.bg && src.bg !== -1) {
	            this.bg = this.bg.apply(src.bg);
	        }
	        return this._changed();
	    }
	    invert() {
	        this.bg = this.bg.inverse();
	        this.fg = this.fg.inverse();
	        return this._changed();
	    }
	    swap() {
	        [this.bg, this.fg] = [this.fg, this.bg];
	        return this._changed();
	    }
	    multiply(color, fg = true, bg = true) {
	        color = from$2(color);
	        if (fg) {
	            this.fg = this.fg.multiply(color);
	        }
	        if (bg) {
	            this.bg = this.bg.multiply(color);
	        }
	        return this._changed();
	    }
	    scale(multiplier, fg = true, bg = true) {
	        if (fg)
	            this.fg = this.fg.scale(multiplier);
	        if (bg)
	            this.bg = this.bg.scale(multiplier);
	        return this._changed();
	    }
	    mix(color, fg = 50, bg = fg) {
	        color = from$2(color);
	        if (fg > 0) {
	            this.fg = this.fg.mix(color, fg);
	        }
	        if (bg > 0) {
	            this.bg = this.bg.mix(color, bg);
	        }
	        return this._changed();
	    }
	    add(color, fg = 100, bg = fg) {
	        color = from$2(color);
	        if (fg > 0) {
	            this.fg = this.fg.add(color, fg);
	        }
	        if (bg > 0) {
	            this.bg = this.bg.add(color, bg);
	        }
	        return this._changed();
	    }
	    separate() {
	        [this.fg, this.bg] = separate(this.fg, this.bg);
	        return this._changed();
	    }
	    bake(clearDancing = false) {
	        this.fg = this.fg.bake(clearDancing);
	        this.bg = this.bg.bake(clearDancing);
	        return this._changed();
	    }
	    toString() {
	        // prettier-ignore
	        return `{ ch: ${this.ch}, fg: ${this.fg.toString()}, bg: ${this.bg.toString()} }`;
	    }
	}
	function makeMixer(base) {
	    return new Mixer(base);
	}

	var options = {
	    colorStart: '#{',
	    colorEnd: '}',
	    field: '{{',
	    fieldEnd: '}}',
	    defaultFg: null,
	    defaultBg: null,
	};
	var helpers = {
	    default: (name, view, args) => {
	        if (args.length === 0)
	            return name;
	        if (args.length === 1) {
	            return '' + getValue(view, args[0]);
	        }
	        return args.map((a) => getValue(view, a)).join(' ');
	    },
	    debug: (name, _view, args) => {
	        if (args.length) {
	            return `{{${name} ${args.join(' ')}}}`;
	        }
	        return `{{${name}}}`;
	    },
	};
	function addHelper(name, fn) {
	    helpers[name] = fn;
	}

	function length(text) {
	    if (!text || text.length == 0)
	        return 0;
	    let len = 0;
	    let inside = false;
	    let inline = false;
	    for (let index = 0; index < text.length; ++index) {
	        const ch = text.charAt(index);
	        if (inline) {
	            if (ch === '}') {
	                inline = false;
	                inside = false;
	            }
	            else {
	                len += 1;
	            }
	        }
	        else if (inside) {
	            if (ch === ' ') {
	                inline = true;
	            }
	            else if (ch === '}') {
	                inside = false;
	            }
	        }
	        else if (ch === '#') {
	            if (text.charAt(index + 1) === '{') {
	                inside = true;
	                index += 1;
	            }
	            else {
	                len += 1;
	            }
	        }
	        else if (ch === '\\') {
	            if (text.charAt(index + 1) === '#') {
	                index += 1; // skip next char
	            }
	            len += 1;
	        }
	        else {
	            len += 1;
	        }
	    }
	    return len;
	}
	// let inColor = false;
	function advanceChars(text, start, count) {
	    let len = 0;
	    let inside = false;
	    let inline = false;
	    let index = start || 0;
	    while (len < count) {
	        const ch = text.charAt(index);
	        if (inline) {
	            if (ch === '}') {
	                inline = false;
	                inside = false;
	            }
	            else {
	                len += 1;
	            }
	        }
	        else if (inside) {
	            if (ch === ' ') {
	                inline = true;
	            }
	            else if (ch === '}') {
	                inside = false;
	            }
	        }
	        else if (ch === '#') {
	            if (text.charAt(index + 1) === '{') {
	                inside = true;
	                index += 1;
	            }
	            else {
	                len += 1;
	            }
	        }
	        else if (ch === '\\') {
	            if (text.charAt(index + 1) === '#') {
	                index += 1; // skip next char
	            }
	            len += 1;
	        }
	        else {
	            len += 1;
	        }
	        ++index;
	    }
	    return index;
	}
	function findChar(text, matchFn, start = 0) {
	    let inside = false;
	    let inline = false;
	    let index = start;
	    while (index < text.length) {
	        let ch = text.charAt(index);
	        if (inline) {
	            if (ch === '}') {
	                inline = false;
	                inside = false;
	            }
	            else {
	                if (matchFn(ch, index))
	                    return index;
	            }
	        }
	        else if (inside) {
	            if (ch === ' ') {
	                inline = true;
	            }
	            else if (ch === '}') {
	                inside = false;
	            }
	        }
	        else if (ch === '#') {
	            if (text.charAt(index + 1) === '{') {
	                inside = true;
	                index += 1;
	            }
	            else {
	                if (matchFn(ch, index))
	                    return index;
	            }
	        }
	        else if (ch === '\\') {
	            if (text.charAt(index + 1) === '#') {
	                index += 1; // skip next char
	                ch = text.charAt(index);
	            }
	            if (matchFn(ch, index))
	                return index;
	        }
	        else {
	            if (matchFn(ch, index))
	                return index;
	        }
	        ++index;
	    }
	    return -1;
	}
	function firstChar(text) {
	    const index = findChar(text, TRUE);
	    if (index < 0)
	        return '';
	    return text.charAt(index);
	}
	function startsWith(text, match) {
	    if (typeof match === 'string') {
	        if (match.length === 1) {
	            return firstChar(text) === match;
	        }
	    }
	    const noColors = removeColors(text);
	    if (typeof match === 'string') {
	        return noColors.startsWith(match);
	    }
	    return match.exec(noColors) !== null;
	}
	function padStart(text, width, pad = ' ') {
	    const len = length(text);
	    if (len >= width)
	        return text;
	    const colorLen = text.length - len;
	    return text.padStart(width + colorLen, pad);
	}
	function padEnd(text, width, pad = ' ') {
	    const len = length(text);
	    if (len >= width)
	        return text;
	    const colorLen = text.length - len;
	    return text.padEnd(width + colorLen, pad);
	}
	function center(text, width, pad = ' ') {
	    const rawLen = text.length;
	    const len = length(text);
	    const padLen = width - len;
	    if (padLen <= 0)
	        return text;
	    const left = Math.floor(padLen / 2);
	    return text.padStart(rawLen + left, pad).padEnd(rawLen + padLen, pad);
	}
	function truncate(text, width) {
	    let len = 0;
	    let inside = false;
	    let inline = false;
	    let index = 0;
	    let colorCount = 0;
	    while (len < width) {
	        const ch = text.charAt(index);
	        if (inline) {
	            if (ch === '}') {
	                inline = false;
	                inside = false;
	                colorCount -= 1;
	            }
	            else {
	                len += 1;
	            }
	        }
	        else if (inside) {
	            if (ch === ' ') {
	                inline = true;
	            }
	            else if (ch === '}') {
	                inside = false;
	            }
	        }
	        else if (ch === '#') {
	            if (text.charAt(index + 1) === '{') {
	                if (text.charAt(index + 2) === '}') {
	                    index += 2;
	                    colorCount = 0;
	                }
	                else {
	                    inside = true;
	                    index += 1;
	                    colorCount += 1;
	                }
	            }
	            else {
	                len += 1;
	            }
	        }
	        else if (ch === '\\') {
	            if (text.charAt(index + 1) === '#') {
	                index += 1; // skip next char
	            }
	            len += 1;
	        }
	        else {
	            len += 1;
	        }
	        ++index;
	    }
	    if (inline) {
	        return text.substring(0, index) + '}' + (colorCount > 1 ? '#{}' : '');
	    }
	    return text.substring(0, index) + (colorCount ? '#{}' : '');
	}
	function capitalize(text) {
	    // TODO - better test for first letter
	    const i = findChar(text, (ch) => ch !== ' ');
	    if (i < 0)
	        return text;
	    const ch = text.charAt(i);
	    return text.substring(0, i) + ch.toUpperCase() + text.substring(i + 1);
	}
	function removeColors(text) {
	    let out = '';
	    let inside = false;
	    let inline = false;
	    let index = 0;
	    while (index < text.length) {
	        let ch = text.charAt(index);
	        if (inline) {
	            if (ch === '}') {
	                inline = false;
	                inside = false;
	            }
	            else {
	                out += ch;
	            }
	        }
	        else if (inside) {
	            if (ch === ' ') {
	                inline = true;
	            }
	            else if (ch === '}') {
	                inside = false;
	            }
	        }
	        else if (ch === '#') {
	            if (text.charAt(index + 1) === '{') {
	                inside = true;
	                index += 1;
	            }
	            else {
	                out += ch;
	            }
	        }
	        else if (ch === '\\') {
	            if (text.charAt(index + 1) === '#') {
	                out += ch;
	                index += 1; // skip next char
	                ch = text.charAt(index);
	            }
	            out += ch;
	        }
	        else {
	            out += ch;
	        }
	        ++index;
	    }
	    return out;
	}
	function spliceRaw(msg, begin, deleteLength, add = '') {
	    const maxLen = msg.length;
	    if (begin >= maxLen)
	        return msg;
	    const preText = msg.substring(0, begin);
	    if (begin + deleteLength >= maxLen) {
	        return preText;
	    }
	    const postText = msg.substring(begin + deleteLength);
	    return preText + add + postText;
	}
	// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
	function hash(str) {
	    let hash = 0;
	    const len = str.length;
	    for (let i = 0; i < len; i++) {
	        hash = (hash << 5) - hash + str.charCodeAt(i);
	        hash |= 0; // Convert to 32bit integer
	    }
	    return hash;
	}
	function splitArgs(text) {
	    const output = [];
	    let index = 0;
	    let start = 0;
	    let insideQuote = false;
	    let insideSingle = false;
	    while (index < text.length) {
	        const ch = text.charAt(index);
	        if (insideQuote) {
	            if (ch === '"') {
	                output.push(text.substring(start, index));
	                start = index + 1;
	                insideSingle = false;
	                insideQuote = false;
	            }
	        }
	        else if (insideSingle) {
	            if (ch === "'") {
	                output.push(text.substring(start, index));
	                start = index + 1;
	                insideSingle = false;
	                insideQuote = false;
	            }
	        }
	        else if (ch === ' ') {
	            if (start !== index) {
	                output.push(text.substring(start, index));
	            }
	            start = index + 1;
	        }
	        else if (ch === '"') {
	            start = index + 1;
	            insideQuote = true;
	        }
	        else if (ch === "'") {
	            start = index + 1;
	            insideSingle = true;
	        }
	        ++index;
	    }
	    if (start === 0) {
	        output.push(text);
	    }
	    else if (start < index) {
	        output.push(text.substring(start));
	    }
	    return output;
	}

	function fieldSplit(template, _opts = {}) {
	    // const FS = opts.field || Config.options.field;
	    // const FE = opts.fieldEnd || Config.options.fieldEnd;
	    const output = [];
	    let inside = false;
	    let start = 0;
	    let hasEscape = false;
	    let index = 0;
	    while (index < template.length) {
	        const ch = template.charAt(index);
	        if (inside) {
	            if (ch === '}') {
	                if (template.charAt(index + 1) !== '}') {
	                    throw new Error('Templates cannot contain }');
	                }
	                const snipet = template.slice(start, index);
	                output.push(snipet);
	                ++index;
	                inside = false;
	                start = index + 1;
	            }
	        }
	        else {
	            if (ch === '\\') {
	                if (template.charAt(index + 1) === '{') {
	                    ++index;
	                    hasEscape = true;
	                }
	            }
	            else if (ch === '{') {
	                if (template.charAt(index + 1) === '{') {
	                    while (template.charAt(index + 1) === '{') {
	                        ++index;
	                    }
	                    inside = true;
	                    let snipet = template.slice(start, index - 1);
	                    if (hasEscape) {
	                        snipet = snipet.replace(/\\\{/g, '{');
	                    }
	                    output.push(snipet);
	                    start = index + 1;
	                    hasEscape = false;
	                }
	            }
	        }
	        ++index;
	    }
	    if (start !== template.length) {
	        let snipet = template.slice(start);
	        if (hasEscape) {
	            snipet = snipet.replace(/\\\{/g, '{');
	        }
	        output.push(snipet);
	    }
	    return output;
	}
	function compile$1(template, opts = {}) {
	    const F = opts.field || options.field;
	    const parts = fieldSplit(template);
	    const sections = parts.map((part, i) => {
	        if (i % 2 == 0)
	            return textSegment(part);
	        if (part.length == 0)
	            return textSegment(F);
	        return makeVariable(part, opts);
	    });
	    return function (view = {}) {
	        if (typeof view === 'string') {
	            view = { value: view };
	        }
	        return sections.map((f) => f(view)).join('');
	    };
	}
	function apply(template, view = {}) {
	    const fn = compile$1(template);
	    const result = fn(view);
	    return result;
	}
	function textSegment(value) {
	    return () => value;
	}
	// export function baseValue(name: string, debug = false): FieldFn {
	//     return function (view: Config.View) {
	//         let h = Config.helpers[name];
	//         if (h) {
	//             return h(name, view);
	//         }
	//         const v = view[name];
	//         if (v !== undefined) return v;
	//         h = debug ? Config.helpers.debug : Config.helpers.default;
	//         return h(name, view);
	//     };
	// }
	// export function fieldValue(
	//     name: string,
	//     source: FieldFn,
	//     debug = false
	// ): FieldFn {
	//     const helper = debug ? Config.helpers.debug : Config.helpers.default;
	//     return function (view: Config.View) {
	//         const obj = source(view);
	//         if (!obj) return helper(name, view, obj);
	//         const value = obj[name];
	//         if (value === undefined) return helper(name, view, obj);
	//         return value;
	//     };
	// }
	// export function helperValue(
	//     name: string,
	//     source: FieldFn,
	//     debug = false
	// ): FieldFn {
	//     const helper =
	//         Config.helpers[name] ||
	//         (debug ? Config.helpers.debug : Config.helpers.default);
	//     return function (view: Config.View) {
	//         const base = source(view);
	//         return helper(name, view, base);
	//     };
	// }
	function stringFormat(format, source) {
	    const data = /%(-?\d*)s/.exec(format) || [];
	    const length = Number.parseInt(data[1] || '0');
	    return function (view) {
	        let text = '' + source(view);
	        if (length < 0) {
	            text = text.padEnd(-length);
	        }
	        else if (length) {
	            text = text.padStart(length);
	        }
	        return text;
	    };
	}
	function intFormat(format, source) {
	    const data = /%([\+-]*)(\d*)d/.exec(format) || ['', '', '0'];
	    let length = Number.parseInt(data[2] || '0');
	    const wantSign = data[1].includes('+');
	    const left = data[1].includes('-');
	    return function (view) {
	        const value = Number.parseInt(source(view) || '0');
	        let text = '' + value;
	        if (value > 0 && wantSign) {
	            text = '+' + text;
	        }
	        if (length && left) {
	            return text.padEnd(length);
	        }
	        else if (length) {
	            return text.padStart(length);
	        }
	        return text;
	    };
	}
	function floatFormat(format, source) {
	    const data = /%([\+-]*)(\d*)(\.(\d+))?f/.exec(format) || ['', '', '0'];
	    let length = Number.parseInt(data[2] || '0');
	    const wantSign = data[1].includes('+');
	    const left = data[1].includes('-');
	    const fixed = Number.parseInt(data[4]) || 0;
	    return function (view) {
	        const value = Number.parseFloat(source(view) || '0');
	        let text;
	        if (fixed) {
	            text = value.toFixed(fixed);
	        }
	        else {
	            text = '' + value;
	        }
	        if (value > 0 && wantSign) {
	            text = '+' + text;
	        }
	        if (length && left) {
	            return text.padEnd(length);
	        }
	        else if (length) {
	            return text.padStart(length);
	        }
	        return text;
	    };
	}
	function makeVariable(pattern, _opts = {}) {
	    let format = '';
	    const formatStart = pattern.indexOf('%');
	    if (formatStart > 0) {
	        format = pattern.substring(formatStart);
	        pattern = pattern.substring(0, formatStart);
	    }
	    const parts = splitArgs(pattern);
	    let name = 'default';
	    if (parts[0] in helpers) {
	        name = parts[0];
	        parts.shift();
	    }
	    const helper = helpers[name];
	    function base(view) {
	        return helper.call(this, name, view, parts);
	    }
	    const valueFn = base.bind({ get: getValue });
	    if (format.length) {
	        if (format.endsWith('d')) {
	            return intFormat(format, valueFn);
	        }
	        else if (format.endsWith('f')) {
	            return floatFormat(format, valueFn);
	        }
	        else {
	            return stringFormat(format, valueFn);
	        }
	    }
	    return valueFn || (() => '!!!');
	    // const data =
	    //     /((\w+) )?(\w+)(\.(\w+))?(%[\+\.\-\d]*[dsf])?/.exec(pattern) || [];
	    // const helper = data[2];
	    // const base = data[3];
	    // const field = data[5];
	    // const format = data[6];
	    // let result = baseValue(base, opts.debug);
	    // if (field && field.length) {
	    //     result = fieldValue(field, result, opts.debug);
	    // }
	    // if (helper && helper.length) {
	    //     result = helperValue(helper, result, opts.debug);
	    // }
	    // if (format && format.length) {
	    //     if (format.endsWith('s')) {
	    //         result = stringFormat(format, result);
	    //     } else if (format.endsWith('d')) {
	    //         result = intFormat(format, result);
	    //     } else {
	    //         result = floatFormat(format, result);
	    //     }
	    // }
	    // return result;
	}

	function eachChar(text, fn, opts = {}) {
	    if (text === null || text === undefined)
	        return;
	    if (!fn)
	        return;
	    text = '' + text; // force string
	    if (!text.length)
	        return;
	    const colorFn = opts.eachColor || NOOP;
	    const fg = opts.fg || options.defaultFg;
	    const bg = opts.bg || options.defaultBg;
	    const ctx = {
	        fg,
	        bg,
	    };
	    colorFn(ctx);
	    const priorCtx = Object.assign({}, ctx);
	    let len = 0;
	    let inside = false;
	    let inline = false;
	    let index = 0;
	    let colorText = '';
	    while (index < text.length) {
	        const ch = text.charAt(index);
	        if (inline) {
	            if (ch === '}') {
	                inline = false;
	                inside = false;
	                Object.assign(ctx, priorCtx);
	                colorFn(ctx);
	            }
	            else {
	                fn(ch, ctx.fg, ctx.bg, len, index);
	                ++len;
	            }
	        }
	        else if (inside) {
	            if (ch === ' ') {
	                inline = true;
	                Object.assign(priorCtx, ctx);
	                const colors = colorText.split(':');
	                if (colors[0].length) {
	                    ctx.fg = colors[0];
	                }
	                if (colors[1]) {
	                    ctx.bg = colors[1];
	                }
	                colorFn(ctx);
	                colorText = '';
	            }
	            else if (ch === '}') {
	                inside = false;
	                const colors = colorText.split(':');
	                if (colors[0].length) {
	                    ctx.fg = colors[0];
	                }
	                if (colors[1]) {
	                    ctx.bg = colors[1];
	                }
	                colorFn(ctx);
	                colorText = '';
	            }
	            else {
	                colorText += ch;
	            }
	        }
	        else if (ch === '#') {
	            if (text.charAt(index + 1) === '{') {
	                if (text.charAt(index + 2) === '}') {
	                    index += 2;
	                    ctx.fg = fg;
	                    ctx.bg = bg;
	                    colorFn(ctx);
	                }
	                else {
	                    inside = true;
	                    index += 1;
	                }
	            }
	            else {
	                fn(ch, ctx.fg, ctx.bg, len, index);
	                ++len;
	            }
	        }
	        else if (ch === '\\') {
	            index += 1; // skip next char
	            const ch = text.charAt(index);
	            fn(ch, ctx.fg, ctx.bg, len, index);
	            ++len;
	        }
	        else {
	            fn(ch, ctx.fg, ctx.bg, len, index);
	            ++len;
	        }
	        ++index;
	    }
	    if (inline) {
	        console.warn('Ended text without ending inline color!');
	    }
	}
	function eachWord(text, fn, opts = {}) {
	    let currentWord = '';
	    let fg = '';
	    let bg = '';
	    let prefix = '';
	    eachChar(text, (ch, fg0, bg0) => {
	        if (fg0 !== fg || bg0 !== bg) {
	            if (currentWord.length) {
	                fn(currentWord, fg, bg, prefix);
	                currentWord = '';
	                prefix = '';
	            }
	            fg = fg0;
	            bg = bg0;
	        }
	        if (ch === ' ') {
	            if (currentWord.length) {
	                fn(currentWord, fg, bg, prefix);
	                currentWord = '';
	                prefix = '';
	            }
	            prefix += ' ';
	        }
	        else if (ch === '\n') {
	            if (currentWord.length) {
	                fn(currentWord, fg, bg, prefix);
	                currentWord = '';
	                prefix = '';
	            }
	            fn('\n', fg, bg, prefix);
	            prefix = '';
	        }
	        else if (ch === '-') {
	            currentWord += ch;
	            if (currentWord.length > 3) {
	                fn(currentWord, fg, bg, prefix);
	                currentWord = '';
	                prefix = '';
	            }
	        }
	        else {
	            currentWord += ch;
	        }
	    }, opts);
	    if (currentWord) {
	        fn(currentWord, fg, bg, prefix);
	    }
	}

	// import { Color } from '../color';
	function wordWrap(text, lineWidth, opts = {}) {
	    // let inside = false;
	    // let inline = false;
	    if (lineWidth < 5)
	        return text;
	    // hyphenate is the wordlen needed to hyphenate
	    // smaller words are not hyphenated
	    let hyphenLen = lineWidth;
	    if (opts.hyphenate) {
	        if (opts.hyphenate === true) {
	            opts.hyphenate = Math.floor(lineWidth / 2);
	        }
	        hyphenLen = clamp(opts.hyphenate, 6, lineWidth + 1);
	    }
	    opts.indent = opts.indent || 0;
	    const indent = ' '.repeat(opts.indent);
	    let output = '';
	    let lastFg = null;
	    let lastBg = null;
	    let lineLeft = lineWidth;
	    lineWidth -= opts.indent;
	    eachWord(text, (word, fg, bg, prefix) => {
	        let totalLen = prefix.length + word.length;
	        // console.log('word', word, lineLen, newLen);
	        if (totalLen > lineLeft && word.length > hyphenLen) {
	            const parts = splitWord(word, lineWidth, lineLeft - prefix.length);
	            if (parts[0].length === 0) {
	                // line doesn't have enough space left, end it
	                output += '\n';
	                if (fg || bg) {
	                    output += `#{${fg ? fg : ''}${bg ? ':' + bg : ''}}`;
	                }
	                lineLeft = lineWidth;
	                parts.shift();
	            }
	            else {
	                output += prefix;
	                lineLeft -= prefix.length;
	            }
	            while (parts.length > 1) {
	                output += parts.shift() + '-\n';
	                if (fg || bg) {
	                    output += `#{${fg ? fg : ''}${bg ? ':' + bg : ''}}`;
	                }
	                output += indent;
	            }
	            output += parts[0];
	            lineLeft = lineWidth - parts[0].length - indent.length;
	            return;
	        }
	        if (word === '\n' || totalLen > lineLeft) {
	            output += '\n';
	            // if (fg || bg || lastFg !== fg || lastBg !== bg) {
	            //     output += `#{${fg ? fg : ''}${bg ? ':' + bg : ''}}`;
	            // }
	            // lastFg = fg;
	            // lastBg = bg;
	            if (fg || bg) {
	                lastFg = 'INVALID';
	                lastBg = 'INVALID';
	            }
	            lineLeft = lineWidth;
	            output += indent;
	            lineLeft -= indent.length;
	            if (word === '\n')
	                return;
	            // lineLeft -= word.length;
	            prefix = '';
	        }
	        if (prefix.length) {
	            output += prefix;
	            lineLeft -= prefix.length;
	        }
	        if (fg !== lastFg || bg !== lastBg) {
	            lastFg = fg;
	            lastBg = bg;
	            output += `#{${fg ? fg : ''}${bg ? ':' + bg : ''}}`;
	        }
	        lineLeft -= word.length;
	        output += word;
	    });
	    return output;
	}
	function splitWord(word, lineWidth, firstWidth) {
	    let index = 0;
	    let output = [];
	    let spaceLeftOnLine = firstWidth || lineWidth;
	    while (index < word.length) {
	        const wordWidth = word.length - index;
	        // do not need to hyphenate
	        if (spaceLeftOnLine >= wordWidth) {
	            output.push(word.substring(index));
	            return output;
	        }
	        // not much room left
	        if (spaceLeftOnLine < 4) {
	            spaceLeftOnLine = lineWidth;
	            output.push(''); // need to fill first line
	        }
	        // if will fit on this line and next...
	        if (wordWidth < spaceLeftOnLine + lineWidth) {
	            output.push(word.substring(index, index + spaceLeftOnLine - 1));
	            output.push(word.substring(index + spaceLeftOnLine - 1));
	            return output;
	        }
	        // hyphenate next part
	        const hyphenAt = Math.min(spaceLeftOnLine - 1, Math.floor(wordWidth / 2));
	        const hyphen = word.substring(index, index + hyphenAt);
	        output.push(hyphen);
	        index += hyphenAt;
	        spaceLeftOnLine = lineWidth;
	    }
	    return output;
	}
	// // Returns the number of lines, including the newlines already in the text.
	// // Puts the output in "to" only if we receive a "to" -- can make it null and just get a line count.
	// export function splitIntoLines(source: string, width = 200, indent = 0) {
	//     const output: string[] = [];
	//     if (!source) return output;
	//     if (width <= 0) width = 200;
	//     let text = wordWrap(source, width, indent);
	//     let start = 0;
	//     let fg0: Color | number | null = null;
	//     let bg0: Color | number | null = null;
	//     eachChar(text, (ch, fg, bg, _, n) => {
	//         if (ch == '\n') {
	//             let color =
	//                 fg0 || bg0 ? `#{${fg0 ? fg0 : ''}${bg0 ? ':' + bg0 : ''}}` : '';
	//             output.push(color + text.substring(start, n));
	//             start = n + 1;
	//             fg0 = fg;
	//             bg0 = bg;
	//         }
	//     });
	//     let color = fg0 || bg0 ? `#{${fg0 ? fg0 : ''}${bg0 ? ':' + bg0 : ''}}` : '';
	//     if (start < text.length) {
	//         output.push(color + text.substring(start));
	//     }
	//     return output;
	// }
	function splitIntoLines(text, width = 200, opts = {}) {
	    if (typeof text !== 'string')
	        return [];
	    text = text.trimEnd();
	    // if (text.endsWith('\n')) {
	    //     text = text.trimEnd();
	    // }
	    const updated = wordWrap(text, width, opts);
	    return updated.split('\n');
	}

	//
	// Formats:
	// moose
	// taco~
	// tomatoe[s]
	// |goose|geese|
	// go[es]
	const RE_BRACKETS = /\[(\w+)(?:\|(\w+))?\]/;
	const RE_ALTS = /\|(\w+)\|(\w+)\|/;
	// VERBS
	function toSingularVerb(text) {
	    if (text.includes('~')) {
	        return text.replace('~', 's');
	    }
	    let match = RE_BRACKETS.exec(text);
	    if (match) {
	        return text.replace(match[0], match[1]);
	    }
	    match = RE_ALTS.exec(text);
	    if (match) {
	        return match[1];
	    }
	    return text;
	}
	function toPluralVerb(text) {
	    if (text.includes('~')) {
	        return text.replace('~', '');
	    }
	    let match = RE_BRACKETS.exec(text);
	    if (match) {
	        return text.replace(match[0], match[2] || '');
	    }
	    match = RE_ALTS.exec(text);
	    if (match) {
	        return match[2];
	    }
	    return text;
	}
	// NOUNS
	function toSingularNoun(text) {
	    text = text.replace('& ', '');
	    if (text.includes('~')) {
	        return text.replace('~', '');
	    }
	    let match = RE_BRACKETS.exec(text);
	    if (match) {
	        return text.replace(match[0], match[2] || '');
	    }
	    match = RE_ALTS.exec(text);
	    if (match) {
	        return match[1];
	    }
	    return text;
	}
	function toPluralNoun(text) {
	    text = text.replace('& ', '');
	    if (text.includes('~')) {
	        return text.replace('~', 's');
	    }
	    let match = RE_BRACKETS.exec(text);
	    if (match) {
	        return text.replace(match[0], match[1]);
	    }
	    match = RE_ALTS.exec(text);
	    if (match) {
	        return match[2];
	    }
	    return text;
	}
	function toQuantity(text, count) {
	    if (count == 1) {
	        text = toSingularNoun(text);
	    }
	    else {
	        text = toPluralNoun(text);
	    }
	    const countText = count > 1 ? '' + count : 'a';
	    if (text.includes('&')) {
	        return text.replace('&', countText);
	    }
	    return countText + ' ' + text;
	}

	function configure(opts = {}) {
	    if (opts.fg !== undefined) {
	        options.defaultFg = opts.fg;
	    }
	    if (opts.bg !== undefined) {
	        options.defaultBg = opts.bg;
	    }
	    if (opts.colorStart) {
	        options.colorStart = opts.colorStart;
	    }
	    if (opts.colorEnd) {
	        options.colorEnd = opts.colorEnd;
	    }
	    if (opts.field) {
	        options.field = opts.field;
	    }
	}

	var index$8 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		configure: configure,
		compile: compile$1,
		apply: apply,
		eachChar: eachChar,
		wordWrap: wordWrap,
		splitIntoLines: splitIntoLines,
		addHelper: addHelper,
		options: options,
		length: length,
		advanceChars: advanceChars,
		findChar: findChar,
		firstChar: firstChar,
		startsWith: startsWith,
		padStart: padStart,
		padEnd: padEnd,
		center: center,
		truncate: truncate,
		capitalize: capitalize,
		removeColors: removeColors,
		spliceRaw: spliceRaw,
		hash: hash,
		splitArgs: splitArgs,
		toSingularVerb: toSingularVerb,
		toPluralVerb: toPluralVerb,
		toSingularNoun: toSingularNoun,
		toPluralNoun: toPluralNoun,
		toQuantity: toQuantity
	});

	class BufferBase {
	    constructor(width, height) {
	        this._clip = null;
	        if (typeof width !== 'number') {
	            height = width.height;
	            width = width.width;
	        }
	        this._width = width;
	        this._height = height;
	    }
	    get width() {
	        return this._width;
	    }
	    get height() {
	        return this._height;
	    }
	    hasXY(x, y) {
	        return x >= 0 && y >= 0 && x < this.width && y < this.height;
	    }
	    // This is without opacity - opacity must be done in Mixer
	    drawSprite(x, y, sprite) {
	        const ch = sprite.ch;
	        const fg = sprite.fg;
	        const bg = sprite.bg;
	        return this.draw(x, y, ch, fg, bg);
	    }
	    blackOut(...args) {
	        if (args.length == 0) {
	            return this.fill(' ', 0, 0);
	        }
	        return this.draw(args[0], args[1], ' ', 0, 0);
	    }
	    fill(glyph = ' ', fg = 0xfff, bg = 0) {
	        if (arguments.length == 1) {
	            bg = from$2(glyph);
	            glyph = null;
	            fg = bg;
	        }
	        return this.fillRect(0, 0, this.width, this.height, glyph, fg, bg);
	    }
	    drawText(x, y, text, fg = 0xfff, bg = null, maxWidth = 0, align = 'left') {
	        // if (!this.hasXY(x, y)) return 0;
	        if (typeof fg !== 'number')
	            fg = from$2(fg);
	        if (typeof bg !== 'number')
	            bg = from$2(bg);
	        maxWidth = Math.min(maxWidth || this.width, this.width - x);
	        if (align == 'right') {
	            const len = length(text);
	            x += maxWidth - len;
	        }
	        else if (align == 'center') {
	            const len = length(text);
	            x += Math.floor((maxWidth - len) / 2);
	        }
	        eachChar(text, (ch, fg0, bg0, i) => {
	            if (x + i >= this.width || i >= maxWidth)
	                return;
	            this.draw(i + x, y, ch, fg0, bg0);
	        }, { fg, bg });
	        return 1; // used 1 line
	    }
	    wrapText(x, y, width, text, fg = 0xfff, bg = null, indent = 0 // TODO - convert to WrapOptions
	    ) {
	        // if (!this.hasXY(x, y)) return 0;
	        fg = from$2(fg);
	        bg = from$2(bg);
	        width = Math.min(width, this.width - x);
	        text = wordWrap(text, width, { indent });
	        let lineCount = 0;
	        let xi = x;
	        eachChar(text, (ch, fg0, bg0) => {
	            if (ch == '\n') {
	                while (xi < x + width) {
	                    this.draw(xi++, y + lineCount, ' ', 0x000, bg0);
	                }
	                ++lineCount;
	                xi = x + indent;
	                return;
	            }
	            this.draw(xi++, y + lineCount, ch, fg0, bg0);
	        }, { fg, bg });
	        while (xi < x + width) {
	            this.draw(xi++, y + lineCount, ' ', 0x000, bg);
	        }
	        return lineCount + 1;
	    }
	    fillBounds(bounds, ch = null, fg = null, bg = null) {
	        return this.fillRect(bounds.x, bounds.y, bounds.width, bounds.height, ch, fg, bg);
	    }
	    fillRect(x, y, w, h, ch = null, fg = null, bg = null) {
	        fg = fg !== null ? from$2(fg) : null;
	        bg = bg !== null ? from$2(bg) : null;
	        const xw = Math.min(x + w, this.width);
	        const yh = Math.min(y + h, this.height);
	        for (let i = x; i < xw; ++i) {
	            for (let j = y; j < yh; ++j) {
	                this.set(i, j, ch, fg, bg);
	            }
	        }
	        return this;
	    }
	    blackOutBounds(bounds, bg = 0) {
	        return this.blackOutRect(bounds.x, bounds.y, bounds.width, bounds.height, bg);
	    }
	    blackOutRect(x, y, w, h, bg = 'black') {
	        bg = from$2(bg);
	        return this.fillRect(x, y, w, h, ' ', bg, bg);
	    }
	    highlight(x, y, color, strength) {
	        if (!this.hasXY(x, y))
	            return this;
	        color = from$2(color);
	        const mixer = new Mixer();
	        const data = this.get(x, y);
	        mixer.drawSprite(data);
	        mixer.fg = mixer.fg.add(color, strength);
	        mixer.bg = mixer.bg.add(color, strength);
	        this.drawSprite(x, y, mixer);
	        return this;
	    }
	    mix(color, percent, x = 0, y = 0, width = 0, height = 0) {
	        color = from$2(color);
	        if (color.isNull())
	            return this;
	        const mixer = new Mixer();
	        if (!width)
	            width = x ? 1 : this.width;
	        if (!height)
	            height = y ? 1 : this.height;
	        const endX = Math.min(width + x, this.width);
	        const endY = Math.min(height + y, this.height);
	        for (let i = x; i < endX; ++i) {
	            for (let j = y; j < endY; ++j) {
	                const data = this.get(i, j);
	                mixer.drawSprite(data);
	                mixer.fg = mixer.fg.mix(color, percent);
	                mixer.bg = mixer.bg.mix(color, percent);
	                this.drawSprite(i, j, mixer);
	            }
	        }
	        return this;
	    }
	    blend(color, x = 0, y = 0, width = 0, height = 0) {
	        color = from$2(color);
	        if (color.isNull())
	            return this;
	        const mixer = new Mixer();
	        if (!width)
	            width = x ? 1 : this.width;
	        if (!height)
	            height = y ? 1 : this.height;
	        const endX = Math.min(width + x, this.width);
	        const endY = Math.min(height + y, this.height);
	        for (let i = x; i < endX; ++i) {
	            for (let j = y; j < endY; ++j) {
	                const data = this.get(i, j);
	                mixer.drawSprite(data);
	                mixer.fg = mixer.fg.blend(color);
	                mixer.bg = mixer.bg.blend(color);
	                this.drawSprite(i, j, mixer);
	            }
	        }
	        return this;
	    }
	    setClip(...args) {
	        if (args.length == 1) {
	            this._clip = args[0].clone();
	            return this;
	        }
	        this._clip = new Bounds(args[0], args[1], args[2], args[3]);
	        return this;
	    }
	    clearClip() {
	        this._clip = null;
	        return this;
	    }
	}
	class Buffer$1 extends BufferBase {
	    constructor(...args) {
	        super(args[0], args[1]);
	        this.changed = false;
	        this._data = [];
	        this.resize(this._width, this._height);
	    }
	    clone() {
	        const other = new (this.constructor)(this._width, this._height);
	        other.copy(this);
	        return other;
	    }
	    resize(width, height) {
	        if (this._data.length === width * height)
	            return;
	        this._width = width;
	        this._height = height;
	        while (this._data.length < width * height) {
	            this._data.push(new Mixer());
	        }
	        this._data.length = width * height; // truncate if was too large
	        this.changed = true;
	    }
	    _index(x, y) {
	        return y * this.width + x;
	    }
	    get(x, y) {
	        if (!this.hasXY(x, y)) {
	            throw new Error(`Invalid loc - ${x},${y}`);
	        }
	        let index = y * this.width + x;
	        return this._data[index];
	    }
	    set(x, y, ch = null, fg = null, bg = null) {
	        if (this._clip && !this._clip.contains(x, y))
	            return this;
	        const m = this.get(x, y);
	        m.fill(ch, fg, bg);
	        return this;
	    }
	    info(x, y) {
	        if (!this.hasXY(x, y)) {
	            throw new Error(`Invalid loc - ${x},${y}`);
	        }
	        let index = y * this.width + x;
	        const m = this._data[index];
	        return {
	            ch: m.ch,
	            fg: m.fg.toInt(),
	            bg: m.bg.toInt(),
	        };
	    }
	    copy(other) {
	        this._data.forEach((m, i) => {
	            m.copy(other._data[i]);
	        });
	        this.changed = true;
	        this._clip = other._clip ? other._clip.clone() : null;
	        return this;
	    }
	    apply(other) {
	        if (this._clip) {
	            this._clip.forEach((x, y) => {
	                const me = this.get(x, y);
	                const you = other.get(x, y);
	                me.drawSprite(you);
	            });
	            return this;
	        }
	        this._data.forEach((m, i) => {
	            m.drawSprite(other._data[i]);
	        });
	        this.changed = true;
	        return this;
	    }
	    // toGlyph(ch: string | number): number {
	    //     if (typeof ch === 'number') return ch;
	    //     if (!ch || !ch.length) return -1; // 0 handled elsewhere
	    //     return ch.charCodeAt(0);
	    // }
	    draw(x, y, glyph = null, fg = null, // TODO - White?
	    bg = null // TODO - Black?
	    ) {
	        if (this._clip && !this._clip.contains(x, y))
	            return this;
	        let index = y * this.width + x;
	        const current = this._data[index];
	        current.draw(glyph, fg, bg);
	        this.changed = true;
	        return this;
	    }
	    nullify(...args) {
	        if (args.length == 0) {
	            if (this._clip) {
	                this._clip.forEach((x, y) => {
	                    this.nullify(x, y);
	                });
	            }
	            else {
	                this._data.forEach((d) => d.nullify());
	            }
	        }
	        else {
	            if (this._clip && !this._clip.contains(args[0], args[1]))
	                return this;
	            this.get(args[0], args[1]).nullify();
	        }
	    }
	    dump() {
	        const data = [];
	        let header = '    ';
	        for (let x = 0; x < this.width; ++x) {
	            if (x % 10 == 0)
	                header += ' ';
	            header += x % 10;
	        }
	        data.push(header);
	        data.push('');
	        for (let y = 0; y < this.height; ++y) {
	            let line = `${('' + y).padStart(2)}] `;
	            for (let x = 0; x < this.width; ++x) {
	                if (x % 10 == 0)
	                    line += ' ';
	                const data = this.get(x, y);
	                let glyph = data.ch;
	                if (glyph === null)
	                    glyph = ' ';
	                line += glyph;
	            }
	            data.push(line);
	        }
	        console.log(data.join('\n'));
	    }
	}
	function make$8(...args) {
	    return new Buffer$1(args[0], args[1]);
	}

	var buffer = /*#__PURE__*/Object.freeze({
		__proto__: null,
		BufferBase: BufferBase,
		Buffer: Buffer$1,
		make: make$8
	});

	const FovFlags = make$a([
	    'VISIBLE',
	    'WAS_VISIBLE',
	    'CLAIRVOYANT_VISIBLE',
	    'WAS_CLAIRVOYANT_VISIBLE',
	    'TELEPATHIC_VISIBLE',
	    'WAS_TELEPATHIC_VISIBLE',
	    'ITEM_DETECTED',
	    'WAS_ITEM_DETECTED',
	    'ACTOR_DETECTED',
	    'WAS_ACTOR_DETECTED',
	    'REVEALED',
	    'MAGIC_MAPPED',
	    'IN_FOV',
	    'WAS_IN_FOV',
	    'ALWAYS_VISIBLE',
	    'IS_CURSOR',
	    'IS_HIGHLIGHTED',
	    'ANY_KIND_OF_VISIBLE = VISIBLE | CLAIRVOYANT_VISIBLE | TELEPATHIC_VISIBLE',
	    'IS_WAS_ANY_KIND_OF_VISIBLE = VISIBLE | WAS_VISIBLE |CLAIRVOYANT_VISIBLE | WAS_CLAIRVOYANT_VISIBLE |TELEPATHIC_VISIBLE |WAS_TELEPATHIC_VISIBLE',
	    'WAS_ANY_KIND_OF_VISIBLE = WAS_VISIBLE | WAS_CLAIRVOYANT_VISIBLE | WAS_TELEPATHIC_VISIBLE',
	    'WAS_DETECTED = WAS_ITEM_DETECTED | WAS_ACTOR_DETECTED',
	    'IS_DETECTED = ITEM_DETECTED | ACTOR_DETECTED',
	    'PLAYER = IN_FOV',
	    'CLAIRVOYANT = CLAIRVOYANT_VISIBLE',
	    'TELEPATHIC = TELEPATHIC_VISIBLE',
	    'VIEWPORT_TYPES = PLAYER | VISIBLE |CLAIRVOYANT |TELEPATHIC |ITEM_DETECTED |ACTOR_DETECTED',
	]);

	// CREDIT - This is adapted from: http://roguebasin.roguelikedevelopment.org/index.php?title=Improved_Shadowcasting_in_Java
	class FOV {
	    constructor(strategy) {
	        this._setVisible = null;
	        this._startX = -1;
	        this._startY = -1;
	        this._maxRadius = 100;
	        this._isBlocked = strategy.isBlocked;
	        this._calcRadius = strategy.calcRadius || calcRadius;
	        this._hasXY = strategy.hasXY || TRUE;
	        this._debug = strategy.debug || NOOP;
	    }
	    calculate(x, y, maxRadius, setVisible) {
	        this._setVisible = setVisible;
	        this._setVisible(x, y, 1);
	        this._startX = x;
	        this._startY = y;
	        this._maxRadius = maxRadius + 1;
	        // uses the diagonals
	        for (let i = 4; i < 8; ++i) {
	            const d = DIRS$2[i];
	            this.castLight(1, 1.0, 0.0, 0, d[0], d[1], 0);
	            this.castLight(1, 1.0, 0.0, d[0], 0, 0, d[1]);
	        }
	    }
	    // NOTE: slope starts a 1 and ends at 0.
	    castLight(row, startSlope, endSlope, xx, xy, yx, yy) {
	        if (row >= this._maxRadius) {
	            this._debug('CAST: row=%d, start=%d, end=%d, row >= maxRadius => cancel', row, startSlope.toFixed(2), endSlope.toFixed(2));
	            return;
	        }
	        if (startSlope < endSlope) {
	            this._debug('CAST: row=%d, start=%d, end=%d, start < end => cancel', row, startSlope.toFixed(2), endSlope.toFixed(2));
	            return;
	        }
	        this._debug('CAST: row=%d, start=%d, end=%d, x=%d,%d, y=%d,%d', row, startSlope.toFixed(2), endSlope.toFixed(2), xx, xy, yx, yy);
	        let nextStart = startSlope;
	        let blocked = false;
	        let deltaY = -row;
	        let currentX, currentY, outerSlope, innerSlope, maxSlope, minSlope = 0;
	        for (let deltaX = -row; deltaX <= 0; deltaX++) {
	            currentX = Math.floor(this._startX + deltaX * xx + deltaY * xy);
	            currentY = Math.floor(this._startY + deltaX * yx + deltaY * yy);
	            outerSlope = (deltaX - 0.5) / (deltaY + 0.5);
	            innerSlope = (deltaX + 0.5) / (deltaY - 0.5);
	            maxSlope = deltaX / (deltaY + 0.5);
	            minSlope = (deltaX + 0.5) / deltaY;
	            if (!this._hasXY(currentX, currentY)) {
	                blocked = true;
	                // nextStart = innerSlope;
	                continue;
	            }
	            this._debug('- test %d,%d ... start=%d, min=%d, max=%d, end=%d, dx=%d, dy=%d', currentX, currentY, startSlope.toFixed(2), maxSlope.toFixed(2), minSlope.toFixed(2), endSlope.toFixed(2), deltaX, deltaY);
	            if (startSlope < minSlope) {
	                blocked = this._isBlocked(currentX, currentY);
	                continue;
	            }
	            else if (endSlope > maxSlope) {
	                break;
	            }
	            //check if it's within the lightable area and light if needed
	            const radius = this._calcRadius(deltaX, deltaY);
	            if (radius < this._maxRadius) {
	                const bright = 1 - radius / this._maxRadius;
	                this._setVisible(currentX, currentY, bright);
	                this._debug('       - visible');
	            }
	            if (blocked) {
	                //previous cell was a blocking one
	                if (this._isBlocked(currentX, currentY)) {
	                    //hit a wall
	                    this._debug('       - blocked ... nextStart: %d', innerSlope.toFixed(2));
	                    nextStart = innerSlope;
	                    continue;
	                }
	                else {
	                    blocked = false;
	                }
	            }
	            else {
	                if (this._isBlocked(currentX, currentY) &&
	                    row < this._maxRadius) {
	                    //hit a wall within sight line
	                    this._debug('       - blocked ... start:%d, end:%d, nextStart: %d', nextStart.toFixed(2), outerSlope.toFixed(2), innerSlope.toFixed(2));
	                    blocked = true;
	                    this.castLight(row + 1, nextStart, outerSlope, xx, xy, yx, yy);
	                    nextStart = innerSlope;
	                }
	            }
	        }
	        if (!blocked) {
	            this.castLight(row + 1, nextStart, endSlope, xx, xy, yx, yy);
	        }
	    }
	}

	// import * as GWU from 'gw-utils';
	class FovSystem {
	    constructor(site, opts = {}) {
	        // needsUpdate: boolean;
	        this.changed = true;
	        this._callback = NOOP;
	        this.follow = null;
	        this.site = site;
	        let flag = 0;
	        const visible = opts.visible || opts.alwaysVisible;
	        if (opts.revealed || (visible && opts.revealed !== false))
	            flag |= FovFlags.REVEALED;
	        if (visible)
	            flag |= FovFlags.VISIBLE;
	        this.flags = make$e(site.width, site.height, flag);
	        // this.needsUpdate = true;
	        if (opts.callback) {
	            this.callback = opts.callback;
	        }
	        this.fov = new FOV({
	            isBlocked: (x, y) => {
	                return this.site.blocksVision(x, y);
	            },
	            hasXY: (x, y) => {
	                return (x >= 0 &&
	                    y >= 0 &&
	                    x < this.site.width &&
	                    y < this.site.height);
	            },
	        });
	        if (opts.alwaysVisible) {
	            this.makeAlwaysVisible();
	        }
	        if (opts.visible || opts.alwaysVisible) {
	            forRect(site.width, site.height, (x, y) => this._callback(x, y, true));
	        }
	    }
	    get callback() {
	        return this._callback;
	    }
	    set callback(v) {
	        if (!v) {
	            this._callback = NOOP;
	        }
	        else if (typeof v === 'function') {
	            this._callback = v;
	        }
	        else {
	            this._callback = v.onFovChange.bind(v);
	        }
	    }
	    getFlag(x, y) {
	        return this.flags[x][y];
	    }
	    isVisible(x, y) {
	        return !!((this.flags.get(x, y) || 0) & FovFlags.VISIBLE);
	    }
	    isAnyKindOfVisible(x, y) {
	        return !!((this.flags.get(x, y) || 0) & FovFlags.ANY_KIND_OF_VISIBLE);
	    }
	    isClairvoyantVisible(x, y) {
	        return !!((this.flags.get(x, y) || 0) & FovFlags.CLAIRVOYANT_VISIBLE);
	    }
	    isTelepathicVisible(x, y) {
	        return !!((this.flags.get(x, y) || 0) & FovFlags.TELEPATHIC_VISIBLE);
	    }
	    isInFov(x, y) {
	        return !!((this.flags.get(x, y) || 0) & FovFlags.IN_FOV);
	    }
	    isDirectlyVisible(x, y) {
	        const flags = FovFlags.VISIBLE | FovFlags.IN_FOV;
	        return ((this.flags.get(x, y) || 0) & flags) === flags;
	    }
	    isActorDetected(x, y) {
	        return !!((this.flags.get(x, y) || 0) & FovFlags.ACTOR_DETECTED);
	    }
	    isItemDetected(x, y) {
	        return !!((this.flags.get(x, y) || 0) & FovFlags.ITEM_DETECTED);
	    }
	    isMagicMapped(x, y) {
	        return !!((this.flags.get(x, y) || 0) & FovFlags.MAGIC_MAPPED);
	    }
	    isRevealed(x, y) {
	        return !!((this.flags.get(x, y) || 0) & FovFlags.REVEALED);
	    }
	    fovChanged(x, y) {
	        const flags = this.flags.get(x, y) || 0;
	        const isVisible = !!(flags & FovFlags.ANY_KIND_OF_VISIBLE);
	        const wasVisible = !!(flags & FovFlags.WAS_ANY_KIND_OF_VISIBLE);
	        return isVisible !== wasVisible;
	    }
	    wasAnyKindOfVisible(x, y) {
	        return !!((this.flags.get(x, y) || 0) & FovFlags.WAS_ANY_KIND_OF_VISIBLE);
	    }
	    makeAlwaysVisible() {
	        this.changed = true;
	        this.flags.forEach((_v, x, y) => {
	            this.flags[x][y] |=
	                FovFlags.ALWAYS_VISIBLE | FovFlags.REVEALED | FovFlags.VISIBLE;
	            this.callback(x, y, true);
	        });
	    }
	    makeCellAlwaysVisible(x, y) {
	        this.changed = true;
	        this.flags[x][y] |=
	            FovFlags.ALWAYS_VISIBLE | FovFlags.REVEALED | FovFlags.VISIBLE;
	        this.callback(x, y, true);
	    }
	    revealAll(makeVisibleToo = true) {
	        const flag = FovFlags.REVEALED | (makeVisibleToo ? FovFlags.VISIBLE : 0);
	        this.flags.update((v) => v | flag);
	        this.flags.forEach((v, x, y) => {
	            this.callback(x, y, !!(v & FovFlags.VISIBLE));
	        });
	        this.changed = true;
	    }
	    revealCell(x, y, radius = 0, makeVisibleToo = true) {
	        const flag = FovFlags.REVEALED | (makeVisibleToo ? FovFlags.VISIBLE : 0);
	        this.fov.calculate(x, y, radius, (x0, y0) => {
	            this.flags[x0][y0] |= flag;
	            this.callback(x0, y0, !!(flag & FovFlags.VISIBLE));
	        });
	        this.changed = true;
	    }
	    hideCell(x, y) {
	        this.flags[x][y] &= ~(FovFlags.MAGIC_MAPPED |
	            FovFlags.REVEALED |
	            FovFlags.ALWAYS_VISIBLE);
	        this.flags[x][y] = this.demoteCellVisibility(this.flags[x][y]); // clears visible, etc...
	        this.callback(x, y, false);
	        this.changed = true;
	    }
	    magicMapCell(x, y) {
	        this.flags[x][y] |= FovFlags.MAGIC_MAPPED;
	        this.changed = true;
	        this.callback(x, y, true);
	    }
	    reset() {
	        this.flags.fill(0);
	        this.changed = true;
	        this.flags.forEach((_v, x, y) => {
	            this.callback(x, y, false);
	        });
	    }
	    // get changed(): boolean {
	    //     return this._changed;
	    // }
	    // set changed(v: boolean) {
	    //     this._changed = v;
	    //     this.needsUpdate = this.needsUpdate || v;
	    // }
	    // CURSOR
	    setCursor(x, y, keep = false) {
	        if (!keep) {
	            this.flags.update((f) => f & ~FovFlags.IS_CURSOR);
	        }
	        this.flags[x][y] |= FovFlags.IS_CURSOR;
	        this.changed = true;
	    }
	    clearCursor(x, y) {
	        if (x === undefined || y === undefined) {
	            this.flags.update((f) => f & ~FovFlags.IS_CURSOR);
	        }
	        else {
	            this.flags[x][y] &= ~FovFlags.IS_CURSOR;
	        }
	        this.changed = true;
	    }
	    isCursor(x, y) {
	        return !!(this.flags[x][y] & FovFlags.IS_CURSOR);
	    }
	    // HIGHLIGHT
	    setHighlight(x, y, keep = false) {
	        if (!keep) {
	            this.flags.update((f) => f & ~FovFlags.IS_HIGHLIGHTED);
	        }
	        this.flags[x][y] |= FovFlags.IS_HIGHLIGHTED;
	        this.changed = true;
	    }
	    clearHighlight(x, y) {
	        if (x === undefined || y === undefined) {
	            this.flags.update((f) => f & ~FovFlags.IS_HIGHLIGHTED);
	        }
	        else {
	            this.flags[x][y] &= ~FovFlags.IS_HIGHLIGHTED;
	        }
	        this.changed = true;
	    }
	    isHighlight(x, y) {
	        return !!(this.flags[x][y] & FovFlags.IS_HIGHLIGHTED);
	    }
	    // COPY
	    // copy(other: FovSystem) {
	    //     this.site = other.site;
	    //     this.flags.copy(other.flags);
	    //     this.fov = other.fov;
	    //     this.follow = other.follow;
	    //     this.onFovChange = other.onFovChange;
	    //     // this.needsUpdate = other.needsUpdate;
	    //     // this._changed = other._changed;
	    // }
	    //////////////////////////
	    // UPDATE
	    demoteCellVisibility(flag) {
	        flag &= ~(FovFlags.WAS_ANY_KIND_OF_VISIBLE |
	            FovFlags.WAS_IN_FOV |
	            FovFlags.WAS_DETECTED);
	        if (flag & FovFlags.IN_FOV) {
	            flag &= ~FovFlags.IN_FOV;
	            flag |= FovFlags.WAS_IN_FOV;
	        }
	        if (flag & FovFlags.VISIBLE) {
	            flag &= ~FovFlags.VISIBLE;
	            flag |= FovFlags.WAS_VISIBLE;
	        }
	        if (flag & FovFlags.CLAIRVOYANT_VISIBLE) {
	            flag &= ~FovFlags.CLAIRVOYANT_VISIBLE;
	            flag |= FovFlags.WAS_CLAIRVOYANT_VISIBLE;
	        }
	        if (flag & FovFlags.TELEPATHIC_VISIBLE) {
	            flag &= ~FovFlags.TELEPATHIC_VISIBLE;
	            flag |= FovFlags.WAS_TELEPATHIC_VISIBLE;
	        }
	        if (flag & FovFlags.ALWAYS_VISIBLE) {
	            flag |= FovFlags.VISIBLE;
	        }
	        if (flag & FovFlags.ITEM_DETECTED) {
	            flag &= ~FovFlags.ITEM_DETECTED;
	            flag |= FovFlags.WAS_ITEM_DETECTED;
	        }
	        if (flag & FovFlags.ACTOR_DETECTED) {
	            flag &= ~FovFlags.ACTOR_DETECTED;
	            flag |= FovFlags.WAS_ACTOR_DETECTED;
	        }
	        return flag;
	    }
	    updateCellVisibility(flag, x, y) {
	        const isVisible = !!(flag & FovFlags.ANY_KIND_OF_VISIBLE);
	        const wasVisible = !!(flag & FovFlags.WAS_ANY_KIND_OF_VISIBLE);
	        if (isVisible && wasVisible) ;
	        else if (isVisible && !wasVisible) {
	            // if the cell became visible this move
	            this.flags[x][y] |= FovFlags.REVEALED;
	            this._callback(x, y, isVisible);
	            this.changed = true;
	        }
	        else if (!isVisible && wasVisible) {
	            // if the cell ceased being visible this move
	            this._callback(x, y, isVisible);
	            this.changed = true;
	        }
	        return isVisible;
	    }
	    // protected updateCellClairyvoyance(
	    //     flag: number,
	    //     x: number,
	    //     y: number
	    // ): boolean {
	    //     const isClairy = !!(flag & FovFlags.CLAIRVOYANT_VISIBLE);
	    //     const wasClairy = !!(flag & FovFlags.WAS_CLAIRVOYANT_VISIBLE);
	    //     if (isClairy && wasClairy) {
	    //         // if (this.site.lightChanged(x, y)) {
	    //         //     this.site.redrawCell(x, y);
	    //         // }
	    //     } else if (!isClairy && wasClairy) {
	    //         // ceased being clairvoyantly visible
	    //         this._callback(x, y, isClairy);
	    //     } else if (!wasClairy && isClairy) {
	    //         // became clairvoyantly visible
	    //         this._callback(x, y, isClairy);
	    //     }
	    //     return isClairy;
	    // }
	    // protected updateCellTelepathy(flag: number, x: number, y: number): boolean {
	    //     const isTele = !!(flag & FovFlags.TELEPATHIC_VISIBLE);
	    //     const wasTele = !!(flag & FovFlags.WAS_TELEPATHIC_VISIBLE);
	    //     if (isTele && wasTele) {
	    //         // if (this.site.lightChanged(x, y)) {
	    //         //     this.site.redrawCell(x, y);
	    //         // }
	    //     } else if (!isTele && wasTele) {
	    //         // ceased being telepathically visible
	    //         this._callback(x, y, isTele);
	    //     } else if (!wasTele && isTele) {
	    //         // became telepathically visible
	    //         this._callback(x, y, isTele);
	    //     }
	    //     return isTele;
	    // }
	    updateCellDetect(flag, x, y) {
	        const isDetect = !!(flag & FovFlags.IS_DETECTED);
	        const wasDetect = !!(flag & FovFlags.WAS_DETECTED);
	        if (isDetect && wasDetect) ;
	        else if (!isDetect && wasDetect) {
	            // ceased being detected visible
	            this._callback(x, y, isDetect);
	            this.changed = true;
	        }
	        else if (!wasDetect && isDetect) {
	            // became detected visible
	            this._callback(x, y, isDetect);
	            this.changed = true;
	        }
	        return isDetect;
	    }
	    // protected updateItemDetect(flag: number, x: number, y: number): boolean {
	    //     const isItem = !!(flag & FovFlags.ITEM_DETECTED);
	    //     const wasItem = !!(flag & FovFlags.WAS_ITEM_DETECTED);
	    //     if (isItem && wasItem) {
	    //         // if (this.site.lightChanged(x, y)) {
	    //         //     this.site.redrawCell(x, y);
	    //         // }
	    //     } else if (!isItem && wasItem) {
	    //         // ceased being detected visible
	    //         this._callback(x, y, isItem);
	    //     } else if (!wasItem && isItem) {
	    //         // became detected visible
	    //         this._callback(x, y, isItem);
	    //     }
	    //     return isItem;
	    // }
	    promoteCellVisibility(flag, x, y) {
	        if (flag & FovFlags.IN_FOV &&
	            this.site.hasVisibleLight(x, y) // &&
	        // !(cell.flags.cellMech & FovFlagsMech.DARKENED)
	        ) {
	            flag = this.flags[x][y] |= FovFlags.VISIBLE;
	        }
	        if (this.updateCellVisibility(flag, x, y))
	            return;
	        // if (this.updateCellClairyvoyance(flag, x, y)) return;
	        // if (this.updateCellTelepathy(flag, x, y)) return;
	        if (this.updateCellDetect(flag, x, y))
	            return;
	        // if (this.updateItemDetect(flag, x, y)) return;
	    }
	    updateFor(subject) {
	        return this.update(subject.x, subject.y, subject.visionDistance);
	    }
	    update(cx, cy, cr) {
	        if (cx === undefined) {
	            if (this.follow) {
	                return this.updateFor(this.follow);
	            }
	        }
	        // if (
	        //     // !this.needsUpdate &&
	        //     cx === undefined &&
	        //     !this.site.lightingChanged()
	        // ) {
	        //     return false;
	        // }
	        if (cr === undefined) {
	            cr = this.site.width + this.site.height;
	        }
	        // this.needsUpdate = false;
	        this.changed = false;
	        this.flags.update(this.demoteCellVisibility.bind(this));
	        this.site.eachViewport((x, y, radius, type) => {
	            let flag = type & FovFlags.VIEWPORT_TYPES;
	            if (!flag)
	                flag = FovFlags.VISIBLE;
	            // if (!flag)
	            //     throw new Error('Received invalid viewport type: ' + Flag.toString(FovFlags, type));
	            if (radius == 0) {
	                this.flags[x][y] |= flag;
	                return;
	            }
	            this.fov.calculate(x, y, radius, (x, y, v) => {
	                if (v) {
	                    this.flags[x][y] |= flag;
	                }
	            });
	        });
	        if (cx !== undefined && cy !== undefined) {
	            this.fov.calculate(cx, cy, cr, (x, y, v) => {
	                if (v) {
	                    this.flags[x][y] |= FovFlags.PLAYER;
	                }
	            });
	        }
	        // if (PLAYER.bonus.clairvoyance < 0) {
	        //   discoverCell(PLAYER.xLoc, PLAYER.yLoc);
	        // }
	        //
	        // if (PLAYER.bonus.clairvoyance != 0) {
	        // 	updateClairvoyance();
	        // }
	        //
	        // updateTelepathy();
	        // updateMonsterDetection();
	        // updateLighting();
	        this.flags.forEach(this.promoteCellVisibility.bind(this));
	        // if (PLAYER.status.hallucinating > 0) {
	        // 	for (theItem of DUNGEON.items) {
	        // 		if ((pmap[theItem.xLoc][theItem.yLoc].flags & DISCOVERED) && refreshDisplay) {
	        // 			refreshDungeonCell(theItem.xLoc, theItem.yLoc);
	        // 		}
	        // 	}
	        // 	for (monst of DUNGEON.monsters) {
	        // 		if ((pmap[monst.xLoc][monst.yLoc].flags & DISCOVERED) && refreshDisplay) {
	        // 			refreshDungeonCell(monst.xLoc, monst.yLoc);
	        // 		}
	        // 	}
	        // }
	        return this.changed;
	    }
	}

	var index$7 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		FovFlags: FovFlags,
		FOV: FOV,
		FovSystem: FovSystem
	});

	// import { grid } from '.';
	const FORBIDDEN = -1;
	const OBSTRUCTION = -2;
	const AVOIDED = 10;
	const OK = 1;
	const NO_PATH = 30000;
	function makeCostLink(i) {
	    return {
	        distance: 0,
	        cost: 0,
	        index: i,
	        left: null,
	        right: null,
	    };
	}
	function makeDijkstraMap(w, h) {
	    return {
	        eightWays: false,
	        front: makeCostLink(-1),
	        links: makeArray(w * h, (i) => makeCostLink(i)),
	        width: w,
	        height: h,
	    };
	}
	function getLink(map, x, y) {
	    return map.links[x + map.width * y];
	}
	const DIRS = DIRS$2;
	function update(map) {
	    let dir, dirs;
	    let linkIndex;
	    let left = null, right = null, link = null;
	    dirs = map.eightWays ? 8 : 4;
	    let head = map.front.right;
	    map.front.right = null;
	    while (head != null) {
	        for (dir = 0; dir < dirs; dir++) {
	            linkIndex = head.index + (DIRS[dir][0] + map.width * DIRS[dir][1]);
	            if (linkIndex < 0 || linkIndex >= map.width * map.height)
	                continue;
	            link = map.links[linkIndex];
	            // verify passability
	            if (link.cost < 0)
	                continue;
	            let diagCost = 0;
	            if (dir >= 4) {
	                diagCost = 0.4142;
	                let way1, way1index, way2, way2index;
	                way1index = head.index + DIRS[dir][0];
	                if (way1index < 0 || way1index >= map.width * map.height)
	                    continue;
	                way2index = head.index + map.width * DIRS[dir][1];
	                if (way2index < 0 || way2index >= map.width * map.height)
	                    continue;
	                way1 = map.links[way1index];
	                way2 = map.links[way2index];
	                if (way1.cost == OBSTRUCTION || way2.cost == OBSTRUCTION)
	                    continue;
	            }
	            if (head.distance + link.cost + diagCost < link.distance) {
	                link.distance = head.distance + link.cost + diagCost;
	                // reinsert the touched cell; it'll be close to the beginning of the list now, so
	                // this will be very fast.  start by removing it.
	                if (link.right != null)
	                    link.right.left = link.left;
	                if (link.left != null)
	                    link.left.right = link.right;
	                left = head;
	                right = head.right;
	                while (right != null && right.distance < link.distance) {
	                    left = right;
	                    right = right.right;
	                }
	                if (left != null)
	                    left.right = link;
	                link.right = right;
	                link.left = left;
	                if (right != null)
	                    right.left = link;
	            }
	        }
	        right = head.right;
	        head.left = null;
	        head.right = null;
	        head = right;
	    }
	}
	function clear(map, maxDistance, eightWays) {
	    let i;
	    map.eightWays = eightWays;
	    map.front.right = null;
	    for (i = 0; i < map.width * map.height; i++) {
	        map.links[i].distance = maxDistance;
	        map.links[i].left = map.links[i].right = null;
	    }
	}
	function setDistance(map, x, y, distance) {
	    let left, right, link;
	    if (x > 0 && y > 0 && x < map.width - 1 && y < map.height - 1) {
	        link = getLink(map, x, y);
	        if (link.distance > distance) {
	            link.distance = distance;
	            if (link.right != null)
	                link.right.left = link.left;
	            if (link.left != null)
	                link.left.right = link.right;
	            left = map.front;
	            right = map.front.right;
	            while (right != null && right.distance < link.distance) {
	                left = right;
	                right = right.right;
	            }
	            link.right = right;
	            link.left = left;
	            left.right = link;
	            if (right != null)
	                right.left = link;
	        }
	    }
	}
	function isBoundaryXY(data, x, y) {
	    if (x <= 0 || y <= 0)
	        return true;
	    if (x >= data.length - 1 || y >= data[0].length - 1)
	        return true;
	    return false;
	}
	function batchInput(map, distanceMap, costMap, eightWays = false, maxDistance = NO_PATH) {
	    let i, j;
	    map.eightWays = eightWays;
	    let left = null;
	    let right = null;
	    map.front.right = null;
	    for (i = 0; i < distanceMap.width; i++) {
	        for (j = 0; j < distanceMap.height; j++) {
	            let link = getLink(map, i, j);
	            if (distanceMap) {
	                link.distance = distanceMap[i][j];
	            }
	            else {
	                if (costMap) {
	                    // totally hackish; refactor
	                    link.distance = maxDistance;
	                }
	            }
	            let cost;
	            if (i == 0 ||
	                j == 0 ||
	                i == distanceMap.width - 1 ||
	                j == distanceMap.height - 1) {
	                cost = OBSTRUCTION;
	                // }
	                // else if (costMap === null) {
	                //     if (
	                //         cellHasEntityFlag(i, j, L_BLOCKS_MOVE) &&
	                //         cellHasEntityFlag(i, j, L_BLOCKS_DIAGONAL)
	                //     ) {
	                //         cost = OBSTRUCTION;
	                //     } else {
	                //         cost = FORBIDDEN;
	                //     }
	            }
	            else {
	                cost = costMap[i][j];
	            }
	            link.cost = cost;
	            if (cost > 0) {
	                if (link.distance < maxDistance) {
	                    // @ts-ignore
	                    if (right === null || right.distance > link.distance) {
	                        // left and right are used to traverse the list; if many cells have similar values,
	                        // some time can be saved by not clearing them with each insertion.  this time,
	                        // sadly, we have to start from the front.
	                        left = map.front;
	                        right = map.front.right;
	                    }
	                    // @ts-ignore
	                    while (right !== null && right.distance < link.distance) {
	                        left = right;
	                        // @ts-ignore
	                        right = right.right;
	                    }
	                    link.right = right;
	                    link.left = left;
	                    // @ts-ignore
	                    left.right = link;
	                    // @ts-ignore
	                    if (right !== null)
	                        right.left = link;
	                    left = link;
	                }
	                else {
	                    link.right = null;
	                    link.left = null;
	                }
	            }
	            else {
	                link.right = null;
	                link.left = null;
	            }
	        }
	    }
	}
	function batchOutput(map, distanceMap) {
	    let i, j;
	    update(map);
	    // transfer results to the distanceMap
	    for (i = 0; i < map.width; i++) {
	        for (j = 0; j < map.height; j++) {
	            distanceMap[i][j] = getLink(map, i, j).distance;
	        }
	    }
	}
	var DIJKSTRA_MAP;
	function calculateDistances(distanceMap, destinationX, destinationY, costMap, eightWays = false, maxDistance = NO_PATH) {
	    const width = distanceMap.length;
	    const height = distanceMap[0].length;
	    if (maxDistance <= 0)
	        maxDistance = NO_PATH;
	    if (!DIJKSTRA_MAP ||
	        DIJKSTRA_MAP.width < width ||
	        DIJKSTRA_MAP.height < height) {
	        DIJKSTRA_MAP = makeDijkstraMap(width, height);
	    }
	    DIJKSTRA_MAP.width = width;
	    DIJKSTRA_MAP.height = height;
	    let i, j;
	    const costFn = typeof costMap === 'function'
	        ? costMap
	        : (x, y) => costMap.get(x, y) || 0;
	    for (i = 0; i < width; i++) {
	        for (j = 0; j < height; j++) {
	            getLink(DIJKSTRA_MAP, i, j).cost = isBoundaryXY(distanceMap, i, j)
	                ? OBSTRUCTION
	                : costFn(i, j);
	        }
	    }
	    clear(DIJKSTRA_MAP, maxDistance, eightWays);
	    setDistance(DIJKSTRA_MAP, destinationX, destinationY, 0);
	    batchOutput(DIJKSTRA_MAP, distanceMap);
	    // TODO - Add this where called!
	    distanceMap.x = destinationX;
	    distanceMap.y = destinationY;
	}
	function rescan(distanceMap, costMap, eightWays = false, maxDistance = NO_PATH) {
	    if (!DIJKSTRA_MAP)
	        throw new Error('You must scan the map first.');
	    batchInput(DIJKSTRA_MAP, distanceMap, costMap, eightWays, maxDistance);
	    batchOutput(DIJKSTRA_MAP, distanceMap);
	}
	// Returns null if there are no beneficial moves.
	// If preferDiagonals is true, we will prefer diagonal moves.
	// Always rolls downhill on the distance map.
	// If monst is provided, do not return a direction pointing to
	// a cell that the monster avoids.
	function nextStep(distanceMap, fromX, fromY, isBlocked, useDiagonals = false) {
	    let newX, newY, bestScore;
	    let dir;
	    // brogueAssert(coordinatesAreInMap(x, y));
	    bestScore = 0;
	    let bestDir = NO_DIRECTION;
	    const dist = distanceMap[fromX][fromY];
	    for (dir = 0; dir < (useDiagonals ? 8 : 4); ++dir) {
	        newX = fromX + DIRS$2[dir][0];
	        newY = fromY + DIRS$2[dir][1];
	        const newDist = distanceMap[newX][newY];
	        if (newDist < dist) {
	            const diff = dist - newDist;
	            if (diff > bestScore &&
	                (newDist === 0 ||
	                    !isBlocked(newX, newY, fromX, fromY, distanceMap))) {
	                bestDir = dir;
	                bestScore = diff;
	            }
	        }
	    }
	    return DIRS$2[bestDir] || null;
	}
	function getClosestValidLocation(distanceMap, x, y, blocked = FALSE) {
	    let i, j, dist, closestDistance, lowestMapScore;
	    let locX = -1;
	    let locY = -1;
	    const width = distanceMap.length;
	    const height = distanceMap[0].length;
	    closestDistance = 10000;
	    lowestMapScore = 10000;
	    for (i = 1; i < width - 1; i++) {
	        for (j = 1; j < height - 1; j++) {
	            if (distanceMap[i][j] >= 0 &&
	                distanceMap[i][j] < NO_PATH &&
	                !blocked(i, j, i, j, distanceMap)) {
	                dist = (i - x) * (i - x) + (j - y) * (j - y);
	                if (dist < closestDistance ||
	                    (dist == closestDistance &&
	                        distanceMap[i][j] < lowestMapScore)) {
	                    locX = i;
	                    locY = j;
	                    closestDistance = dist;
	                    lowestMapScore = distanceMap[i][j];
	                }
	            }
	        }
	    }
	    if (locX >= 0)
	        return [locX, locY];
	    return null;
	}
	// Populates path[][] with a list of coordinates starting at origin and traversing down the map. Returns the path.
	function getPath(distanceMap, fromX, fromY, isBlocked, eightWays = false) {
	    const path = [];
	    forPath(distanceMap, fromX, fromY, isBlocked, (x, y) => {
	        path.push([x, y]);
	    }, eightWays);
	    return path.length ? path : null;
	}
	// Populates path[][] with a list of coordinates starting at origin and traversing down the map. Returns the path.
	function forPath(distanceMap, fromX, fromY, isBlocked, pathFn, eightWays = false) {
	    // actor = actor || GW.PLAYER;
	    let x = fromX;
	    let y = fromY;
	    let dist = distanceMap[x][y];
	    let count = 0;
	    if (dist === 0) {
	        pathFn(x, y);
	        return count;
	    }
	    if (dist < 0 ||
	        dist >= NO_PATH /* || isBlocked(x, y, x, y, distanceMap) */) {
	        const loc = getClosestValidLocation(distanceMap, x, y, isBlocked);
	        if (!loc)
	            return 0;
	        x = loc[0];
	        y = loc[1];
	        pathFn(x, y);
	        ++count;
	    }
	    let dir;
	    do {
	        dir = nextStep(distanceMap, x, y, isBlocked, eightWays);
	        if (dir) {
	            pathFn(x, y);
	            ++count;
	            x += dir[0];
	            y += dir[1];
	            // path[steps][0] = x;
	            // path[steps][1] = y;
	            // brogueAssert(coordinatesAreInMap(x, y));
	        }
	    } while (dir);
	    pathFn(x, y);
	    return count;
	}
	// export function getPathBetween(
	//     width: number,
	//     height: number,
	//     fromX: number,
	//     fromY: number,
	//     toX: number,
	//     toY: number,
	//     costFn: (x: number, y: number) => number,
	//     eightWays = true
	// ): XY.Loc[] | null {
	//     const costMap = Grid.alloc(width, height);
	//     const distanceMap = Grid.alloc(width, height);
	//     for (let x = 0; x < width; ++x) {
	//         for (let y = 0; y < height; ++y) {
	//             costMap[x][y] = costFn(x, y);
	//         }
	//     }
	//     calculateDistances(distanceMap, toX, toY, costMap, eightWays);
	//     const isBlocked = (x: number, y: number) => costFn(x, y) < 0;
	//     const path = getPath(distanceMap, fromX, fromY, isBlocked, eightWays);
	//     Grid.free(distanceMap);
	//     Grid.free(costMap);
	//     return path;
	// }

	function fromTo(from, to, costFn = ONE) {
	    const search = new AStar(to, costFn);
	    return search.from(from);
	}
	class AStar {
	    constructor(goal, costFn = ONE) {
	        this._todo = [];
	        this._done = [];
	        this.goal = goal;
	        this.costFn = costFn;
	    }
	    _add(loc, cost = 1, prev = null) {
	        const h = distanceFromTo(loc, this.goal);
	        let newItem = {
	            x: x(loc),
	            y: y(loc),
	            prev: prev,
	            g: prev ? prev.g + cost : 0,
	            h: h,
	        };
	        const f = newItem.g + newItem.h;
	        const existing = this._todo.findIndex((i) => equals(i, newItem));
	        if (existing > -1) {
	            const oldItem = this._todo[existing];
	            if (oldItem.g + oldItem.h <= f) {
	                return;
	            }
	            this._todo.splice(existing, 1); // this one is better
	        }
	        /* insert by distance */
	        for (let i = 0; i < this._todo.length; i++) {
	            const item = this._todo[i];
	            const itemF = item.g + item.h;
	            if (f < itemF || (f == itemF && h < item.h)) {
	                this._todo.splice(i, 0, newItem);
	                return;
	            }
	        }
	        this._todo.push(newItem);
	    }
	    from(from) {
	        this._add(from);
	        let item = null;
	        while (this._todo.length) {
	            item = this._todo.shift() || null;
	            if (!item)
	                break;
	            if (this._done.findIndex((i) => equals(i, item)) > -1) {
	                continue;
	            }
	            this._done.push(item);
	            if (equals(item, this.goal)) {
	                break;
	            }
	            eachNeighbor(item.x, item.y, (x, y, dir) => {
	                if (this._done.findIndex((i) => i.x === x && i.y === y) > -1) {
	                    return;
	                }
	                const mult = isDiagonal(dir) ? 1.4 : 1;
	                const cost = this.costFn(x, y) * mult;
	                if (cost < 0 || cost > 10000)
	                    return;
	                this._add([x, y], cost, item);
	            }, false);
	        }
	        if (item && !equals(item, this.goal))
	            return [];
	        let result = [];
	        while (item) {
	            result.push([item.x, item.y]);
	            item = item.prev;
	        }
	        result.reverse();
	        return result;
	    }
	}

	var index$6 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		FORBIDDEN: FORBIDDEN,
		OBSTRUCTION: OBSTRUCTION,
		AVOIDED: AVOIDED,
		OK: OK,
		NO_PATH: NO_PATH,
		calculateDistances: calculateDistances,
		rescan: rescan,
		nextStep: nextStep,
		getClosestValidLocation: getClosestValidLocation,
		getPath: getPath,
		forPath: forPath,
		fromTo: fromTo
	});

	/**
	 * Data for an event listener.
	 */
	class EventListener {
	    /**
	     * Creates a Listener.
	     * @param {EventFn} fn The listener function.
	     * @param {any} [context=null] The context to invoke the listener with.
	     * @param {boolean} [once=false] Specify if the listener is a one-time listener.
	     */
	    constructor(fn, context, once = false) {
	        this.fn = fn;
	        this.context = context || null;
	        this.once = once || false;
	        this.next = null;
	    }
	    /**
	     * Compares this Listener to the parameters.
	     * @param {EventFn} fn - The function
	     * @param {any} [context] - The context Object.
	     * @param {boolean} [once] - Whether or not it is a one time handler.
	     * @returns Whether or not this Listener matches the parameters.
	     */
	    matches(fn, context, once) {
	        return (this.fn === fn &&
	            (once === undefined || once == this.once) &&
	            (!context || this.context === context));
	    }
	}
	class EventEmitter {
	    constructor() {
	        this._events = {};
	    }
	    /**
	     * Add a listener for a given event.
	     *
	     * @param {String} event The event name.
	     * @param {EventFn} fn The listener function.
	     * @param {*} context The context to invoke the listener with.
	     * @param {boolean} once Specify if the listener is a one-time listener.
	     * @returns {Listener}
	     */
	    addListener(event, fn, context, once = false) {
	        if (typeof fn !== 'function') {
	            throw new TypeError('The listener must be a function');
	        }
	        const listener = new EventListener(fn, context || null, once);
	        push(this._events, event, listener);
	        return this;
	    }
	    /**
	     * Add a listener for a given event.
	     *
	     * @param {String} event The event name.
	     * @param {EventFn} fn The listener function.
	     * @param {*} context The context to invoke the listener with.
	     * @param {boolean} once Specify if the listener is a one-time listener.
	     * @returns {Listener}
	     */
	    on(event, fn, context, once = false) {
	        return this.addListener(event, fn, context, once);
	    }
	    /**
	     * Add a one-time listener for a given event.
	     *
	     * @param {(String|Symbol)} event The event name.
	     * @param {EventFn} fn The listener function.
	     * @param {*} [context=this] The context to invoke the listener with.
	     * @returns {EventEmitter} `this`.
	     * @public
	     */
	    once(event, fn, context) {
	        return this.addListener(event, fn, context, true);
	    }
	    /**
	     * Remove the listeners of a given event.
	     *
	     * @param {String} event The event name.
	     * @param {EventFn} fn Only remove the listeners that match this function.
	     * @param {*} context Only remove the listeners that have this context.
	     * @param {boolean} once Only remove one-time listeners.
	     * @returns {EventEmitter} `this`.
	     * @public
	     */
	    removeListener(event, fn, context, once = false) {
	        if (!this._events[event])
	            return this;
	        if (!fn)
	            return this;
	        forEach(this._events[event], (obj) => {
	            if (obj.matches(fn, context, once)) {
	                remove(this._events, event, obj);
	            }
	        });
	        return this;
	    }
	    /**
	     * Remove the listeners of a given event.
	     *
	     * @param {String} event The event name.
	     * @param {EventFn} fn Only remove the listeners that match this function.
	     * @param {*} context Only remove the listeners that have this context.
	     * @param {boolean} once Only remove one-time listeners.
	     * @returns {EventEmitter} `this`.
	     * @public
	     */
	    off(event, fn, context, once = false) {
	        return this.removeListener(event, fn, context, once);
	    }
	    /**
	     * Clear event by name.
	     *
	     * @param {String} evt The Event name.
	     */
	    clearEvent(event) {
	        if (this._events[event]) {
	            this._events[event] = null;
	        }
	        return this;
	    }
	    /**
	     * Remove all listeners, or those of the specified event.
	     *
	     * @param {(String|Symbol)} [event] The event name.
	     * @returns {EventEmitter} `this`.
	     * @public
	     */
	    removeAllListeners(event) {
	        if (event) {
	            this.clearEvent(event);
	        }
	        else {
	            this._events = {};
	        }
	        return this;
	    }
	    /**
	     * Calls each of the listeners registered for a given event.
	     *
	     * @param {String} event The event name.
	     * @param {...*} args The additional arguments to the event handlers.
	     * @returns {boolean} `true` if the event had listeners, else `false`.
	     * @public
	     */
	    emit(event, ...args) {
	        if (!this._events[event])
	            return false; // no events to send
	        let listener = this._events[event];
	        while (listener) {
	            let next = listener.next;
	            if (listener.once)
	                remove(this._events, event, listener);
	            listener.fn.apply(listener.context, args);
	            listener = next;
	        }
	        return true;
	    }
	}

	var events = /*#__PURE__*/Object.freeze({
		__proto__: null,
		EventListener: EventListener,
		EventEmitter: EventEmitter
	});

	function make$7(v) {
	    if (v === undefined)
	        return () => 100;
	    if (v === null)
	        return () => 0;
	    if (typeof v === 'number')
	        return () => v;
	    if (typeof v === 'function')
	        return v;
	    let base = {};
	    if (typeof v === 'string') {
	        const parts = v.split(/[,|]/).map((t) => t.trim());
	        base = {};
	        parts.forEach((p) => {
	            let [level, weight] = p.split(':');
	            base[level] = Number.parseInt(weight) || 100;
	        });
	    }
	    else {
	        base = v;
	    }
	    const parts = Object.entries(base);
	    const funcs = parts.map(([levels, frequency]) => {
	        let value = 0;
	        if (typeof frequency === 'string') {
	            value = Number.parseInt(frequency);
	        }
	        else {
	            value = frequency;
	        }
	        if (levels.includes('-')) {
	            let [start, end] = levels
	                .split('-')
	                .map((t) => t.trim())
	                .map((v) => Number.parseInt(v));
	            return (level) => level >= start && level <= end ? value : 0;
	        }
	        else if (levels.endsWith('+')) {
	            const found = Number.parseInt(levels);
	            return (level) => (level >= found ? value : 0);
	        }
	        else {
	            const found = Number.parseInt(levels);
	            return (level) => (level === found ? value : 0);
	        }
	    });
	    if (funcs.length == 1)
	        return funcs[0];
	    return (level) => funcs.reduce((out, fn) => out || fn(level), 0);
	}

	var frequency = /*#__PURE__*/Object.freeze({
		__proto__: null,
		make: make$7
	});

	class Scheduler {
	    constructor() {
	        this.next = null;
	        this.time = 0;
	        this.cache = null;
	    }
	    clear() {
	        while (this.next) {
	            const current = this.next;
	            this.next = current.next;
	            current.next = this.cache;
	            this.cache = current;
	        }
	    }
	    push(item, delay = 1) {
	        let entry;
	        if (this.cache) {
	            entry = this.cache;
	            this.cache = entry.next;
	            entry.next = null;
	        }
	        else {
	            entry = { item: null, time: 0, next: null };
	        }
	        entry.item = item;
	        entry.time = this.time + delay;
	        if (!this.next) {
	            this.next = entry;
	        }
	        else {
	            let current = this;
	            let next = current.next;
	            while (next && next.time <= entry.time) {
	                current = next;
	                next = current.next;
	            }
	            entry.next = current.next;
	            current.next = entry;
	        }
	        return entry;
	    }
	    pop() {
	        const n = this.next;
	        if (!n)
	            return null;
	        this.next = n.next;
	        n.next = this.cache;
	        this.cache = n;
	        this.time = Math.max(n.time, this.time); // so you can schedule -1 as a time uint
	        return n.item;
	    }
	    peek() {
	        const n = this.next;
	        if (!n)
	            return null;
	        return n.item;
	    }
	    remove(item) {
	        if (!item || !this.next)
	            return;
	        if (this.next.item === item) {
	            this.next = this.next.next;
	            return;
	        }
	        let prev = this.next;
	        let current = prev.next;
	        while (current && current.item !== item) {
	            prev = current;
	            current = current.next;
	        }
	        if (current && current.item === item) {
	            prev.next = current.next;
	        }
	    }
	}

	var scheduler = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Scheduler: Scheduler
	});

	class Glyphs {
	    constructor(opts = {}) {
	        this._tileWidth = 12;
	        this._tileHeight = 16;
	        this.needsUpdate = true;
	        this._toGlyph = {};
	        this._toChar = [];
	        opts.font = opts.font || 'monospace';
	        this._node = document.createElement('canvas');
	        this._ctx = this.node.getContext('2d');
	        this._configure(opts);
	    }
	    static fromImage(src) {
	        if (typeof src === 'string') {
	            if (src.startsWith('data:'))
	                throw new Error('Glyph: You must load a data string into an image element and use that.');
	            const el = document.getElementById(src);
	            if (!el)
	                throw new Error('Glyph: Failed to find image element with id:' + src);
	            src = el;
	        }
	        const glyph = new this({
	            tileWidth: src.width / 16,
	            tileHeight: src.height / 16,
	        });
	        glyph._ctx.drawImage(src, 0, 0);
	        return glyph;
	    }
	    static fromFont(src) {
	        if (typeof src === 'string') {
	            src = { font: src };
	        }
	        const glyphs = new this(src);
	        const basicOnly = src.basicOnly || src.basic || false;
	        const initFn = src.init || initGlyphs;
	        initFn(glyphs, basicOnly);
	        return glyphs;
	    }
	    get node() {
	        return this._node;
	    }
	    get ctx() {
	        return this._ctx;
	    }
	    get tileWidth() {
	        return this._tileWidth;
	    }
	    get tileHeight() {
	        return this._tileHeight;
	    }
	    get pxWidth() {
	        return this._node.width;
	    }
	    get pxHeight() {
	        return this._node.height;
	    }
	    forChar(ch) {
	        if (!ch || !ch.length)
	            return -1;
	        return this._toGlyph[ch] || -1;
	    }
	    toChar(n) {
	        return this._toChar[n] || ' ';
	    }
	    _configure(opts) {
	        this._tileWidth = opts.tileWidth || this.tileWidth;
	        this._tileHeight = opts.tileHeight || this.tileHeight;
	        this.node.width = 16 * this.tileWidth;
	        this.node.height = 16 * this.tileHeight;
	        this._ctx.fillStyle = 'black';
	        this._ctx.fillRect(0, 0, this.pxWidth, this.pxHeight);
	        const size = opts.fontSize ||
	            opts.size ||
	            Math.max(this.tileWidth, this.tileHeight);
	        this._ctx.font = '' + size + 'px ' + opts.font;
	        this._ctx.textAlign = 'center';
	        this._ctx.textBaseline = 'middle';
	        this._ctx.fillStyle = 'white';
	    }
	    draw(n, ch) {
	        if (n >= 256)
	            throw new Error('Cannot draw more than 256 glyphs.');
	        const x = (n % 16) * this.tileWidth;
	        const y = Math.floor(n / 16) * this.tileHeight;
	        const cx = x + Math.floor(this.tileWidth / 2);
	        const cy = y + Math.floor(this.tileHeight / 2);
	        this._ctx.save();
	        this._ctx.beginPath();
	        this._ctx.rect(x, y, this.tileWidth, this.tileHeight);
	        this._ctx.clip();
	        this._ctx.fillStyle = 'black';
	        this._ctx.fillRect(x, y, this.tileWidth, this.tileHeight);
	        this._ctx.fillStyle = 'white';
	        if (typeof ch === 'function') {
	            ch(this._ctx, x, y, this.tileWidth, this.tileHeight);
	        }
	        else {
	            if (this._toGlyph[ch] === undefined)
	                this._toGlyph[ch] = n;
	            this._toChar[n] = ch;
	            this._ctx.fillText(ch, cx, cy);
	        }
	        this._ctx.restore();
	        this.needsUpdate = true;
	    }
	}
	function initGlyphs(glyphs, basicOnly = false) {
	    for (let i = 32; i < 127; ++i) {
	        glyphs.draw(i, String.fromCharCode(i));
	    }
	    [
	        ' ',
	        '\u263a',
	        '\u263b',
	        '\u2665',
	        '\u2666',
	        '\u2663',
	        '\u2660',
	        '\u263c',
	        '\u2600',
	        '\u2606',
	        '\u2605',
	        '\u2023',
	        '\u2219',
	        '\u2043',
	        '\u2022',
	        '\u2630',
	        '\u2637',
	        '\u2610',
	        '\u2611',
	        '\u2612',
	        '\u26ac',
	        '\u29bf',
	        '\u2191',
	        '\u2192',
	        '\u2193',
	        '\u2190',
	        '\u2194',
	        '\u2195',
	        '\u25b2',
	        '\u25b6',
	        '\u25bc',
	        '\u25c0', // big left arrow
	    ].forEach((ch, i) => {
	        glyphs.draw(i, ch);
	    });
	    if (!basicOnly) {
	        // [
	        // '\u2302',
	        // '\u2b09', '\u272a', '\u2718', '\u2610', '\u2611', '\u25ef', '\u25ce', '\u2690',
	        // '\u2691', '\u2598', '\u2596', '\u259d', '\u2597', '\u2744', '\u272d', '\u2727',
	        // '\u25e3', '\u25e4', '\u25e2', '\u25e5', '\u25a8', '\u25a7', '\u259a', '\u265f',
	        // '\u265c', '\u265e', '\u265d', '\u265b', '\u265a', '\u301c', '\u2694', '\u2692',
	        // '\u25b6', '\u25bc', '\u25c0', '\u25b2', '\u25a4', '\u25a5', '\u25a6', '\u257a',
	        // '\u257b', '\u2578', '\u2579', '\u2581', '\u2594', '\u258f', '\u2595', '\u272d',
	        // '\u2591', '\u2592', '\u2593', '\u2503', '\u252b', '\u2561', '\u2562', '\u2556',
	        // '\u2555', '\u2563', '\u2551', '\u2557', '\u255d', '\u255c', '\u255b', '\u2513',
	        // '\u2517', '\u253b', '\u2533', '\u2523', '\u2501', '\u254b', '\u255e', '\u255f',
	        // '\u255a', '\u2554', '\u2569', '\u2566', '\u2560', '\u2550', '\u256c', '\u2567',
	        // '\u2568', '\u2564', '\u2565', '\u2559', '\u2558', '\u2552', '\u2553', '\u256b',
	        // '\u256a', '\u251b', '\u250f', '\u2588', '\u2585', '\u258c', '\u2590', '\u2580',
	        // '\u03b1', '\u03b2', '\u0393', '\u03c0', '\u03a3', '\u03c3', '\u03bc', '\u03c4',
	        // '\u03a6', '\u03b8', '\u03a9', '\u03b4', '\u221e', '\u03b8', '\u03b5', '\u03b7',
	        // '\u039e', '\u00b1', '\u2265', '\u2264', '\u2234', '\u2237', '\u00f7', '\u2248',
	        // '\u22c4', '\u22c5', '\u2217', '\u27b5', '\u2620', '\u2625', '\u25fc', '\u25fb'
	        // ].forEach( (ch, i) => {
	        //   this.draw(i + 127, ch);
	        // });
	        [
	            '\u2302',
	            '\u00C7',
	            '\u00FC',
	            '\u00E9',
	            '\u00E2',
	            '\u00E4',
	            '\u00E0',
	            '\u00E5',
	            '\u00E7',
	            '\u00EA',
	            '\u00EB',
	            '\u00E8',
	            '\u00EF',
	            '\u00EE',
	            '\u00EC',
	            '\u00C4',
	            '\u00C5',
	            '\u00C9',
	            '\u00E6',
	            '\u00C6',
	            '\u00F4',
	            '\u00F6',
	            '\u00F2',
	            '\u00FB',
	            '\u00F9',
	            '\u00FF',
	            '\u00D6',
	            '\u00DC',
	            '\u00A2',
	            '\u00A3',
	            '\u00A5',
	            '\u20A7',
	            '\u0192',
	            '\u00E1',
	            '\u00ED',
	            '\u00F3',
	            '\u00FA',
	            '\u00F1',
	            '\u00D1',
	            '\u00AA',
	            '\u00BA',
	            '\u00BF',
	            '\u2310',
	            '\u00AC',
	            '\u00BD',
	            '\u00BC',
	            '\u00A1',
	            '\u00AB',
	            '\u00BB',
	            '\u2591',
	            '\u2592',
	            '\u2593',
	            '\u2502',
	            '\u2524',
	            '\u2561',
	            '\u2562',
	            '\u2556',
	            '\u2555',
	            '\u2563',
	            '\u2551',
	            '\u2557',
	            '\u255D',
	            '\u255C',
	            '\u255B',
	            '\u2510',
	            '\u2514',
	            '\u2534',
	            '\u252C',
	            '\u251C',
	            '\u2500',
	            '\u253C',
	            '\u255E',
	            '\u255F',
	            '\u255A',
	            '\u2554',
	            '\u2569',
	            '\u2566',
	            '\u2560',
	            '\u2550',
	            '\u256C',
	            '\u2567',
	            '\u2568',
	            '\u2564',
	            '\u2565',
	            '\u2559',
	            '\u2558',
	            '\u2552',
	            '\u2553',
	            '\u256B',
	            '\u256A',
	            '\u2518',
	            '\u250C',
	            '\u2588',
	            '\u2584',
	            '\u258C',
	            '\u2590',
	            '\u2580',
	            '\u03B1',
	            '\u00DF',
	            '\u0393',
	            '\u03C0',
	            '\u03A3',
	            '\u03C3',
	            '\u00B5',
	            '\u03C4',
	            '\u03A6',
	            '\u0398',
	            '\u03A9',
	            '\u03B4',
	            '\u221E',
	            '\u03C6',
	            '\u03B5',
	            '\u2229',
	            '\u2261',
	            '\u00B1',
	            '\u2265',
	            '\u2264',
	            '\u2320',
	            '\u2321',
	            '\u00F7',
	            '\u2248',
	            '\u00B0',
	            '\u2219',
	            '\u00B7',
	            '\u221A',
	            '\u207F',
	            '\u00B2',
	            '\u25A0',
	            '\u00A0',
	        ].forEach((ch, i) => {
	            glyphs.draw(i + 127, ch);
	        });
	    }
	}

	const VS = `
#version 300 es

in vec2 position;
in uvec2 offset;
in uint fg;
in uint bg;
in uint glyph;

out vec2 fsOffset;
out vec4 fgRgb;
out vec4 bgRgb;
flat out uvec2 fontPos;

uniform int depth;

void main() {
	float fdepth = float(depth) / 255.0;
	gl_Position = vec4(position, fdepth, 1.0);

	float fgr = float((fg & uint(0xF000)) >> 12);
	float fgg = float((fg & uint(0x0F00)) >> 8);
	float fgb = float((fg & uint(0x00F0)) >> 4);
	float fga = float((fg & uint(0x000F)) >> 0);
	fgRgb = vec4(fgr, fgg, fgb, fga) / 15.0;
  
	float bgr = float((bg & uint(0xF000)) >> 12);
	float bgg = float((bg & uint(0x0F00)) >> 8);
	float bgb = float((bg & uint(0x00F0)) >> 4);
	float bga = float((bg & uint(0x000F)) >> 0);
	bgRgb = vec4(bgr, bgg, bgb, bga) / 15.0;

	uint glyphX = (glyph & uint(0xF));
	uint glyphY = (glyph >> 4);
	fontPos = uvec2(glyphX, glyphY);

	fsOffset = vec2(offset);
}`.trim();
	const FS = `
#version 300 es
precision highp float;

in vec2 fsOffset;
in vec4 fgRgb;
in vec4 bgRgb;
flat in uvec2 fontPos;

out vec4 fragColor;

uniform sampler2D font;
uniform uvec2 tileSize;

void main() {
	uvec2 fontPx = (tileSize * fontPos) + uvec2(vec2(tileSize) * fsOffset);
	vec4 texel = texelFetch(font, ivec2(fontPx), 0).rgba;

	fragColor = vec4(mix(bgRgb.rgb, fgRgb.rgb, texel.rgb), mix(bgRgb.a, fgRgb.a, texel.r));
}`.trim();

	class Event {
	    constructor(type, opts) {
	        this.target = null; // current handler information
	        // Used in UI
	        this.defaultPrevented = false;
	        this.propagationStopped = false;
	        this.immediatePropagationStopped = false;
	        // Key Event
	        this.key = '';
	        this.code = '';
	        this.shiftKey = false;
	        this.ctrlKey = false;
	        this.altKey = false;
	        this.metaKey = false;
	        // Dir Event extends KeyEvent
	        this.dir = null;
	        // Mouse Event
	        this.x = -1;
	        this.y = -1;
	        this.clientX = -1;
	        this.clientY = -1;
	        // Tick Event
	        this.dt = 0;
	        this.reset(type, opts);
	    }
	    preventDefault() {
	        this.defaultPrevented = true;
	    }
	    stopPropagation() {
	        this.propagationStopped = true;
	    }
	    stopImmediatePropagation() {
	        this.immediatePropagationStopped = true;
	    }
	    reset(type, opts) {
	        this.type = type;
	        this.target = null;
	        this.defaultPrevented = false;
	        this.shiftKey = false;
	        this.ctrlKey = false;
	        this.altKey = false;
	        this.metaKey = false;
	        this.key = '';
	        this.code = '';
	        this.x = -1;
	        this.y = -1;
	        this.dir = null;
	        this.dt = 0;
	        this.target = null;
	        if (opts) {
	            Object.assign(this, opts);
	        }
	    }
	    clone() {
	        const other = new Event(this.type, this);
	        return other;
	    }
	    dispatch(handler) {
	        if (this.type === KEYPRESS) {
	            if (this.dir) {
	                handler.trigger('dir', this);
	                if (this.propagationStopped)
	                    return;
	            }
	            handler.trigger(this.key, this);
	            if (this.propagationStopped)
	                return;
	            if (this.code !== this.key) {
	                handler.trigger(this.code, this);
	                if (this.propagationStopped)
	                    return;
	            }
	        }
	        handler.trigger(this.type, this);
	    }
	}
	// let IOMAP: IOMap = {};
	const DEAD_EVENTS = [];
	const KEYPRESS = 'keypress';
	const MOUSEMOVE = 'mousemove';
	const CLICK = 'click';
	const TICK = 'tick';
	const MOUSEUP = 'mouseup';
	const STOP = 'stop';
	const CONTROL_CODES = [
	    'ShiftLeft',
	    'ShiftRight',
	    'ControlLeft',
	    'ControlRight',
	    'AltLeft',
	    'AltRight',
	    'MetaLeft',
	    'MetaRight',
	    //
	    'Enter',
	    'Delete',
	    'Backspace',
	    'Tab',
	    'CapsLock',
	    'Escape',
	];
	function isControlCode(e) {
	    if (typeof e === 'string') {
	        return CONTROL_CODES.includes(e);
	    }
	    return CONTROL_CODES.includes(e.code);
	}
	// type EventHandler = (event: Event) => void;
	// export function setKeymap(keymap: IOMap) {
	//     IOMAP = keymap;
	// }
	// export function handlerFor(ev: EventType, km: Record<string, any>): any | null {
	//     let c;
	//     if ('dir' in ev) {
	//         c = km.dir || km.keypress;
	//     } else if (ev.type === KEYPRESS) {
	//         c = km[ev.key!] || km[ev.code!] || km.keypress;
	//     } else if (km[ev.type]) {
	//         c = km[ev.type];
	//     }
	//     if (!c) {
	//         c = km.dispatch;
	//     }
	//     return c || null;
	// }
	// export async function dispatchEvent(ev: Event, km: IOMap, thisArg?: any) {
	//     let result;
	//     km = km || IOMAP;
	//     if (ev.type === STOP) {
	//         recycleEvent(ev);
	//         return true; // Should stop loops, etc...
	//     }
	//     const handler = handlerFor(ev, km);
	//     if (handler) {
	//         // if (typeof c === 'function') {
	//         result = await handler.call(thisArg || km, ev);
	//         // } else if (commands[c]) {
	//         //     result = await commands[c](ev);
	//         // } else {
	//         //     Utils.WARN('No command found: ' + c);
	//         // }
	//     }
	//     // TODO - what is this here for?
	//     // if ('next' in km && km.next === false) {
	//     //     result = false;
	//     // }
	//     recycleEvent(ev);
	//     return result;
	// }
	function recycleEvent(ev) {
	    DEAD_EVENTS.push(ev);
	}
	// STOP
	function makeStopEvent() {
	    return makeCustomEvent(STOP);
	}
	// CUSTOM
	function makeCustomEvent(type, opts) {
	    const ev = DEAD_EVENTS.pop() || null;
	    if (!ev)
	        return new Event(type, opts);
	    ev.reset(type, opts);
	    return ev;
	}
	// TICK
	function makeTickEvent(dt) {
	    const ev = makeCustomEvent(TICK);
	    ev.dt = dt;
	    return ev;
	}
	// KEYBOARD
	function makeKeyEvent(e) {
	    let key = e.key;
	    let code = e.code; // .toLowerCase();
	    if (e.shiftKey) {
	        key = key.toUpperCase();
	        // code = code.toUpperCase();
	    }
	    if (e.ctrlKey) {
	        key = '^' + key;
	        // code = '^' + code;
	    }
	    if (e.metaKey) {
	        key = '#' + key;
	        // code = '#' + code;
	    }
	    if (e.altKey) ;
	    const ev = DEAD_EVENTS.pop() || new Event(KEYPRESS);
	    ev.shiftKey = e.shiftKey;
	    ev.ctrlKey = e.ctrlKey;
	    ev.altKey = e.altKey;
	    ev.metaKey = e.metaKey;
	    ev.type = KEYPRESS;
	    ev.defaultPrevented = false;
	    ev.key = key;
	    ev.code = code;
	    ev.x = -1;
	    ev.y = -1;
	    ev.clientX = -1;
	    ev.clientY = -1;
	    ev.dir = keyCodeDirection(e.code);
	    ev.dt = 0;
	    ev.target = null;
	    return ev;
	}
	function keyCodeDirection(key) {
	    const lowerKey = key.toLowerCase();
	    if (lowerKey === 'arrowup') {
	        return [0, -1];
	    }
	    else if (lowerKey === 'arrowdown') {
	        return [0, 1];
	    }
	    else if (lowerKey === 'arrowleft') {
	        return [-1, 0];
	    }
	    else if (lowerKey === 'arrowright') {
	        return [1, 0];
	    }
	    return null;
	}
	function ignoreKeyEvent(e) {
	    return CONTROL_CODES.includes(e.code);
	}
	// MOUSE
	function makeMouseEvent(e, x, y) {
	    const ev = DEAD_EVENTS.pop() || new Event(e.type);
	    ev.shiftKey = e.shiftKey;
	    ev.ctrlKey = e.ctrlKey;
	    ev.altKey = e.altKey;
	    ev.metaKey = e.metaKey;
	    ev.type = e.type || 'mousemove';
	    if (e.buttons && e.type !== 'mouseup') {
	        ev.type = CLICK;
	    }
	    ev.defaultPrevented = false;
	    ev.key = '';
	    ev.code = '';
	    ev.x = x;
	    ev.y = y;
	    ev.clientX = e.clientX;
	    ev.clientY = e.clientY;
	    ev.dir = null;
	    ev.dt = 0;
	    ev.target = null;
	    return ev;
	}
	class Queue {
	    constructor() {
	        this.lastClick = { x: -1, y: -1 };
	        this._events = [];
	    }
	    get length() {
	        return this._events.length;
	    }
	    clear() {
	        this._events.length = 0;
	    }
	    enqueue(ev) {
	        if (this._events.length) {
	            const last = this._events[this._events.length - 1];
	            if (last.type === ev.type) {
	                if (last.type === MOUSEMOVE) {
	                    last.x = ev.x;
	                    last.y = ev.y;
	                    recycleEvent(ev);
	                    return;
	                }
	            }
	        }
	        // Keep clicks down to one per cell if holding down mouse button
	        if (ev.type === CLICK) {
	            if (this.lastClick.x == ev.x && this.lastClick.y == ev.y) {
	                if (this._events.findIndex((e) => e.type === CLICK) >= 0) {
	                    recycleEvent(ev);
	                    return;
	                }
	            }
	            this.lastClick.x = ev.x;
	            this.lastClick.y = ev.y;
	        }
	        else if (ev.type == MOUSEUP) {
	            this.lastClick.x = -1;
	            this.lastClick.y = -1;
	            recycleEvent(ev);
	            return;
	        }
	        if (ev.type === TICK) {
	            const first = this._events[0];
	            if (first && first.type === TICK) {
	                first.dt += ev.dt;
	                recycleEvent(ev);
	                return;
	            }
	            this._events.unshift(ev); // ticks go first
	        }
	        else {
	            this._events.push(ev);
	        }
	    }
	    dequeue() {
	        return this._events.shift();
	    }
	    peek() {
	        return this._events[0];
	    }
	}

	// Based on: https://github.com/ondras/fastiles/blob/master/ts/scene.ts (v2.1.0)
	const VERTICES_PER_TILE = 6;
	class NotSupportedError extends Error {
	    constructor(...params) {
	        // Pass remaining arguments (including vendor specific ones) to parent constructor
	        super(...params);
	        // Maintains proper stack trace for where our error was thrown (only available on V8)
	        // @ts-ignore
	        if (Error.captureStackTrace) {
	            // @ts-ignore
	            Error.captureStackTrace(this, NotSupportedError);
	        }
	        this.name = 'NotSupportedError';
	    }
	}
	class Canvas {
	    constructor(options) {
	        this.mouse = { x: -1, y: -1 };
	        this._renderRequested = false;
	        this._autoRender = true;
	        this._width = 50;
	        this._height = 25;
	        this._layers = [];
	        if (!options.glyphs)
	            throw new Error('You must supply glyphs for the canvas.');
	        this._node = this._createNode();
	        this._createContext();
	        this._configure(options);
	    }
	    get node() {
	        return this._node;
	    }
	    get width() {
	        return this._width;
	    }
	    get height() {
	        return this._height;
	    }
	    get tileWidth() {
	        return this._glyphs.tileWidth;
	    }
	    get tileHeight() {
	        return this._glyphs.tileHeight;
	    }
	    get pxWidth() {
	        return this.node.clientWidth;
	    }
	    get pxHeight() {
	        return this.node.clientHeight;
	    }
	    get glyphs() {
	        return this._glyphs;
	    }
	    set glyphs(glyphs) {
	        this._setGlyphs(glyphs);
	    }
	    layer(depth = 0) {
	        let layer = this._layers.find((l) => l.depth === depth);
	        if (layer)
	            return layer;
	        layer = new Layer(this, depth);
	        this._layers.push(layer);
	        this._layers.sort((a, b) => a.depth - b.depth);
	        return layer;
	    }
	    clearLayer(depth = 0) {
	        const layer = this._layers.find((l) => l.depth === depth);
	        if (layer)
	            layer.clear();
	    }
	    removeLayer(depth = 0) {
	        const index = this._layers.findIndex((l) => l.depth === depth);
	        if (index > -1) {
	            this._layers.splice(index, 1);
	        }
	    }
	    _createNode() {
	        return document.createElement('canvas');
	    }
	    _configure(options) {
	        this._width = options.width || this._width;
	        this._height = options.height || this._height;
	        this._autoRender = options.render !== false;
	        this._setGlyphs(options.glyphs);
	        this.bg = from$2(options.bg || BLACK);
	        if (options.div) {
	            let el;
	            if (typeof options.div === 'string') {
	                el = document.getElementById(options.div);
	                if (!el) {
	                    console.warn('Failed to find parent element by ID: ' + options.div);
	                }
	            }
	            else {
	                el = options.div;
	            }
	            if (el && el.appendChild) {
	                el.appendChild(this.node);
	            }
	        }
	    }
	    _setGlyphs(glyphs) {
	        if (glyphs === this._glyphs)
	            return false;
	        this._glyphs = glyphs;
	        this.resize(this._width, this._height);
	        const gl = this._gl;
	        const uniforms = this._uniforms;
	        gl.uniform2uiv(uniforms['tileSize'], [this.tileWidth, this.tileHeight]);
	        this._uploadGlyphs();
	        return true;
	    }
	    resize(width, height) {
	        this._width = width;
	        this._height = height;
	        const node = this.node;
	        node.width = this._width * this.tileWidth;
	        node.height = this._height * this.tileHeight;
	        const gl = this._gl;
	        // const uniforms = this._uniforms;
	        gl.viewport(0, 0, this.node.width, this.node.height);
	        // gl.uniform2ui(uniforms["viewportSize"], this.node.width, this.node.height);
	        this._createGeometry();
	        this._createData();
	    }
	    _requestRender() {
	        if (this._renderRequested)
	            return;
	        this._renderRequested = true;
	        if (!this._autoRender)
	            return;
	        requestAnimationFrame(() => this._render());
	    }
	    hasXY(x, y) {
	        return x >= 0 && y >= 0 && x < this.width && y < this.height;
	    }
	    toX(x) {
	        return Math.floor((this.width * x) / this.node.clientWidth);
	    }
	    toY(y) {
	        return Math.floor((this.height * y) / this.node.clientHeight);
	    }
	    get onclick() {
	        throw new Error('Write only.');
	    }
	    set onclick(fn) {
	        if (fn) {
	            this.node.onclick = (e) => {
	                const x = this.toX(e.offsetX);
	                const y = this.toY(e.offsetY);
	                const ev = makeMouseEvent(e, x, y);
	                fn(ev);
	                e.preventDefault();
	            };
	        }
	        else {
	            this.node.onclick = null;
	        }
	    }
	    get onmousemove() {
	        throw new Error('write only.');
	    }
	    set onmousemove(fn) {
	        if (fn) {
	            this.node.onmousemove = (e) => {
	                const x = this.toX(e.offsetX);
	                const y = this.toY(e.offsetY);
	                if (x == this.mouse.x && y == this.mouse.y)
	                    return;
	                this.mouse.x = x;
	                this.mouse.y = y;
	                const ev = makeMouseEvent(e, x, y);
	                fn(ev);
	                e.preventDefault();
	            };
	        }
	        else {
	            this.node.onmousemove = null;
	        }
	    }
	    get onmouseup() {
	        throw new Error('write only.');
	    }
	    set onmouseup(fn) {
	        if (fn) {
	            this.node.onmouseup = (e) => {
	                const x = this.toX(e.offsetX);
	                const y = this.toY(e.offsetY);
	                const ev = makeMouseEvent(e, x, y);
	                fn(ev);
	                e.preventDefault();
	            };
	        }
	        else {
	            this.node.onmouseup = null;
	        }
	    }
	    get onkeydown() {
	        throw new Error('write only.');
	    }
	    set onkeydown(fn) {
	        if (fn) {
	            this.node.tabIndex = 0;
	            this.node.onkeydown = (e) => {
	                e.stopPropagation();
	                const ev = makeKeyEvent(e);
	                fn(ev);
	                e.preventDefault();
	            };
	        }
	        else {
	            this.node.onkeydown = null;
	        }
	    }
	    _createContext() {
	        let gl = this.node.getContext('webgl2');
	        if (!gl) {
	            throw new NotSupportedError('WebGL 2 not supported');
	        }
	        this._gl = gl;
	        this._buffers = {};
	        this._attribs = {};
	        this._uniforms = {};
	        const p = createProgram(gl, VS, FS);
	        gl.useProgram(p);
	        const attributeCount = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES);
	        for (let i = 0; i < attributeCount; i++) {
	            gl.enableVertexAttribArray(i);
	            let info = gl.getActiveAttrib(p, i);
	            this._attribs[info.name] = i;
	        }
	        const uniformCount = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
	        for (let i = 0; i < uniformCount; i++) {
	            let info = gl.getActiveUniform(p, i);
	            this._uniforms[info.name] = gl.getUniformLocation(p, info.name);
	        }
	        gl.uniform1i(this._uniforms['font'], 0);
	        this._texture = createTexture(gl);
	    }
	    _createGeometry() {
	        const gl = this._gl;
	        this._buffers.position && gl.deleteBuffer(this._buffers.position);
	        this._buffers.uv && gl.deleteBuffer(this._buffers.uv);
	        let buffers = createGeometry(gl, this._attribs, this.width, this.height);
	        Object.assign(this._buffers, buffers);
	    }
	    _createData() {
	        const gl = this._gl;
	        const attribs = this._attribs;
	        this._buffers.fg && gl.deleteBuffer(this._buffers.fg);
	        this._buffers.bg && gl.deleteBuffer(this._buffers.bg);
	        this._buffers.glyph && gl.deleteBuffer(this._buffers.glyph);
	        if (this._layers.length) {
	            this._layers.forEach((l) => l.detach());
	            this._layers.length = 0;
	        }
	        const fg = gl.createBuffer();
	        gl.bindBuffer(gl.ARRAY_BUFFER, fg);
	        gl.vertexAttribIPointer(attribs['fg'], 1, gl.UNSIGNED_SHORT, 0, 0);
	        const bg = gl.createBuffer();
	        gl.bindBuffer(gl.ARRAY_BUFFER, bg);
	        gl.vertexAttribIPointer(attribs['bg'], 1, gl.UNSIGNED_SHORT, 0, 0);
	        const glyph = gl.createBuffer();
	        gl.bindBuffer(gl.ARRAY_BUFFER, glyph);
	        gl.vertexAttribIPointer(attribs['glyph'], 1, gl.UNSIGNED_BYTE, 0, 0);
	        Object.assign(this._buffers, { fg, bg, glyph });
	    }
	    _uploadGlyphs() {
	        if (!this._glyphs.needsUpdate)
	            return;
	        const gl = this._gl;
	        gl.activeTexture(gl.TEXTURE0);
	        gl.bindTexture(gl.TEXTURE_2D, this._texture);
	        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._glyphs.node);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	        this._requestRender();
	        this._glyphs.needsUpdate = false;
	    }
	    draw(x, y, glyph, fg, bg) {
	        this.layer(0).draw(x, y, glyph, fg, bg);
	    }
	    render(buffer) {
	        if (buffer) {
	            this.layer().copy(buffer);
	        }
	        this._requestRender();
	    }
	    _render() {
	        const gl = this._gl;
	        if (this._glyphs.needsUpdate) {
	            // auto keep glyphs up to date
	            this._uploadGlyphs();
	        }
	        else if (!this._renderRequested) {
	            return;
	        }
	        this._renderRequested = false;
	        // clear to bg color?
	        gl.enable(gl.BLEND);
	        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	        gl.clearColor(this.bg.r / 100, this.bg.g / 100, this.bg.b / 100, this.bg.a / 100);
	        gl.clear(gl.COLOR_BUFFER_BIT);
	        // sort layers?
	        this._layers.forEach((layer) => {
	            if (layer.empty)
	                return;
	            // set depth
	            gl.uniform1i(this._uniforms['depth'], layer.depth);
	            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.fg);
	            gl.bufferData(gl.ARRAY_BUFFER, layer.fg, gl.DYNAMIC_DRAW);
	            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.bg);
	            gl.bufferData(gl.ARRAY_BUFFER, layer.bg, gl.DYNAMIC_DRAW);
	            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.glyph);
	            gl.bufferData(gl.ARRAY_BUFFER, layer.glyph, gl.DYNAMIC_DRAW);
	            gl.drawArrays(gl.TRIANGLES, 0, this._width * this._height * VERTICES_PER_TILE);
	        });
	    }
	}
	function withImage(image) {
	    let opts = {};
	    if (typeof image === 'string') {
	        opts.glyphs = Glyphs.fromImage(image);
	    }
	    else if (image instanceof HTMLImageElement) {
	        opts.glyphs = Glyphs.fromImage(image);
	    }
	    else {
	        if (!image.image)
	            throw new Error('You must supply the image.');
	        Object.assign(opts, image);
	        opts.glyphs = Glyphs.fromImage(image.image);
	    }
	    return new Canvas(opts);
	}
	function withFont(src) {
	    if (typeof src === 'string') {
	        src = { font: src };
	    }
	    src.glyphs = Glyphs.fromFont(src);
	    return new Canvas(src);
	}
	// Copy of: https://github.com/ondras/fastiles/blob/master/ts/utils.ts (v2.1.0)
	function createProgram(gl, ...sources) {
	    const p = gl.createProgram();
	    [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, index) => {
	        const shader = gl.createShader(type);
	        gl.shaderSource(shader, sources[index]);
	        gl.compileShader(shader);
	        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	            throw new Error(gl.getShaderInfoLog(shader));
	        }
	        gl.attachShader(p, shader);
	    });
	    gl.linkProgram(p);
	    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
	        throw new Error(gl.getProgramInfoLog(p));
	    }
	    return p;
	}
	function createTexture(gl) {
	    let t = gl.createTexture();
	    gl.bindTexture(gl.TEXTURE_2D, t);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	    return t;
	}
	// x, y offsets for 6 verticies (2 triangles) in square
	const QUAD = [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1];
	function createGeometry(gl, attribs, width, height) {
	    let tileCount = width * height;
	    let positionData = new Float32Array(tileCount * QUAD.length);
	    let offsetData = new Uint8Array(tileCount * QUAD.length);
	    for (let y = 0; y < height; y++) {
	        for (let x = 0; x < width; x++) {
	            const index = (x + y * width) * QUAD.length;
	            positionData.set(QUAD.map((v, i) => {
	                if (i % 2) {
	                    // y
	                    return 1 - (2 * (y + v)) / height;
	                }
	                else {
	                    return (2 * (x + v)) / width - 1;
	                }
	            }), index);
	            offsetData.set(QUAD, index);
	        }
	    }
	    const position = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, position);
	    gl.vertexAttribPointer(attribs['position'], 2, gl.FLOAT, false, 0, 0);
	    gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
	    const uv = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, uv);
	    gl.vertexAttribIPointer(attribs['offset'], 2, gl.UNSIGNED_BYTE, 0, 0);
	    gl.bufferData(gl.ARRAY_BUFFER, offsetData, gl.STATIC_DRAW);
	    return { position, uv };
	}

	class Layer extends BufferBase {
	    constructor(canvas, depth = 0) {
	        super(canvas.width, canvas.height);
	        this._empty = true;
	        this.canvas = canvas;
	        this.resize(canvas.width, canvas.height);
	        this._depth = depth;
	    }
	    get width() {
	        return this.canvas.width;
	    }
	    get height() {
	        return this.canvas.height;
	    }
	    get depth() {
	        return this._depth;
	    }
	    get empty() {
	        return this._empty;
	    }
	    detach() {
	        // @ts-ignore
	        this.canvas = null;
	    }
	    resize(width, height) {
	        const size = width * height * VERTICES_PER_TILE;
	        if (!this.fg || this.fg.length !== size) {
	            this.fg = new Uint16Array(size);
	            this.bg = new Uint16Array(size);
	            this.glyph = new Uint8Array(size);
	        }
	    }
	    clear() {
	        this.fg.fill(0);
	        this.bg.fill(0);
	        this.glyph.fill(0);
	        this._empty = true;
	    }
	    get(x, y) {
	        const index = x * y * VERTICES_PER_TILE;
	        return {
	            ch: this.fromGlyph(this.glyph[index]),
	            fg: this.fg[index],
	            bg: this.bg[index],
	        };
	    }
	    set(x, y, glyph = null, fg = 0xfff, bg = -1) {
	        return this.draw(x, y, glyph, fg, bg);
	    }
	    draw(x, y, glyph = null, fg = 0xfff, bg = -1) {
	        const index = x + y * this.canvas.width;
	        if (typeof glyph === 'string') {
	            glyph = this.toGlyph(glyph);
	        }
	        else if (glyph === null) {
	            glyph = this.glyph[index];
	        }
	        fg = from$2(fg).toInt();
	        bg = from$2(bg).toInt();
	        this._set(index, glyph, fg, bg);
	        if (glyph || bg || fg) {
	            this._empty = false;
	            this.canvas._requestRender();
	        }
	        return this;
	    }
	    _set(index, glyph, fg, bg) {
	        index *= VERTICES_PER_TILE;
	        glyph = glyph & 0xff;
	        bg = bg & 0xffff;
	        fg = fg & 0xffff;
	        for (let i = 0; i < VERTICES_PER_TILE; ++i) {
	            this.glyph[index + i] = glyph;
	            this.fg[index + i] = fg;
	            this.bg[index + i] = bg;
	        }
	    }
	    nullify(...args) {
	        if (args.length === 2) {
	            this._set(args[0] * args[1], 0, 0, 0);
	        }
	        else {
	            this.glyph.fill(0);
	            this.fg.fill(0);
	            this.bg.fill(0);
	        }
	    }
	    dump() {
	        const data = [];
	        let header = '    ';
	        for (let x = 0; x < this.width; ++x) {
	            if (x % 10 == 0)
	                header += ' ';
	            header += x % 10;
	        }
	        data.push(header);
	        data.push('');
	        for (let y = 0; y < this.height; ++y) {
	            let line = `${('' + y).padStart(2)}] `;
	            for (let x = 0; x < this.width; ++x) {
	                if (x % 10 == 0)
	                    line += ' ';
	                const data = this.get(x, y);
	                let glyph = data.ch;
	                if (glyph === null)
	                    glyph = ' ';
	                line += glyph;
	            }
	            data.push(line);
	        }
	        console.log(data.join('\n'));
	    }
	    copy(buffer) {
	        if (buffer.width !== this.width || buffer.height !== this.height) {
	            console.log('auto resizing buffer');
	            buffer.resize(this.width, this.height);
	        }
	        if (!this.canvas) {
	            throw new Error('Layer is detached.  Did you resize the canvas?');
	        }
	        buffer._data.forEach((mixer, i) => {
	            let glyph = mixer.ch ? this.canvas.glyphs.forChar(mixer.ch) : 0;
	            this._set(i, glyph, mixer.fg.toInt(), mixer.bg.toInt());
	        });
	        this._empty = false;
	        this.canvas._requestRender();
	    }
	    copyTo(buffer) {
	        buffer.resize(this.width, this.height);
	        for (let y = 0; y < this.height; ++y) {
	            for (let x = 0; x < this.width; ++x) {
	                const index = (x + y * this.width) * VERTICES_PER_TILE;
	                buffer.draw(x, y, this.toChar(this.glyph[index]), this.fg[index], this.bg[index]);
	            }
	        }
	    }
	    toGlyph(ch) {
	        return this.canvas.glyphs.forChar(ch);
	    }
	    fromGlyph(n) {
	        return this.canvas.glyphs.toChar(n);
	    }
	    toChar(n) {
	        return this.canvas.glyphs.toChar(n);
	    }
	}

	class Buffer extends Buffer$1 {
	    constructor(layer) {
	        super(layer.width, layer.height);
	        this._layer = layer;
	        layer.copyTo(this);
	    }
	    // get canvas() { return this._target; }
	    toGlyph(ch) {
	        if (typeof ch === 'number')
	            return ch;
	        return this._layer.toGlyph(ch);
	    }
	    render() {
	        this._layer.copy(this);
	        return this;
	    }
	    copyFromLayer() {
	        this._layer.copyTo(this);
	        return this;
	    }
	}

	function make$6(...args) {
	    let width = args[0];
	    let height = args[1];
	    let opts = args[2];
	    if (args.length == 1) {
	        opts = args[0];
	        height = opts.height || 34;
	        width = opts.width || 80;
	    }
	    opts = opts || { font: 'monospace' };
	    let glyphs;
	    if (opts.image) {
	        glyphs = Glyphs.fromImage(opts.image);
	    }
	    else {
	        glyphs = Glyphs.fromFont(opts);
	    }
	    const canvas = new Canvas({ width, height, glyphs });
	    if (opts.div) {
	        let el;
	        if (typeof opts.div === 'string') {
	            el = document.getElementById(opts.div);
	            if (!el) {
	                console.warn('Failed to find parent element by ID: ' + opts.div);
	            }
	        }
	        else {
	            el = opts.div;
	        }
	        if (el && el.appendChild) {
	            el.appendChild(canvas.node);
	        }
	    }
	    return canvas;
	}

	var index$5 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Glyphs: Glyphs,
		initGlyphs: initGlyphs,
		Layer: Layer,
		Buffer: Buffer,
		VERTICES_PER_TILE: VERTICES_PER_TILE,
		NotSupportedError: NotSupportedError,
		Canvas: Canvas,
		withImage: withImage,
		withFont: withFont,
		createProgram: createProgram,
		QUAD: QUAD,
		make: make$6
	});

	class Sprite {
	    constructor(ch, fg, bg, opacity = 100) {
	        if (!ch)
	            ch = null;
	        this.ch = ch;
	        this.fg = from$2(fg);
	        this.bg = from$2(bg);
	        this.opacity = clamp(opacity, 0, 100);
	    }
	    clone() {
	        return new Sprite(this.ch, this.fg, this.bg, this.opacity);
	    }
	    toString() {
	        const parts = [];
	        if (this.ch)
	            parts.push('ch: ' + this.ch);
	        if (!this.fg.isNull())
	            parts.push('fg: ' + this.fg.toString());
	        if (!this.bg.isNull())
	            parts.push('bg: ' + this.bg.toString());
	        if (this.opacity !== 100)
	            parts.push('opacity: ' + this.opacity);
	        return '{ ' + parts.join(', ') + ' }';
	    }
	}
	const sprites = {};
	function make$5(...args) {
	    let ch = null, fg = -1, bg = -1, opacity;
	    if (args.length == 0) {
	        return new Sprite(null, -1, -1);
	    }
	    else if (args.length == 1 && Array.isArray(args[0])) {
	        args = args[0];
	    }
	    if (args.length > 3) {
	        opacity = args[3];
	        args.pop();
	    }
	    else if (args.length == 2 &&
	        typeof args[1] == 'number' &&
	        args[0].length > 1) {
	        opacity = args.pop();
	    }
	    if (args.length > 1) {
	        ch = args[0] || null;
	        fg = args[1];
	        bg = args[2];
	    }
	    else {
	        if (typeof args[0] === 'string' && args[0].length == 1) {
	            ch = args[0];
	            fg = 'white'; // white is default?
	        }
	        else if ((typeof args[0] === 'string' && args[0].length > 1) ||
	            typeof args[0] === 'number') {
	            bg = args[0];
	        }
	        else if (args[0] instanceof Color) {
	            bg = args[0];
	        }
	        else {
	            const sprite = args[0];
	            ch = sprite.ch || null;
	            fg = sprite.fg || -1;
	            bg = sprite.bg || -1;
	            opacity = sprite.opacity;
	        }
	    }
	    if (typeof fg === 'string')
	        fg = from$2(fg);
	    else if (Array.isArray(fg))
	        fg = make$9(fg);
	    else if (fg === undefined || fg === null)
	        fg = -1;
	    if (typeof bg === 'string')
	        bg = from$2(bg);
	    else if (Array.isArray(bg))
	        bg = make$9(bg);
	    else if (bg === undefined || bg === null)
	        bg = -1;
	    return new Sprite(ch, fg, bg, opacity);
	}
	function from$1(config) {
	    if (typeof config === 'string') {
	        const sprite = sprites[config];
	        if (!sprite)
	            throw new Error('Failed to find sprite: ' + config);
	        return sprite;
	    }
	    return make$5(config);
	}
	function install$1(name, ...args) {
	    let sprite;
	    // @ts-ignore
	    sprite = make$5(...args);
	    sprite.name = name;
	    sprites[name] = sprite;
	    return sprite;
	}

	var index$4 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Sprite: Sprite,
		sprites: sprites,
		make: make$5,
		from: from$1,
		install: install$1,
		Mixer: Mixer,
		makeMixer: makeMixer
	});

	var types = /*#__PURE__*/Object.freeze({
		__proto__: null
	});

	class Cache {
	    constructor(opts = {}) {
	        this._archive = [];
	        this._confirmed = [];
	        this.archiveLen = 30;
	        this.msgWidth = 80;
	        this._nextWriteIndex = 0;
	        // _needsUpdate = true;
	        this._combatMsg = null;
	        this.archiveLen = opts.length || 30;
	        this.msgWidth = opts.width || 80;
	        this._reverse = opts.reverseMultiLine || false;
	        this.clear();
	    }
	    clear() {
	        for (let i = 0; i < this.archiveLen; ++i) {
	            this._archive[i] = null;
	            this._confirmed[i] = false;
	        }
	        this._nextWriteIndex = 0;
	        // this._needsUpdate = true;
	        this._combatMsg = null;
	    }
	    // get needsUpdate(): boolean {
	    //     return this._needsUpdate;
	    // }
	    // set needsUpdate(needs: boolean) {
	    //     this._needsUpdate = needs;
	    // }
	    // function messageWithoutCaps(msg, requireAcknowledgment) {
	    _addMessageLine(msg) {
	        if (!length(msg)) {
	            return;
	        }
	        // Add the message to the archive.
	        this._archive[this._nextWriteIndex] = msg;
	        this._confirmed[this._nextWriteIndex] = false;
	        this._nextWriteIndex = (this._nextWriteIndex + 1) % this.archiveLen;
	    }
	    add(msg) {
	        this.commitCombatMessage();
	        this._addMessage(msg);
	    }
	    _addMessage(msg) {
	        msg = capitalize(msg);
	        // // Implement the American quotation mark/period/comma ordering rule.
	        // for (i=0; text.text[i] && text.text[i+1]; i++) {
	        //     if (text.charCodeAt(i) === COLOR_ESCAPE) {
	        //         i += 4;
	        //     } else if (text.text[i] === '"'
	        //                && (text.text[i+1] === '.' || text.text[i+1] === ','))
	        // 		{
	        // 			const replace = text.text[i+1] + '"';
	        // 			text.spliceRaw(i, 2, replace);
	        //     }
	        // }
	        const lines = splitIntoLines(msg, this.msgWidth);
	        if (this._reverse) {
	            lines.reverse();
	        }
	        lines.forEach((l) => this._addMessageLine(l));
	        // display the message:
	        // if (GAME.playbackMode) {
	        // 	GAME.playbackDelayThisTurn += GAME.playbackDelayPerTurn * 5;
	        // }
	    }
	    addCombat(msg) {
	        this._addCombatMessage(msg);
	    }
	    _addCombatMessage(msg) {
	        if (!this._combatMsg) {
	            this._combatMsg = msg;
	        }
	        else {
	            this._combatMsg += ', ' + capitalize(msg);
	        }
	    }
	    commitCombatMessage() {
	        if (!this._combatMsg)
	            return false;
	        this._addMessage(this._combatMsg + '.');
	        this._combatMsg = null;
	        return true;
	    }
	    confirmAll() {
	        for (let i = 0; i < this._confirmed.length; i++) {
	            this._confirmed[i] = true;
	        }
	    }
	    forEach(fn) {
	        this.commitCombatMessage();
	        for (let i = 0; i < this.archiveLen; ++i) {
	            const n = (this.archiveLen - i + this._nextWriteIndex - 1) %
	                this.archiveLen;
	            const msg = this._archive[n];
	            if (!msg)
	                return;
	            if (fn(msg, this._confirmed[n], i) === false)
	                return;
	        }
	    }
	    get length() {
	        let count = 0;
	        this.forEach(() => ++count);
	        return count;
	    }
	}

	var message = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Cache: Cache
	});

	const data = {};
	const config$1 = {};
	// export const make: any = {};
	// export const flags: any = {};

	class Blob {
	    constructor(opts = {}) {
	        this.options = {
	            rng: random,
	            rounds: 5,
	            minWidth: 10,
	            minHeight: 10,
	            maxWidth: 40,
	            maxHeight: 20,
	            percentSeeded: 50,
	            birthParameters: 'ffffffttt',
	            survivalParameters: 'ffffttttt',
	        };
	        Object.assign(this.options, opts);
	        this.options.birthParameters = this.options.birthParameters.toLowerCase();
	        this.options.survivalParameters = this.options.survivalParameters.toLowerCase();
	        if (this.options.minWidth >= this.options.maxWidth) {
	            this.options.minWidth = Math.round(0.75 * this.options.maxWidth);
	            this.options.maxWidth = Math.round(1.25 * this.options.maxWidth);
	        }
	        if (this.options.minHeight >= this.options.maxHeight) {
	            this.options.minHeight = Math.round(0.75 * this.options.maxHeight);
	            this.options.maxHeight = Math.round(1.25 * this.options.maxHeight);
	        }
	    }
	    carve(width, height, setFn) {
	        let i, j, k;
	        let blobNumber, blobSize, topBlobNumber, topBlobSize;
	        let bounds = new Bounds(0, 0, 0, 0);
	        const dest = alloc(width, height);
	        const left = Math.floor((dest.width - this.options.maxWidth) / 2);
	        const top = Math.floor((dest.height - this.options.maxHeight) / 2);
	        let tries = 10;
	        // Generate blobs until they satisfy the minBlobWidth and minBlobHeight restraints
	        do {
	            // Clear buffer.
	            dest.fill(0);
	            // Fill relevant portion with noise based on the percentSeeded argument.
	            for (i = 0; i < this.options.maxWidth; i++) {
	                for (j = 0; j < this.options.maxHeight; j++) {
	                    dest[i + left][j + top] = this.options.rng.chance(this.options.percentSeeded)
	                        ? 1
	                        : 0;
	                }
	            }
	            // Some iterations of cellular automata
	            for (k = 0; k < this.options.rounds; k++) {
	                if (!this._cellularAutomataRound(dest)) {
	                    k = this.options.rounds; // cellularAutomataRound did not make any changes
	                }
	            }
	            // Now to measure the result. These are best-of variables; start them out at worst-case values.
	            topBlobSize = 0;
	            topBlobNumber = 0;
	            // Fill each blob with its own number, starting with 2 (since 1 means floor), and keeping track of the biggest:
	            blobNumber = 2;
	            for (i = 0; i < dest.width; i++) {
	                for (j = 0; j < dest.height; j++) {
	                    if (dest[i][j] == 1) {
	                        // an unmarked blob
	                        // Mark all the cells and returns the total size:
	                        blobSize = dest.floodFill(i, j, 1, blobNumber);
	                        if (blobSize > topBlobSize) {
	                            // if this blob is a new record
	                            topBlobSize = blobSize;
	                            topBlobNumber = blobNumber;
	                        }
	                        blobNumber++;
	                    }
	                }
	            }
	            // Figure out the top blob's height and width:
	            dest.valueBounds(topBlobNumber, bounds);
	        } while ((bounds.width < this.options.minWidth ||
	            bounds.height < this.options.minHeight ||
	            topBlobNumber == 0) &&
	            --tries);
	        // Replace the winning blob with 1's, and everything else with 0's:
	        for (i = 0; i < dest.width; i++) {
	            for (j = 0; j < dest.height; j++) {
	                if (dest[i][j] == topBlobNumber) {
	                    setFn(i, j);
	                }
	            }
	        }
	        free(dest);
	        // Populate the returned variables.
	        return bounds;
	    }
	    _cellularAutomataRound(grid$1) {
	        let i, j, nbCount, newX, newY;
	        let dir;
	        let buffer2;
	        buffer2 = alloc(grid$1.width, grid$1.height);
	        buffer2.copy(grid$1); // Make a backup of this in buffer2, so that each generation is isolated.
	        let didSomething = false;
	        for (i = 0; i < grid$1.width; i++) {
	            for (j = 0; j < grid$1.height; j++) {
	                nbCount = 0;
	                for (dir = 0; dir < DIRS$2.length; dir++) {
	                    newX = i + DIRS$2[dir][0];
	                    newY = j + DIRS$2[dir][1];
	                    if (grid$1.hasXY(newX, newY) && buffer2[newX][newY]) {
	                        nbCount++;
	                    }
	                }
	                if (!buffer2[i][j] &&
	                    this.options.birthParameters[nbCount] == 't') {
	                    grid$1[i][j] = 1; // birth
	                    didSomething = true;
	                }
	                else if (buffer2[i][j] &&
	                    this.options.survivalParameters[nbCount] == 't') ;
	                else {
	                    grid$1[i][j] = 0; // death
	                    didSomething = true;
	                }
	            }
	        }
	        free(buffer2);
	        return didSomething;
	    }
	}
	function fillBlob(grid, opts = {}) {
	    const blob = new Blob(opts);
	    return blob.carve(grid.width, grid.height, (x, y) => (grid[x][y] = 1));
	}
	function make$4(opts = {}) {
	    return new Blob(opts);
	}

	var blob = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Blob: Blob,
		fillBlob: fillBlob,
		make: make$4
	});

	// const LIGHT_SMOOTHING_THRESHOLD = 150;       // light components higher than this magnitude will be toned down a little
	const config = (config$1.light = {
	    INTENSITY_DARK: 20,
	    INTENSITY_SHADOW: 50,
	}); // less than 20% for highest color in rgb
	let LIGHT_COMPONENTS = make$9();
	class Light {
	    constructor(color, radius = 1, fadeTo = 0, pass = false) {
	        this.fadeTo = 0;
	        this.passThroughActors = false;
	        this.id = null;
	        this.color = from$2(color); /* color */
	        this.radius = make$c(radius);
	        this.fadeTo = fadeTo;
	        this.passThroughActors = pass; // generally no, but miner light does (TODO - string parameter?  'false' or 'true')
	    }
	    copy(other) {
	        this.color = other.color;
	        this.radius.copy(other.radius);
	        this.fadeTo = other.fadeTo;
	        this.passThroughActors = other.passThroughActors;
	    }
	    get intensity() {
	        return intensity(this.color);
	    }
	    // Returns true if any part of the light hit cells that are in the player's field of view.
	    paint(site, x, y, maintainShadows = false, isMinersLight = false) {
	        if (!site)
	            return false;
	        let k;
	        // let colorComponents = [0,0,0];
	        let lightMultiplier = 0;
	        let radius = this.radius.value();
	        let outerRadius = Math.ceil(radius);
	        if (outerRadius < 1)
	            return false;
	        // calcLightComponents(colorComponents, this);
	        LIGHT_COMPONENTS = this.color.bake();
	        // console.log('paint', LIGHT_COMPONENTS.toString(true), x, y, outerRadius);
	        // the miner's light does not dispel IS_IN_SHADOW,
	        // so the player can be in shadow despite casting his own light.
	        const dispelShadows = !isMinersLight &&
	            !maintainShadows &&
	            !isDarkLight(LIGHT_COMPONENTS);
	        const fadeToPercent = this.fadeTo;
	        const grid$1 = alloc(site.width, site.height, 0);
	        site.calcFov(x, y, outerRadius, this.passThroughActors, (i, j) => {
	            grid$1[i][j] = 1;
	        });
	        // let overlappedFieldOfView = false;
	        const lightValue = [0, 0, 0];
	        grid$1.forCircle(x, y, outerRadius, (v, i, j) => {
	            if (!v)
	                return;
	            // const cell = map.cell(i, j);
	            lightMultiplier = Math.floor(100 -
	                (100 - fadeToPercent) *
	                    (distanceBetween(x, y, i, j) / radius));
	            for (k = 0; k < 3; ++k) {
	                lightValue[k] = Math.floor((LIGHT_COMPONENTS._data[k] * lightMultiplier) / 100);
	            }
	            site.addCellLight(i, j, lightValue, dispelShadows);
	            // if (dispelShadows) {
	            //     map.clearCellFlag(i, j, CellFlags.IS_IN_SHADOW);
	            // }
	            // if (map.isVisible(i, j)) {
	            //     overlappedFieldOfView = true;
	            // }
	            // console.log(i, j, lightMultiplier, cell.light);
	        });
	        // if (dispelShadows) {
	        //     map.clearCellFlag(x, y, CellFlags.IS_IN_SHADOW);
	        // }
	        free(grid$1);
	        // return overlappedFieldOfView;
	        return true;
	    }
	}
	function intensity(light) {
	    let data = light;
	    if (light instanceof Color) {
	        data = light._data;
	    }
	    return Math.max(data[0], data[1], data[2]);
	}
	function isDarkLight(light, threshold = 20) {
	    return intensity(light) <= threshold;
	}
	function isShadowLight(light, threshold = 40) {
	    return intensity(light) <= threshold;
	}
	function make$3(...args) {
	    if (args.length == 1) {
	        const config = args[0];
	        if (typeof config === 'string') {
	            const cached = lights[config];
	            if (cached)
	                return cached;
	            const [color, radius, fadeTo, pass] = config
	                .split(/[,|]/)
	                .map((t) => t.trim());
	            return new Light(from$2(color), from$4(radius || 1), Number.parseInt(fadeTo || '0'), !!pass && pass !== 'false');
	        }
	        else if (Array.isArray(config)) {
	            const [color, radius, fadeTo, pass] = config;
	            return new Light(color, radius, fadeTo, pass);
	        }
	        else if (config && config.color) {
	            return new Light(from$2(config.color), from$4(config.radius), Number.parseInt(config.fadeTo || '0'), config.pass);
	        }
	        else {
	            throw new Error('Unknown Light config - ' + config);
	        }
	    }
	    else {
	        const [color, radius, fadeTo, pass] = args;
	        return new Light(color, radius, fadeTo, pass);
	    }
	}
	const lights = {};
	function from(...args) {
	    if (args.length != 1)
	        ERROR('Unknown Light config: ' + JSON.stringify(args));
	    const arg = args[0];
	    if (typeof arg === 'string') {
	        const cached = lights[arg];
	        if (cached)
	            return cached;
	    }
	    if (arg && arg.paint)
	        return arg;
	    return make$3(arg);
	}
	function install(id, ...args) {
	    let source;
	    if (args.length == 1) {
	        source = make$3(args[0]);
	    }
	    else {
	        source = make$3(args[0], args[1], args[2], args[3]);
	    }
	    lights[id] = source;
	    source.id = id;
	    return source;
	}
	function installAll(config) {
	    const entries = Object.entries(config);
	    entries.forEach(([name, info]) => {
	        install(name, info);
	    });
	}
	// // TODO - Move?
	// export function playerInDarkness(
	//     map: Types.LightSite,
	//     PLAYER: Utils.XY,
	//     darkColor?: Color.Color
	// ) {
	//     const cell = map.cell(PLAYER.x, PLAYER.y);
	//     return cell.isDark(darkColor);
	//     // return (
	//     //   cell.light[0] + 10 < darkColor.r &&
	//     //   cell.light[1] + 10 < darkColor.g &&
	//     //   cell.light[2] + 10 < darkColor.b
	//     // );
	// }

	const LightFlags = make$a([
	    'LIT',
	    'IN_SHADOW',
	    'DARK',
	    // 'MAGIC_DARK',
	    'CHANGED',
	]);
	class LightSystem {
	    constructor(map, opts = {}) {
	        this.staticLights = null;
	        this.site = map;
	        this.ambient = from$2(opts.ambient || 'white').toLight();
	        this.changed = false;
	        this.glowLightChanged = false;
	        this.dynamicLightChanged = false;
	        this.light = make$e(map.width, map.height, () => this.ambient.slice());
	        this.glowLight = make$e(map.width, map.height, () => this.ambient.slice());
	        this.oldLight = make$e(map.width, map.height, () => this.ambient.slice());
	        this.flags = make$e(map.width, map.height);
	        this.finishLightUpdate();
	    }
	    copy(other) {
	        this.setAmbient(other.ambient);
	        this.glowLightChanged = true;
	        this.dynamicLightChanged = true;
	        this.changed = true;
	        this.staticLights = null;
	        forEach(other.staticLights, (info) => this.addStatic(info.x, info.y, info.light));
	    }
	    getAmbient() {
	        return this.ambient;
	    }
	    setAmbient(light) {
	        if (light instanceof Color) {
	            light = light.toLight();
	        }
	        else if (!Array.isArray(light)) {
	            light = from$2(light).toLight();
	        }
	        for (let i = 0; i < 3; ++i) {
	            this.ambient[i] = light[i];
	        }
	        this.glowLightChanged = true;
	    }
	    get needsUpdate() {
	        return this.glowLightChanged || this.dynamicLightChanged;
	    }
	    getLight(x, y) {
	        return this.light[x][y];
	    }
	    setLight(x, y, light) {
	        const val = this.light[x][y];
	        for (let i = 0; i < 3; ++i) {
	            val[i] = light[i];
	        }
	    }
	    isLit(x, y) {
	        return !!(this.flags[x][y] & LightFlags.LIT);
	    }
	    isDark(x, y) {
	        return !!(this.flags[x][y] & LightFlags.DARK);
	    }
	    isInShadow(x, y) {
	        return !!(this.flags[x][y] & LightFlags.IN_SHADOW);
	    }
	    // isMagicDark(x: number, y: number): boolean {
	    //     return !!(this.flags[x][y] & LightFlags.MAGIC_DARK);
	    // }
	    lightChanged(x, y) {
	        return !!(this.flags[x][y] & LightFlags.CHANGED);
	    }
	    // setMagicDark(x: number, y: number, isDark = true) {
	    //     if (isDark) {
	    //         this.flags[x][y] |= LightFlags.MAGIC_DARK;
	    //     } else {
	    //         this.flags[x][y] &= ~LightFlags.MAGIC_DARK;
	    //     }
	    // }
	    get width() {
	        return this.site.width;
	    }
	    get height() {
	        return this.site.height;
	    }
	    addStatic(x, y, light) {
	        const info = {
	            x,
	            y,
	            light: from(light),
	            next: this.staticLights,
	        };
	        this.staticLights = info;
	        this.glowLightChanged = true;
	        return info;
	    }
	    removeStatic(x, y, light) {
	        let prev = this.staticLights;
	        if (!prev)
	            return;
	        function matches(info) {
	            if (info.x != x || info.y != y)
	                return false;
	            return !light || light === info.light;
	        }
	        this.glowLightChanged = true;
	        while (prev && matches(prev)) {
	            prev = this.staticLights = prev.next;
	        }
	        if (!prev)
	            return;
	        let current = prev.next;
	        while (current) {
	            if (matches(current)) {
	                prev.next = current.next;
	            }
	            else {
	                prev = current;
	            }
	            current = current.next;
	        }
	    }
	    eachStaticLight(fn) {
	        forEach(this.staticLights, (info) => fn(info.x, info.y, info.light));
	        this.site.eachGlowLight((x, y, light) => {
	            fn(x, y, light);
	        });
	    }
	    eachDynamicLight(fn) {
	        this.site.eachDynamicLight(fn);
	    }
	    update(force = false) {
	        this.changed = false;
	        if (!force && !this.needsUpdate)
	            return false;
	        // Copy Light over oldLight
	        this.startLightUpdate();
	        if (!this.glowLightChanged) {
	            this.restoreGlowLights();
	        }
	        else {
	            // GW.debug.log('painting glow lights.');
	            // Paint all glowing tiles.
	            this.eachStaticLight((x, y, light) => {
	                light.paint(this, x, y);
	            });
	            this.recordGlowLights();
	            this.glowLightChanged = false;
	        }
	        // Cycle through monsters and paint their lights:
	        this.eachDynamicLight((x, y, light) => light.paint(this, x, y)
	        // if (monst.mutationIndex >= 0 && mutationCatalog[monst.mutationIndex].light != lights['NO_LIGHT']) {
	        //     paint(map, mutationCatalog[monst.mutationIndex].light, actor.x, actor.y, false, false);
	        // }
	        // if (actor.isBurning()) { // monst.status.burning && !(actor.kind.flags & Flags.Actor.AF_FIERY)) {
	        // 	paint(map, lights.BURNING_CREATURE, actor.x, actor.y, false, false);
	        // }
	        // if (actor.isTelepathicallyRevealed()) {
	        // 	paint(map, lights['TELEPATHY_LIGHT'], actor.x, actor.y, false, true);
	        // }
	        );
	        // Also paint telepathy lights for dormant monsters.
	        // for (monst of map.dormantMonsters) {
	        //     if (monsterTelepathicallyRevealed(monst)) {
	        //         paint(map, lights['TELEPATHY_LIGHT'], monst.xLoc, monst.yLoc, false, true);
	        //     }
	        // }
	        this.finishLightUpdate();
	        // Miner's light:
	        const PLAYER = data.player;
	        if (PLAYER) {
	            const PLAYERS_LIGHT = lights.PLAYERS_LIGHT;
	            if (PLAYERS_LIGHT) {
	                PLAYERS_LIGHT.paint(this, PLAYER.x, PLAYER.y, true, true);
	            }
	        }
	        this.dynamicLightChanged = false;
	        this.changed = true;
	        // if (PLAYER.status.invisible) {
	        //     PLAYER.info.foreColor = playerInvisibleColor;
	        // } else if (playerInDarkness()) {
	        // 	PLAYER.info.foreColor = playerInDarknessColor;
	        // } else if (pmap[PLAYER.xLoc][PLAYER.yLoc].flags & IS_IN_SHADOW) {
	        // 	PLAYER.info.foreColor = playerInShadowColor;
	        // } else {
	        // 	PLAYER.info.foreColor = playerInLightColor;
	        // }
	        return true;
	    }
	    startLightUpdate() {
	        // record Old Lights
	        // and then zero out Light.
	        let i = 0;
	        const flag = isShadowLight(this.ambient)
	            ? LightFlags.IN_SHADOW
	            : 0;
	        this.light.forEach((val, x, y) => {
	            for (i = 0; i < 3; ++i) {
	                this.oldLight[x][y][i] = val[i];
	                val[i] = this.ambient[i];
	            }
	            this.flags[x][y] = flag;
	        });
	    }
	    finishLightUpdate() {
	        forRect(this.width, this.height, (x, y) => {
	            // clear light flags
	            // this.flags[x][y] &= ~(LightFlags.LIT | LightFlags.DARK);
	            const oldLight = this.oldLight[x][y];
	            const light = this.light[x][y];
	            if (light.some((v, i) => v !== oldLight[i])) {
	                this.flags[x][y] |= LightFlags.CHANGED;
	            }
	            if (isDarkLight(light)) {
	                this.flags[x][y] |= LightFlags.DARK;
	            }
	            else if (!isShadowLight(light)) {
	                this.flags[x][y] |= LightFlags.LIT;
	            }
	        });
	    }
	    recordGlowLights() {
	        let i = 0;
	        this.light.forEach((val, x, y) => {
	            const glowLight = this.glowLight[x][y];
	            for (i = 0; i < 3; ++i) {
	                glowLight[i] = val[i];
	            }
	        });
	    }
	    restoreGlowLights() {
	        let i = 0;
	        this.light.forEach((val, x, y) => {
	            const glowLight = this.glowLight[x][y];
	            for (i = 0; i < 3; ++i) {
	                val[i] = glowLight[i];
	            }
	        });
	    }
	    // PaintSite
	    calcFov(x, y, radius, passThroughActors, cb) {
	        const site = this.site;
	        const fov = new FOV({
	            isBlocked(x, y) {
	                if (!passThroughActors && site.hasActor(x, y))
	                    return false;
	                return site.blocksVision(x, y);
	            },
	            hasXY(x, y) {
	                return site.hasXY(x, y);
	            },
	        });
	        fov.calculate(x, y, radius, cb);
	    }
	    addCellLight(x, y, light, dispelShadows) {
	        const val = this.light[x][y];
	        for (let i = 0; i < 3; ++i) {
	            val[i] += light[i];
	        }
	        if (dispelShadows && !isShadowLight(light)) {
	            this.flags[x][y] &= ~LightFlags.IN_SHADOW;
	        }
	    }
	}

	var index$3 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		config: config,
		Light: Light,
		intensity: intensity,
		isDarkLight: isDarkLight,
		isShadowLight: isShadowLight,
		make: make$3,
		lights: lights,
		from: from,
		install: install,
		installAll: installAll,
		LightSystem: LightSystem
	});

	// import * as IO from './io';
	class Events {
	    constructor(ctx) {
	        this._events = {};
	        this.onUnhandled = null;
	        this._ctx = ctx;
	    }
	    has(name) {
	        const events = this._events[name];
	        if (!events)
	            return false;
	        return events.some((e) => e && e.fn);
	    }
	    on(ev, fn) {
	        if (Array.isArray(ev)) {
	            const cleanup = ev.map((e) => this.on(e, fn));
	            return () => {
	                cleanup.forEach((c) => c());
	            };
	        }
	        if (!(ev in this._events)) {
	            this._events[ev] = [];
	        }
	        const info = { fn };
	        this._events[ev].unshift(info); // add to front
	        return () => {
	            arrayNullify(this._events[ev], info);
	        };
	    }
	    once(ev, fn) {
	        if (Array.isArray(ev)) {
	            const cleanup = ev.map((e) => this.on(e, fn));
	            return () => {
	                cleanup.forEach((c) => c());
	            };
	        }
	        if (!(ev in this._events)) {
	            this._events[ev] = [];
	        }
	        const info = { fn, once: true };
	        this._events[ev].unshift(info); // add to front
	        return () => {
	            arrayNullify(this._events[ev], info);
	        };
	    }
	    off(ev, cb) {
	        if (Array.isArray(ev)) {
	            ev.forEach((e) => this.off(e, cb));
	            return;
	        }
	        const events = this._events[ev];
	        if (!events)
	            return;
	        if (!cb) {
	            for (let i = 0; i < events.length; ++i) {
	                events[i] = null;
	            }
	            return;
	        }
	        const current = events.findIndex((i) => i && i.fn === cb);
	        if (current > -1) {
	            events[current] = null;
	        }
	    }
	    trigger(ev, ...args) {
	        if (Array.isArray(ev)) {
	            let success = false;
	            for (let name of ev) {
	                success = this.trigger(name, ...args) || success;
	            }
	            return success;
	        }
	        const events = this._events[ev];
	        if (!events || events.length == 0) {
	            return this._unhandled(ev, args);
	        }
	        // newer events first (especially for input)
	        events.forEach((info) => {
	            info && info.fn.call(this._ctx, ...args);
	        });
	        this._events[ev] = events.filter((i) => i && !i.once);
	        return true;
	    }
	    _unhandled(ev, args) {
	        if (!this.onUnhandled)
	            return false;
	        this.onUnhandled(ev, ...args);
	        return true;
	    }
	    load(cfg) {
	        const cancel = Object.entries(cfg).map(([ev, cb]) => this.on(ev, cb));
	        return () => cancel.forEach((c) => c());
	    }
	    clear() {
	        this._events = {};
	        this.onUnhandled = null;
	    }
	    restart() {
	        Object.keys(this._events).forEach((ev) => {
	            this._events[ev] = this._events[ev].filter((i) => i && !i.once);
	        });
	        this.onUnhandled = null;
	    }
	}

	// Tweeing API based on - http://tweenjs.github.io/tween.js/
	class BaseObj {
	    constructor() {
	        this.events = new Events(this);
	        this.children = [];
	    }
	    on(ev, fn) {
	        this.events.on(ev, fn);
	        return this;
	    }
	    once(ev, fn) {
	        this.events.once(ev, fn);
	        return this;
	    }
	    off(ev, fn) {
	        this.events.off(ev, fn);
	        return this;
	    }
	    trigger(ev, ...args) {
	        return this.events.trigger(ev, ...args);
	    }
	    addChild(t) {
	        this.children.push(t);
	        return this;
	    }
	    removeChild(t) {
	        arrayDelete(this.children, t);
	        return this;
	    }
	    update(dt) {
	        this.children.forEach((c) => c.update(dt));
	        this.trigger('update', dt);
	    }
	}
	class Tween extends BaseObj {
	    constructor(src) {
	        super();
	        this._repeat = 0;
	        this._count = 0;
	        this._from = false;
	        this._duration = 0;
	        this._delay = 0;
	        this._repeatDelay = -1;
	        this._yoyo = false;
	        this._time = Number.MAX_SAFE_INTEGER;
	        this._startTime = 0;
	        this._goal = {};
	        this._start = {};
	        // _startCb: TweenCb | null = null;
	        // _updateCb: TweenCb | null = null;
	        // _repeatCb: TweenCb | null = null;
	        // _finishCb: TweenFinishCb | null = null;
	        this._easing = linear;
	        this._interpolate = interpolate;
	        this._obj = src;
	    }
	    isRunning() {
	        return (this._startTime > 0 ||
	            this._time < this._duration ||
	            this.children.length > 0);
	    }
	    onStart(cb) {
	        this.on('start', cb);
	        return this;
	    }
	    onUpdate(cb) {
	        this.on('update', cb);
	        return this;
	    }
	    onRepeat(cb) {
	        this.on('repeat', cb);
	        return this;
	    }
	    onFinish(cb) {
	        this.on('stop', cb);
	        return this;
	    }
	    to(goal, duration) {
	        this._goal = goal;
	        this._from = false;
	        if (duration !== undefined)
	            this._duration = duration;
	        return this;
	    }
	    from(start, duration) {
	        this._start = start;
	        this._from = true;
	        if (duration !== undefined)
	            this._duration = duration;
	        return this;
	    }
	    duration(v) {
	        if (v === undefined)
	            return this._duration;
	        this._duration = v;
	        return this;
	    }
	    repeat(v) {
	        if (v === undefined)
	            return this._repeat;
	        this._repeat = v;
	        return this;
	    }
	    delay(v) {
	        if (v === undefined)
	            return this._delay;
	        this._delay = v;
	        return this;
	    }
	    repeatDelay(v) {
	        if (v === undefined)
	            return this._repeatDelay;
	        this._repeatDelay = v;
	        return this;
	    }
	    yoyo(v) {
	        if (v === undefined)
	            return this._yoyo;
	        this._yoyo = v;
	        return this;
	    }
	    start(animator) {
	        if (this._time > 0) {
	            this._time = 0;
	            this._startTime = this._delay;
	            this._count = 0;
	            if (this._from) {
	                this._goal = {};
	                Object.keys(this._start).forEach((key) => (this._goal[key] = this._obj[key]));
	                this._updateProperties(this._obj, this._start, this._goal, 0);
	            }
	            else {
	                this._start = {};
	                Object.keys(this._goal).forEach((key) => (this._start[key] = this._obj[key]));
	            }
	        }
	        if (animator) {
	            animator.add(this);
	        }
	        return this;
	    }
	    update(dt) {
	        if (!this.isRunning())
	            return;
	        this.children.forEach((c) => c.update(dt));
	        this.children = this.children.filter((c) => c.isRunning());
	        this._time += dt;
	        if (this._startTime) {
	            if (this._startTime > this._time)
	                return;
	            this._time -= this._startTime;
	            this._startTime = 0;
	            if (this._count > 0)
	                this._restart();
	        }
	        if (this._count === 0) {
	            this._restart();
	        }
	        const pct = this._easing(this._time / this._duration);
	        let madeChange = this._updateProperties(this._obj, this._start, this._goal, pct);
	        if (madeChange) {
	            this.trigger('update', this._obj, pct);
	        }
	        if (this._time >= this._duration) {
	            if (this._repeat > this._count || this._repeat < 0) {
	                this._time = this._time % this._duration;
	                this._startTime =
	                    this._repeatDelay > -1 ? this._repeatDelay : this._delay;
	                if (this._yoyo) {
	                    [this._start, this._goal] = [this._goal, this._start];
	                }
	                if (!this._startTime) {
	                    this._restart();
	                }
	            }
	            else if (!this.isRunning()) {
	                this.stop(true);
	            }
	        }
	    }
	    _restart() {
	        ++this._count;
	        // reset starting values
	        Object.entries(this._start).forEach(([key, value]) => {
	            this._obj[key] = value;
	        });
	        if (this._count == 1) {
	            this.trigger('start', this._obj, 0);
	        }
	        else {
	            this.trigger('repeat', this._obj, this._count) ||
	                this.trigger('update', this._obj, 0);
	        }
	    }
	    // gameTick(_dt: number): boolean {
	    //     return false;
	    // }
	    stop(success = false) {
	        this._time = Number.MAX_SAFE_INTEGER;
	        // if (this._finishCb) this._finishCb.call(this, this._obj, 1);
	        this.trigger('stop', this._obj, success);
	    }
	    _updateProperties(obj, start, goal, pct) {
	        let madeChange = false;
	        Object.entries(goal).forEach(([field, goalV]) => {
	            const currentV = obj[field];
	            const startV = start[field];
	            const updatedV = this._interpolate(startV, goalV, pct);
	            if (updatedV !== currentV) {
	                obj[field] = updatedV;
	                madeChange = true;
	            }
	        });
	        return madeChange;
	    }
	}
	function make$2(src, duration = 1000) {
	    return new Tween(src).duration(duration);
	}
	function linear(pct) {
	    return clamp(pct, 0, 1);
	}
	// TODO - string, bool, Color
	function interpolate(start, goal, pct) {
	    if (typeof start === 'boolean' || typeof goal === 'boolean') {
	        return Math.floor(pct) == 0 ? start : goal;
	    }
	    return Math.floor((goal - start) * pct) + start;
	}

	var tween = /*#__PURE__*/Object.freeze({
		__proto__: null,
		BaseObj: BaseObj,
		Tween: Tween,
		make: make$2,
		linear: linear,
		interpolate: interpolate
	});

	class Timers {
	    constructor(ctx) {
	        this._timers = [];
	        this._ctx = ctx;
	    }
	    get length() {
	        return this._timers.length;
	    }
	    clear() {
	        this._timers = [];
	    }
	    // Clears all one time timers and resets all repeating timers
	    restart() {
	        this._timers.forEach((i) => {
	            i.delay = i.repeat || 0;
	        });
	        this._timers = this._timers.filter((i) => i.delay > 0);
	    }
	    setTimeout(fn, delay) {
	        const info = {
	            fn,
	            delay,
	            repeat: 0,
	        };
	        this._timers.push(info);
	        return () => arrayDelete(this._timers, info);
	    }
	    setInterval(fn, delay) {
	        const info = {
	            fn,
	            delay,
	            repeat: delay,
	        };
	        this._timers.push(info);
	        return () => arrayDelete(this._timers, info);
	    }
	    update(dt) {
	        if (!this._timers.length)
	            return;
	        let needFilter = false;
	        this._timers.forEach((info) => {
	            info.delay -= dt;
	            if (info.delay <= 0) {
	                const result = info.fn.call(this._ctx);
	                if (info.repeat && result !== false) {
	                    info.delay += info.repeat;
	                    if (info.delay < 0) {
	                        info.delay = info.repeat;
	                    }
	                }
	            }
	            needFilter = needFilter || info.delay <= 0;
	        });
	        if (needFilter) {
	            this._timers = this._timers.filter((info) => info.delay > 0);
	        }
	    }
	}

	class Tweens {
	    constructor() {
	        this._tweens = [];
	    }
	    get length() {
	        return this._tweens.length;
	    }
	    clear() {
	        this._tweens = [];
	    }
	    add(tween) {
	        this._tweens.push(tween);
	    }
	    remove(tween) {
	        arrayDelete(this._tweens, tween);
	    }
	    update(dt) {
	        // // fire animations
	        this._tweens.forEach((tw) => tw.update(dt));
	        this._tweens = this._tweens.filter((tw) => tw.isRunning());
	    }
	}

	class Selector {
	    constructor(text) {
	        this.priority = 0;
	        if (text.startsWith(':') || text.startsWith('.')) {
	            text = '*' + text;
	        }
	        this.text = text;
	        this.matchFn = this._parse(text);
	    }
	    _parse(text) {
	        const parts = text.split(/ +/g).map((p) => p.trim());
	        const matches = [];
	        for (let i = 0; i < parts.length; ++i) {
	            let p = parts[i];
	            if (p === '>') {
	                matches.push(this._parentMatch());
	                ++i;
	                p = parts[i];
	            }
	            else if (i > 0) {
	                matches.push(this._ancestorMatch());
	            }
	            matches.push(this._matchElement(p));
	        }
	        return matches.reduce((out, fn) => fn.bind(undefined, out), TRUE);
	    }
	    _parentMatch() {
	        return function parentM(next, e) {
	            // console.log('parent', e.parent);
	            if (!e.parent)
	                return false;
	            return next(e.parent);
	        };
	    }
	    _ancestorMatch() {
	        return function ancestorM(next, e) {
	            let current = e.parent;
	            while (current) {
	                if (next(current))
	                    return true;
	            }
	            return false;
	        };
	    }
	    _matchElement(text) {
	        const CSS_RE = /(?:(\w+|\*|\$)|#(\w+)|\.([^\.: ]+))|(?::(?:(?:not\(\.([^\)]+)\))|(?:not\(:([^\)]+)\))|([^\.: ]+)))/g;
	        const parts = [];
	        const re = new RegExp(CSS_RE, 'g');
	        let match = re.exec(text);
	        while (match) {
	            if (match[1]) {
	                const fn = this._matchTag(match[1]);
	                if (fn) {
	                    parts.push(fn);
	                }
	            }
	            else if (match[2]) {
	                parts.push(this._matchId(match[2]));
	            }
	            else if (match[3]) {
	                parts.push(this._matchClass(match[3]));
	            }
	            else if (match[4]) {
	                parts.push(this._matchNot(this._matchClass(match[4])));
	            }
	            else if (match[5]) {
	                parts.push(this._matchNot(this._matchProp(match[5])));
	            }
	            else {
	                parts.push(this._matchProp(match[6]));
	            }
	            match = re.exec(text);
	        }
	        return (next, e) => {
	            if (!parts.every((fn) => fn(e)))
	                return false;
	            return next(e);
	        };
	    }
	    _matchTag(tag) {
	        if (tag === '*')
	            return null;
	        if (tag === '$') {
	            this.priority += 10000;
	            return null;
	        }
	        this.priority += 10;
	        return (el) => el.tag === tag;
	    }
	    _matchClass(cls) {
	        this.priority += 100;
	        return (el) => el.classes.includes(cls);
	    }
	    _matchProp(prop) {
	        if (prop.startsWith('first')) {
	            return this._matchFirst();
	        }
	        else if (prop.startsWith('last')) {
	            return this._matchLast();
	        }
	        else if (prop === 'invalid') {
	            return this._matchNot(this._matchProp('valid'));
	        }
	        else if (prop === 'optional') {
	            return this._matchNot(this._matchProp('required'));
	        }
	        else if (prop === 'enabled') {
	            return this._matchNot(this._matchProp('disabled'));
	        }
	        else if (prop === 'unchecked') {
	            return this._matchNot(this._matchProp('checked'));
	        }
	        this.priority += 2; // prop
	        if (['odd', 'even'].includes(prop)) {
	            this.priority -= 1;
	        }
	        return (el) => !!el.prop(prop);
	    }
	    _matchId(id) {
	        this.priority += 1000;
	        return (el) => el.attr('id') === id;
	    }
	    _matchFirst() {
	        this.priority += 1; // prop
	        return (el) => !!el.parent && !!el.parent.children && el.parent.children[0] === el;
	    }
	    _matchLast() {
	        this.priority += 1; // prop
	        return (el) => {
	            if (!el.parent)
	                return false;
	            if (!el.parent.children)
	                return false;
	            return el.parent.children[el.parent.children.length - 1] === el;
	        };
	    }
	    _matchNot(fn) {
	        return (el) => !fn(el);
	    }
	    matches(obj) {
	        return this.matchFn(obj);
	    }
	}
	function compile(text) {
	    return new Selector(text);
	}

	// static - size/pos automatic (ignore TRBL)
	// relative - size automatic, pos = automatic + TRBL
	// fixed - size = self, pos = TRBL vs root
	// absolute - size = self, pos = TRBL vs positioned parent (fixed, absolute)
	// export interface Stylable {
	//     tag: string;
	//     classes: string[];
	//     attr(name: string): string | undefined;
	//     prop(name: string): PropType | undefined;
	//     parent: UIWidget | null;
	//     children?: UIWidget[];
	//     style(): Style;
	// }
	// export interface StyleOptions {
	//     fg?: Color.ColorBase;
	//     bg?: Color.ColorBase;
	//     // depth?: number;
	//     align?: Text.Align;
	//     valign?: Text.VAlign;
	//     // minWidth?: number;
	//     // maxWidth?: number;
	//     // width?: number;
	//     // minHeight?: number;
	//     // maxHeight?: number;
	//     // height?: number;
	//     // left?: number;
	//     // right?: number;
	//     // top?: number;
	//     // bottom?: number;
	//     // //        all,     [t+b, l+r],        [t, r+l,b],               [t, r, b, l]
	//     // padding?:
	//     //     | number
	//     //     | [number]
	//     //     | [number, number]
	//     //     | [number, number, number]
	//     //     | [number, number, number, number];
	//     // padLeft?: number;
	//     // padRight?: number;
	//     // padTop?: number;
	//     // padBottom?: number;
	//     // //        all,     [t+b, l+r],        [t, l+r, b],               [t, r, b, l]
	//     // margin?:
	//     //     | number
	//     //     | [number]
	//     //     | [number, number]
	//     //     | [number, number, number]
	//     //     | [number, number, number, number];
	//     // marginLeft?: number;
	//     // marginRight?: number;
	//     // marginTop?: number;
	//     // marginBottom?: number;
	//     // border?: Color.ColorBase;
	// }
	class Style {
	    constructor(selector = '$', init) {
	        this._dirty = false;
	        this.selector = new Selector(selector);
	        if (init) {
	            this.set(init);
	        }
	        this._dirty = false;
	    }
	    get dirty() {
	        return this._dirty;
	    }
	    set dirty(v) {
	        this._dirty = v;
	    }
	    get fg() {
	        return this._fg;
	    }
	    get bg() {
	        return this._bg;
	    }
	    get opacity() {
	        return this._opacity;
	    }
	    dim(pct = 25, fg = true, bg = false) {
	        if (fg) {
	            this._fg = from$2(this._fg).darken(pct);
	        }
	        if (bg) {
	            this._bg = from$2(this._bg).darken(pct);
	        }
	        return this;
	    }
	    bright(pct = 25, fg = true, bg = false) {
	        if (fg) {
	            this._fg = from$2(this._fg).lighten(pct);
	        }
	        if (bg) {
	            this._bg = from$2(this._bg).lighten(pct);
	        }
	        return this;
	    }
	    invert() {
	        [this._fg, this._bg] = [this._bg, this._fg];
	        return this;
	    }
	    get align() {
	        return this._align;
	    }
	    get valign() {
	        return this._valign;
	    }
	    get(key) {
	        const id = ('_' + key);
	        return this[id];
	    }
	    set(key, value, setDirty = true) {
	        if (typeof key === 'string') {
	            const field = '_' + key;
	            if (typeof value === 'string') {
	                if (value.match(/^[+-]?\d+$/)) {
	                    value = Number.parseInt(value);
	                }
	                else if (value === 'true') {
	                    value = true;
	                }
	                else if (value === 'false') {
	                    value = false;
	                }
	            }
	            this[field] = value;
	            // }
	        }
	        else if (key instanceof Style) {
	            setDirty = value || value === undefined ? true : false;
	            Object.entries(key).forEach(([name, value]) => {
	                if (name === 'selector' || name === '_dirty')
	                    return;
	                if (value !== undefined && value !== null) {
	                    this[name] = value;
	                }
	                else if (value === null) {
	                    this.unset(name);
	                }
	            });
	        }
	        else {
	            setDirty = value || value === undefined ? true : false;
	            Object.entries(key).forEach(([name, value]) => {
	                if (value === null) {
	                    this.unset(name);
	                }
	                else {
	                    this.set(name, value, setDirty);
	                }
	            });
	        }
	        this.dirty || (this.dirty = setDirty);
	        return this;
	    }
	    unset(key) {
	        const field = key.startsWith('_') ? key : '_' + key;
	        delete this[field];
	        this.dirty = true;
	        return this;
	    }
	    clone() {
	        const other = new this.constructor();
	        other.copy(this);
	        return other;
	    }
	    copy(other) {
	        Object.assign(this, other);
	        return this;
	    }
	}
	function makeStyle(style, selector = '$') {
	    const opts = {};
	    const parts = style
	        .trim()
	        .split(';')
	        .map((p) => p.trim());
	    parts.forEach((p) => {
	        const [name, base] = p.split(':').map((p) => p.trim());
	        if (!name)
	            return;
	        const baseParts = base.split(/ +/g);
	        if (baseParts.length == 1) {
	            // @ts-ignore
	            opts[name] = base;
	        }
	        else {
	            // @ts-ignore
	            opts[name] = baseParts;
	        }
	    });
	    return new Style(selector, opts);
	}
	// const NO_BOUNDS = ['fg', 'bg', 'depth', 'align', 'valign'];
	// export function affectsBounds(key: keyof StyleOptions): boolean {
	//     return !NO_BOUNDS.includes(key);
	// }
	class ComputedStyle extends Style {
	    // constructor(source: Stylable, sources?: Style[]) {
	    constructor(sources) {
	        super();
	        // obj: Stylable;
	        this.sources = [];
	        // _opacity = 100;
	        this._baseFg = null;
	        this._baseBg = null;
	        // this.obj = source;
	        if (sources) {
	            // sort low to high priority (highest should be this.obj._style, lowest = global default:'*')
	            sources.sort((a, b) => a.selector.priority - b.selector.priority);
	            this.sources = sources;
	        }
	        this.sources.forEach((s) => super.set(s));
	        // this.opacity = opacity;
	        this._dirty = false; // As far as I know I reflect all of the current source values.
	    }
	    get opacity() {
	        var _a;
	        return (_a = this._opacity) !== null && _a !== void 0 ? _a : 100;
	    }
	    set opacity(v) {
	        v = clamp(v, 0, 100);
	        this._opacity = v;
	        if (v === 100) {
	            this._fg = this._baseFg || this._fg;
	            this._bg = this._baseBg || this._bg;
	            return;
	        }
	        if (this._fg !== undefined) {
	            this._baseFg = this._baseFg || from$2(this._fg);
	            this._fg = this._baseFg.alpha(v);
	        }
	        if (this._bg !== undefined) {
	            this._baseBg = this._baseBg || from$2(this._bg);
	            this._bg = this._baseBg.alpha(v);
	        }
	    }
	    get dirty() {
	        return this._dirty || this.sources.some((s) => s.dirty);
	    }
	    set dirty(v) {
	        this._dirty = v;
	    }
	}
	class Sheet {
	    constructor(parentSheet) {
	        this.rules = [];
	        this._dirty = true;
	        // if (parentSheet === undefined) {
	        //     parentSheet = defaultStyle;
	        // }
	        // if (parentSheet) {
	        //     this.rules = parentSheet.rules.slice();
	        // }
	        this._parent = parentSheet || null;
	    }
	    get dirty() {
	        return this._dirty;
	    }
	    set dirty(v) {
	        this._dirty = v;
	        if (!this._dirty) {
	            this.rules.forEach((r) => (r.dirty = false));
	        }
	    }
	    setParent(sheet) {
	        this._parent = sheet;
	    }
	    add(selector, props) {
	        if (selector.includes(',')) {
	            selector
	                .split(',')
	                .map((p) => p.trim())
	                .forEach((p) => this.add(p, props));
	            return this;
	        }
	        if (selector.includes(' '))
	            throw new Error('Hierarchical selectors not supported.');
	        // if 2 '.' - Error('Only single class rules supported.')
	        // if '&' - Error('Not supported.')
	        let rule = new Style(selector, props);
	        // const existing = this.rules.findIndex(
	        //     (s) => s.selector.text === rule.selector.text
	        // );
	        // if (existing > -1) {
	        //     // TODO - Should this delete the rule and add the new one at the end?
	        //     const current = this.rules[existing];
	        //     current.set(rule);
	        //     rule = current;
	        // } else {
	        this.rules.push(rule);
	        // }
	        // rulesChanged = true;
	        this.dirty = true;
	        return this;
	    }
	    get(selector) {
	        return this.rules.find((s) => s.selector.text === selector) || null;
	    }
	    load(styles) {
	        Object.entries(styles).forEach(([selector, props]) => {
	            this.add(selector, props);
	        });
	        return this;
	    }
	    remove(selector) {
	        const existing = this.rules.findIndex((s) => s.selector.text === selector);
	        if (existing > -1) {
	            this.rules.splice(existing, 1);
	            this.dirty = true;
	        }
	    }
	    _rulesFor(widget) {
	        let rules = this.rules.filter((r) => r.selector.matches(widget));
	        if (this._parent) {
	            rules = this._parent._rulesFor(widget).concat(rules);
	        }
	        return rules;
	    }
	    computeFor(widget) {
	        const sources = this._rulesFor(widget);
	        const widgetStyle = widget.style();
	        if (widgetStyle) {
	            sources.push(widgetStyle);
	            widgetStyle.dirty = false;
	        }
	        return new ComputedStyle(sources);
	    }
	}
	const defaultStyle = new Sheet(null);
	defaultStyle.add('*', { fg: 'white' });

	// Scene
	class Scene {
	    constructor(id, app) {
	        this.events = new Events(this);
	        this.tweens = new Tweens();
	        this.timers = new Timers(this);
	        this.all = [];
	        this.children = [];
	        this.focused = null;
	        this.dt = 0;
	        this.time = 0;
	        this.realTime = 0;
	        this.skipTime = false;
	        this.stopped = true;
	        this.paused = {};
	        this.debug = false;
	        this.needsDraw = true;
	        this.bg = BLACK;
	        this.data = {};
	        this.id = id;
	        this.styles = new Sheet();
	        this.app = app;
	        this.buffer = new Buffer$1(app.width, app.height);
	        this.styles.setParent(app.styles);
	    }
	    get width() {
	        return this.buffer.width;
	    }
	    get height() {
	        return this.buffer.height;
	    }
	    isActive() {
	        return !this.stopped;
	    }
	    isPaused() {
	        return this.isPaused;
	    }
	    isSleeping() {
	        return this.isSleeping;
	    }
	    // GENERAL
	    create(opts = {}) {
	        opts.bg && (this.bg = from$2(opts.bg));
	        if (opts.on) {
	            Object.entries(opts.on).forEach(([ev, fn]) => {
	                this.on(ev, fn);
	            });
	        }
	        Object.entries(opts).forEach(([ev, fn]) => {
	            if (typeof fn !== 'function')
	                return;
	            this.on(ev, fn);
	        });
	        this.trigger('create', opts);
	    }
	    destroy(data) {
	        this.trigger('destroy', data);
	        this.all.forEach((c) => c.destroy());
	        this.children = [];
	        this.all = [];
	        this.timers.clear();
	        this.tweens.clear();
	    }
	    start(opts = {}) {
	        this.app.scenes.stop(); // stop all running scenes
	        this._start(opts);
	    }
	    _start(opts = {}) {
	        this.stopped = false;
	        this.timers.restart();
	        this.events.restart();
	        this.tweens.clear();
	        this.buffer.nullify();
	        this.needsDraw = true;
	        this.events.trigger('start', opts); // this will start this one in the app.scenes obj
	    }
	    run(data = {}) {
	        this.app.scenes.pause();
	        this._start(data);
	        this.once('stop', () => this.app.scenes.resume());
	    }
	    stop(data) {
	        this.stopped = true;
	        this.events.trigger('stop', data);
	    }
	    pause(opts) {
	        opts = opts || {
	            timers: true,
	            tweens: true,
	            update: true,
	            input: true,
	            draw: true,
	        };
	        Object.assign(this.paused, opts);
	        this.events.trigger('pause');
	    }
	    resume(opts) {
	        opts = opts || {
	            timers: true,
	            tweens: true,
	            update: true,
	            input: true,
	            draw: true,
	        };
	        Object.entries(opts).forEach(([key, value]) => {
	            if (value === true) {
	                this.paused[key] = false;
	            }
	        });
	        this.needsDraw = true;
	        this.events.trigger('resume');
	    }
	    // FRAME STEPS
	    frameStart() {
	        this.events.trigger('frameStart');
	    }
	    input(e) {
	        if (this.paused.input || this.stopped)
	            return;
	        this.trigger('input', e);
	        if (e.defaultPrevented || e.propagationStopped)
	            return;
	        if (e.type === KEYPRESS) {
	            let w = this.focused;
	            if (w && (w.hidden || w.disabled)) {
	                this.nextTabStop();
	                w = this.focused;
	            }
	            w && w.keypress(e);
	            if (!e.defaultPrevented) {
	                if (e.key === 'Tab') {
	                    this.nextTabStop();
	                }
	                else if (e.key === 'TAB') {
	                    this.prevTabStop();
	                }
	            }
	        }
	        else if (e.type === MOUSEMOVE) {
	            this.children.forEach((c) => c.mousemove(e));
	        }
	        else {
	            // click
	            const c = this.childAt(e);
	            if (c) {
	                c.click(e);
	                if (c.prop('tabStop') && !e.defaultPrevented) {
	                    this.setFocusWidget(c);
	                }
	            }
	        }
	        if (e.propagationStopped || e.defaultPrevented)
	            return;
	        e.dispatch(this.events);
	    }
	    update(dt) {
	        if (this.stopped)
	            return;
	        if (!this.paused.timers)
	            this.timers.update(dt);
	        if (!this.paused.tweens)
	            this.tweens.update(dt);
	        if (!this.paused.update) {
	            this.events.trigger('update', dt);
	            this.all.forEach((c) => c.update(dt));
	        }
	    }
	    draw(buffer) {
	        if (this.stopped)
	            return;
	        if (!this.paused.draw && this.needsDraw) {
	            this._draw(this.buffer);
	            this.trigger('draw', this.buffer);
	            this.children.forEach((c) => c.draw(this.buffer));
	            this.needsDraw = false;
	        }
	        // if (this.buffer.changed) {
	        buffer.apply(this.buffer);
	        this.buffer.changed = false;
	        // }
	    }
	    _draw(buffer) {
	        buffer.fill(this.bg);
	    }
	    frameDebug(buffer) {
	        this.events.trigger('frameDebug', buffer);
	    }
	    frameEnd(buffer) {
	        this.events.trigger('frameEnd', buffer);
	    }
	    // ANIMATION
	    fadeIn(widget, ms) {
	        return this.fadeTo(widget, 100, ms);
	    }
	    fadeOut(widget, ms) {
	        return this.fadeTo(widget, 0, ms);
	    }
	    fadeTo(widget, opacity, ms) {
	        const tween$1 = make$2({ pct: widget.style('opacity') })
	            .to({ pct: opacity })
	            .duration(ms)
	            .onUpdate((info) => {
	            widget.style('opacity', info.pct);
	        });
	        this.tweens.add(tween$1);
	        return this;
	    }
	    fadeToggle(widget, ms) {
	        return this.fadeTo(widget, widget._used.opacity ? 0 : 100, ms);
	    }
	    slideIn(widget, x, y, from, ms) {
	        let start = { x, y };
	        if (from === 'left') {
	            start.x = -widget.bounds.width;
	        }
	        else if (from === 'right') {
	            start.x = this.width + widget.bounds.width;
	        }
	        else if (from === 'top') {
	            start.y = -widget.bounds.height;
	        }
	        else if (from === 'bottom') {
	            start.y = this.height + widget.bounds.height;
	        }
	        return this.slide(widget, start, { x, y }, ms);
	    }
	    slideOut(widget, dir, ms) {
	        let dest = { x: widget.bounds.x, y: widget.bounds.y };
	        if (dir === 'left') {
	            dest.x = -widget.bounds.width;
	        }
	        else if (dir === 'right') {
	            dest.x = this.width + widget.bounds.width;
	        }
	        else if (dir === 'top') {
	            dest.y = -widget.bounds.height;
	        }
	        else if (dir === 'bottom') {
	            dest.y = this.height + widget.bounds.height;
	        }
	        return this.slide(widget, widget.bounds, dest, ms);
	    }
	    slide(widget, from, to, ms) {
	        const tween$1 = make$2({ x: x(from), y: y(from) })
	            .to({ x: x(to), y: y(to) })
	            .duration(ms)
	            .onUpdate((info) => {
	            widget.pos(info.x, info.y);
	        });
	        this.tweens.add(tween$1);
	        return this;
	    }
	    // async fadeTo(
	    //     color: COLOR.ColorBase = 'black',
	    //     duration = 1000
	    // ): Promise<void> {
	    //     return new Promise<void>((resolve) => {
	    //         color = COLOR.from(color);
	    //         this.pause();
	    //         const buffer = this.buffer.clone();
	    //         let pct = 0;
	    //         let elapsed = 0;
	    //         this.app.repeat(32, () => {
	    //             elapsed += 32;
	    //             pct = Math.floor((100 * elapsed) / duration);
	    //             this.buffer.copy(buffer);
	    //             this.buffer.mix(color, pct);
	    //             if (elapsed >= duration) {
	    //                 this.resume();
	    //                 resolve();
	    //                 return false; // end timer
	    //             }
	    //         });
	    //     });
	    // }
	    // CHILDREN
	    get(id) {
	        return this.all.find((c) => c.id === id) || null;
	    }
	    _attach(widget) {
	        if (this.all.includes(widget))
	            return;
	        if (widget.scene)
	            throw new Error('Widget on another scene!');
	        this.all.push(widget);
	        widget.scene = this;
	        widget.children.forEach((c) => this._attach(c));
	        if (widget.prop('tabStop') &&
	            !this.focused &&
	            !widget.hidden &&
	            !widget.disabled) {
	            this.setFocusWidget(widget);
	        }
	    }
	    _detach(widget) {
	        const index = this.all.indexOf(widget);
	        if (index < 0)
	            return;
	        this.all.splice(index, 1);
	        widget.scene = null;
	        widget.children.forEach((c) => this._detach(c));
	    }
	    addChild(child, opts) {
	        if (this.children.includes(child))
	            return;
	        child.setParent(null);
	        this.children.push(child);
	        this._attach(child);
	        if (opts) {
	            child.updatePos(opts);
	            if (opts.focused) {
	                this.setFocusWidget(child);
	            }
	        }
	    }
	    removeChild(child) {
	        const index = this.children.indexOf(child);
	        if (index < 0)
	            return;
	        this.children.splice(index, 1);
	        child.setParent(null);
	        this._detach(child);
	    }
	    childAt(xy, y) {
	        let x = 0;
	        if (typeof xy === 'number') {
	            x = xy;
	            y = y || 0;
	        }
	        else {
	            x = xy.x;
	            y = xy.y;
	        }
	        return (arrayFindRight(this.children, (c) => c.contains(x, y)) ||
	            null);
	    }
	    widgetAt(xy, y) {
	        let x = 0;
	        if (typeof xy === 'number') {
	            x = xy;
	            y = y || 0;
	        }
	        else {
	            x = xy.x;
	            y = xy.y;
	        }
	        return arrayFindRight(this.all, (c) => c.contains(x, y)) || null;
	    }
	    // FOCUS
	    setFocusWidget(w, reverse = false) {
	        if (w === this.focused)
	            return;
	        const was = this.focused;
	        const want = w;
	        this.focused = null;
	        was && was.blur(reverse);
	        if (this.focused === null) {
	            this.focused = want;
	            want && want.focus(reverse);
	        }
	    }
	    nextTabStop() {
	        if (!this.focused) {
	            this.setFocusWidget(this.all.find((w) => !!w.prop('tabStop') && !w.disabled && !w.hidden) || null);
	            return !!this.focused;
	        }
	        const next = arrayNext(this.all, this.focused, (w) => !!w.prop('tabStop') && !w.disabled && !w.hidden);
	        if (next) {
	            this.setFocusWidget(next);
	            return true;
	        }
	        this.setFocusWidget(null);
	        return false;
	    }
	    prevTabStop() {
	        if (!this.focused) {
	            this.setFocusWidget(this.all.find((w) => !!w.prop('tabStop') && !w.disabled && !w.hidden) || null);
	            return !!this.focused;
	        }
	        const prev = arrayPrev(this.all, this.focused, (w) => !!w.prop('tabStop') && !w.disabled && !w.hidden);
	        if (prev) {
	            this.setFocusWidget(prev, true);
	            return true;
	        }
	        this.setFocusWidget(null, true);
	        return false;
	    }
	    // EVENTS
	    on(ev, cb) {
	        return this.events.on(ev, cb);
	    }
	    once(ev, cb) {
	        return this.events.once(ev, cb);
	    }
	    trigger(ev, ...args) {
	        return this.events.trigger(ev, ...args);
	    }
	    load(cfg) {
	        return this.events.load(cfg);
	    }
	    wait(delay, fn, ctx) {
	        if (typeof fn === 'string') {
	            const ev = fn;
	            ctx = ctx || {};
	            fn = () => this.trigger(ev, ctx);
	        }
	        return this.timers.setTimeout(fn, delay);
	    }
	    repeat(delay, fn, ctx) {
	        if (typeof fn === 'string') {
	            const ev = fn;
	            ctx = ctx || {};
	            fn = () => this.trigger(ev, ctx);
	        }
	        return this.timers.setInterval(fn, delay);
	    }
	}
	// export class Scene {
	//     id: string;
	//     app!: App;
	//     events: EVENTS.Events;
	//     timers: TIMERS.Timers;
	//     buffer!: CANVAS.Buffer;
	//     tweens: Tweens;
	//     dt = 0;
	//     time = 0;
	//     realTime = 0;
	//     skipTime = false;
	//     stopped = true;
	//     paused: PauseOpts = {};
	//     debug = false;
	//     children: SceneObj[] = [];
	//     data: Record<string, any> = {};
	//     constructor(id: string, opts: SceneOpts = {}) {
	//         this.id = id;
	//         this.events = new EVENTS.Events(this);
	//         this.timers = new TIMERS.Timers(this);
	//         this.tweens = new Tweens();
	//         if (opts.on) {
	//             Object.entries(opts.on).forEach(([ev, fn]) => {
	//                 this.on(ev, fn);
	//             });
	//         }
	//         Object.entries(opts).forEach(([ev, fn]) => {
	//             if (typeof fn !== 'function') return;
	//             this.on(ev, fn);
	//         });
	//     }
	//     get width() {
	//         return this.buffer.width;
	//     }
	//     get height() {
	//         return this.buffer.height;
	//     }
	//     isActive() {
	//         return !this.stopped;
	//     }
	//     isPaused() {
	//         return this.isPaused;
	//     }
	//     isSleeping() {
	//         return this.isSleeping;
	//     }
	//     on(ev: string, fn: EVENTS.CallbackFn): EVENTS.CancelFn;
	//     on(ev: string, fn: EVENTS.CallbackFn): EVENTS.CancelFn {
	//         return this.events.on(ev, fn);
	//     }
	//     trigger(ev: string, ...args: any[]) {
	//         return this.events.trigger(ev, ...args);
	//     }
	//     wait(delay: number, fn: TIMERS.TimerFn): EVENTS.CancelFn;
	//     wait(delay: number, fn: string, ctx?: Record<string, any>): EVENTS.CancelFn;
	//     wait(
	//         delay: number,
	//         fn: TIMERS.TimerFn | string,
	//         ctx?: Record<string, any>
	//     ): EVENTS.CancelFn {
	//         if (typeof fn === 'string') {
	//             const ev = fn;
	//             ctx = ctx || {};
	//             fn = () => this.trigger(ev, ctx!);
	//         }
	//         return this.timers.setTimeout(fn, delay);
	//     }
	//     repeat(delay: number, fn: TIMERS.TimerFn): EVENTS.CancelFn;
	//     repeat(
	//         delay: number,
	//         fn: string,
	//         ctx?: Record<string, any>
	//     ): EVENTS.CancelFn;
	//     repeat(
	//         delay: number,
	//         fn: TIMERS.TimerFn | string,
	//         ctx?: Record<string, any>
	//     ): EVENTS.CancelFn {
	//         if (typeof fn === 'string') {
	//             const ev = fn;
	//             ctx = ctx || {};
	//             fn = () => this.trigger(ev, ctx!);
	//         }
	//         return this.timers.setInterval(fn, delay);
	//     }
	//     // run() {
	//     //     this.trigger('run', this);
	//     //     let running = false;
	//     //     this.loopID = (setInterval(() => {
	//     //         if (!running) {
	//     //             running = true;
	//     //             this._frame();
	//     //             running = false;
	//     //         }
	//     //     }, 16) as unknown) as number;
	//     //     this.stopped = false;
	//     // }
	//     create(app: App) {
	//         this.app = app;
	//         this.buffer = app.buffer.clone();
	//         this.trigger('create');
	//     }
	//     destroy() {
	//         this.trigger('destroy');
	//     }
	//     start(data?: Record<string, any>) {
	//         this.stopped = false;
	//         this.timers.clear();
	//         this.tweens.clear();
	//         this.events.trigger('start', data || {});
	//     }
	//     run(data?: Record<string, any>): Promise<any> {
	//         return new Promise((resolve) => {
	//             this.app.scenes.pause();
	//             const cleanup = this.once('stop', (d) => {
	//                 cleanup();
	//                 this.app.scenes.resume();
	//                 resolve(d);
	//             });
	//             this.start(data);
	//         });
	//     }
	//     stop(data?: Record<string, any>) {
	//         this.stopped = true;
	//         this.events.trigger('stop', data || {});
	//     }
	//     pause(opts?: PauseOpts): void {
	//         opts = opts || {
	//             timers: true,
	//             tweens: true,
	//             update: true,
	//             input: true,
	//             draw: true,
	//         };
	//         Object.assign(this.paused, opts);
	//         this.events.trigger('pause');
	//     }
	//     resume(opts?: ResumeOpts) {
	//         opts = opts || {
	//             timers: true,
	//             tweens: true,
	//             update: true,
	//             input: true,
	//             draw: true,
	//         };
	//         Object.entries(opts).forEach(([key, value]) => {
	//             if (value === true) {
	//                 this.paused[key as keyof ResumeOpts] = false;
	//             }
	//         });
	//         this.events.trigger('resume');
	//     }
	//     // CHILDREN
	//     add(obj: SceneObj) {
	//         this.children.push(obj);
	//         obj.trigger('add', this);
	//     }
	//     remove(obj: SceneObj) {
	//         UTILS.arrayDelete(this.children, obj);
	//         obj.trigger('remove', this);
	//     }
	//     // FRAME STEPS
	//     frameStart() {
	//         this.events.trigger('frameStart');
	//     }
	//     input(ev: IO.Event) {
	//         if (this.stopped || this.paused.input) return;
	//         this.events.dispatch(ev);
	//     }
	//     update(dt: number) {
	//         if (this.stopped) return;
	//         if (!this.paused.timers) this.timers.update(dt);
	//         if (!this.paused.tweens) this.tweens.update(dt);
	//         if (!this.paused.update) {
	//             this.children.forEach((c) => c.update(dt));
	//             this.events.trigger('update', dt);
	//         }
	//     }
	//     draw(buffer: CANVAS.Buffer) {
	//         if (this.stopped) return;
	//         if (!this.paused.draw) {
	//             this.events.trigger('draw', this.buffer);
	//             this.children.forEach((c) => c.draw(this.buffer));
	//         }
	//         if (this.buffer.changed) {
	//             buffer.apply(this.buffer);
	//             this.buffer.changed = false;
	//         }
	//     }
	//     frameDebug(buffer: CANVAS.Buffer) {
	//         this.events.trigger('frameDebug', buffer);
	//     }
	//     frameEnd(buffer: CANVAS.Buffer) {
	//         this.events.trigger('frameEnd', buffer);
	//         // if (this.buffer.changed) {
	//         //     buffer.apply(this.buffer);
	//         //     this.buffer.changed = false;
	//         // }
	//     }
	//     // UI
	//     alert(text: string): Promise<boolean> {
	//         return this.app.scenes.run('alert', { text });
	//     }
	//     async fadeTo(
	//         color: COLOR.ColorBase = 'black',
	//         duration = 1000
	//     ): Promise<void> {
	//         return new Promise<void>((resolve) => {
	//             color = COLOR.from(color);
	//             this.pause();
	//             const buffer = this.buffer.clone();
	//             let pct = 0;
	//             let elapsed = 0;
	//             this.app.repeat(32, () => {
	//                 elapsed += 32;
	//                 pct = Math.floor((100 * elapsed) / duration);
	//                 this.buffer.copy(buffer);
	//                 this.buffer.mix(color, pct);
	//                 if (elapsed >= duration) {
	//                     this.resume();
	//                     resolve();
	//                     return false; // end timer
	//                 }
	//             });
	//         });
	//     }
	// }

	class Scenes {
	    constructor(gw) {
	        this._scenes = {};
	        this._active = [];
	        this._busy = false;
	        this._pending = [];
	        this._app = gw;
	        this._config = Object.assign({}, scenes);
	    }
	    get isBusy() {
	        return this._busy;
	    }
	    add(id, opts) {
	        const current = this._config[id] || {};
	        if (typeof opts === 'function') {
	            opts = { make: opts };
	        }
	        Object.assign(current, opts);
	        this._config[id] = current;
	    }
	    load(scenes) {
	        Object.entries(scenes).forEach(([id, fns]) => this.add(id, fns));
	    }
	    get(id) {
	        if (id === undefined) {
	            return this._active[this._active.length - 1];
	        }
	        return this._scenes[id] || null;
	    }
	    trigger(ev, ...args) {
	        this._active.forEach((a) => a.trigger(ev, ...args));
	    }
	    _create(id, opts = {}) {
	        let cfg = this._config[id] || {};
	        const used = Object.assign({}, cfg, opts);
	        let scene;
	        if (used.make) {
	            scene = used.make(id, this._app);
	        }
	        else {
	            scene = new Scene(id, this._app);
	        }
	        scene.on('start', () => this._start(scene));
	        scene.on('stop', () => this._stop(scene));
	        scene.create(used);
	        this._scenes[scene.id] = scene;
	        return scene;
	    }
	    create(id, data = {}) {
	        if (id in this._scenes) {
	            console.log('Scene already created - ' + id);
	            return this._scenes[id];
	        }
	        return this._create(id, data);
	    }
	    start(id, data) {
	        let scene = this._scenes[id] || this._create(id, data);
	        if (this.isBusy) {
	            this._pending.push({ action: 'start', scene, data });
	        }
	        else {
	            scene.start(data);
	        }
	        return scene;
	    }
	    run(id, data) {
	        let scene = this._scenes[id] || this._create(id, data);
	        if (this.isBusy) {
	            this._pending.push({ action: 'run', scene, data });
	        }
	        else {
	            scene.run(data);
	        }
	        return scene;
	    }
	    _start(scene) {
	        this._active.push(scene);
	    }
	    stop(id, data) {
	        if (typeof id === 'string') {
	            const scene = this._scenes[id];
	            if (!scene)
	                throw new Error('Unknown scene:' + id);
	            id = scene;
	        }
	        if (id instanceof Scene) {
	            if (this.isBusy) {
	                this._pending.push({ action: 'stop', scene: id, data });
	            }
	            else {
	                id.stop(data);
	            }
	        }
	        else {
	            this._active.forEach((s) => this.stop(s.id, id));
	        }
	    }
	    _stop(_scene) {
	        this._active = this._active.filter((s) => s.isActive());
	    }
	    destroy(id, data) {
	        const scene = this._scenes[id];
	        if (!scene)
	            return;
	        if (scene.isActive()) {
	            scene.stop(data);
	        }
	        scene.destroy(data);
	        delete this._scenes[id];
	    }
	    pause(id, opts) {
	        if (typeof id === 'string') {
	            const scene = this._scenes[id];
	            if (!scene)
	                throw new Error('Unknown scene:' + id);
	            scene.pause(opts);
	        }
	        else {
	            this._active.forEach((s) => s.pause(id));
	        }
	    }
	    resume(id, opts) {
	        if (typeof id === 'string') {
	            const scene = this._scenes[id];
	            if (!scene)
	                throw new Error('Unknown scene:' + id);
	            scene.resume(opts);
	        }
	        else {
	            this._active.forEach((s) => s.resume(id));
	        }
	    }
	    // FRAME
	    frameStart() {
	        this._busy = true;
	        this._active.forEach((s) => s.frameStart());
	    }
	    input(ev) {
	        arrayRevEach(this._active, (s) => {
	            if (!ev.propagationStopped)
	                s.input(ev);
	        });
	    }
	    update(dt) {
	        this._active.forEach((s) => s.update(dt));
	    }
	    draw(buffer) {
	        this._active.forEach((s) => {
	            // if (i > 0) {
	            //     s.buffer.copy(this._active[i - 1].buffer);
	            // }
	            s.draw(buffer);
	        });
	    }
	    frameDebug(buffer) {
	        if (this._active.length) {
	            this._active.forEach((s) => s.frameDebug(buffer));
	        }
	    }
	    frameEnd(buffer) {
	        if (this._active.length) {
	            this._active.forEach((s) => s.frameEnd(buffer));
	        }
	        this._busy = false;
	        for (let i = 0; i < this._pending.length; ++i) {
	            const todo = this._pending[i];
	            todo.scene[todo.action](todo.data);
	        }
	        this._pending.length = 0;
	    }
	}
	const scenes = {};
	function installScene(id, scene) {
	    if (typeof scene === 'function') {
	        scene = { make: scene };
	    }
	    scenes[id] = scene;
	}

	// Widget
	class Widget {
	    constructor(opts = {}) {
	        // tag = 'widget';
	        // id = '';
	        this.parent = null;
	        this.scene = null;
	        this.children = [];
	        this.events = new Events(this);
	        this._style = new Style();
	        this._data = {};
	        this.classes = [];
	        this._props = {
	            needsDraw: true,
	            needsStyle: true,
	            hover: false,
	        };
	        this._attrs = {};
	        if (opts.id)
	            this.attr('id', opts.id);
	        this.attr('tag', opts.tag || 'widget');
	        this.bounds = new Bounds(opts);
	        this._style.set(opts);
	        // opts.tag && (this.tag = opts.tag);
	        if (opts.class) {
	            this.classes = opts.class.split(/ +/g).map((c) => c.trim());
	        }
	        if (opts.tabStop) {
	            this.prop('tabStop', true);
	        }
	        if (opts.disabled) {
	            this.prop('disabled', true);
	        }
	        if (opts.hidden) {
	            this.hidden = true;
	        }
	        if (opts.data) {
	            this._data = opts.data; // call set data yourself
	        }
	        opts.action = opts.action || opts.id;
	        if (opts.action) {
	            if (opts.action === true) {
	                if (!opts.id)
	                    throw new Error('boolean action requires id.');
	                opts.action = opts.id;
	            }
	            this.attr('action', opts.action);
	        }
	        [
	            'create',
	            'input',
	            'update',
	            'draw',
	            'destroy',
	            'keypress',
	            'mouseenter',
	            'mousemove',
	            'mouseleave',
	            'click',
	        ].forEach((n) => {
	            if (n in opts) {
	                this.on(n, opts[n]);
	            }
	        });
	        if (opts.on) {
	            Object.entries(opts.on).forEach(([ev, fn]) => this.on(ev, fn));
	        }
	        if (opts.parent) {
	            this.setParent(opts.parent, opts);
	        }
	        else if (opts.scene) {
	            opts.scene.addChild(this, opts);
	        }
	    }
	    get needsDraw() {
	        return this.scene ? this.scene.needsDraw : false;
	    }
	    set needsDraw(v) {
	        if (!v)
	            return;
	        this.scene && (this.scene.needsDraw = v);
	    }
	    get tag() {
	        return this._attrStr('tag');
	    }
	    get id() {
	        return this._attrStr('id');
	    }
	    data(...args) {
	        if (args.length == 0) {
	            return this._data;
	        }
	        if (args.length == 2) {
	            this._setDataItem(args[0], args[1]);
	            this.needsDraw = true;
	            return this;
	        }
	        if (typeof args[0] === 'string') {
	            if (Array.isArray(this._data)) {
	                throw new Error('Cannot access fields of array data.');
	            }
	            return this._data[args[0]];
	        }
	        this._setData(args[0]);
	        this.needsDraw = true;
	        return this;
	    }
	    _setData(v) {
	        this._data = v;
	    }
	    _setDataItem(key, v) {
	        if (Array.isArray(this._data)) {
	            throw new Error('Cannot set field in array data.');
	        }
	        this._data[key] = v;
	    }
	    pos(x, y) {
	        if (x === undefined)
	            return this.bounds;
	        if (typeof x === 'number') {
	            this.bounds.x = x;
	            this.bounds.y = y || 0;
	        }
	        else {
	            this.bounds.x = x.x;
	            this.bounds.y = x.y;
	        }
	        this.needsDraw = true;
	        return this;
	    }
	    updatePos(opts) {
	        if (!this.parent && !this.scene)
	            return;
	        if (opts.centerX || opts.center) {
	            this.centerX();
	        }
	        else if (opts.left) {
	            this.left(opts.left);
	        }
	        else if (opts.right) {
	            this.right(opts.right);
	        }
	        else if (opts.x) {
	            this.bounds.x = opts.x;
	        }
	        if (opts.centerY || opts.center) {
	            this.centerY();
	        }
	        else if (opts.top) {
	            this.top(opts.top);
	        }
	        else if (opts.bottom) {
	            this.bottom(opts.bottom);
	        }
	        else if (opts.y) {
	            this.bounds.y = opts.y;
	        }
	    }
	    contains(...args) {
	        if (this.hidden)
	            return false;
	        if (this.bounds.contains(args[0], args[1]))
	            return true;
	        return this.children.some((c) => c.contains(args[0], args[1]));
	    }
	    center(bounds) {
	        return this.centerX(bounds).centerY(bounds);
	    }
	    centerX(bounds) {
	        const dims = bounds || (this.parent ? this.parent.bounds : this.scene);
	        if (!dims)
	            throw new Error('Need parent or scene to apply center.');
	        if ('x' in dims) {
	            const w = this.bounds.width;
	            const mid = Math.round((dims.width - w) / 2);
	            this.bounds.x = dims.x + mid;
	        }
	        else {
	            this.bounds.x = Math.round((dims.width - this.bounds.width) / 2);
	        }
	        return this;
	    }
	    centerY(bounds) {
	        const dims = bounds || (this.parent ? this.parent.bounds : this.scene);
	        if (!dims)
	            throw new Error('Need parent or scene to apply center.');
	        if ('y' in dims) {
	            const h = this.bounds.height;
	            const mid = Math.round((dims.height - h) / 2);
	            this.bounds.y = dims.y + mid;
	        }
	        else {
	            this.bounds.y = Math.round((dims.height - this.bounds.height) / 2);
	        }
	        return this;
	    }
	    left(n) {
	        const x = this.parent ? this.parent.bounds.left : 0;
	        this.bounds.left = x + n;
	        return this;
	    }
	    right(n) {
	        if (this.parent) {
	            this.bounds.right = this.parent.bounds.right + n;
	        }
	        else if (this.scene) {
	            this.bounds.right = this.scene.width + n - 1;
	        }
	        else {
	            this.bounds.left = 0;
	        }
	        return this;
	    }
	    top(n) {
	        const y = this.parent ? this.parent.bounds.top : 0;
	        this.bounds.top = y + n;
	        return this;
	    }
	    bottom(n) {
	        if (this.parent) {
	            this.bounds.bottom = this.parent.bounds.bottom + n - 1;
	        }
	        else if (this.scene) {
	            this.bounds.bottom = this.scene.height + n - 1;
	        }
	        else {
	            this.bounds.top = 0;
	        }
	        return this;
	    }
	    resize(w, h) {
	        this.bounds.width = w || this.bounds.width;
	        this.bounds.height = h || this.bounds.height;
	        this.needsDraw = true;
	        return this;
	    }
	    style(...args) {
	        if (args.length == 0)
	            return this._style;
	        if (typeof args[0] !== 'string') {
	            this._style.set(args[0]);
	        }
	        else {
	            if (args[1] === undefined) {
	                const source = this._used || this._style;
	                return source.get(args[0]);
	            }
	            this._style.set(args[0], args[1]);
	        }
	        this.needsStyle = true;
	        return this;
	    }
	    addClass(c) {
	        const all = c.split(/ +/g);
	        all.forEach((a) => {
	            if (this.classes.includes(a))
	                return;
	            this.classes.push(a);
	        });
	        return this;
	    }
	    removeClass(c) {
	        const all = c.split(/ +/g);
	        all.forEach((a) => {
	            arrayDelete(this.classes, a);
	        });
	        return this;
	    }
	    hasClass(c) {
	        const all = c.split(/ +/g);
	        return arrayIncludesAll(this.classes, all);
	    }
	    toggleClass(c) {
	        const all = c.split(/ +/g);
	        all.forEach((a) => {
	            if (this.classes.includes(a)) {
	                arrayDelete(this.classes, a);
	            }
	            else {
	                this.classes.push(a);
	            }
	        });
	        return this;
	    }
	    attr(name, v) {
	        if (v === undefined)
	            return this._attrs[name];
	        this._attrs[name] = v;
	        return this;
	    }
	    _attrInt(name) {
	        const n = this._attrs[name] || 0;
	        if (typeof n === 'number')
	            return n;
	        if (typeof n === 'string')
	            return Number.parseInt(n);
	        return n ? 1 : 0;
	    }
	    _attrStr(name) {
	        const n = this._attrs[name] || '';
	        if (typeof n === 'string')
	            return n;
	        if (typeof n === 'number')
	            return '' + n;
	        return n ? 'true' : 'false';
	    }
	    _attrBool(name) {
	        return !!this._attrs[name];
	    }
	    text(v) {
	        if (v === undefined)
	            return this._attrStr('text');
	        this.attr('text', v);
	        return this;
	    }
	    prop(name, v) {
	        if (v === undefined)
	            return this._props[name];
	        const current = this._props[name];
	        if (current !== v) {
	            this._setProp(name, v);
	        }
	        return this;
	    }
	    _setProp(name, v) {
	        // console.log(`${this.tag}.${name}=${v} (was:${this._props[name]})`);
	        this._props[name] = v;
	        this.needsStyle = true;
	    }
	    _propInt(name) {
	        const n = this._props[name] || 0;
	        if (typeof n === 'number')
	            return n;
	        if (typeof n === 'string')
	            return Number.parseInt(n);
	        return n ? 1 : 0;
	    }
	    _propStr(name) {
	        const n = this._props[name] || '';
	        if (typeof n === 'string')
	            return n;
	        if (typeof n === 'number')
	            return '' + n;
	        return n ? 'true' : 'false';
	    }
	    _propBool(name) {
	        return !!this._props[name];
	    }
	    toggleProp(name) {
	        const current = !!this._props[name];
	        this.prop(name, !current);
	        return this;
	    }
	    incProp(name, n = 1) {
	        let current = this.prop(name) || 0;
	        if (typeof current === 'boolean') {
	            current = current ? 1 : 0;
	        }
	        else if (typeof current === 'string') {
	            current = Number.parseInt(current) || 0;
	        }
	        current += n;
	        this.prop(name, current);
	        return this;
	    }
	    get hovered() {
	        return !!this.prop('hover');
	    }
	    set hovered(v) {
	        this.prop('hover', v);
	    }
	    get disabled() {
	        let current = this;
	        while (current) {
	            if (current.prop('disabled'))
	                return true;
	            current = current.parent;
	        }
	        return false;
	    }
	    set disabled(v) {
	        this.prop('disabled', v);
	    }
	    get hidden() {
	        let current = this;
	        while (current) {
	            if (current.prop('hidden'))
	                return true;
	            current = current.parent;
	        }
	        return false;
	    }
	    set hidden(v) {
	        this.prop('hidden', v);
	        if (!v && this._used && this._used.opacity == 0) {
	            this._used.opacity = 100;
	        }
	        if (v && this.scene && this.scene.focused === this) {
	            this.scene.nextTabStop();
	        }
	        else if (!v && this.scene && this.scene.focused === null) {
	            this.scene.setFocusWidget(this);
	        }
	        this.trigger(v ? 'hide' : 'show');
	    }
	    get needsStyle() {
	        return this._propBool('needsStyle');
	    }
	    set needsStyle(v) {
	        this._props.needsStyle = v;
	        if (v) {
	            this.needsDraw = true; // changed style or state
	        }
	    }
	    get focused() {
	        return !!this.prop('focus');
	    }
	    focus(reverse = false) {
	        if (this.prop('focus'))
	            return;
	        this.prop('focus', true);
	        this.trigger('focus', { reverse });
	    }
	    blur(reverse = false) {
	        if (!this.prop('focus'))
	            return;
	        this.prop('focus', false);
	        this.trigger('blur', { reverse });
	    }
	    // CHILDREN
	    setParent(parent, opts) {
	        if (this.parent === parent)
	            return;
	        // remove from curent parent
	        if (this.parent) {
	            const index = this.parent.children.indexOf(this);
	            if (index < 0)
	                throw new Error('Error in parent/child setup!');
	            this.parent.children.splice(index, 1);
	        }
	        if (parent) {
	            if (this.scene !== parent.scene) {
	                if (this.scene) {
	                    this.scene._detach(this);
	                }
	                if (parent.scene) {
	                    parent.scene._attach(this);
	                }
	                if (opts && opts.focused) {
	                    this.scene.setFocusWidget(this);
	                }
	            }
	            if (opts && opts.first) {
	                parent.children.unshift(this);
	            }
	            else if (opts && opts.before) {
	                let index = -1;
	                if (typeof opts.before === 'string') {
	                    index = parent.children.findIndex((c) => c.id === opts.before);
	                }
	                else {
	                    index = parent.children.indexOf(opts.before);
	                }
	                if (index < 0) {
	                    parent.children.unshift(this);
	                }
	                else {
	                    parent.children.splice(index, 0, this);
	                }
	            }
	            else if (opts && opts.after) {
	                let index = -1;
	                if (typeof opts.after === 'string') {
	                    index = parent.children.findIndex((c) => c.id === opts.before);
	                }
	                else {
	                    index = parent.children.indexOf(opts.after);
	                }
	                if (index < 0) {
	                    parent.children.push(this);
	                }
	                else {
	                    parent.children.splice(index + 1, 0, this);
	                }
	            }
	            else {
	                parent.children.push(this);
	            }
	            this.parent = parent;
	        }
	        else {
	            this.scene && this.scene._detach(this);
	            this.parent = null;
	        }
	        if (opts && (this.parent || this.scene)) {
	            this.updatePos(opts);
	        }
	    }
	    addChild(child) {
	        if (this.children.includes(child))
	            return;
	        child.setParent(this);
	    }
	    removeChild(child) {
	        if (!this.children.includes(child))
	            return;
	        child.setParent(null);
	    }
	    childAt(xy$1, y) {
	        if (!isXY(xy$1)) {
	            xy$1 = { x: xy$1, y: y };
	        }
	        // if (!this.contains(xy)) return null;
	        for (let child of this.children) {
	            if (child.contains(xy$1))
	                return child;
	        }
	        return null;
	    }
	    getChild(id) {
	        return this.children.find((c) => c.id === id) || null;
	    }
	    // EVENTS
	    on(ev, cb) {
	        if (ev === 'keypress') {
	            this.prop('tabStop', true);
	        }
	        return this.events.on(ev, cb);
	    }
	    once(ev, cb) {
	        if (ev === 'keypress') {
	            this.prop('tabStop', true);
	        }
	        return this.events.once(ev, cb);
	    }
	    off(ev, cb) {
	        this.events.off(ev, cb);
	        // cannot turn off keypress automatically because
	        // we could be waiting for dispatched events - e.g. 'Enter', or 'dir', ...
	    }
	    trigger(ev, ...args) {
	        return this.events.trigger(ev, ...args);
	    }
	    action(ev) {
	        if (ev && ev.defaultPrevented)
	            return;
	        this.trigger('action');
	        const action = this._attrStr('action');
	        if (!action || !action.length)
	            return;
	        this.scene && this.scene.trigger(action, this);
	    }
	    // FRAME
	    input(e) {
	        this.trigger('input', e);
	        if (e.defaultPrevented || e.propagationStopped)
	            return;
	        if (e.type === KEYPRESS) {
	            this.keypress(e);
	        }
	        else if (e.type === MOUSEMOVE) {
	            this.mousemove(e);
	        }
	        else if (e.type === CLICK) {
	            this.click(e);
	        }
	    }
	    _mouseenter(e) {
	        if (!this.bounds.contains(e))
	            return;
	        if (this.hovered)
	            return;
	        this.hovered = true;
	        this.trigger('mouseenter', e);
	        // if (this._parent) {
	        //     this._parent._mouseenter(e);
	        // }
	    }
	    mousemove(e) {
	        for (let child of this.children) {
	            child.mousemove(e);
	        }
	        if (this.bounds.contains(e) && !this.hidden) {
	            //  && !e.defaultPrevented
	            this._mouseenter(e);
	            this._mousemove(e);
	            // e.preventDefault();
	        }
	        else {
	            this._mouseleave(e);
	        }
	    }
	    _mousemove(e) {
	        this.trigger('mousemove', e);
	    }
	    _mouseleave(e) {
	        if (!this.hovered)
	            return;
	        if (this.bounds.contains(e))
	            return;
	        this.hovered = false;
	        this.trigger('mouseleave', e);
	        // if (this._parent) {
	        //     this._parent.mouseleave(e);
	        // }
	    }
	    click(e) {
	        if (this.disabled || this.hidden)
	            return;
	        e.target = this;
	        const c = this.childAt(e);
	        if (c) {
	            c.click(e);
	        }
	        if (!this.bounds.contains(e))
	            return;
	        if (e.propagationStopped)
	            return;
	        this._click(e);
	        if (!e.defaultPrevented) {
	            this.action();
	        }
	    }
	    _click(e) {
	        this.events.trigger('click', e);
	    }
	    // keypress bubbles
	    keypress(e) {
	        if (this.hidden || this.disabled)
	            return;
	        let current = this;
	        while (current && !e.propagationStopped) {
	            e.dispatch(current.events);
	            current = current.parent;
	        }
	    }
	    draw(buffer) {
	        if (this.needsStyle && this.scene) {
	            this._used = this.scene.styles.computeFor(this);
	            this.needsStyle = false;
	        }
	        if (this.hidden)
	            return;
	        this._draw(buffer);
	        this.trigger('draw', buffer);
	        this.children.forEach((c) => c.draw(buffer));
	    }
	    _draw(buffer) {
	        this._drawFill(buffer);
	    }
	    _drawFill(buffer) {
	        const b = this.bounds;
	        buffer.fillRect(b.x, b.y, b.width, b.height, ' ', this._used.bg, this._used.bg);
	    }
	    update(dt) {
	        this.trigger('update', dt);
	    }
	    destroy() {
	        if (this.parent) {
	            this.setParent(null);
	        }
	        if (this.scene) {
	            this.scene._detach(this);
	        }
	        this.children.forEach((c) => c.destroy());
	        this.children = [];
	        // @ts-ignore;
	        this._used = null;
	    }
	}
	function alignChildren(widget, align = 'left') {
	    if (widget.children.length < 2)
	        return;
	    if (align === 'left') {
	        const left = widget.children.reduce((out, c) => Math.min(out, c.bounds.left), 999);
	        widget.children.forEach((c) => (c.bounds.left = left));
	    }
	    else if (align === 'right') {
	        const right = widget.children.reduce((out, c) => Math.max(out, c.bounds.right), 0);
	        widget.children.forEach((c) => (c.bounds.right = right));
	    }
	    else {
	        // center
	        const right = widget.children.reduce((out, c) => Math.max(out, c.bounds.right), 0);
	        const left = widget.children.reduce((out, c) => Math.min(out, c.bounds.left), 999);
	        const center = left + Math.floor((right - left) / 2);
	        widget.children.forEach((c) => {
	            c.bounds.center = center;
	        });
	    }
	}
	function spaceChildren(widget, space = 0) {
	    if (widget.children.length < 2)
	        return;
	    let y = widget.children.reduce((out, c) => Math.min(out, c.bounds.top), 999);
	    widget.children
	        .slice()
	        .sort((a, b) => a.bounds.top - b.bounds.top)
	        .forEach((c) => {
	        c.bounds.top = y;
	        y = c.bounds.bottom + space;
	    });
	}
	function wrapChildren(widget, pad = 0) {
	    if (widget.children.length < 1)
	        return;
	    widget.bounds.copy(widget.children[0].bounds);
	    widget.children.forEach((c) => {
	        widget.bounds.include(c.bounds);
	    });
	    widget.bounds.pad(pad);
	}

	// import * as GWU from 'gw-utils';
	class Text extends Widget {
	    constructor(opts) {
	        super(opts);
	        this._text = '';
	        this._lines = [];
	        this._fixedWidth = false;
	        this._fixedHeight = false;
	        this._fixedHeight = !!opts.height;
	        this._fixedWidth = !!opts.width;
	        this.bounds.width = opts.width || 0;
	        this.bounds.height = opts.height || 1;
	        this.text(opts.text || '');
	    }
	    text(v) {
	        if (v === undefined)
	            return this._text;
	        this._text = v;
	        let w = this._fixedWidth
	            ? this.bounds.width
	            : this.scene
	                ? this.scene.width
	                : 100;
	        this._lines = splitIntoLines(this._text, w);
	        if (!this._fixedWidth) {
	            this.bounds.width = this._lines.reduce((out, line) => Math.max(out, length(line)), 0);
	        }
	        if (this._fixedHeight) {
	            if (this._lines.length > this.bounds.height) {
	                this._lines.length = this.bounds.height;
	            }
	        }
	        else {
	            this.bounds.height = Math.max(1, this._lines.length);
	        }
	        this.needsDraw = true;
	        return this;
	    }
	    resize(w, h) {
	        super.resize(w, h);
	        this._fixedWidth = w > 0;
	        this._fixedHeight = h > 0;
	        this.text(this._text);
	        return this;
	    }
	    addChild() {
	        throw new Error('Text widgets cannot have children.');
	    }
	    _draw(buffer) {
	        super._draw(buffer);
	        let vOffset = 0;
	        if (this._used.valign === 'bottom') {
	            vOffset = this.bounds.height - this._lines.length;
	        }
	        else if (this._used.valign === 'middle') {
	            vOffset = Math.floor((this.bounds.height - this._lines.length) / 2);
	        }
	        this._lines.forEach((line, i) => {
	            buffer.drawText(this.bounds.x, this.bounds.y + i + vOffset, line, this._used.fg, -1, this.bounds.width, this._used.align);
	        });
	    }
	}
	// // extend Layer
	// export type AddTextOptions = TextOptions & UpdatePosOpts & { parent?: Widget };
	// export function text(opts: AddTextOptions = {}): Text {
	//     const widget = new Text(opts);
	//     return widget;
	// }

	class Border extends Widget {
	    constructor(opts) {
	        super(opts);
	        this.ascii = false;
	        if (opts.ascii) {
	            this.ascii = true;
	        }
	        else if (opts.fg && opts.ascii !== false) {
	            this.ascii = true;
	        }
	    }
	    // contains(e: XY.XY): boolean;
	    // contains(x: number, y: number): boolean;
	    contains() {
	        return false;
	    }
	    _draw(buffer) {
	        super._draw(buffer);
	        const w = this.bounds.width;
	        const h = this.bounds.height;
	        const x = this.bounds.x;
	        const y = this.bounds.y;
	        const ascii = this.ascii;
	        drawBorder(buffer, x, y, w, h, this._used, ascii);
	        return true;
	    }
	}
	/*
	// extend WidgetLayer
	export type AddBorderOptions = BorderOptions &
	    Widget.SetParentOptions & { parent?: Widget.Widget };

	declare module './layer' {
	    interface WidgetLayer {
	        border(opts: AddBorderOptions): Border;
	    }
	}
	WidgetLayer.prototype.border = function (opts: AddBorderOptions): Border {
	    const options = Object.assign({}, this._opts, opts);
	    const list = new Border(this, options);
	    if (opts.parent) {
	        list.setParent(opts.parent, opts);
	    }
	    return list;
	};
	*/
	function drawBorder(buffer, x, y, w, h, style, ascii) {
	    const fg = style.fg;
	    const bg = style.bg;
	    if (ascii) {
	        for (let i = 1; i < w; ++i) {
	            buffer.draw(x + i, y, '-', fg, bg);
	            buffer.draw(x + i, y + h - 1, '-', fg, bg);
	        }
	        for (let j = 1; j < h; ++j) {
	            buffer.draw(x, y + j, '|', fg, bg);
	            buffer.draw(x + w - 1, y + j, '|', fg, bg);
	        }
	        buffer.draw(x, y, '+', fg, bg);
	        buffer.draw(x + w - 1, y, '+', fg, bg);
	        buffer.draw(x, y + h - 1, '+', fg, bg);
	        buffer.draw(x + w - 1, y + h - 1, '+', fg, bg);
	    }
	    else {
	        forBorder(x, y, w, h, (x, y) => {
	            buffer.draw(x, y, ' ', bg, bg);
	        });
	    }
	}

	// import * as GWU from 'gw-utils';
	function toPadArray(pad) {
	    if (!pad)
	        return [0, 0, 0, 0];
	    if (pad === true) {
	        return [1, 1, 1, 1];
	    }
	    else if (typeof pad === 'number') {
	        return [pad, pad, pad, pad];
	    }
	    else if (pad.length == 1) {
	        const p = pad[0];
	        return [p, p, p, p];
	    }
	    else if (pad.length == 2) {
	        const [pv, ph] = pad;
	        return [pv, ph, pv, ph];
	    }
	    throw new Error('Invalid pad: ' + pad);
	}
	defaultStyle.add('dialog', {
	    bg: 'darkest_gray',
	    fg: 'light_gray',
	});
	class Dialog extends Widget {
	    constructor(opts) {
	        super((() => {
	            opts.tag = opts.tag || Dialog.default.tag;
	            return opts;
	        })());
	        this.legend = null;
	        let border = opts.border || Dialog.default.border;
	        this.attr('border', border);
	        const pad = toPadArray(opts.pad || Dialog.default.pad);
	        this.attr('padTop', pad[0]);
	        this.attr('padRight', pad[1]);
	        this.attr('padBottom', pad[2]);
	        this.attr('padLeft', pad[3]);
	        if (border !== 'none') {
	            for (let i = 0; i < 4; ++i) {
	                pad[i] += 1;
	            }
	        }
	        this._adjustBounds(pad);
	        this.attr('legendTag', opts.legendTag || Dialog.default.legendTag);
	        this.attr('legendClass', opts.legendClass || opts.class || Dialog.default.legendClass);
	        this.attr('legendAlign', opts.legendAlign || Dialog.default.legendAlign);
	        this._addLegend(opts);
	    }
	    _adjustBounds(pad) {
	        // adjust w,h,x,y for border/pad
	        this.bounds.width += pad[1] + pad[3];
	        this.bounds.height += pad[0] + pad[2];
	        this.bounds.x -= pad[3];
	        this.bounds.y -= pad[0];
	        return this;
	    }
	    get _innerLeft() {
	        const border = this._attrStr('border');
	        const padLeft = this._attrInt('padLeft');
	        return this.bounds.x + padLeft + (border === 'none' ? 0 : 1);
	    }
	    get _innerWidth() {
	        const border = this._attrStr('border');
	        const padSize = this._attrInt('padLeft') + this._attrInt('padRight');
	        return this.bounds.width - padSize - (border === 'none' ? 0 : 2);
	    }
	    get _innerTop() {
	        const border = this._attrStr('border');
	        const padTop = this._attrInt('padTop');
	        return this.bounds.y + padTop + (border === 'none' ? 0 : 1);
	    }
	    get _innerHeight() {
	        const border = this._attrStr('border');
	        const padSize = this._attrInt('padTop') + this._attrInt('padBottom');
	        return this.bounds.height - padSize - (border === 'none' ? 0 : 2);
	    }
	    _addLegend(opts) {
	        if (!opts.legend) {
	            if (this._attrStr('border') === 'none') {
	                this.bounds.height = 0;
	            }
	            return this;
	        }
	        const border = this._attrStr('border') !== 'none';
	        const textWidth = length(opts.legend);
	        const width = this.bounds.width - (border ? 4 : 0);
	        const align = this._attrStr('legendAlign');
	        let x = this.bounds.x + (border ? 2 : 0);
	        if (align === 'center') {
	            x += Math.floor((width - textWidth) / 2);
	        }
	        else if (align === 'right') {
	            x += width - textWidth;
	        }
	        this.legend = new Text({
	            parent: this,
	            text: opts.legend,
	            x,
	            y: this.bounds.y,
	            // depth: this.depth + 1,
	            tag: this._attrStr('legendTag'),
	            class: this._attrStr('legendClass'),
	        });
	        // if (this.bounds.width < this.legend.bounds.width + 4) {
	        //     this.bounds.width = this.legend.bounds.width + 4;
	        // }
	        // this.bounds.height +=
	        //     this._attrInt('padTop') + this._attrInt('padBottom');
	        this.bounds.height = Math.max(1, this.bounds.height);
	        return this;
	    }
	    _draw(buffer) {
	        super._draw(buffer);
	        const border = this._attrStr('border');
	        if (border === 'none')
	            return false;
	        drawBorder(buffer, this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height, this._used, border === 'ascii');
	        return true;
	    }
	}
	Dialog.default = {
	    tag: 'dialog',
	    border: 'none',
	    pad: false,
	    legendTag: 'legend',
	    legendClass: '',
	    legendAlign: 'left',
	};
	function dialog(opts) {
	    const widget = new Dialog(opts);
	    return widget;
	}

	// import * as Color from '../color';
	const AlertScene = {
	    create() {
	        this.on('mousemove', (e) => {
	            e.stopPropagation();
	        });
	        this.on('click', (e) => {
	            e.stopPropagation();
	            this.stop({ click: true });
	        });
	        this.on('keypress', (e) => {
	            e.stopPropagation();
	            this.stop({ keypress: true });
	        });
	    },
	    start(data) {
	        if (data.args) {
	            data.text = apply(data.text, data.args);
	        }
	        data.class = data.class || 'alert';
	        data.border = data.border || 'ascii';
	        data.pad = data.pad || 1;
	        const text = new Text(data);
	        if (!data.height) {
	            data.height = text.bounds.height;
	        }
	        if (!data.width) {
	            data.width = text.bounds.width;
	        }
	        data.scene = this;
	        data.center = true;
	        const dialog = new Dialog(data);
	        text.setParent(dialog, { center: true });
	        if (!data.waitForAck) {
	            this.wait(data.duration || 3000, () => this.stop({}));
	        }
	    },
	    stop() {
	        this.children.forEach((c) => c.destroy());
	        this.children = [];
	        this.timers.clear();
	    },
	};
	installScene('alert', AlertScene);

	// import * as GWU from 'gw-utils';
	class Button extends Text {
	    constructor(opts) {
	        super((() => {
	            opts.text = opts.text || '';
	            opts.tabStop = opts.tabStop === undefined ? true : opts.tabStop;
	            opts.tag = opts.tag || 'button';
	            if (!opts.text && !opts.width)
	                throw new Error('Buttons must have text or width.');
	            if (opts.text.length == 0) {
	                opts.width = opts.width || 2;
	            }
	            return opts;
	        })());
	        this.on('click', this.action.bind(this));
	        this.on('Enter', this.action.bind(this));
	    }
	}
	/*
	// extend Layer

	export type AddButtonOptions = Omit<ButtonOptions, 'text'> &
	    Widget.SetParentOptions & { parent?: Widget.Widget };

	declare module './layer' {
	    interface WidgetLayer {
	        button(text: string, opts?: AddButtonOptions): Button;
	    }
	}
	WidgetLayer.prototype.button = function (
	    text: string,
	    opts: AddButtonOptions
	): Button {
	    const options: ButtonOptions = Object.assign({}, this._opts, opts, {
	        text,
	    });
	    const widget = new Button(this, options);
	    if (opts.parent) {
	        widget.setParent(opts.parent, opts);
	    }
	    this.pos(widget.bounds.x, widget.bounds.bottom);
	    return widget;
	};
	*/

	// import * as GWU from 'gw-utils';
	const ConfirmScene = {
	    create() {
	        this.on('keypress', (e) => {
	            if (e.key === 'Escape') {
	                this.trigger('CANCEL');
	            }
	            else if (e.key === 'Enter') {
	                this.trigger('OK');
	            }
	        });
	        this.on('OK', () => {
	            this.stop(true);
	        });
	        this.on('CANCEL', () => {
	            this.stop(false);
	        });
	    },
	    start(opts) {
	        opts.class = opts.class || 'confirm';
	        opts.border = opts.border || 'ascii';
	        opts.pad = opts.pad || 1;
	        // Fade the background
	        const opacity = opts.opacity !== undefined ? opts.opacity : 50;
	        this.bg = BLACK.alpha(opacity);
	        if (opts.cancel === undefined) {
	            opts.cancel = 'Cancel';
	        }
	        else if (opts.cancel === true) {
	            opts.cancel = 'Cancel';
	        }
	        else if (!opts.cancel) {
	            opts.cancel = '';
	        }
	        opts.ok = opts.ok || 'Ok';
	        let buttonWidth = opts.buttonWidth || 0;
	        if (!buttonWidth) {
	            buttonWidth = Math.max(opts.ok.length, opts.cancel.length);
	        }
	        const width = Math.max(opts.width || 0, buttonWidth * 2 + 2);
	        // create the text widget
	        const textWidget = new Text({
	            scene: this,
	            text: opts.text,
	            class: opts.textClass || opts.class,
	            width: width,
	            height: opts.height,
	        }).center();
	        Object.assign(opts, {
	            scene: this,
	            width: textWidget.bounds.width + 2,
	            height: textWidget.bounds.height + 2,
	            x: textWidget.bounds.x,
	            y: textWidget.bounds.y,
	            tag: 'confirm',
	        });
	        const dialog = new Dialog(opts);
	        dialog.addChild(textWidget);
	        new Button({
	            parent: dialog,
	            text: opts.ok,
	            class: opts.okClass || opts.class,
	            width: buttonWidth,
	            id: 'OK',
	            right: -1 - dialog._attrInt('padRight'),
	            bottom: -1 - dialog._attrInt('padBottom'),
	        });
	        if (opts.cancel.length) {
	            new Button({
	                parent: dialog,
	                text: opts.cancel,
	                class: opts.cancelClass || opts.class,
	                width: buttonWidth,
	                id: 'CANCEL',
	                left: 1 + dialog._attrInt('padLeft'),
	                bottom: -1 - dialog._attrInt('padBottom'),
	            });
	        }
	        if (opts.done) {
	            const done = opts.done;
	            this.once('OK', () => {
	                done(true);
	            });
	            this.once('CANCEL', () => {
	                done(false);
	            });
	        }
	    },
	    stop() {
	        this.children.forEach((c) => c.destroy());
	        this.children = [];
	    },
	};
	installScene('confirm', ConfirmScene);

	// import * as GWU from 'gw-utils';
	defaultStyle.add('input', {
	    bg: 'light_gray',
	    fg: 'black',
	    align: 'left',
	    valign: 'top',
	});
	defaultStyle.add('input:invalid', {
	    fg: 'red',
	});
	defaultStyle.add('input:empty', {
	    fg: 'darkest_green',
	});
	defaultStyle.add('input:focus', {
	    bg: 'lighter_gray',
	});
	class Input extends Text {
	    constructor(opts) {
	        super((() => {
	            opts.text = opts.text || '';
	            opts.tag = opts.tag || 'input';
	            opts.tabStop = opts.tabStop === undefined ? true : opts.tabStop;
	            opts.width =
	                opts.width ||
	                    opts.maxLength ||
	                    Math.max(opts.minLength || 0, 10);
	            return opts;
	        })());
	        this.minLength = 0;
	        this.maxLength = 0;
	        this.numbersOnly = false;
	        this.min = 0;
	        this.max = 0;
	        this.attr('default', this._text);
	        this.attr('placeholder', opts.placeholder || Input.default.placeholder);
	        if (opts.numbersOnly) {
	            this.numbersOnly = true;
	            this.min = opts.min || 0;
	            this.max = opts.max || 0;
	        }
	        else {
	            this.minLength = opts.minLength || 0;
	            this.maxLength = opts.maxLength || 0;
	        }
	        if (opts.required) {
	            this.attr('required', true);
	            this.prop('required', true);
	        }
	        if (opts.disabled) {
	            this.attr('disabled', true);
	            this.prop('disabled', true);
	        }
	        this.prop('valid', this.isValid()); // redo b/c rules are now set
	        this.on('blur', this.action.bind(this));
	        // this.on('click', this.action.bind(this));
	        this.reset();
	    }
	    reset() {
	        this.text(this._attrStr('default'));
	    }
	    _setProp(name, v) {
	        super._setProp(name, v);
	        this._props.valid = this.isValid();
	    }
	    isValid() {
	        const t = this._text || '';
	        if (this.numbersOnly) {
	            const val = Number.parseInt(t);
	            if (this.min !== undefined && val < this.min)
	                return false;
	            if (this.max !== undefined && val > this.max)
	                return false;
	            return val > 0;
	        }
	        const minLength = Math.max(this.minLength, this.prop('required') ? 1 : 0);
	        return (t.length >= minLength &&
	            (!this.maxLength || t.length <= this.maxLength));
	    }
	    keypress(ev) {
	        if (!ev.key)
	            return;
	        const textEntryBounds = this.numbersOnly ? ['0', '9'] : [' ', '~'];
	        if (ev.key === 'Enter' && this.isValid()) {
	            this.action();
	            this.scene && this.scene.nextTabStop();
	            ev.stopPropagation();
	            return;
	        }
	        if (ev.key == 'Delete' || ev.key == 'Backspace') {
	            if (this._text.length) {
	                this.text(spliceRaw(this._text, this._text.length - 1, 1));
	                this.trigger('change');
	                this._used && this._draw(this.scene.buffer); // save some work?
	            }
	            ev.stopPropagation();
	            return;
	        }
	        else if (isControlCode(ev)) {
	            // ignore other special keys...
	            return;
	        }
	        // eat/use all other keys
	        if (ev.key >= textEntryBounds[0] && ev.key <= textEntryBounds[1]) {
	            // allow only permitted input
	            if (!this.maxLength || this._text.length < this.maxLength) {
	                this.text(this._text + ev.key);
	                this.trigger('change');
	                this._used && this._draw(this.scene.buffer); // save some work?
	            }
	        }
	        ev.stopPropagation();
	    }
	    click(e) {
	        if (this.disabled || this.hidden)
	            return;
	        e.target = this;
	        const c = this.childAt(e);
	        if (c) {
	            c.click(e);
	        }
	        if (!this.bounds.contains(e))
	            return;
	        if (e.propagationStopped)
	            return;
	        e.dispatch(this.events);
	    }
	    text(v) {
	        if (v === undefined)
	            return this._text;
	        super.text(v);
	        this.prop('empty', this._text.length === 0);
	        this.prop('valid', this.isValid());
	        return this;
	    }
	    _draw(buffer, _force = false) {
	        this._drawFill(buffer);
	        let vOffset = 0;
	        if (!this._used) ;
	        else if (this._used.valign === 'bottom') {
	            vOffset = this.bounds.height - this._lines.length;
	        }
	        else if (this._used.valign === 'middle') {
	            vOffset = Math.floor((this.bounds.height - this._lines.length) / 2);
	        }
	        let show = this._text;
	        if (show.length == 0) {
	            show = this._attrStr('placeholder');
	        }
	        if (this._text.length > this.bounds.width) {
	            show = this._text.slice(this._text.length - this.bounds.width);
	        }
	        const fg = this._used ? this._used.fg : 'white';
	        const align = this._used ? this._used.align : 'left';
	        buffer.drawText(this.bounds.x, this.bounds.y + vOffset, show, fg, -1, this.bounds.width, align);
	        return true;
	    }
	}
	Input.default = {
	    tag: 'input',
	    width: 10,
	    placeholder: '',
	};
	/*
	// extend WidgetLayer

	export type AddInputOptions = InputOptions &
	    Widget.SetParentOptions & { parent?: Widget.Widget };

	declare module './layer' {
	    interface WidgetLayer {
	        input(opts: AddInputOptions): Input;
	    }
	}
	WidgetLayer.prototype.input = function (opts: AddInputOptions): Input {
	    const options = Object.assign({}, this._opts, opts);
	    const list = new Input(this, options);
	    if (opts.parent) {
	        list.setParent(opts.parent, opts);
	    }
	    return list;
	};
	*/

	// import * as GWU from 'gw-utils';
	const PromptScene = {
	    create() {
	        this.on('mousemove', (e) => {
	            e.stopPropagation();
	        });
	        this.on('click', (e) => {
	            e.stopPropagation();
	        });
	        this.on('keypress', (e) => {
	            e.stopPropagation();
	        });
	        this.on('INPUT', () => {
	            const input = this.get('INPUT');
	            this.stop(input ? input.text() : null);
	        });
	        this.on('Escape', () => {
	            this.stop(null);
	        });
	    },
	    start(opts) {
	        opts.class = opts.class || 'confirm';
	        opts.border = opts.border || 'ascii';
	        opts.pad = opts.pad || 0;
	        // Fade the background
	        const opacity = opts.opacity !== undefined ? opts.opacity : 50;
	        this.bg = BLACK.alpha(opacity);
	        // create the text widget
	        const textWidget = new Text({
	            text: opts.prompt,
	            class: opts.textClass || opts.class,
	            width: opts.width,
	            height: opts.height,
	        });
	        Object.assign(opts, {
	            width: textWidget.bounds.width + 2,
	            height: textWidget.bounds.height + 1,
	            x: textWidget.bounds.x - 1,
	            y: textWidget.bounds.y - 1,
	            tag: 'inputbox',
	            scene: this,
	            center: true,
	        });
	        const dialog = new Dialog(opts);
	        textWidget.setParent(dialog, { top: 1, centerX: true });
	        let width = dialog._innerWidth - 2;
	        let x = textWidget.bounds.left;
	        if (opts.label) {
	            const label = new Text({
	                parent: dialog,
	                text: opts.label,
	                class: opts.labelClass || opts.class,
	                tag: 'label',
	                x,
	                bottom: -1,
	            });
	            x += label.bounds.width + 1;
	            width -= label.bounds.width + 1;
	        }
	        const input = new Input({
	            parent: dialog,
	            class: opts.inputClass || opts.class,
	            width,
	            id: 'INPUT',
	            x,
	            bottom: -1,
	        });
	        this.once('INPUT', () => {
	            if (opts.done)
	                opts.done(input.text());
	        });
	        this.once('Escape', () => {
	            if (opts.done)
	                opts.done(null);
	        });
	    },
	    stop() {
	        this.children.forEach((c) => c.destroy());
	        this.children = [];
	    },
	};
	installScene('prompt', PromptScene);

	// import * as Color from '../color';
	const MenuScene = {
	    create() {
	        this.on('click', () => {
	            this.stop();
	        });
	        this.on('Escape', () => {
	            this.stop();
	        });
	    },
	    start(data) {
	        if (!data.menu)
	            throw new Error('Must supply a menu to show!');
	        this.addChild(data.menu);
	        this.events.onUnhandled = (ev, ...args) => {
	            data.origin.trigger(ev, ...args);
	        };
	    },
	    stop() {
	        this.children = [];
	    },
	};
	installScene('menu', MenuScene);

	var index$2 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		AlertScene: AlertScene,
		ConfirmScene: ConfirmScene,
		PromptScene: PromptScene,
		MenuScene: MenuScene
	});

	// import * as GWU from 'gw-utils';
	class Fieldset extends Dialog {
	    constructor(opts) {
	        super((() => {
	            opts.tag = opts.tag || Fieldset.default.tag;
	            opts.border = opts.border || Fieldset.default.border;
	            opts.legendTag = opts.legendTag || Fieldset.default.legendTag;
	            opts.legendClass =
	                opts.legendClass || Fieldset.default.legendClass;
	            opts.legendAlign =
	                opts.legendAlign || Fieldset.default.legendAlign;
	            opts.width = opts.width || 0;
	            opts.height = opts.height || 0;
	            return opts;
	        })());
	        this.fields = [];
	        this.attr('separator', opts.separator || Fieldset.default.separator);
	        this.attr('dataTag', opts.dataTag || Fieldset.default.dataTag);
	        this.attr('dataClass', opts.dataClass || Fieldset.default.dataClass);
	        this.attr('dataWidth', opts.dataWidth);
	        this.attr('labelTag', opts.labelTag || Fieldset.default.labelTag);
	        this.attr('labelClass', opts.labelClass || Fieldset.default.labelClass);
	        this.attr('labelWidth', this._innerWidth - opts.dataWidth);
	        this._addLegend(opts);
	    }
	    _adjustBounds(pad) {
	        this.bounds.width = Math.max(this.bounds.width, pad[1] + pad[3]);
	        this.bounds.height = Math.max(this.bounds.height, pad[0] + pad[2]);
	        return this;
	    }
	    get _labelLeft() {
	        const border = this._attrStr('border');
	        const padLeft = this._attrInt('padLeft');
	        return this.bounds.x + padLeft + (border === 'none' ? 0 : 1);
	    }
	    get _dataLeft() {
	        return this._labelLeft + this._attrInt('labelWidth');
	    }
	    get _nextY() {
	        let border = this._attrStr('border') === 'none' ? 0 : 1;
	        const padBottom = this._attrInt('padBottom');
	        return this.bounds.bottom - border - padBottom;
	    }
	    add(label, format) {
	        const sep = this._attrStr('separator');
	        const labelText = padEnd(label, this._attrInt('labelWidth') - sep.length, ' ') + sep;
	        new Text({
	            parent: this,
	            text: labelText,
	            x: this._labelLeft,
	            y: this._nextY,
	            width: this._attrInt('labelWidth'),
	            tag: this._attrStr('labelTag'),
	            class: this._attrStr('labelClass'),
	        });
	        if (typeof format === 'string') {
	            format = { format };
	        }
	        format.x = this._dataLeft;
	        format.y = this._nextY;
	        format.width = this._attrInt('dataWidth');
	        format.tag = format.tag || this._attrStr('dataTag');
	        format.class = format.class || this._attrStr('dataClass');
	        format.parent = this;
	        const field = new Field(format);
	        this.bounds.height += 1;
	        this.fields.push(field);
	        return this;
	    }
	    _setData(v) {
	        super._setData(v);
	        this.fields.forEach((f) => f.format(v));
	    }
	    _setDataItem(key, v) {
	        super._setDataItem(key, v);
	        this.fields.forEach((f) => f.format(v));
	    }
	}
	Fieldset.default = {
	    tag: 'fieldset',
	    border: 'none',
	    separator: ' : ',
	    pad: false,
	    legendTag: 'legend',
	    legendClass: 'legend',
	    legendAlign: 'left',
	    labelTag: 'label',
	    labelClass: '',
	    dataTag: 'field',
	    dataClass: '',
	};
	class Field extends Text {
	    constructor(opts) {
	        super((() => {
	            // @ts-ignore
	            const topts = opts;
	            topts.tag = topts.tag || 'field';
	            topts.text = '';
	            return topts;
	        })());
	        if (typeof opts.format === 'string') {
	            this._format = compile$1(opts.format);
	        }
	        else {
	            this._format = opts.format;
	        }
	    }
	    format(v) {
	        const t = this._format(v) || '';
	        return this.text(t);
	    }
	}

	class OrderedList extends Widget {
	    constructor(opts) {
	        super((() => {
	            opts.tag = opts.tag || 'ol';
	            return opts;
	        })());
	        this._fixedWidth = false;
	        this._fixedHeight = false;
	        this._fixedHeight = !!opts.height;
	        this._fixedWidth = !!opts.width;
	        this.prop('pad', opts.pad || OrderedList.default.pad);
	    }
	    addChild(w) {
	        w.bounds.x = this.bounds.x + 2;
	        if (!this._fixedHeight) {
	            w.bounds.y = this.bounds.bottom - 2;
	            this.bounds.height += w.bounds.height;
	        }
	        if (this._fixedWidth) {
	            w.bounds.width = Math.min(w.bounds.width, this.bounds.width - 4);
	        }
	        else if (w.bounds.width > this.bounds.width - 4) {
	            this.bounds.width = w.bounds.width + 4;
	        }
	        return super.addChild(w);
	    }
	    _draw(buffer) {
	        this._drawFill(buffer);
	        this.children.forEach((c, i) => {
	            this._drawBulletFor(c, buffer, i);
	        });
	        return true;
	    }
	    _getBullet(index) {
	        return '' + (index + 1);
	    }
	    _drawBulletFor(widget, buffer, index) {
	        const bullet = this._getBullet(index);
	        const size = this._attrInt('pad') + bullet.length;
	        const x = widget.bounds.x - size;
	        const y = widget.bounds.y;
	        buffer.drawText(x, y, bullet, widget._used.fg, widget._used.bg, size);
	    }
	}
	OrderedList.default = {
	    pad: 1,
	};
	class UnorderedList extends OrderedList {
	    constructor(opts) {
	        super((() => {
	            opts.tag = opts.tag || 'ul';
	            return opts;
	        })());
	        this.prop('bullet', opts.bullet || UnorderedList.default.bullet);
	        this.prop('pad', opts.pad || UnorderedList.default.pad);
	    }
	    _getBullet(_index) {
	        return this._attrStr('bullet');
	    }
	}
	UnorderedList.default = {
	    bullet: '\u2022',
	    pad: 1,
	};
	/*
	// extend WidgetLayer

	export type AddOrderedListOptions = OrderedListOptions &
	    Widget.SetParentOptions & { parent?: Widget.Widget };

	export type AddUnorderedListOptions = UnorderedListOptions &
	    Widget.SetParentOptions & { parent?: Widget.Widget };

	declare module './layer' {
	    interface WidgetLayer {
	        ol(opts?: AddOrderedListOptions): OrderedList;
	        ul(opts?: AddUnorderedListOptions): UnorderedList;
	    }
	}

	WidgetLayer.prototype.ol = function (
	    opts: AddOrderedListOptions = {}
	): OrderedList {
	    const options = Object.assign({}, this._opts, opts) as OrderedListOptions;
	    const widget = new OrderedList(this, options);
	    if (opts.parent) {
	        widget.setParent(opts.parent, opts);
	    }
	    return widget;
	};

	WidgetLayer.prototype.ul = function (
	    opts: AddUnorderedListOptions = {}
	): UnorderedList {
	    const options = Object.assign({}, this._opts, opts) as UnorderedListOptions;
	    const widget = new UnorderedList(this, options);
	    if (opts.parent) {
	        widget.setParent(opts.parent, opts);
	    }
	    return widget;
	};
	*/

	// import * as GWU from 'gw-utils';
	defaultStyle.add('datatable', { bg: 'black' });
	// STYLE.defaultStyle.add('th', { bg: 'light_teal', fg: 'dark_blue' });
	// STYLE.defaultStyle.add('td', { bg: 'darker_gray' });
	// STYLE.defaultStyle.add('td:odd', { bg: 'gray' });
	// STYLE.defaultStyle.add('td:hover', { bg: 'light_gray' });
	defaultStyle.add('td:selected', { bg: 'gray' });
	class Column {
	    constructor(opts) {
	        this.format = IDENTITY;
	        this.width = opts.width || DataTable.default.columnWidth;
	        if (typeof opts.format === 'function') {
	            this.format = opts.format;
	        }
	        else if (opts.format) {
	            this.format = compile$1(opts.format);
	        }
	        this.header = opts.header || '';
	        this.headerTag = opts.headerTag || DataTable.default.headerTag;
	        this.empty = opts.empty || DataTable.default.empty;
	        this.dataTag = opts.dataTag || DataTable.default.dataTag;
	    }
	    addHeader(table, x, y, col) {
	        const t = new Text({
	            parent: table,
	            x,
	            y,
	            class: table.classes.join(' '),
	            tag: table._attrStr('headerTag'),
	            width: this.width,
	            height: table.rowHeight,
	            // depth: table.depth + 1,
	            text: this.header,
	        });
	        t.prop('row', -1);
	        t.prop('col', col);
	        // table.scene.attach(t);
	        return t;
	    }
	    addData(table, data, x, y, col, row) {
	        let text;
	        if (Array.isArray(data)) {
	            text = '' + (data[col] || this.empty);
	        }
	        else if (typeof data !== 'object') {
	            text = '' + data;
	        }
	        else {
	            text = this.format(data);
	        }
	        if (text === '') {
	            text = this.empty;
	        }
	        const widget = new Text({
	            parent: table,
	            text,
	            x,
	            y,
	            class: table.classes.join(' '),
	            tag: table._attrStr('dataTag'),
	            width: this.width,
	            height: table.rowHeight,
	            // depth: table.depth + 1,
	        });
	        widget.on('mouseenter', () => {
	            table.select(col, row);
	        });
	        widget.prop(row % 2 == 0 ? 'even' : 'odd', true);
	        widget.prop('row', row);
	        widget.prop('col', col);
	        // table.addChild(widget);
	        return widget;
	    }
	    addEmpty(table, x, y, col, row) {
	        return this.addData(table, [], x, y, col, row);
	    }
	}
	class DataTable extends Widget {
	    constructor(opts) {
	        super((() => {
	            opts.tag = opts.tag || DataTable.default.tag;
	            opts.tabStop = opts.tabStop === undefined ? true : opts.tabStop;
	            if (opts.data) {
	                if (!Array.isArray(opts.data)) {
	                    opts.data = [opts.data];
	                }
	            }
	            else {
	                opts.data = [];
	            }
	            return opts;
	        })());
	        this.columns = [];
	        this.showHeader = false;
	        this.rowHeight = 1;
	        this.selectedRow = -1;
	        this.selectedColumn = 0;
	        this.size =
	            opts.size ||
	                (this.parent
	                    ? this.parent.bounds.height
	                    : this.scene
	                        ? this.scene.height
	                        : 0);
	        this.bounds.width = 0;
	        opts.columns.forEach((o) => {
	            const col = new Column(o);
	            this.columns.push(col);
	            this.bounds.width += col.width;
	        });
	        if (opts.border) {
	            if (opts.border === true)
	                opts.border = 'ascii';
	        }
	        else if (opts.border === false) {
	            opts.border = 'none';
	        }
	        this.attr('border', opts.border || DataTable.default.border);
	        this.rowHeight = opts.rowHeight || 1;
	        this.bounds.height = 1;
	        this.attr('wrap', opts.wrap === undefined ? DataTable.default.wrap : opts.wrap);
	        this.attr('header', opts.header === undefined ? DataTable.default.header : opts.header);
	        this.attr('headerTag', opts.headerTag || DataTable.default.headerTag);
	        this.attr('dataTag', opts.dataTag || DataTable.default.dataTag);
	        this.attr('prefix', opts.prefix || DataTable.default.prefix);
	        this.attr('select', opts.select || DataTable.default.select);
	        this.attr('hover', opts.hover || DataTable.default.hover);
	        this._setData(this._data);
	    }
	    get selectedData() {
	        if (this.selectedRow < 0)
	            return undefined;
	        return this._data[this.selectedRow];
	    }
	    select(col, row) {
	        // console.log('select', col, row);
	        if (!this._data || this._data.length == 0) {
	            this.selectedRow = this.selectedColumn = 0;
	            return this;
	        }
	        if (this.attr('wrap')) {
	            if (col < 0 || col >= this.columns.length) {
	                col += this.columns.length;
	                col %= this.columns.length;
	            }
	            if (row < 0 || row >= this._data.length) {
	                row += this._data.length;
	                row %= this._data.length;
	            }
	        }
	        col = this.selectedColumn = clamp(col, 0, this.columns.length - 1);
	        row = this.selectedRow = clamp(row, 0, this._data.length - 1);
	        const select = this._attrStr('select');
	        if (select === 'none') {
	            this.children.forEach((c) => {
	                c.prop('selected', false);
	            });
	        }
	        else if (select === 'row') {
	            this.children.forEach((c) => {
	                const active = row == c.prop('row');
	                c.prop('selected', active);
	            });
	        }
	        else if (select === 'column') {
	            this.children.forEach((c) => {
	                const active = col == c.prop('col');
	                c.prop('selected', active);
	            });
	        }
	        else if (select === 'cell') {
	            this.children.forEach((c) => {
	                const active = col == c.prop('col') && row == c.prop('row');
	                c.prop('selected', active);
	            });
	        }
	        this.trigger('change', {
	            row,
	            col,
	            data: this.selectedData,
	        });
	        return this;
	    }
	    selectNextRow() {
	        return this.select(this.selectedColumn, this.selectedRow + 1);
	    }
	    selectPrevRow() {
	        return this.select(this.selectedColumn, this.selectedRow - 1);
	    }
	    selectNextCol() {
	        return this.select(this.selectedColumn + 1, this.selectedRow);
	    }
	    selectPrevCol() {
	        return this.select(this.selectedColumn - 1, this.selectedRow);
	    }
	    blur(reverse) {
	        this.trigger('change', {
	            col: this.selectedColumn,
	            row: this.selectedRow,
	            data: this.selectedData,
	        });
	        return super.blur(reverse);
	    }
	    _setData(v) {
	        this._data = v;
	        for (let i = this.children.length - 1; i >= 0; --i) {
	            const c = this.children[i];
	            if (c.tag !== this.attr('headerTag')) {
	                this.removeChild(c);
	            }
	        }
	        const borderAdj = this.attr('border') !== 'none' ? 1 : 0;
	        let x = this.bounds.x + borderAdj;
	        let y = this.bounds.y + borderAdj;
	        if (this.attr('header')) {
	            this.columns.forEach((col, i) => {
	                col.addHeader(this, x, y, i);
	                x += col.width + borderAdj;
	            });
	            y += this.rowHeight + borderAdj;
	        }
	        this._data.forEach((obj, j) => {
	            if (j >= this.size)
	                return;
	            x = this.bounds.x + borderAdj;
	            this.columns.forEach((col, i) => {
	                col.addData(this, obj, x, y, i, j);
	                x += col.width + borderAdj;
	            });
	            y += this.rowHeight + borderAdj;
	        });
	        if (this._data.length == 0) {
	            x = this.bounds.x + borderAdj;
	            this.columns.forEach((col, i) => {
	                col.addEmpty(this, x, y, i, 0);
	                x += col.width + borderAdj;
	            });
	            y += 1;
	            this.select(-1, -1);
	        }
	        else {
	            this.select(0, 0);
	        }
	        this.bounds.height = y - this.bounds.y;
	        this.bounds.width = x - this.bounds.x;
	        this.needsStyle = true; // sets this.needsDraw
	        return this;
	    }
	    _draw(buffer) {
	        this._drawFill(buffer);
	        this.children.forEach((w) => {
	            if (w.prop('row') >= this.size)
	                return;
	            if (this.attr('border') !== 'none') {
	                drawBorder(buffer, w.bounds.x - 1, w.bounds.y - 1, w.bounds.width + 2, w.bounds.height + 2, this._used, this.attr('border') == 'ascii');
	            }
	        });
	        return true;
	    }
	    // _mouseenter(e: IO.Event): void {
	    //     super._mouseenter(e);
	    //     if (!this.hovered) return;
	    //     const hovered = this.children.find((c) => c.contains(e));
	    //     if (hovered) {
	    //         const col = hovered._propInt('col');
	    //         const row = hovered._propInt('row');
	    //         if (col !== this.selectedColumn || row !== this.selectedRow) {
	    //             this.selectedColumn = col;
	    //             this.selectedRow = row;
	    //             let select = false;
	    //             let hover = this._attrStr('hover');
	    //             if (hover === 'select') {
	    //                 hover = this._attrStr('select');
	    //                 select = true;
	    //             }
	    //             if (hover === 'none') {
	    //                 this.children.forEach((c) => {
	    //                     c.hovered = false;
	    //                     if (select) c.prop('selected', false);
	    //                 });
	    //             } else if (hover === 'row') {
	    //                 this.children.forEach((c) => {
	    //                     const active = row == c.prop('row');
	    //                     c.hovered = active;
	    //                     if (select) c.prop('selected', active);
	    //                 });
	    //             } else if (hover === 'column') {
	    //                 this.children.forEach((c) => {
	    //                     const active = col == c.prop('col');
	    //                     c.hovered = active;
	    //                     if (select) c.prop('selected', active);
	    //                 });
	    //             } else if (hover === 'cell') {
	    //                 this.children.forEach((c) => {
	    //                     const active =
	    //                         col == c.prop('col') && row == c.prop('row');
	    //                     c.hovered = active;
	    //                     if (select) c.prop('selected', active);
	    //                 });
	    //             }
	    //             this.trigger('change', {
	    //                 row,
	    //                 col,
	    //                 data: this.selectedData,
	    //             });
	    //         }
	    //     }
	    // }
	    // click(e: IO.Event): boolean {
	    //     if (!this.contains(e) || this.disabled || this.hidden) return false;
	    //     this.action();
	    //     // this.trigger('change', {
	    //     //     row: this.selectedRow,
	    //     //     col: this.selectedColumn,
	    //     //     data: this.selectedData,
	    //     // });
	    //     // return false;
	    //     return true;
	    // }
	    keypress(e) {
	        if (!e.key)
	            return false;
	        if (e.dir) {
	            return this.dir(e);
	        }
	        if (e.key === 'Enter') {
	            this.action();
	            // this.trigger('change', {
	            //     row: this.selectedRow,
	            //     col: this.selectedColumn,
	            //     data: this.selectedData,
	            // });
	            return true;
	        }
	        return false;
	    }
	    dir(e) {
	        if (!e.dir)
	            return false;
	        if (e.dir[1] == 1) {
	            this.selectNextRow();
	        }
	        else if (e.dir[1] == -1) {
	            this.selectPrevRow();
	        }
	        if (e.dir[0] == 1) {
	            this.selectNextCol();
	        }
	        else if (e.dir[0] == -1) {
	            this.selectPrevCol();
	        }
	        return true;
	    }
	}
	DataTable.default = {
	    columnWidth: 10,
	    header: true,
	    empty: '',
	    tag: 'datatable',
	    headerTag: 'th',
	    dataTag: 'td',
	    select: 'cell',
	    hover: 'select',
	    prefix: 'none',
	    border: 'ascii',
	    wrap: true,
	};
	/*
	// extend WidgetLayer

	export type AddDataTableOptions = DataTableOptions &
	    SetParentOptions & { parent?: Widget };

	declare module './layer' {
	    interface WidgetLayer {
	        datatable(opts: AddDataTableOptions): DataTable;
	    }
	}
	WidgetLayer.prototype.datatable = function (
	    opts: AddDataTableOptions
	): DataTable {
	    const options = Object.assign({}, this._opts, opts);
	    const list = new DataTable(this, options);
	    if (opts.parent) {
	        list.setParent(opts.parent, opts);
	    }
	    return list;
	};
	*/

	class DataList extends DataTable {
	    constructor(opts) {
	        super((() => {
	            // @ts-ignore
	            const tableOpts = opts;
	            if (opts.border !== 'none' && opts.width) {
	                opts.width -= 2;
	            }
	            tableOpts.columns = [Object.assign({}, opts)];
	            if (!opts.header || !opts.header.length) {
	                tableOpts.header = false;
	            }
	            return tableOpts;
	        })());
	    }
	}
	/*
	// extend WidgetLayer

	export type AddDataListOptions = DataListOptions &
	    Widget.SetParentOptions & { parent?: Widget.Widget };

	declare module './layer' {
	    interface WidgetLayer {
	        datalist(opts: AddDataListOptions): DataList;
	    }
	}
	WidgetLayer.prototype.datalist = function (opts: AddDataListOptions): DataList {
	    const options = Object.assign({}, this._opts, opts);
	    const list = new DataList(this, options);
	    if (opts.parent) {
	        list.setParent(opts.parent, opts);
	    }
	    return list;
	};
	*/

	class Menu extends Widget {
	    constructor(opts) {
	        super((() => {
	            opts.tag = opts.tag || Menu.default.tag;
	            opts.class = opts.class || Menu.default.class;
	            opts.tabStop = opts.tabStop === undefined ? true : opts.tabStop;
	            return opts;
	        })());
	        this._selectedIndex = 0;
	        if (Array.isArray(opts.buttonClass)) {
	            this.attr('buttonClass', opts.buttonClass.join(' '));
	        }
	        else {
	            this.attr('buttonClass', opts.buttonClass || Menu.default.buttonClass);
	        }
	        this.attr('buttonTag', opts.buttonTag || Menu.default.buttonTag);
	        this.attr('marker', opts.marker || Menu.default.marker);
	        this._initButtons(opts);
	        this.bounds.height = this.children.length;
	        this.on('mouseenter', (e) => {
	            this.children.forEach((c) => {
	                if (!c.contains(e)) {
	                    c.collapse();
	                }
	                else {
	                    c.expand();
	                }
	            });
	            return true;
	        });
	        this.on('dir', (e) => {
	            if (!e.dir)
	                return;
	            if (e.dir[0] < 0) {
	                this.hide();
	            }
	            else if (e.dir[0] > 0) {
	                this.expandItem();
	            }
	            else if (e.dir[1] < 0) {
	                this.prevItem();
	            }
	            else if (e.dir[1] > 0) {
	                this.nextItem();
	            }
	            e.stopPropagation();
	        });
	        this.on(['Enter', ' '], () => {
	            const btn = this.children[this._selectedIndex];
	            btn.action();
	            this.hide();
	        });
	    }
	    _initButtons(opts) {
	        this.children = [];
	        const buttons = opts.buttons;
	        const marker = this._attrStr('marker');
	        const entries = Object.entries(buttons);
	        this.bounds.width = Math.max(opts.minWidth || 0, this.bounds.width, entries.reduce((out, [key, value]) => {
	            const textLen = length(key) +
	                (typeof value === 'string' ? 0 : marker.length);
	            return Math.max(out, textLen);
	        }, 0));
	        entries.forEach(([key, value], i) => {
	            const opts = {
	                x: this.bounds.x,
	                y: this.bounds.y + i,
	                class: this._attrStr('buttonClass'),
	                tag: this._attrStr('buttonTag'),
	                width: this.bounds.width,
	                height: 1,
	                // depth: this.depth + 1,
	                buttons: value,
	                text: key,
	                parent: this,
	            };
	            if (typeof value === 'string') {
	                opts.action = value;
	            }
	            else {
	                opts.text =
	                    padEnd(key, this.bounds.width - marker.length, ' ') + marker;
	            }
	            const menuItem = new MenuButton(opts);
	            menuItem.on('mouseenter', () => {
	                this.trigger('change');
	            });
	            menuItem.on('click', () => {
	                this.hide();
	            });
	            if (menuItem.menu) {
	                menuItem.menu.on('hide', () => {
	                    this.scene.setFocusWidget(this);
	                });
	            }
	        });
	    }
	    show() {
	        this.hidden = false;
	        this._selectedIndex = 0;
	        this.scene.setFocusWidget(this);
	        this.trigger('show');
	    }
	    hide() {
	        this.hidden = true;
	        this.trigger('hide');
	    }
	    nextItem() {
	        ++this._selectedIndex;
	        if (this._selectedIndex >= this.children.length) {
	            this._selectedIndex = 0;
	        }
	    }
	    prevItem() {
	        --this._selectedIndex;
	        if (this._selectedIndex < 0) {
	            this._selectedIndex = this.children.length - 1;
	        }
	    }
	    expandItem() {
	        const c = this.children[this._selectedIndex];
	        return c.expand();
	    }
	    selectItemWithKey(key) {
	        let found = false;
	        this.children.forEach((c) => {
	            if (found)
	                return;
	            if (c.text().startsWith(key)) {
	                found = true;
	                // ???
	            }
	        });
	    }
	}
	Menu.default = {
	    tag: 'menu',
	    class: '',
	    buttonClass: '',
	    buttonTag: 'mi',
	    marker: ' \u25b6',
	    minWidth: 4,
	};
	class MenuButton extends Text {
	    constructor(opts) {
	        super((() => {
	            opts.tag = opts.tag || 'mi';
	            opts.tabStop = false;
	            return opts;
	        })());
	        this.menu = null;
	        // this.tag = opts.tag || 'mi';
	        if (typeof opts.buttons !== 'string') {
	            this.menu = this._initMenu(opts);
	            this.on('mouseenter', () => {
	                this.menu.hidden = false;
	                this.menu.trigger('change');
	            });
	            this.on('mouseleave', (_n, _w, e) => {
	                var _a;
	                if ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.bounds.contains(e)) {
	                    this.menu.hidden = true;
	                }
	            });
	            this.on('click', () => {
	                return true; // eat clicks
	            });
	        }
	        this.on('click', this.action.bind(this));
	    }
	    collapse() {
	        if (this.menu) {
	            this.menu.hide();
	        }
	    }
	    expand() {
	        if (!this.menu)
	            return null;
	        this.menu.show();
	        // this.scene!.setFocusWidget(this.menu);
	        return this.menu;
	    }
	    _setMenuPos(xy, opts) {
	        xy.x = this.bounds.x + this.bounds.width;
	        xy.y = this.bounds.y;
	        const height = Object.keys(opts.buttons).length;
	        if (this.scene && xy.y + height >= this.scene.height) {
	            xy.y = this.scene.height - height - 1;
	        }
	    }
	    _initMenu(opts) {
	        if (typeof opts.buttons === 'string')
	            return null;
	        const menuOpts = {
	            x: this.bounds.x + this.bounds.width,
	            y: this.bounds.y,
	            class: opts.class,
	            tag: opts.tag || 'mi',
	            buttons: opts.buttons,
	            // depth: this.depth + 1,
	        };
	        this._setMenuPos(menuOpts, opts);
	        menuOpts.parent = this;
	        const menu = new Menu(menuOpts);
	        menu.hidden = true;
	        return menu;
	    }
	}
	/*
	// extend WidgetLayer

	export type AddMenuOptions = MenuOptions &
	    Widget.SetParentOptions & { parent?: Widget.Widget };

	declare module './layer' {
	    interface WidgetLayer {
	        menu(opts: AddMenuOptions): Menu;
	    }
	}
	WidgetLayer.prototype.menu = function (opts: AddMenuOptions): Menu {
	    const options = Object.assign({}, this._opts, opts);
	    const list = new Menu(this, options);
	    if (opts.parent) {
	        list.setParent(opts.parent, opts);
	    }
	    return list;
	};
	*/

	class Menubar extends Widget {
	    // _config!: DropdownConfig;
	    // _buttons: MenubarButton[] = [];
	    // _selectedIndex: number;
	    constructor(opts) {
	        super((() => {
	            opts.tabStop = false;
	            opts.tag = opts.tag || 'menu';
	            return opts;
	        })());
	        if (opts.buttonClass) {
	            if (Array.isArray(opts.buttonClass)) {
	                this.attr('buttonClass', opts.buttonClass.join(' '));
	            }
	            else {
	                this.attr('buttonClass', opts.buttonClass);
	            }
	        }
	        else {
	            this.attr('buttonClass', Menubar.default.buttonClass);
	        }
	        this.attr('buttonTag', opts.buttonTag || Menubar.default.buttonTag);
	        if (opts.menuClass) {
	            if (Array.isArray(opts.menuClass)) {
	                this.attr('menuClass', opts.menuClass.join(' '));
	            }
	            else {
	                this.attr('menuClass', opts.menuClass);
	            }
	        }
	        else {
	            this.attr('menuClass', Menubar.default.menuClass);
	        }
	        this.attr('menuTag', opts.menuTag || Menubar.default.menuTag);
	        this.attr('prefix', opts.prefix || Menubar.default.prefix);
	        this.attr('separator', opts.separator || Menubar.default.separator);
	        this.bounds.height = 1;
	        this._initButtons(opts);
	        // // @ts-ignore
	        // if (this._selectedIndex === undefined) {
	        //     this._selectedIndex = -1;
	        // } else if (this._selectedIndex == -2) {
	        //     this._selectedIndex = 0;
	        // }
	    }
	    // get selectedIndex(): number {
	    //     return this._selectedIndex;
	    // }
	    // set selectedIndex(v: number) {
	    //     if (this._selectedIndex >= 0) {
	    //         this._buttons[this._selectedIndex].prop('focus', false).expand();
	    //     }
	    //     this._selectedIndex = v;
	    //     if (v >= 0 && this._buttons && v < this._buttons.length) {
	    //         this._buttons[v].prop('focus', true).expand();
	    //     } else {
	    //         this._selectedIndex = this._buttons ? -1 : -2;
	    //     }
	    // }
	    // get selectedButton(): Widget.Widget {
	    //     return this._buttons[this._selectedIndex];
	    // }
	    // focus(reverse = false): void {
	    //     if (reverse) {
	    //         this.selectedIndex = this._buttons.length - 1;
	    //     } else {
	    //         this.selectedIndex = 0;
	    //     }
	    //     super.focus(reverse);
	    // }
	    // blur(reverse = false): void {
	    //     this.selectedIndex = -1;
	    //     super.blur(reverse);
	    // }
	    // keypress(e: IO.Event): void {
	    //     if (!e.key) return;
	    //     this.events.dispatch(e);
	    //     if (e.defaultPrevented) return;
	    //     if (e.key === 'Tab') {
	    //         this.selectedIndex += 1;
	    //         if (this._selectedIndex !== -1) {
	    //             e.preventDefault();
	    //         }
	    //     } else if (e.key === 'TAB') {
	    //         this.selectedIndex -= 1;
	    //         if (this._selectedIndex !== -1) {
	    //             e.preventDefault();
	    //         }
	    //     } else if (this._selectedIndex >= 0) {
	    //         super.keypress(e);
	    //     }
	    // }
	    // mousemove(e: IO.Event): void {
	    //     super.mousemove(e);
	    //     if (!this.contains(e) || !this.focused) return;
	    //     const active = this._buttons.findIndex((c) => c.contains(e));
	    //     if (active < 0 || active === this._selectedIndex) return;
	    //     this.selectedIndex = active;
	    // }
	    _initButtons(opts) {
	        // this._config = opts.buttons;
	        const entries = Object.entries(opts.buttons);
	        const buttonTag = this._attrStr('buttonTag');
	        const buttonClass = this._attrStr('buttonClass');
	        let x = this.bounds.x;
	        const y = this.bounds.y;
	        entries.forEach(([key, value], i) => {
	            const prefix = i == 0 ? this._attrStr('prefix') : this._attrStr('separator');
	            new Text({ parent: this, text: prefix, x, y });
	            x += prefix.length;
	            this.bounds.width += prefix.length;
	            const button = new Button({
	                parent: this,
	                id: key,
	                text: key,
	                x,
	                y,
	                tag: buttonTag,
	                class: buttonClass,
	                // buttons: value,
	            });
	            x += button.bounds.width;
	            this.bounds.width += button.bounds.width;
	            let menu = null;
	            if (typeof value !== 'string') {
	                menu = new Menu({
	                    buttons: value,
	                    buttonClass: this._attrStr('menuClass'),
	                    buttonTag: this._attrStr('menuTag'),
	                    x: button.bounds.x,
	                    y: button.bounds.y + 1,
	                });
	                button.data('menu', menu);
	            }
	            button.on(['click', 'Enter', ' '], () => {
	                if (typeof value === 'string') {
	                    // simulate action
	                    this.trigger(value);
	                    this.scene.trigger(value);
	                }
	                else {
	                    this.scene.app.scenes.run('menu', {
	                        menu,
	                        origin: this.scene,
	                    });
	                }
	            });
	        });
	    }
	}
	Menubar.default = {
	    buttonClass: '',
	    buttonTag: 'mi',
	    menuClass: '',
	    menuTag: 'mi',
	    prefix: ' ',
	    separator: ' | ',
	};
	/*
	export interface MenubarButtonOptions extends Widget.WidgetOpts {
	    text: string;
	    buttons: ButtonConfig;
	    action?: string | boolean;
	}

	export class MenubarButton extends Text.Text {
	    menu: Menu | null = null;
	    parent!: Menubar;

	    constructor(opts: MenubarButtonOptions) {
	        super(
	            (() => {
	                opts.tag = opts.tag || 'mi';
	                if (typeof opts.buttons === 'string' && !opts.action) {
	                    opts.action = opts.buttons;
	                }
	                return opts;
	            })()
	        );

	        this.tag = opts.tag || 'mi';

	        if (typeof opts.buttons !== 'string') {
	            const menu = (this.menu = this._initMenu(opts)) as Menu;

	            this.on('mouseenter', () => {
	                menu.hidden = false;
	                menu.trigger('change');
	                return true;
	            });
	            this.on('mouseleave', (e) => {
	                if (this.parent!.contains(e)) {
	                    menu.hidden = true;
	                    return true;
	                }
	                return false;
	            });
	            this.on('click', () => {
	                return true; // eat clicks
	            });
	        }

	        this.on('click', () => {
	            this.parent.activate(this);
	        });
	        this.on('Enter', () => {
	            this.parent.activate(this);
	        });
	        this.on(' ', () => {
	            this.parent.activate(this);
	        });
	    }

	    collapse(): void {
	        if (!this.menu || this.menu.hidden) return;
	        this.menu.hide();
	    }

	    expand(): Menu | null {
	        if (!this.menu) return null;
	        this.menu.show();
	        return this.menu;
	    }

	    _setMenuPos(xy: XY.XY, opts: MenubarButtonOptions) {
	        xy.x = this.bounds.x;
	        const height = opts.height || Object.keys(opts.buttons).length;
	        if (this.bounds.y < height) {
	            xy.y = this.bounds.y + 1;
	        } else {
	            xy.y = this.bounds.top - height;
	        }
	    }

	    _initMenu(opts: MenubarButtonOptions): Menu | null {
	        if (typeof opts.buttons === 'string') return null;

	        const menuOpts = {
	            parent: this,
	            x: this.bounds.x,
	            y: this.bounds.y,
	            class: opts.class,
	            tag: opts.tag || 'mi',
	            height: opts.height,
	            buttons: opts.buttons,
	            // depth: this.depth + 1,
	        };
	        this._setMenuPos(menuOpts, opts);
	        const menu = new Menu(menuOpts);
	        menu.hidden = true;

	        return menu;
	    }
	}

	export function runMenu(owner: Menubar, menu: Menu) {
	    if (!owner || !owner.scene)
	        throw new Error('need an owner that is attached to a scene.');

	    let menus: Menu[] = [menu];
	    let current = menu;

	    menu.hidden = false;
	    const scene = owner.scene;

	    const offInput = scene.on('input', (e) => {
	        if (e.type === IO.KEYPRESS) {
	            if (e.dir) {
	                if (e.dir[0] > 0) {
	                    const next = current.expandItem();
	                    if (next) {
	                        menus.push(next);
	                        current = next;
	                    }
	                } else if (e.dir[0] < 0) {
	                    current.hide();
	                    menus.pop();
	                    if (menus.length == 0) {
	                        return done(e);
	                    } else {
	                        current = menus[menus.length - 1];
	                    }
	                } else if (e.dir[1] > 0) {
	                    current.nextItem();
	                } else if (e.dir[1] < 0) {
	                    current.prevItem();
	                }
	            } else if (e.key === 'Enter' || e.key === ' ') {
	                const next = current.expandItem();
	                if (next) {
	                    menus.push(next);
	                    current = next;
	                } else {
	                    done(e);
	                    current.action();
	                    return;
	                }
	            } else if (e.key === 'Escape') {
	                current.hide();
	                menus.pop();
	                if (menus.length == 0) {
	                    return done(e);
	                }
	                current = menus[menus.length - 1];
	            } else if (e.key === 'Tab' || e.key === 'TAB') {
	                return done();
	            } else {
	                current.selectItemWithKey(e.key);
	            }
	        } else if (e.type === IO.MOUSEMOVE) {
	            if (!current.contains(e)) {
	                let found = -1;
	                for (let i = 0; i < menus.length; ++i) {
	                    const m = menus[i];
	                    if (found >= 0) {
	                        m.hide();
	                    } else {
	                        if (m.contains(e)) {
	                            current = m;
	                            found = i;
	                        }
	                    }
	                }
	                if (found >= 0) {
	                    menus.length = found + 1;
	                }
	            }
	            if (current.contains(e)) {
	                current.mousemove(e);
	            } else if (owner.contains(e)) {
	                done();
	                return owner.mousemove(e);
	            }
	        } else if (e.type === IO.CLICK) {
	            // assumes mousemove was called for this spot before click
	            const btn = current.childAt(e);
	            if (btn) {
	                btn.click(e);
	            }
	            done(e);
	        }

	        e.stopPropagation();
	        e.preventDefault();
	    });

	    function done(e?: IO.Event) {
	        offInput();
	        menus.forEach((m) => (m.hidden = true));
	        scene.setFocusWidget(owner);
	        if (e) {
	            e.stopPropagation();
	            e.preventDefault();
	        }
	    }
	}
	*/

	// import * as GWU from 'gw-utils';
	class Select extends Widget {
	    constructor(opts) {
	        super((() => {
	            opts.tag = opts.tag || 'select';
	            return opts;
	        })());
	        this._initText(opts);
	        this._initMenu(opts);
	        this.bounds.height = 1; // just the text component
	    }
	    _initText(opts) {
	        this.dropdown = new Text({
	            parent: this,
	            text: opts.text + ' \u25bc',
	            x: this.bounds.x,
	            y: this.bounds.y,
	            class: opts.class,
	            tag: opts.tag || 'select',
	            width: this.bounds.width,
	            height: 1,
	            // depth: this.depth + 1,
	        });
	        this.dropdown.on('click', () => {
	            this.menu.toggleProp('hidden');
	            return false;
	        });
	        // this.dropdown.setParent(this, { beforeIndex: 0 });
	    }
	    _initMenu(opts) {
	        this.menu = new Menu({
	            parent: this,
	            x: this.bounds.x,
	            y: this.bounds.y + 1,
	            class: opts.buttonClass,
	            tag: opts.buttonTag || 'select',
	            width: opts.width,
	            minWidth: this.dropdown.bounds.width,
	            height: opts.height,
	            buttons: opts.buttons,
	            // depth: this.depth + 1,
	        });
	        this.menu.on('click', () => {
	            this.menu.hidden = true;
	            return false;
	        });
	        this.menu.hidden = true;
	    }
	}
	/*
	// extend WidgetLayer

	export type AddSelectOptions = SelectOptions &
	    Widget.SetParentOptions & { parent?: Widget.Widget };

	declare module './layer' {
	    interface WidgetLayer {
	        select(opts: AddSelectOptions): Select;
	    }
	}
	WidgetLayer.prototype.select = function (opts: AddSelectOptions): Select {
	    const options: SelectOptions = Object.assign({}, this._opts, opts);
	    const list = new Select(this, options);
	    if (opts.parent) {
	        list.setParent(opts.parent, opts);
	    }
	    return list;
	};
	*/

	// import * as GWU from 'gw-utils';
	class Prompt {
	    constructor(question, field = {}) {
	        this._id = null;
	        this._defaultNext = null;
	        this.selection = -1;
	        if (typeof field === 'string') {
	            field = { field };
	        }
	        this._prompt = question;
	        this._field = field.field || '';
	        this._choices = [];
	        this._infos = [];
	        this._values = [];
	        this._next = [];
	        this._defaultNext = field.next || null;
	        this._id = field.id || field.field || '';
	    }
	    reset() {
	        this.selection = -1;
	    }
	    field(v) {
	        if (v === undefined)
	            return this._field;
	        this._field = v;
	        return this;
	    }
	    id(v) {
	        if (v === undefined)
	            return this._id;
	        this._id = v;
	        return this;
	    }
	    prompt(arg) {
	        if (typeof this._prompt === 'string')
	            return this._prompt;
	        return this._prompt(arg);
	    }
	    next(v) {
	        if (v === undefined)
	            return this._next[this.selection] || this._defaultNext;
	        this._defaultNext = v;
	        return this;
	    }
	    choices(choice, info) {
	        if (choice === undefined)
	            return this._choices;
	        if (!Array.isArray(choice)) {
	            info = Object.values(choice);
	            choice = Object.keys(choice);
	        }
	        else if (!Array.isArray(info)) {
	            info = new Array(choice.length).fill('');
	        }
	        info = info.map((i) => {
	            if (typeof i === 'string')
	                return { info: i };
	            return i;
	        });
	        if (choice.length !== info.length)
	            throw new Error('Choices and Infos must have same length.');
	        choice.forEach((c, i) => {
	            this.choice(c, info[i]);
	        });
	        return this;
	    }
	    choice(choice, info = {}) {
	        if (typeof info === 'string') {
	            info = { info: info };
	        }
	        this._choices.push(choice);
	        this._infos.push(info.info || '');
	        this._next.push(info.next || null);
	        this._values.push(info.value || choice);
	        return this;
	    }
	    info(arg) {
	        const i = this._infos[this.selection] || '';
	        if (typeof i === 'string')
	            return i;
	        return i(arg);
	    }
	    choose(n) {
	        this.selection = n;
	        return this;
	    }
	    value() {
	        return this._values[this.selection];
	    }
	    updateResult(res) {
	        if (this.selection < 0)
	            return this;
	        res[this._field] = this.value();
	        return this;
	    }
	}
	class Choice extends Widget {
	    constructor(opts) {
	        super((() => {
	            opts.tag = opts.tag || Choice.default.tag;
	            return opts;
	        })());
	        this._prompt = null;
	        this._done = null;
	        this.choiceWidth = opts.choiceWidth;
	        this.attr('border', opts.border || Choice.default.border);
	        this.attr('promptTag', opts.promptTag || Choice.default.promptTag);
	        this.attr('promptClass', opts.promptClass || Choice.default.promptClass);
	        this.attr('choiceTag', opts.choiceTag || Choice.default.choiceTag);
	        this.attr('choiceClass', opts.choiceClass || Choice.default.choiceClass);
	        this.attr('infoTag', opts.infoTag || Choice.default.infoTag);
	        this.attr('infoClass', opts.infoClass || Choice.default.infoClass);
	        this._addLegend();
	        this._addList();
	        this._addInfo();
	        if (opts.prompt) {
	            this.showPrompt(opts.prompt);
	        }
	    }
	    get prompt() {
	        return this._prompt;
	    }
	    showPrompt(prompt, arg) {
	        this._prompt = prompt;
	        prompt.choose(0);
	        this._text.text(prompt.prompt(arg));
	        this._list.data(prompt.choices());
	        this._info.text(prompt.info(arg));
	        this.trigger('prompt', this._prompt);
	        return new Promise((resolve) => (this._done = resolve));
	    }
	    _addList() {
	        this._list = new DataList({
	            parent: this,
	            height: this.bounds.height - 2,
	            x: this.bounds.x + 1,
	            width: this.choiceWidth,
	            y: this.bounds.y + 1,
	            dataTag: this._attrStr('choiceTag'),
	            dataClass: this._attrStr('choiceClass'),
	            tabStop: true,
	            border: 'none',
	            hover: 'select',
	        });
	        this._list.on('change', () => {
	            if (!this._prompt)
	                return false;
	            const p = this._prompt;
	            const row = this._list.selectedRow;
	            p.choose(row);
	            this._info.text(p.info());
	            this.trigger('change', p);
	            // e.stopPropagation(); // I want to eat this event
	        });
	        this._list.on('action', () => {
	            if (!this._prompt)
	                return false;
	            const p = this._prompt;
	            p.choose(this._list.selectedRow);
	            this.action();
	            this._done(p.value());
	            // e.stopPropagation(); // eat this event
	        });
	        return this;
	    }
	    _addInfo() {
	        this._info = new Text({
	            parent: this,
	            text: '',
	            x: this.bounds.x + this.choiceWidth + 2,
	            y: this.bounds.y + 1,
	            width: this.bounds.width - this.choiceWidth - 3,
	            height: this.bounds.height - 2,
	            tag: this._attrStr('infoTag'),
	            class: this._attrStr('infoClass'),
	        });
	        return this;
	    }
	    _addLegend() {
	        this._text = new Text({
	            parent: this,
	            text: '',
	            width: this.bounds.width - 4,
	            x: this.bounds.x + 2,
	            y: this.bounds.y,
	            tag: this._attrStr('promptTag'),
	            class: this._attrStr('promptClass'),
	        });
	        return this;
	    }
	    _draw(buffer) {
	        let w = this.choiceWidth + 2;
	        const h = this.bounds.height;
	        let x = this.bounds.x;
	        const y = this.bounds.y;
	        const ascii = this.attr('border') === 'ascii';
	        drawBorder(buffer, x, y, w, h, this._used, ascii);
	        w = this.bounds.width - this.choiceWidth - 1;
	        x = this.bounds.x + this.choiceWidth + 1;
	        drawBorder(buffer, x, y, w, h, this._used, ascii);
	        return true;
	    }
	}
	Choice.default = {
	    tag: 'choice',
	    border: 'ascii',
	    promptTag: 'prompt',
	    promptClass: '',
	    choiceTag: 'ci',
	    choiceClass: '',
	    infoTag: 'info',
	    infoClass: '',
	};
	/*
	// extend WidgetLayer

	export type AddChoiceOptions = ChoiceOptions &
	    Widget.SetParentOptions & { parent?: Widget.Widget };

	declare module './layer' {
	    interface WidgetLayer {
	        choice(opts?: AddChoiceOptions): Choice;
	    }
	}
	WidgetLayer.prototype.choice = function (opts: AddChoiceOptions): Choice {
	    const options = Object.assign({}, this._opts, opts) as ChoiceOptions;
	    const widget = new Choice(this, options);
	    if (opts.parent) {
	        widget.setParent(opts.parent, opts);
	    }
	    return widget;
	};
	*/
	////////////////////////////////////////////////////////////////////////////////
	// INQUIRY
	class Inquiry {
	    constructor(widget) {
	        this._prompts = [];
	        this.events = {};
	        this._result = {};
	        this._stack = [];
	        this._current = null;
	        this.widget = widget;
	        this._keypress = this._keypress.bind(this);
	        this._change = this._change.bind(this);
	    }
	    prompts(v, ...args) {
	        if (Array.isArray(v)) {
	            this._prompts = v.slice();
	        }
	        else {
	            args.unshift(v);
	            this._prompts = args;
	        }
	        return this;
	    }
	    _finish() {
	        this.widget.off('keypress', this._keypress);
	        this.widget.off('change', this._change);
	        this._fireEvent('finish', this.widget, this._result);
	    }
	    _cancel() {
	        this.widget.off('keypress', this._keypress);
	        this.widget.off('change', this._change);
	        this._fireEvent('cancel', this.widget);
	    }
	    start() {
	        this._current = this._prompts[0];
	        this._result = {};
	        this.widget.on('keypress', this._keypress);
	        this.widget.on('change', this._change);
	        this.widget.showPrompt(this._current, this._result);
	    }
	    back() {
	        this._current.reset();
	        this._current = this._stack.pop() || null;
	        if (!this._current) {
	            this._cancel();
	        }
	        else {
	            this._current.reset(); // also reset the one we are going back to
	            this._result = {};
	            this._prompts.forEach((p) => p.updateResult(this._result));
	            this.widget.showPrompt(this._current, this._result);
	        }
	    }
	    restart() {
	        this._prompts.forEach((p) => p.reset());
	        this._result = {};
	        this._current = this._prompts[0];
	        this.widget.showPrompt(this._current, this._result);
	    }
	    quit() {
	        this._cancel();
	    }
	    _keypress(_n, _w, e) {
	        if (!e.key)
	            return false;
	        if (e.key === 'Escape') {
	            this.back();
	            return true;
	        }
	        else if (e.key === 'R') {
	            this.restart();
	            return true;
	        }
	        else if (e.key === 'Q') {
	            this.quit();
	            return true;
	        }
	        return false;
	    }
	    _change(_n, _w, p) {
	        p.updateResult(this._result);
	        const next = p.next();
	        if (next) {
	            this._current = this._prompts.find((p) => p.id() === next) || null;
	            if (this._current) {
	                this._stack.push(p);
	                this.widget.showPrompt(this._current, this._result);
	                this._fireEvent('step', this.widget, {
	                    prompt: this._current,
	                    data: this._result,
	                });
	                return true;
	            }
	        }
	        this._finish();
	        return true;
	    }
	    on(event, cb) {
	        let handlers = this.events[event];
	        if (!handlers) {
	            handlers = this.events[event] = [];
	        }
	        if (!handlers.includes(cb)) {
	            handlers.push(cb);
	        }
	        return this;
	    }
	    off(event, cb) {
	        let handlers = this.events[event];
	        if (!handlers)
	            return this;
	        if (cb) {
	            arrayDelete(handlers, cb);
	        }
	        else {
	            handlers.length = 0; // clear all handlers
	        }
	        return this;
	    }
	    _fireEvent(name, source, args) {
	        const handlers = this.events[name] || [];
	        let handled = false;
	        for (let handler of handlers) {
	            handled = handler(name, source || this.widget, args) || handled;
	        }
	        if (!handled) {
	            handled = this.widget.trigger(name, args);
	        }
	        return handled;
	    }
	}

	class Checkbox extends Text {
	    constructor(opts) {
	        var _a;
	        super((() => {
	            // opts.action = opts.action || opts.id || 'input';
	            opts.tag = opts.tag || 'checkbox';
	            opts.tabStop = opts.tabStop === undefined ? true : opts.tabStop;
	            return opts;
	        })());
	        this.attr('uncheck', opts.uncheck || Checkbox.default.uncheck);
	        this.attr('check', opts.check || Checkbox.default.check);
	        this.attr('pad', (_a = opts.pad) !== null && _a !== void 0 ? _a : Checkbox.default.pad);
	        this.attr('offValue', '');
	        if (Array.isArray(opts.value)) {
	            this.attr('offValue', opts.value[0] || '');
	            this.attr('value', opts.value[1] || Checkbox.default.value);
	        }
	        else {
	            this.attr('value', opts.value || Checkbox.default.value);
	        }
	        this.bounds.width += this._attrInt('pad');
	        if (opts.checked) {
	            this.prop('checked', true);
	        }
	        this.on('click', (ev) => {
	            if (ev.defaultPrevented)
	                return;
	            this.toggleProp('checked');
	        });
	    }
	    value() {
	        return this._propBool('checked')
	            ? this._attrStr('value')
	            : this._attrStr('offValue');
	    }
	    text(v) {
	        if (v === undefined)
	            return super.text();
	        super.text(v);
	        this.bounds.width += 1 + this._attrInt('pad');
	        return this;
	    }
	    keypress(ev) {
	        if (!ev.key)
	            return;
	        super.keypress(ev);
	        if (ev.defaultPrevented)
	            return;
	        if (ev.key === 'Enter' || ev.key === ' ') {
	            this.toggleProp('checked');
	            this.trigger('change');
	        }
	        else if (ev.key === 'Backspace' || ev.key === 'Delete') {
	            this.prop('checked', false);
	            this.trigger('change');
	        }
	    }
	    _draw(buffer) {
	        const fg = this._used.fg || WHITE;
	        const bg = this._used.bg || NONE;
	        const align = this._used.align;
	        buffer.fillBounds(this.bounds, ' ', 0, bg);
	        const state = this.prop('checked') ? 'check' : 'uncheck';
	        let v = '' + this._attrs[state];
	        buffer.drawText(this.bounds.x, this.bounds.y, v, fg, bg);
	        let vOffset = 0;
	        if (this._used.valign === 'bottom') {
	            vOffset = this.bounds.height - this._lines.length;
	        }
	        else if (this._used.valign === 'middle') {
	            vOffset = Math.floor((this.bounds.height - this._lines.length) / 2);
	        }
	        const pad = this._attrInt('pad') + 1;
	        this._lines.forEach((line, i) => {
	            buffer.drawText(this.bounds.x + pad, this.bounds.y + i + vOffset, line, fg, bg, this.bounds.width - pad, align);
	        });
	        return true;
	    }
	}
	Checkbox.default = {
	    uncheck: '\u2610',
	    check: '\u2612',
	    pad: 1,
	    value: 'on',
	};

	// export interface WidgetLayerOptions extends LayerOptions {}
	class Builder {
	    constructor(scene) {
	        this._opts = { x: 0, y: 0 };
	        this.scene = scene;
	        this._opts.scene = scene;
	    }
	    // Style and Opts
	    reset() {
	        this._opts = { x: 0, y: 0, scene: this.scene };
	        return this;
	    }
	    fg(v) {
	        this._opts.fg = v;
	        return this;
	    }
	    bg(v) {
	        this._opts.bg = v;
	        return this;
	    }
	    dim(pct = 25, fg = true, bg = false) {
	        if (fg) {
	            this._opts.fg = from$2(this._opts.fg || 'white').darken(pct);
	        }
	        if (bg) {
	            this._opts.bg = from$2(this._opts.bg || 'black').darken(pct);
	        }
	        return this;
	    }
	    bright(pct = 25, fg = true, bg = false) {
	        if (fg) {
	            this._opts.fg = from$2(this._opts.fg || 'white').lighten(pct);
	        }
	        if (bg) {
	            this._opts.bg = from$2(this._opts.bg || 'black').lighten(pct);
	        }
	        return this;
	    }
	    invert() {
	        [this._opts.fg, this._opts.bg] = [this._opts.bg, this._opts.fg];
	        return this;
	    }
	    // STYLE
	    style(opts) {
	        Object.assign(this._opts, opts);
	        return this;
	    }
	    class(c) {
	        this._opts.class = this._opts.class || '';
	        this._opts.class += ' ' + c;
	        return this;
	    }
	    pos(x, y) {
	        if (x === undefined)
	            return this._opts;
	        this._opts.x = clamp(x, 0, this.scene.width);
	        this._opts.y = clamp(y, 0, this.scene.height);
	        return this;
	    }
	    moveTo(x, y) {
	        return this.pos(x, y);
	    }
	    move(dx, dy) {
	        this._opts.x = clamp(this._opts.x + dx, 0, this.scene.width);
	        this._opts.y = clamp(this._opts.y + dy, 0, this.scene.height);
	        return this;
	    }
	    up(n = 1) {
	        return this.move(0, -n);
	    }
	    down(n = 1) {
	        return this.move(0, n);
	    }
	    left(n = 1) {
	        return this.move(-n, 0);
	    }
	    right(n = 1) {
	        return this.move(n, 0);
	    }
	    nextLine(n = 1) {
	        return this.pos(0, this._opts.y + n);
	    }
	    prevLine(n = 1) {
	        return this.pos(0, this._opts.y - n);
	    }
	    // grid(): Grid {
	    //     return new Grid(this);
	    // }
	    // EDIT
	    // erase and move back to top left
	    clear(color) {
	        this.scene.destroy();
	        if (color) {
	            this.scene.bg = from$2(color);
	        }
	        else {
	            this.scene.bg = NONE;
	        }
	        return this;
	    }
	    // Widgets
	    text(info = {}, opts) {
	        if (typeof info === 'string') {
	            opts = opts || {};
	            opts.text = info;
	        }
	        else {
	            opts = info;
	        }
	        const _opts = Object.assign({}, this._opts, opts);
	        const widget = new Text(_opts);
	        this.move(0, 1); // next line
	        return widget;
	    }
	    border(opts) {
	        const _opts = Object.assign({}, this._opts, opts);
	        const widget = new Border(_opts);
	        this.move(1, 1); // step inside border
	        return widget;
	    }
	    button(opts) {
	        const _opts = Object.assign({}, this._opts, opts);
	        const widget = new Button(_opts);
	        this.move(0, 1); // step inside border
	        return widget;
	    }
	    checkbox(opts) {
	        const _opts = Object.assign({}, this._opts, opts);
	        const widget = new Checkbox(_opts);
	        this.move(0, 1); // step inside border
	        return widget;
	    }
	    input(opts) {
	        const _opts = Object.assign({}, this._opts, opts);
	        const widget = new Input(_opts);
	        this.move(0, 1); // step inside border
	        return widget;
	    }
	    fieldset(opts) {
	        const _opts = Object.assign({}, this._opts, opts);
	        const widget = new Fieldset(_opts);
	        this.move(1, 1); // step inside border
	        return widget;
	    }
	    datatable(opts) {
	        const _opts = Object.assign({}, this._opts, opts);
	        const widget = new DataTable(_opts);
	        this.move(0, widget.bounds.height); // step inside border
	        return widget;
	    }
	    datalist(opts) {
	        const _opts = Object.assign({}, this._opts, opts);
	        const widget = new DataList(_opts);
	        this.move(0, widget.bounds.height); // step inside border
	        return widget;
	    }
	    menubar(opts) {
	        const _opts = Object.assign({}, this._opts, opts);
	        const widget = new Menubar(_opts);
	        this.move(0, widget.bounds.height); // step below menubar
	        return widget;
	    }
	}
	// // declare module '../ui/ui' {
	// //     interface UI {
	// //         startWidgetLayer(opts?: WidgetLayerOptions): WidgetLayer;
	// //     }
	// // }
	// // UI.prototype.startWidgetLayer = function (
	// //     opts: WidgetLayerOptions = {}
	// // ): WidgetLayer {
	// //     opts.styles = this.layer ? this.layer.styles : this.styles;
	// //     const layer = new WidgetLayer(this, opts);
	// //     this.startLayer(layer);
	// //     return layer;
	// // };

	function make$1(opts) {
	    const w = new Widget(opts);
	    if (opts.with) {
	        Object.entries(opts.with).forEach(([name, fn]) => {
	            // @ts-ignore
	            w[name] = fn;
	        });
	    }
	    return w;
	}

	var index$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Widget: Widget,
		alignChildren: alignChildren,
		spaceChildren: spaceChildren,
		wrapChildren: wrapChildren,
		Text: Text,
		Border: Border,
		drawBorder: drawBorder,
		Button: Button,
		toPadArray: toPadArray,
		Dialog: Dialog,
		dialog: dialog,
		Fieldset: Fieldset,
		Field: Field,
		OrderedList: OrderedList,
		UnorderedList: UnorderedList,
		Input: Input,
		Column: Column,
		DataTable: DataTable,
		DataList: DataList,
		Menu: Menu,
		MenuButton: MenuButton,
		Menubar: Menubar,
		Select: Select,
		Prompt: Prompt,
		Choice: Choice,
		Inquiry: Inquiry,
		Builder: Builder,
		make: make$1
	});

	class Loop {
	    constructor() {
	        this._timer = 0;
	    }
	    get isRunning() {
	        return this._timer != 0;
	    }
	    start(cb, dt = 16) {
	        let busy = false;
	        if (this._timer)
	            throw new Error('Cannot start loop twice.');
	        this._timer = setInterval(() => {
	            if (!busy) {
	                busy = true;
	                cb();
	                busy = false;
	            }
	        }, dt);
	    }
	    stop() {
	        if (this._timer) {
	            clearInterval(this._timer);
	            this._timer = 0;
	        }
	    }
	}

	class App {
	    constructor(opts = {}) {
	        this.dt = 0;
	        this.time = 0;
	        this.realTime = 0;
	        this.skipTime = false;
	        this.fps = 0;
	        this.fpsBuf = [];
	        this.fpsTimer = 0;
	        this.numFrames = 0;
	        this.loopID = 0;
	        this.stopped = true;
	        this.paused = false;
	        this.debug = false;
	        if ('loop' in opts) {
	            this.loop = opts.loop;
	            delete opts.loop;
	        }
	        else {
	            this.loop = new Loop();
	        }
	        this.styles = defaultStyle;
	        this.canvas = opts.canvas || make$6(opts);
	        this.io = new Queue();
	        this.events = new Events(this);
	        this.timers = new Timers(this);
	        this.scenes = new Scenes(this);
	        this.canvas.onclick = this.io.enqueue.bind(this.io);
	        this.canvas.onmousemove = this.io.enqueue.bind(this.io);
	        this.canvas.onclick = this.io.enqueue.bind(this.io);
	        this.canvas.onkeydown = this.io.enqueue.bind(this.io);
	        this.buffer = new Buffer$1(this.canvas.width, this.canvas.height);
	        if (opts.scenes) {
	            this.scenes.load(opts.scenes);
	            if (typeof opts.start === 'string') {
	                this.scenes.start(opts.start);
	            }
	            else {
	                this.scenes.start(Object.keys(opts.scenes)[0]);
	            }
	        }
	        else if (opts.scene) {
	            if (opts.scene === true)
	                opts.scene = {};
	            this.scenes.add('default', opts.scene);
	            this.scenes.start('default');
	            // } else {
	            //     this.scenes.install('default', { bg: COLOR.colors.NONE }); // NONE just in case you draw directly on app.buffer
	            //     this.scenes.start('default');
	        }
	        if (opts.start !== false) {
	            this.start();
	        }
	    }
	    // get buffer() {
	    //     return this.scene.buffer;
	    // }
	    get width() {
	        return this.canvas.width;
	    }
	    get height() {
	        return this.canvas.height;
	    }
	    get node() {
	        return this.canvas.node;
	    }
	    get mouseXY() {
	        return this.canvas.mouse;
	    }
	    get scene() {
	        return this.scenes.get();
	    }
	    on(ev, fn) {
	        // return this.scene.on(ev, fn);
	        return this.events.on(ev, fn);
	    }
	    trigger(ev, ...args) {
	        this.scenes.trigger(ev, ...args);
	        this.events.trigger(ev, ...args);
	    }
	    wait(...args) {
	        // @ts-ignore
	        // return this.scene.wait.apply(this.scene, args);
	        if (typeof args[1] === 'string') {
	            const ev = args[1];
	            args[2] = args[2] || {};
	            args[1] = () => this.trigger(ev, args[2]);
	        }
	        return this.timers.setTimeout(args[1], args[0]);
	    }
	    repeat(...args) {
	        // @ts-ignore
	        // return this.scene.repeat.apply(this.scene, args);
	        if (typeof fn === 'string') {
	            const ev = args[1];
	            args[2] = args[2] || {};
	            args[1] = () => this.trigger(ev, args[2]);
	        }
	        return this.timers.setInterval(args[1], args[0]);
	    }
	    // run() {
	    //     this.trigger('run', this);
	    //     let running = false;
	    //     this.loopID = (setInterval(() => {
	    //         if (!running) {
	    //             running = true;
	    //             this._frame();
	    //             running = false;
	    //         }
	    //     }, 16) as unknown) as number;
	    //     this.stopped = false;
	    // }
	    start() {
	        if (this.loop.isRunning)
	            return;
	        this.loop.start(this._frame.bind(this));
	    }
	    stop() {
	        this.trigger('stop', this);
	        this.loop.stop();
	        this.stopped = true;
	    }
	    _frame(t = 0) {
	        t = t || Date.now();
	        if (typeof document !== 'undefined' &&
	            document.visibilityState !== 'visible') {
	            return;
	        }
	        if (this.realTime == 0) {
	            this.realTime = t;
	            return;
	        }
	        const realTime = t;
	        const realDt = realTime - this.realTime;
	        this.realTime = realTime;
	        if (!this.skipTime) {
	            this.dt = realDt;
	            this.time += this.dt;
	            this.fpsBuf.push(1000 / this.dt);
	            this.fpsTimer += this.dt;
	            if (this.fpsTimer >= 1) {
	                this.fpsTimer = 0;
	                this.fps = Math.round(this.fpsBuf.reduce((a, b) => a + b) / this.fpsBuf.length);
	                this.fpsBuf = [];
	            }
	        }
	        this.skipTime = false;
	        this.numFrames++;
	        this._frameStart();
	        // // unprocessed io is handled here
	        while (this.io.length) {
	            const ev = this.io.dequeue();
	            this._input(ev);
	        }
	        if (!this.paused && this.debug !== true) {
	            this._update(this.dt);
	        }
	        this._draw();
	        if (this.debug !== false) {
	            this._frameDebug();
	        }
	        this._frameEnd();
	        this.io.clear();
	    }
	    _input(ev) {
	        this.scenes.input(ev);
	        if (ev.propagationStopped || ev.defaultPrevented)
	            return;
	        ev.dispatch(this.events);
	    }
	    _update(dt = 0) {
	        dt = dt || this.dt;
	        this.scenes.update(dt);
	        this.timers.update(dt);
	        this.events.trigger('update', dt);
	    }
	    _frameStart() {
	        // this.buffer.nullify();
	        this.scenes.frameStart();
	        this.events.trigger('frameStart');
	    }
	    _draw() {
	        this.scenes.draw(this.buffer);
	        this.events.trigger('draw', this.buffer);
	    }
	    _frameDebug() {
	        this.scenes.frameDebug(this.buffer);
	        this.events.trigger('frameDebug', this.buffer);
	    }
	    _frameEnd() {
	        this.scenes.frameEnd(this.buffer);
	        this.events.trigger('frameEnd', this.buffer);
	        this.canvas.render(this.buffer);
	    }
	    alert(text, opts = {}) {
	        opts.text = text;
	        return this.scenes.run('alert', opts);
	    }
	    confirm(text, opts = {}) {
	        opts.text = text;
	        return this.scenes.run('confirm', opts);
	    }
	    prompt(text, opts = {}) {
	        // NEED TO CREATE A NEW SCENE EVERY TIME SO WE DON"T HAVE HOLDOVER EVENTS, etc...
	        opts.prompt = text;
	        const prompt = this.scenes._create('prompt', PromptScene);
	        prompt.run(opts);
	        return prompt;
	    }
	}
	function make(opts) {
	    const app = new App(opts);
	    return app;
	}

	var index = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Event: Event,
		KEYPRESS: KEYPRESS,
		MOUSEMOVE: MOUSEMOVE,
		CLICK: CLICK,
		TICK: TICK,
		MOUSEUP: MOUSEUP,
		STOP: STOP,
		isControlCode: isControlCode,
		recycleEvent: recycleEvent,
		makeStopEvent: makeStopEvent,
		makeCustomEvent: makeCustomEvent,
		makeTickEvent: makeTickEvent,
		makeKeyEvent: makeKeyEvent,
		keyCodeDirection: keyCodeDirection,
		ignoreKeyEvent: ignoreKeyEvent,
		makeMouseEvent: makeMouseEvent,
		Queue: Queue,
		Events: Events,
		Loop: Loop,
		Timers: Timers,
		Tweens: Tweens,
		Selector: Selector,
		compile: compile,
		Style: Style,
		makeStyle: makeStyle,
		ComputedStyle: ComputedStyle,
		Sheet: Sheet,
		defaultStyle: defaultStyle,
		Widget: Widget,
		alignChildren: alignChildren,
		spaceChildren: spaceChildren,
		wrapChildren: wrapChildren,
		Scene: Scene,
		Scenes: Scenes,
		scenes: scenes,
		installScene: installScene,
		App: App,
		make: make
	});

	exports.ERROR = ERROR;
	exports.FALSE = FALSE;
	exports.IDENTITY = IDENTITY;
	exports.IS_NONZERO = IS_NONZERO;
	exports.IS_ZERO = IS_ZERO;
	exports.NOOP = NOOP;
	exports.ONE = ONE;
	exports.TRUE = TRUE;
	exports.WARN = WARN;
	exports.ZERO = ZERO;
	exports.app = index;
	exports.arrayDelete = arrayDelete;
	exports.arrayFindRight = arrayFindRight;
	exports.arrayIncludesAll = arrayIncludesAll;
	exports.arrayInsert = arrayInsert;
	exports.arrayNext = arrayNext;
	exports.arrayNullify = arrayNullify;
	exports.arrayPrev = arrayPrev;
	exports.arrayRevEach = arrayRevEach;
	exports.arraysIntersect = arraysIntersect;
	exports.blob = blob;
	exports.buffer = buffer;
	exports.canvas = index$5;
	exports.clamp = clamp;
	exports.color = index$9;
	exports.colors = colors;
	exports.config = config$1;
	exports.cosmetic = cosmetic;
	exports.data = data;
	exports.events = events;
	exports.first = first;
	exports.flag = flag;
	exports.fov = index$7;
	exports.frequency = frequency;
	exports.grid = grid;
	exports.lerp = lerp$1;
	exports.light = index$3;
	exports.list = list;
	exports.message = message;
	exports.nextIndex = nextIndex;
	exports.object = object;
	exports.path = index$6;
	exports.prevIndex = prevIndex;
	exports.queue = queue;
	exports.random = random;
	exports.range = range;
	exports.rng = rng;
	exports.scheduler = scheduler;
	exports.sprite = index$4;
	exports.sum = sum;
	exports.tags = tags;
	exports.text = index$8;
	exports.tween = tween;
	exports.types = types;
	exports.ui = index$2;
	exports.widget = index$1;
	exports.xy = xy;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=gw-utils.js.map
