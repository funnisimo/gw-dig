(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('gw-utils')) :
	typeof define === 'function' && define.amd ? define(['exports', 'gw-utils'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GWD = {}, global.GWU));
})(this, (function (exports, GWU) { 'use strict';

	function _interopNamespaceDefault(e) {
		var n = Object.create(null);
		if (e) {
			Object.keys(e).forEach(function (k) {
				if (k !== 'default') {
					var d = Object.getOwnPropertyDescriptor(e, k);
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: function () { return e[k]; }
					});
				}
			});
		}
		n.default = e;
		return Object.freeze(n);
	}

	var GWU__namespace = /*#__PURE__*/_interopNamespaceDefault(GWU);

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

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
	function isSymbol$1(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && baseGetTag$1(value) == symbolTag);
	}

	var isSymbol_1 = isSymbol$1;

	var baseTrim = _baseTrim,
	    isObject$2 = isObject_1,
	    isSymbol = isSymbol_1;

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
	  if (isSymbol(value)) {
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

	var _clamp = /*@__PURE__*/getDefaultExportFromCjs(clamp_1);

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

	function getValue$1(object, key) {
	  return object == null ? undefined : object[key];
	}

	var _getValue = getValue$1;

	var baseIsNative = _baseIsNative,
	    getValue = _getValue;

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative$3(object, key) {
	  var value = getValue(object, key);
	  return baseIsNative(value) ? value : undefined;
	}

	var _getNative = getNative$3;

	var getNative$2 = _getNative;

	/* Built-in method references that are verified to be native. */
	var nativeCreate$4 = getNative$2(Object, 'create');

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

	var getNative$1 = _getNative,
	    root = _root;

	/* Built-in method references that are verified to be native. */
	var Map$1 = getNative$1(root, 'Map');

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
	memoizeCapped(function(string) {
	  var result = [];
	  if (string.charCodeAt(0) === 46 /* . */) {
	    result.push('');
	  }
	  string.replace(rePropName, function(match, number, quote, subString) {
	    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});

	var Symbol = _Symbol;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined;
	    symbolProto ? symbolProto.toString : undefined;

	var getNative = _getNative;

	((function() {
	  try {
	    var func = getNative(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	})());

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
	function ERROR(message, options) {
	    throw new Error(message, options);
	}
	/**
	 * clamps a value between min and max (inclusive)
	 * @param v {Number} the value to clamp
	 * @param min {Number} the minimum value
	 * @param max {Number} the maximum value
	 * @returns {Number} the clamped value
	 */
	const clamp = _clamp;
	///

	// TODO - Is this the right way to do this?  Should it be DIRS4 and DIRS8 (both clockwise)?
	// DIRS are organized clockwise
	// - first 4 are arrow directions
	//   >> rotate 90 degrees clockwise ==>> newIndex = (oldIndex + 1) % 4
	//   >> opposite direction ==>> oppIndex = (index + 2) % 4
	// - last 4 are diagonals
	//   >> rotate 90 degrees clockwise ==>> newIndex = 4 + (oldIndex + 1) % 4;
	//   >> opposite diagonal ==>> newIndex = 4 + (index + 2) % 4;
	const DIRS$4 = [
	    [0, -1],
	    [1, 0],
	    [0, 1],
	    [-1, 0],
	    [1, -1],
	    [1, 1],
	    [-1, 1],
	    [-1, -1],
	];
	// DIRS4 are organized clockwise
	// - first 4 are arrow directions
	//   >> rotate 90 degrees clockwise ==>> newIndex = (oldIndex + 1) % 4
	//   >> opposite direction ==>> oppIndex = (index + 2) % 4
	const DIRS4 = [
	    [0, -1],
	    [1, 0],
	    [0, 1],
	    [-1, 0],
	];
	const NO_DIRECTION = -1;
	const UP = 0;
	const DOWN = 2;
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
	function x(src) {
	    // @ts-ignore
	    return src.x || src[0] || 0;
	}
	function y(src) {
	    // @ts-ignore
	    return src.y || src[1] || 0;
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
	function isDiagonal(xy) {
	    return x(xy) != 0 && y(xy) != 0;
	}
	function eachNeighbor(x, y, fn, only4dirs = false) {
	    const max = only4dirs ? 4 : 8;
	    for (let i = 0; i < max; ++i) {
	        const dir = DIRS$4[i];
	        const x1 = x + dir[0];
	        const y1 = y + dir[1];
	        fn(x1, y1, dir);
	    }
	}
	function distanceBetween(x1, y1, x2, y2) {
	    const x = Math.abs(x1 - x2);
	    const y = Math.abs(y1 - y2);
	    const min = Math.min(x, y);
	    return x + y - 0.6 * min;
	}
	function calcRadius(x, y) {
	    return distanceBetween(0, 0, x, y);
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
	function dumpRect(left, top, width, height, fmtFn, log = console.log) {
	    let i, j;
	    const bottom = top + height;
	    const right = left + width;
	    let output = [];
	    for (j = top; j < bottom; j++) {
	        let line = ('' + j + ']').padStart(3, ' ');
	        for (i = left; i < right; i++) {
	            if (i % 10 == 0) {
	                line += ' ';
	            }
	            line += fmtFn(i, j);
	        }
	        output.push(line);
	    }
	    log(output.join('\n'));
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
	function closestMatchingLocs(x, y, matchFn) {
	    const locs = [];
	    let i, j, k;
	    // count up the number of candidate locations
	    for (k = 0; k < 100 && !locs.length; k++) {
	        for (i = x - k; i <= x + k; i++) {
	            for (j = y - k; j <= y + k; j++) {
	                if (Math.ceil(distanceBetween(x, y, i, j)) == k &&
	                    matchFn(i, j)) {
	                    locs.push([i, j]);
	                }
	            }
	        }
	    }
	    return locs.length ? locs : null;
	}

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
	function assignObject(dest, src) {
	    Object.keys(src).forEach((key) => {
	        assignField(dest, src, key);
	    });
	    return dest;
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
	function defaultMergeFn(current, updated, _key, _target, _source) {
	    if (Array.isArray(updated)) {
	        if (Array.isArray(current)) {
	            return current.concat(updated);
	        }
	        return updated.slice();
	    }
	    if (updated === null) {
	        return updated;
	    }
	    if (typeof updated === 'object') {
	        if (typeof current !== 'object' || !current) {
	            return Object.assign({}, updated);
	        }
	        current = Object.assign({}, current);
	        for (let key in updated) {
	            const value = updated[key];
	            if (value !== undefined) {
	                current[key] = value;
	            }
	        }
	        return current;
	    }
	    return updated;
	}
	function makeMergeFn(fieldMap, defaultFn) {
	    if (!fieldMap)
	        return defaultMergeFn;
	    if (typeof fieldMap === 'function')
	        return fieldMap;
	    defaultFn = defaultFn || fieldMap._default || defaultMergeFn;
	    return function (current, updated, key, target, source) {
	        // console.log('custom: ' + key);
	        if (fieldMap[key]) {
	            const result = fieldMap[key](current, updated, key, target, source);
	            return result;
	        }
	        return defaultFn(current, updated, key, target, source);
	    };
	}
	function mergePropertiesWith(target, source, customizer) {
	    for (let key of Object.keys(source)) {
	        // const updated = source[key];
	        let updated = Object.getOwnPropertyDescriptor(source, key);
	        if (!updated)
	            continue;
	        const current = target[key];
	        // const value = customizer(current, updated, key, target, source);
	        const value = customizer(current, updated.value, key, target, source);
	        if (value === undefined)
	            continue;
	        // target[key] = value;
	        updated.value = value;
	        Object.defineProperty(target, key, updated);
	    }
	}
	function mergeWith(target, source, customizer) {
	    customizer = makeMergeFn(customizer || defaultMergeFn);
	    if (Array.isArray(source)) {
	        source.forEach((src) => mergeWith(target, src, customizer));
	        return target;
	    }
	    mergePropertiesWith(target, source, customizer);
	    // for( let k of Reflect.ownKeys(source)) {
	    // 	const current = target[k];
	    //   const updated = source[k];
	    //
	    //   const value = customizer(current, updated, k, target, source);
	    //   target[k] = value;
	    // }
	    return target;
	}

	const DIRS$3 = DIRS$4;
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
	class Grid {
	    constructor(w, h, v) {
	        this._data = []; // TODO - Can this stay protected?
	        const grid = this;
	        for (let x = 0; x < w; ++x) {
	            if (typeof v === 'function') {
	                this._data[x] = new Array(h)
	                    .fill(0)
	                    .map((_, i) => v(x, i, grid));
	            }
	            else {
	                this._data[x] = new Array(h).fill(v);
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
	        if (!this.hasXY(x, y)) {
	            return undefined;
	        }
	        return this._data[x][y];
	    }
	    set(x, y, v) {
	        if (!this.hasXY(x, y))
	            return false;
	        this._data[x][y] = v;
	        return true;
	    }
	    /**
	     * Calls the supplied function for each cell in the grid.
	     * @param fn - The function to call on each item in the grid.
	     */
	    forEach(fn) {
	        let i, j;
	        for (i = 0; i < this.width; i++) {
	            for (j = 0; j < this.height; j++) {
	                fn(this._data[i][j], i, j, this);
	            }
	        }
	    }
	    async forEachAsync(fn) {
	        let i, j;
	        for (i = 0; i < this.width; i++) {
	            for (j = 0; j < this.height; j++) {
	                await fn(this._data[i][j], i, j, this);
	            }
	        }
	    }
	    eachNeighbor(x, y, fn, only4dirs = false) {
	        eachNeighbor(x, y, (i, j) => {
	            if (this.hasXY(i, j)) {
	                fn(this._data[i][j], i, j, this);
	            }
	        }, only4dirs);
	    }
	    async eachNeighborAsync(x, y, fn, only4dirs = false) {
	        const maxIndex = only4dirs ? 4 : 8;
	        for (let d = 0; d < maxIndex; ++d) {
	            const dir = DIRS$3[d];
	            const i = x + dir[0];
	            const j = y + dir[1];
	            if (this.hasXY(i, j)) {
	                await fn(this._data[i][j], i, j, this);
	            }
	        }
	    }
	    forRect(x, y, w, h, fn) {
	        forRect(x, y, w, h, (i, j) => {
	            if (this.hasXY(i, j)) {
	                fn(this._data[i][j], i, j, this);
	            }
	        });
	    }
	    randomEach(fn, rng) {
	        rng = rng || random$1;
	        const sequence = rng.sequence(this.width * this.height);
	        for (let i = 0; i < sequence.length; ++i) {
	            const n = sequence[i];
	            const x = n % this.width;
	            const y = Math.floor(n / this.width);
	            if (fn(this._data[x][y], x, y, this) === true)
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
	     */
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
	     */
	    some(fn) {
	        return this._data.some((col, x) => col.some((data, y) => fn(data, x, y, this)));
	    }
	    forCircle(x, y, radius, fn) {
	        forCircle(x, y, radius, (i, j) => {
	            if (this.hasXY(i, j))
	                fn(this._data[i][j], i, j, this);
	        });
	    }
	    hasXY(x, y) {
	        return x >= 0 && y >= 0 && x < this.width && y < this.height;
	    }
	    isBoundaryXY(x, y) {
	        return (this.hasXY(x, y) &&
	            (x == 0 || x == this.width - 1 || y == 0 || y == this.height - 1));
	    }
	    calcBounds(val, bounds) {
	        bounds = bounds || new Bounds(0, 0, this.width, this.height);
	        let fn;
	        if (val === undefined) {
	            fn = (v) => !!v;
	        }
	        else if (typeof val !== 'function') {
	            fn = (t) => t == val;
	        }
	        else {
	            fn = val;
	        }
	        let foundValueAtThisLine = false;
	        let i, j;
	        let left = this.width - 1, right = 0, top = this.height - 1, bottom = 0;
	        // Figure out the top blob's height and width:
	        // First find the max & min x:
	        for (i = 0; i < this.width; i++) {
	            foundValueAtThisLine = false;
	            for (j = 0; j < this.height; j++) {
	                if (fn(this._data[i][j])) {
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
	                if (fn(this._data[i][j])) {
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
	        if (right > 0) {
	            bounds.x = left;
	            bounds.width = right - left + 1;
	        }
	        else {
	            bounds.x = 0;
	            bounds.width = 0;
	        }
	        if (bottom > 0) {
	            bounds.y = top;
	            bounds.height = bottom - top + 1;
	        }
	        else {
	            bounds.y = 0;
	            bounds.height = 0;
	        }
	        return bounds;
	    }
	    update(fn) {
	        forRect(this.width, this.height, (i, j) => {
	            this._data[i][j] = fn(this._data[i][j], i, j, this);
	        });
	    }
	    updateRect(x, y, width, height, fn) {
	        forRect(x, y, width, height, (i, j) => {
	            if (this.hasXY(i, j))
	                this._data[i][j] = fn(this._data[i][j], i, j, this);
	        });
	    }
	    updateCircle(x, y, radius, fn) {
	        forCircle(x, y, radius, (i, j) => {
	            if (this.hasXY(i, j)) {
	                this._data[i][j] = fn(this._data[i][j], i, j, this);
	            }
	        });
	    }
	    /**
	     * Fills the entire grid with the supplied value
	     * @param v - The fill value or a function that returns the fill value.
	     */
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
	        this.update((_, i, j) => from._data[i][j]);
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
	     */
	    find(match) {
	        const fn = typeof match === 'function'
	            ? match
	            : (v) => v == match;
	        for (let x = 0; x < this.width; ++x) {
	            for (let y = 0; y < this.height; ++y) {
	                const v = this._data[x][y];
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
	        fmtFn = fmtFn || _formatGridValue;
	        const format = (x, y) => {
	            return fmtFn(this.get(x, y), x, y);
	        };
	        return dumpRect(left, top, width, height, format, log);
	    }
	    dumpAround(x, y, radius, fmtFn, log = console.log) {
	        this.dumpRect(x - radius, y - radius, 2 * radius + 1, 2 * radius + 1, fmtFn, log);
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
	                else if (dist == bestDistance && random$1.chance(50)) {
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
	                if (fn(this._data[i][j], i, j, this)) {
	                    return [i, j];
	                }
	            }
	        }
	        return [-1, -1];
	    }
	    randomMatchingLoc(v) {
	        const fn = typeof v === 'function'
	            ? (x, y) => v(this._data[x][y], x, y, this)
	            : (x, y) => this.get(x, y) === v;
	        return random$1.matchingLoc(this.width, this.height, fn);
	    }
	    matchingLocNear(x, y, v) {
	        const fn = typeof v === 'function'
	            ? (x, y) => v(this._data[x][y], x, y, this)
	            : (x, y) => this.get(x, y) === v;
	        return random$1.matchingLocNear(x, y, fn);
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
	            return this.hasXY(i, j) && testFn(this._data[i][j], i, j, this);
	        });
	    }
	    walkFrom(x, y, withDiagonals, callback) {
	        if (typeof withDiagonals === 'function') {
	            callback = withDiagonals;
	            withDiagonals = true;
	        }
	        const seen = alloc(this.width, this.height);
	        seen.set(x, y, 1);
	        let nextSteps = [{ x, y }];
	        let distance = 0;
	        const dirs = withDiagonals ? DIRS$3 : DIRS$3.slice(4);
	        while (nextSteps.length) {
	            const current = nextSteps;
	            nextSteps = [];
	            for (let step of current) {
	                seen.set(step.x, step.y, 1);
	                const data = this.get(step.x, step.y);
	                if (callback(step.x, step.y, data, distance)) {
	                    for (let dir of dirs) {
	                        const x2 = step.x + dir[0];
	                        const y2 = step.y + dir[1];
	                        if (!seen.hasXY(x2, y2))
	                            continue;
	                        if (!seen.get(x2, y2)) {
	                            seen.set(x2, y2, 1);
	                            nextSteps.push({ x: x2, y: y2 });
	                        }
	                    }
	                }
	            }
	            ++distance;
	        }
	        free(seen);
	    }
	}
	const GRID_CACHE = [];
	class NumGrid extends Grid {
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
	        let grid = GRID_CACHE.pop();
	        if (!grid) {
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
	        }
	    }
	    constructor(w, h, v = 0) {
	        super(w, h, v);
	    }
	    _resize(width, height, v) {
	        const fn = typeof v === 'function' ? v : () => v;
	        while (this._data.length < width)
	            this._data.push([]);
	        this._data.length = width;
	        let x = 0;
	        let y = 0;
	        for (x = 0; x < width; ++x) {
	            const col = this._data[x];
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
	    increment(x, y, inc = 1) {
	        this._data[x][y] += inc;
	        return this._data[x][y];
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
	                this._data[x][y] >= eligibleValueMin &&
	                this._data[x][y] <= eligibleValueMax);
	        };
	        if (!ok(x, y))
	            return 0;
	        this._data[x][y] = fillValue;
	        for (dir = 0; dir < 4; dir++) {
	            newX = x + DIRS$3[dir][0];
	            newY = y + DIRS$3[dir][1];
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
	    // valueBounds(value: number | ((v: number) => boolean), bounds?: XY.Bounds) {
	    //     let fn: (v: number) => boolean;
	    //     if (typeof value === 'number') {
	    //         fn = (v) => v == value;
	    //     } else {
	    //         fn = value;
	    //     }
	    //     let foundValueAtThisLine = false;
	    //     let i: number, j: number;
	    //     let left = this.width - 1,
	    //         right = 0,
	    //         top = this.height - 1,
	    //         bottom = 0;
	    //     // Figure out the top blob's height and width:
	    //     // First find the max & min x:
	    //     for (i = 0; i < this.width; i++) {
	    //         foundValueAtThisLine = false;
	    //         for (j = 0; j < this.height; j++) {
	    //             if (fn(this._data[i][j])) {
	    //                 foundValueAtThisLine = true;
	    //                 break;
	    //             }
	    //         }
	    //         if (foundValueAtThisLine) {
	    //             if (i < left) {
	    //                 left = i;
	    //             }
	    //             if (i > right) {
	    //                 right = i;
	    //             }
	    //         }
	    //     }
	    //     // Then the max & min y:
	    //     for (j = 0; j < this.height; j++) {
	    //         foundValueAtThisLine = false;
	    //         for (i = 0; i < this.width; i++) {
	    //             if (fn(this._data[i][j])) {
	    //                 foundValueAtThisLine = true;
	    //                 break;
	    //             }
	    //         }
	    //         if (foundValueAtThisLine) {
	    //             if (j < top) {
	    //                 top = j;
	    //             }
	    //             if (j > bottom) {
	    //                 bottom = j;
	    //             }
	    //         }
	    //     }
	    //     bounds = bounds || new XY.Bounds(0, 0, 0, 0);
	    //     bounds.x = left;
	    //     bounds.y = top;
	    //     bounds.width = right - left + 1;
	    //     bounds.height = bottom - top + 1;
	    //     return bounds;
	    // }
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
	            if (!this.hasXY(x, y) || done._data[x][y])
	                continue;
	            if (!matchFn(this._data[x][y], x, y, this))
	                continue;
	            this._data[x][y] = fillFn(this._data[x][y], x, y, this);
	            done._data[x][y] = 1;
	            ++count;
	            // Iterate through the four cardinal neighbors.
	            for (let dir = 0; dir < 4; dir++) {
	                newX = x + DIRS$3[dir][0];
	                newY = y + DIRS$3[dir][1];
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
	        const grid = alloc(width, height);
	        locationCount = 0;
	        grid.update((_v, x, y) => {
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
	                    if (grid.get(i, j)) {
	                        if (index == 0) {
	                            free(grid);
	                            return [i, j];
	                        }
	                        index--;
	                    }
	                }
	            }
	        }
	        free(grid);
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
	const random$1 = new Random();
	const cosmetic = new Random();

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
	        rng = rng || random$1;
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
	function make$6(config) {
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

	function make$5(base) {
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
	function merge(current, updated) {
	    const updatedTags = make$5(updated);
	    const out = current.slice();
	    updatedTags.forEach((t) => {
	        if (t.startsWith('!')) {
	            const index = out.indexOf(t.slice(1));
	            if (index >= 0) {
	                out.splice(index, 1);
	            }
	        }
	        else {
	            out.push(t);
	        }
	    });
	    return out;
	}

	///////////////////////////////////
	// FLAG
	function fl(N) {
	    return 2 ** N;
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
	function from_base(obj, throws, ...args) {
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
	                        result = from_base(obj, throws, result, parts);
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
	                        else {
	                            if (throws) {
	                                throw new Error(`Unknown flag - ${v}`);
	                            }
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
	/**
	 * Converts from a flag base to a flag.
	 *
	 * @param {Object} flagObj - The flag we are getting values from
	 * @param {...FlagSource | FlagSource[]} args - The args to concatenate from flagObj
	 * @returns {number}
	 * @throws {Error} - If it encounters an unknown flag in args
	 */
	function from$1(obj, ...args) {
	    return from_base(obj, true, ...args);
	}
	function make$4(obj) {
	    const out = {};
	    if (typeof obj === 'string') {
	        obj = obj.split(/[|,]/).map((v) => v.trim());
	    }
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
	        out[key] = from$1(out, value);
	    });
	    return out;
	}

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
	                other = from(other);
	                return other.equals(this);
	            }
	            if (this.name)
	                return this.name === other;
	        }
	        else if (typeof other === 'number') {
	            return this.toInt() === other;
	        }
	        const O = from(other);
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
	        return make$3(this._data.map((v) => clamp(v, 0, 100)));
	    }
	    blend(other) {
	        const O = from(other);
	        if (O.isNull())
	            return this;
	        if (O.a === 100)
	            return O;
	        const pct = O.a / 100;
	        const keepPct = 1 - pct;
	        const newColor = make$3(Math.round(this._data[0] * keepPct + O._data[0] * pct), Math.round(this._data[1] * keepPct + O._data[1] * pct), Math.round(this._data[2] * keepPct + O._data[2] * pct), Math.round(O.a + this._data[3] * keepPct));
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
	        const O = from(other);
	        if (O.isNull())
	            return this;
	        if (percent >= 100)
	            return O;
	        const pct = clamp(percent, 0, 100) / 100;
	        const keepPct = 1 - pct;
	        const newColor = make$3(Math.round(this._data[0] * keepPct + O._data[0] * pct), Math.round(this._data[1] * keepPct + O._data[1] * pct), Math.round(this._data[2] * keepPct + O._data[2] * pct), (this.isNull() ? 100 : this._data[3]) * keepPct + O._data[3] * pct);
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
	        const O = from(other);
	        if (O.isNull())
	            return this;
	        if (O.a >= 100)
	            return O;
	        if (O.a <= 0)
	            return this;
	        const pct = clamp(O.a, 0, 100) / 100;
	        const keepPct = ((1 - pct) * this.a) / 100;
	        const newColor = make$3(Math.round(this._data[0] * keepPct + O._data[0] * pct), Math.round(this._data[1] * keepPct + O._data[1] * pct), Math.round(this._data[2] * keepPct + O._data[2] * pct), Math.round(this._data[3] * keepPct + O._data[3] * pct));
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
	        return make$3(Math.round(this._data[0] * keepPct + 100 * pct), Math.round(this._data[1] * keepPct + 100 * pct), Math.round(this._data[2] * keepPct + 100 * pct), this._a);
	    }
	    // Only adjusts r,g,b
	    darken(percent) {
	        if (this.isNull())
	            return this;
	        const pct = clamp(percent, 0, 100) / 100;
	        const keepPct = 1 - pct;
	        return make$3(Math.round(this._data[0] * keepPct + 0 * pct), Math.round(this._data[1] * keepPct + 0 * pct), Math.round(this._data[2] * keepPct + 0 * pct), this._a);
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
	        return make$3(this._r + rand + redRand, this._g + rand + greenRand, this._b + rand + blueRand, this._a);
	    }
	    // Adds a color to this one
	    add(other, percent = 100) {
	        const O = from(other);
	        if (O.isNull())
	            return this;
	        const alpha = (O.a / 100) * (percent / 100);
	        return make$3(Math.round(this._data[0] + O._data[0] * alpha), Math.round(this._data[1] + O._data[1] * alpha), Math.round(this._data[2] + O._data[2] * alpha), clamp(Math.round(this._a + alpha * 100), 0, 100));
	    }
	    scale(percent) {
	        if (this.isNull() || percent == 100)
	            return this;
	        const pct = Math.max(0, percent) / 100;
	        return make$3(Math.round(this._data[0] * pct), Math.round(this._data[1] * pct), Math.round(this._data[2] * pct), this._a);
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
	        return make$3(Math.round(this._ra * (data[0] / 100) * pct), Math.round(this._ga * (data[1] / 100) * pct), Math.round(this._ba * (data[2] / 100) * pct), 100);
	    }
	    // scales rgb down to a max of 100
	    normalize() {
	        if (this.isNull())
	            return this;
	        const max = Math.max(this._ra, this._ga, this._ba);
	        if (max <= 100)
	            return this;
	        return make$3(Math.round((100 * this._ra) / max), Math.round((100 * this._ga) / max), Math.round((100 * this._ba) / max), 100);
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
	function make$3(...args) {
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
	function from(...args) {
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
	    return make$3(arg, args[1]);
	}
	function install$4(name, ...args) {
	    let info = args;
	    if (args.length == 1) {
	        info = args[0];
	    }
	    const c = info instanceof Color ? info : make$3(info);
	    // @ts-ignore
	    c._const = true;
	    colors[name] = c;
	    c.name = name;
	    return c;
	}
	function installSpread(name, ...args) {
	    let c;
	    if (args.length == 1) {
	        c = install$4(name, args[0]);
	    }
	    else {
	        c = install$4(name, ...args);
	    }
	    install$4('light_' + name, c.lighten(25));
	    install$4('lighter_' + name, c.lighten(50));
	    install$4('lightest_' + name, c.lighten(75));
	    install$4('dark_' + name, c.darken(25));
	    install$4('darker_' + name, c.darken(50));
	    install$4('darkest_' + name, c.darken(75));
	    return c;
	}
	const NONE = install$4('NONE', -1);
	install$4('black', 0x000);
	install$4('white', 0xfff);
	installSpread('teal', [30, 100, 100]);
	installSpread('brown', [60, 40, 0]);
	installSpread('tan', [80, 70, 55]); // 80, 67,		15);
	installSpread('pink', [100, 60, 66]);
	installSpread('gray', [50, 50, 50]);
	installSpread('grey', [50, 50, 50]);
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

	make$4([
	    'VISIBLE', // cell has sufficient light and is in field of view, ready to draw.
	    'WAS_VISIBLE',
	    'CLAIRVOYANT_VISIBLE',
	    'WAS_CLAIRVOYANT_VISIBLE',
	    'TELEPATHIC_VISIBLE', // potions of telepathy let you see through other creatures' eyes
	    'WAS_TELEPATHIC_VISIBLE', // potions of telepathy let you see through other creatures' eyes
	    'ITEM_DETECTED',
	    'WAS_ITEM_DETECTED',
	    'ACTOR_DETECTED',
	    'WAS_ACTOR_DETECTED',
	    'REVEALED',
	    'MAGIC_MAPPED', // TODO - REMOVE !?!?
	    'IN_FOV', // player has unobstructed line of sight whether or not there is enough light
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
	            const d = DIRS$4[i];
	            this._castLight(1, 1.0, 0.0, 0, d[0], d[1], 0);
	            this._castLight(1, 1.0, 0.0, d[0], 0, 0, d[1]);
	        }
	    }
	    // NOTE: slope starts a 1 and ends at 0.
	    _castLight(row, startSlope, endSlope, xx, xy, yx, yy) {
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
	                    this._castLight(row + 1, nextStart, outerSlope, xx, xy, yx, yy);
	                    nextStart = innerSlope;
	                }
	            }
	        }
	        if (!blocked) {
	            this._castLight(row + 1, nextStart, endSlope, xx, xy, yx, yy);
	        }
	    }
	}

	const DIRS$2 = DIRS$4;
	const OK = 1;
	const BLOCKED = 10000;
	const OBSTRUCTION = 20000; // Blocks Diagonal
	const NOT_DONE = 30000;
	function makeItem$1(x, y, distance = NOT_DONE) {
	    return {
	        x,
	        y,
	        distance,
	        next: null,
	        prev: null,
	    };
	}
	class DijkstraMap {
	    constructor(width, height) {
	        this._data = [];
	        this._todo = makeItem$1(-1, -1);
	        this._width = 0;
	        this._height = 0;
	        if (width !== undefined && height !== undefined) {
	            this.reset(width, height);
	        }
	    }
	    get width() {
	        return this._width;
	    }
	    get height() {
	        return this._height;
	    }
	    copy(other) {
	        this.reset(other.width, other.height);
	        const max = other.width * other.height;
	        for (let index = 0; index < max; ++index) {
	            this._data[index].distance = other._data[index].distance;
	        }
	    }
	    hasXY(x, y) {
	        return x >= 0 && x < this._width && y >= 0 && y < this._height;
	    }
	    reset(width, height, distance = NOT_DONE) {
	        this._width = width;
	        this._height = height;
	        while (this._data.length < width * height) {
	            this._data.push(makeItem$1(-1, -1));
	        }
	        for (let y = 0; y < this._height; ++y) {
	            for (let x = 0; x < this._width; ++x) {
	                const item = this._get(x, y);
	                item.x = x;
	                item.y = y;
	                item.distance = distance;
	                item.next = item.prev = null;
	            }
	        }
	        this._todo.next = this._todo.prev = null;
	    }
	    _get(...args) {
	        if (args.length == 1) {
	            const x$1 = x(args[0]);
	            const y$1 = y(args[0]);
	            return this._data[x$1 + y$1 * this._width];
	        }
	        else {
	            return this._data[args[0] + args[1] * this._width];
	        }
	    }
	    setGoal(...args) {
	        if (typeof args[0] === 'number') {
	            this._add(args[0], args[1], args[2] || 0, 0);
	        }
	        else {
	            this._add(x(args[0]), y(args[0]), args[1] || 0, 0);
	        }
	    }
	    setDistance(x, y, distance) {
	        this._add(x, y, 0, distance);
	    }
	    _add(x, y, distance, cost) {
	        if (!this.hasXY(x, y))
	            return false;
	        const item = this._get(x, y);
	        if (Math.floor(item.distance * 100) <=
	            Math.floor((cost + distance) * 100)) {
	            return false;
	        }
	        if (item.prev) {
	            item.prev.next = item.next;
	            item.next && (item.next.prev = item.prev);
	        }
	        item.prev = item.next = null;
	        if (cost >= OBSTRUCTION) {
	            item.distance = OBSTRUCTION;
	            return false;
	        }
	        else if (cost >= BLOCKED) {
	            item.distance = BLOCKED;
	            return false;
	        }
	        item.distance = distance + cost;
	        return this._insert(item);
	    }
	    _insert(item) {
	        let prev = this._todo;
	        let current = prev.next;
	        while (current && current.distance < item.distance) {
	            prev = current;
	            current = prev.next;
	        }
	        prev.next = item;
	        item.prev = prev;
	        item.next = current;
	        current && (current.prev = item);
	        return true;
	    }
	    calculate(costFn, only4dirs = false) {
	        let current = this._todo.next;
	        while (current) {
	            let next = current.next;
	            current.prev = current.next = null;
	            this._todo.next = next;
	            next && (next.prev = this._todo);
	            // console.log('current', current.x, current.y, current.distance);
	            eachNeighbor(current.x, current.y, (x, y, dir) => {
	                let mult = 1;
	                if (isDiagonal(dir)) {
	                    mult = 1.4;
	                    // check to see if obstruction blocks this move
	                    if (costFn(x, current.y) >= OBSTRUCTION ||
	                        costFn(current.x, y) >= OBSTRUCTION) {
	                        return;
	                    }
	                }
	                const cost = costFn(x, y) * mult;
	                if (this._add(x, y, current.distance, cost)) ;
	            }, only4dirs);
	            current = this._todo.next;
	        }
	    }
	    rescan(costFn, only4dirs = false) {
	        this._data.forEach((item) => {
	            item.next = item.prev = null;
	            if (item.distance < BLOCKED) {
	                this._insert(item);
	            }
	        });
	        this.calculate(costFn, only4dirs);
	    }
	    getDistance(x, y) {
	        if (!this.hasXY(x, y))
	            return NOT_DONE;
	        return this._get(x, y).distance;
	    }
	    addObstacle(x, y, costFn, radius, penalty = radius) {
	        const done = [[x, y]];
	        const todo = [[x, y]];
	        while (todo.length) {
	            const item = todo.shift();
	            const dist = distanceBetween(x, y, item[0], item[1]);
	            if (dist > radius) {
	                continue;
	            }
	            const stepPenalty = penalty * ((radius - dist) / radius);
	            const data = this._get(item);
	            data.distance += stepPenalty;
	            eachNeighbor(item[0], item[1], (i, j) => {
	                const stepCost = costFn(i, j);
	                if (done.findIndex((e) => e[0] === i && e[1] === j) >= 0) {
	                    return;
	                }
	                if (stepCost >= BLOCKED) {
	                    return;
	                }
	                done.push([i, j]);
	                todo.push([i, j]);
	            });
	        }
	    }
	    nextDir(fromX, fromY, isBlocked, only4dirs = false) {
	        let newX, newY, bestScore;
	        let index;
	        // brogueAssert(coordinatesAreInMap(x, y));
	        bestScore = 0;
	        let bestDir = NO_DIRECTION;
	        if (!this.hasXY(fromX, fromY))
	            throw new Error('Invalid index.');
	        const dist = this._get(fromX, fromY).distance;
	        for (index = 0; index < (only4dirs ? 4 : 8); ++index) {
	            const dir = DIRS$2[index];
	            newX = fromX + dir[0];
	            newY = fromY + dir[1];
	            if (!this.hasXY(newX, newY))
	                continue;
	            if (isDiagonal(dir)) {
	                if (this._get(newX, fromY).distance >= OBSTRUCTION ||
	                    this._get(fromX, newY).distance >= OBSTRUCTION) {
	                    continue; // diagonal blocked
	                }
	            }
	            const newDist = this._get(newX, newY).distance;
	            if (newDist < dist) {
	                const diff = dist - newDist;
	                if (diff > bestScore &&
	                    (newDist === 0 || !isBlocked(newX, newY))) {
	                    bestDir = index;
	                    bestScore = diff;
	                }
	            }
	        }
	        return DIRS$2[bestDir] || null;
	    }
	    getPath(fromX, fromY, isBlocked, only4dirs = false) {
	        const path = [];
	        this.forPath(fromX, fromY, isBlocked, (x, y) => {
	            path.push([x, y]);
	        }, only4dirs);
	        return path.length ? path : null;
	    }
	    // Populates path[][] with a list of coordinates starting at origin and traversing down the map. Returns the path.
	    forPath(fromX, fromY, isBlocked, pathFn, only4dirs = false) {
	        // actor = actor || GW.PLAYER;
	        let x = fromX;
	        let y = fromY;
	        let dist = this._get(x, y).distance || 0;
	        let count = 0;
	        if (dist === 0) {
	            pathFn(x, y);
	            return count;
	        }
	        if (dist >= BLOCKED) {
	            const locs = closestMatchingLocs(x, y, (v) => {
	                return v < BLOCKED;
	            });
	            if (!locs || locs.length === 0)
	                return 0;
	            // get the loc with the lowest distance
	            const loc = locs.reduce((best, current) => {
	                const bestItem = this._get(best);
	                const currentItem = this._get(current);
	                return bestItem.distance <= currentItem.distance
	                    ? best
	                    : current;
	            });
	            x = loc[0];
	            y = loc[1];
	            pathFn(x, y);
	            ++count;
	        }
	        let dir;
	        do {
	            dir = this.nextDir(x, y, isBlocked, only4dirs);
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
	    // allows you to transform the data - for flee calcs, etc...
	    update(fn) {
	        for (let y = 0; y < this._height; ++y) {
	            for (let x = 0; x < this._width; ++x) {
	                const item = this._get(x, y);
	                item.distance = fn(item.distance, item.x, item.y);
	            }
	        }
	    }
	    add(other) {
	        if (this._width !== other._width || this._height !== other._height)
	            throw new Error('Not same size!');
	        for (let index = 0; index < this._width * this._height; ++index) {
	            this._data[index].distance += other._data[index].distance;
	        }
	    }
	    forEach(fn) {
	        for (let y = 0; y < this._height; ++y) {
	            for (let x = 0; x < this._width; ++x) {
	                const item = this._get(x, y);
	                fn(item.distance, item.x, item.y);
	            }
	        }
	    }
	    dump(fmtFn, log = console.log) {
	        this.dumpRect(0, 0, this.width, this.height, fmtFn, log);
	    }
	    dumpRect(left, top, width, height, fmtFn, log = console.log) {
	        fmtFn = fmtFn || _format;
	        const format = (x, y) => {
	            return fmtFn(this.getDistance(x, y));
	        };
	        return dumpRect(left, top, width, height, format, log);
	    }
	    dumpAround(x, y, radius, fmtFn, log = console.log) {
	        this.dumpRect(x - radius, y - radius, 2 * radius, 2 * radius, fmtFn, log);
	    }
	    _dumpTodo() {
	        let current = this._todo.next;
	        const out = [];
	        while (current) {
	            out.push(`${current.x},${current.y}=${current.distance.toFixed(2)}`);
	            current = current.next;
	        }
	        return out;
	    }
	}
	function _format(v) {
	    if (v < BLOCKED) {
	        return v.toFixed(1).padStart(3, ' ') + ' ';
	        // } else if (v < 36) {
	        //     return String.fromCharCode('a'.charCodeAt(0) + v - 10);
	        // } else if (v < 62) {
	        //     return String.fromCharCode('A'.charCodeAt(0) + v - 10 - 26);
	    }
	    else if (v >= OBSTRUCTION) {
	        return ' ## ';
	    }
	    else if (v >= BLOCKED) {
	        return ' XX ';
	    }
	    else {
	        return ' >> ';
	    }
	}

	function make$2(v) {
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
	        let valueFn;
	        if (typeof frequency === 'string') {
	            const value = Number.parseInt(frequency);
	            valueFn = () => value;
	        }
	        else if (typeof frequency === 'number') {
	            valueFn = () => frequency;
	        }
	        else {
	            valueFn = frequency;
	        }
	        if (levels.includes('-')) {
	            let [start, end] = levels
	                .split('-')
	                .map((t) => t.trim())
	                .map((v) => Number.parseInt(v));
	            return (level) => level >= start && level <= end ? valueFn(level) : 0;
	        }
	        else if (levels.endsWith('+')) {
	            const found = Number.parseInt(levels);
	            return (level) => (level >= found ? valueFn(level) : 0);
	        }
	        else {
	            const found = Number.parseInt(levels);
	            return (level) => (level === found ? valueFn(level) : 0);
	        }
	    });
	    if (funcs.length == 1)
	        return funcs[0];
	    return (level) => funcs.reduce((out, fn) => out || fn(level), 0);
	}

	var TaskResultType;
	(function (TaskResultType) {
	    TaskResultType[TaskResultType["OK"] = 0] = "OK";
	    TaskResultType[TaskResultType["DONE"] = 1] = "DONE";
	    TaskResultType[TaskResultType["RETRY"] = 2] = "RETRY";
	})(TaskResultType || (TaskResultType = {}));

	class Blob {
	    constructor(opts = {}) {
	        this.options = {
	            rng: random$1,
	            rounds: 5,
	            minWidth: 10,
	            minHeight: 10,
	            maxWidth: 40,
	            maxHeight: 20,
	            percentSeeded: 50,
	            birthParameters: 'ffffffttt',
	            survivalParameters: 'ffffttttt',
	            tries: 10,
	            seedWidth: 0,
	            seedHeight: 0,
	            minPercentFilled: 50,
	            maxPercentFilled: 90,
	            largestOnly: true,
	        };
	        Object.assign(this.options, opts);
	        this.options.birthParameters =
	            this.options.birthParameters.toLowerCase();
	        this.options.survivalParameters =
	            this.options.survivalParameters.toLowerCase();
	        if (this.options.percentSeeded < 1) {
	            this.options.percentSeeded = Math.floor(this.options.percentSeeded * 100);
	        }
	        if (this.options.minPercentFilled < 1) {
	            this.options.minPercentFilled = Math.floor(this.options.minPercentFilled * 100);
	        }
	        if (this.options.maxPercentFilled < 1) {
	            this.options.maxPercentFilled = Math.floor(this.options.maxPercentFilled * 100);
	        }
	        if (this.options.minWidth >= this.options.maxWidth) {
	            this.options.minWidth = Math.round(0.75 * this.options.maxWidth);
	            this.options.maxWidth = Math.round(1.25 * this.options.maxWidth);
	        }
	        if (this.options.minHeight >= this.options.maxHeight) {
	            this.options.minHeight = Math.round(0.75 * this.options.maxHeight);
	            this.options.maxHeight = Math.round(1.25 * this.options.maxHeight);
	        }
	        if (!this.options.seedWidth) {
	            this.options.seedWidth = this.options.maxWidth;
	        }
	        if (!this.options.seedHeight) {
	            this.options.seedHeight = this.options.maxHeight;
	        }
	    }
	    carve(width, height, setFn) {
	        let i, j, k;
	        let blobNumber, blobSize, topBlobNumber, topBlobSize;
	        let bounds = new Bounds(0, 0, 0, 0);
	        const dest = alloc(width, height);
	        const maxWidth = Math.min(width, this.options.maxWidth);
	        const maxHeight = Math.min(height, this.options.maxHeight);
	        const minWidth = Math.min(width, this.options.minWidth);
	        const minHeight = Math.min(height, this.options.minHeight);
	        const seedWidth = this.options.seedWidth;
	        const seedHeight = this.options.seedHeight;
	        const seedLeft = Math.floor((dest.width - seedWidth) / 2);
	        const seedTop = Math.floor((dest.height - seedHeight) / 2);
	        const minPctFilled = this.options.minPercentFilled;
	        const maxPctFilled = this.options.maxPercentFilled;
	        let pctFilled = 0;
	        let tries = this.options.tries;
	        // Generate blobs until they satisfy the minBlobWidth and minBlobHeight restraints
	        do {
	            // Clear buffer.
	            dest.fill(0);
	            // Fill relevant portion with noise based on the percentSeeded argument.
	            for (i = 0; i < seedWidth; i++) {
	                for (j = 0; j < seedHeight; j++) {
	                    dest._data[i + seedLeft][j + seedTop] =
	                        this.options.rng.chance(this.options.percentSeeded)
	                            ? 1
	                            : 0;
	                }
	            }
	            // Some iterations of cellular automata
	            for (k = 0; k < this.options.rounds; k++) {
	                if (!cellularAutomataRound(dest, this.options.birthParameters, this.options.survivalParameters)) {
	                    // TODO - why not just break?
	                    k = this.options.rounds; // cellularAutomataRound did not make any changes
	                }
	            }
	            dest.calcBounds(1, bounds);
	            if (bounds.width > maxWidth) {
	                const iters = Math.floor((dest.width - maxWidth) / 2);
	                for (let x = 0; x < iters; ++x) {
	                    for (let y = 0; y < height; ++y) {
	                        dest.set(x, y, 0);
	                        dest.set(width - x - 1, y, 0);
	                    }
	                }
	            }
	            if (bounds.height > maxHeight) {
	                const iters = Math.floor((dest.height - maxHeight) / 2);
	                for (let y = 0; y < iters; ++y) {
	                    for (let x = 0; x < width; ++x) {
	                        dest.set(x, y, 0);
	                        dest.set(x, height - y - 1, 0);
	                    }
	                }
	            }
	            // Now to measure the result. These are best-of variables; start them out at worst-case values.
	            topBlobSize = 0;
	            topBlobNumber = 0;
	            // Fill each blob with its own number, starting with 2 (since 1 means floor), and keeping track of the biggest:
	            blobNumber = 2;
	            if (this.options.largestOnly) {
	                dest.forEach((v, i, j) => {
	                    if (v == 1) {
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
	                });
	                // Figure out the top blob's height and width:
	                dest.calcBounds(topBlobNumber, bounds);
	            }
	            else {
	                dest.forEach((v) => {
	                    if (v > 0)
	                        ++topBlobSize;
	                });
	                dest.calcBounds((v) => v > 0, bounds);
	                topBlobNumber = 1;
	            }
	            // Calc the percent of that area that is filled
	            pctFilled = Math.floor((100 * topBlobSize) / (bounds.width * bounds.height));
	        } while ((bounds.width < minWidth ||
	            bounds.height < minHeight ||
	            bounds.width > maxWidth ||
	            bounds.height > maxHeight ||
	            topBlobNumber == 0 ||
	            pctFilled < minPctFilled ||
	            pctFilled > maxPctFilled) &&
	            --tries);
	        if (tries <= 0) {
	            console.warn('Failed to find successful blob, returning last attempt.');
	            if (bounds.width < minWidth)
	                console.log(' - too narrow');
	            if (bounds.height < minHeight)
	                console.log(' - too short');
	            if (bounds.width > maxWidth)
	                console.log(' - too wide');
	            if (bounds.height > maxHeight)
	                console.log(' - too tall');
	            if (topBlobNumber == 0)
	                console.log(' - empty');
	            if (pctFilled < minPctFilled)
	                console.log(' - too sparse');
	            if (pctFilled > maxPctFilled)
	                console.log(' - too dense');
	            dest.dump();
	        }
	        // Replace the winning blob with 1's, and everything else with 0's:
	        dest.forEach((v, i, j) => {
	            if (!v)
	                return;
	            if (!this.options.largestOnly || v == topBlobNumber) {
	                setFn(i, j);
	            }
	        });
	        free(dest);
	        // Populate the returned variables.
	        return bounds;
	    }
	}
	function cellularAutomataRound(grid, birthParameters, survivalParameters) {
	    let i, j, nbCount, newX, newY;
	    let dir;
	    let buffer2;
	    buffer2 = alloc(grid.width, grid.height);
	    buffer2.copy(grid); // Make a backup of this in buffer2, so that each generation is isolated.
	    let didSomething = false;
	    for (i = 0; i < grid.width; i++) {
	        for (j = 0; j < grid.height; j++) {
	            nbCount = 0;
	            for (dir = 0; dir < DIRS$4.length; dir++) {
	                newX = i + DIRS$4[dir][0];
	                newY = j + DIRS$4[dir][1];
	                if (grid.hasXY(newX, newY) && buffer2._data[newX][newY]) {
	                    nbCount++;
	                }
	            }
	            if (!buffer2._data[i][j] && birthParameters[nbCount] == 't') {
	                grid._data[i][j] = 1; // birth
	                didSomething = true;
	            }
	            else if (buffer2._data[i][j] &&
	                survivalParameters[nbCount] == 't') ;
	            else {
	                grid._data[i][j] = 0; // death
	                didSomething = true;
	            }
	        }
	    }
	    free(buffer2);
	    return didSomething;
	}

	// const LIGHT_SMOOTHING_THRESHOLD = 150;       // light components higher than this magnitude will be toned down a little
	// export const config = (CONFIG.light = {
	//     INTENSITY_DARK: 20,
	//     INTENSITY_SHADOW: 50,
	// }); // less than 20% for highest color in rgb
	make$3();
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

	make$4([
	    'LIT',
	    'IN_SHADOW',
	    'DARK',
	    // 'MAGIC_DARK',
	    'CHANGED',
	]);

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
	            this._fg = from(this._fg).darken(pct);
	        }
	        if (bg) {
	            this._bg = from(this._bg).darken(pct);
	        }
	        return this;
	    }
	    bright(pct = 25, fg = true, bg = false) {
	        if (fg) {
	            this._fg = from(this._fg).lighten(pct);
	        }
	        if (bg) {
	            this._bg = from(this._bg).lighten(pct);
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
	        this.dirty ||= setDirty;
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
	        return this._opacity ?? 100;
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
	            this._baseFg = this._baseFg || from(this._fg);
	            this._fg = this._baseFg.alpha(v);
	        }
	        if (this._bg !== undefined) {
	            this._baseBg = this._baseBg || from(this._bg);
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

	// import * as GWU from 'gw-utils/dist';
	defaultStyle.add('dialog', {
	    bg: 'darkest_gray',
	    fg: 'light_gray',
	});

	// import * as GWU from 'gw-utils/dist';
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

	// import * as GWU from 'gw-utils/dist';
	defaultStyle.add('datatable', { bg: 'black' });
	// STYLE.defaultStyle.add('th', { bg: 'light_teal', fg: 'dark_blue' });
	// STYLE.defaultStyle.add('td', { bg: 'darker_gray' });
	// STYLE.defaultStyle.add('td:odd', { bg: 'gray' });
	// STYLE.defaultStyle.add('td:hover', { bg: 'light_gray' });
	defaultStyle.add('td:selected', { bg: 'gray' });
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

	class TileFactory {
	    constructor(withDefaults = true) {
	        this.plugins = [];
	        this.tileIds = {};
	        this.allTiles = [];
	        this.fieldMap = {};
	        this.installField('extends', NOOP); // skip
	        this.installField('tags', (current, updated) => {
	            return merge(current, updated);
	        });
	        this.installField('priority', this._priorityFieldMap.bind(this));
	        if (withDefaults) {
	            this.installSet(default_tiles);
	        }
	    }
	    installField(name, fn) {
	        this.fieldMap[name] = fn;
	    }
	    installFields(fields) {
	        Object.assign(this.fieldMap, fields);
	    }
	    use(plugin) {
	        this.plugins.push(plugin);
	    }
	    getTile(name) {
	        const tile = this._getTile(name);
	        if (!tile) {
	            console.warn('Failed to find tile: ' + name);
	        }
	        return tile;
	    }
	    _getTile(name) {
	        let id;
	        if (typeof name === 'string') {
	            id = this.tileIds[name];
	            if (id === undefined) {
	                return null;
	            }
	        }
	        else {
	            id = name;
	        }
	        return this.allTiles[id] || null;
	    }
	    hasTile(name) {
	        return this.getTile(name) !== null;
	    }
	    tileId(name) {
	        if (typeof name === 'number')
	            return name;
	        return this.tileIds[name] ?? -1; // TODO: -1 vs 0?
	    }
	    // TODO - Remove?
	    blocksMove(name) {
	        const info = this.getTile(name);
	        return (!!info && info.blocksMove) || false;
	    }
	    install(id, opts = {}) {
	        if (typeof id !== 'string') {
	            opts = id;
	            id = id.id;
	        }
	        const base = { id, index: this.allTiles.length, priority: 0, tags: [] };
	        opts.extends = opts.extends || id;
	        if (opts.extends) {
	            const root = this._getTile(opts.extends);
	            if (root) {
	                Object.assign(base, root);
	            }
	            else if (opts.extends !== id) {
	                throw new Error('Cannot extend tile: ' + opts.extends);
	            }
	        }
	        const info = mergeWith(base, opts, this.fieldMap);
	        info.id = id;
	        info.index = this.allTiles.length;
	        if (info.blocksPathing === undefined) {
	            if (info.blocksMove) {
	                info.blocksPathing = true;
	            }
	        }
	        // Do any custom tile setup
	        this.apply(info, opts);
	        if (this.tileIds[id]) {
	            info.index = this.tileIds[id];
	            this.allTiles[info.index] = info;
	        }
	        else {
	            this.allTiles.push(info);
	            this.tileIds[id] = info.index;
	        }
	        return info;
	    }
	    installSet(set) {
	        const arr = Array.isArray(set) ? set : [set];
	        arr.forEach((s) => {
	            Object.entries(s).forEach(([k, v]) => {
	                if (typeof v === 'string') {
	                    // This is a reference
	                    const tile = this.getTile(v);
	                    if (tile) {
	                        this.tileIds[k] = tile.index;
	                    }
	                    else {
	                        console.warn('Trying to install invalid tile reference: ' +
	                            k +
	                            ' => ' +
	                            v);
	                    }
	                }
	                else {
	                    this.install(k, v);
	                }
	            });
	        });
	    }
	    apply(tile, config) {
	        this.plugins.forEach((p) => {
	            if (p.createTile) {
	                p.createTile(tile, config);
	            }
	        });
	    }
	    _priorityFieldMap(current, updated) {
	        if (typeof updated === 'number')
	            return updated;
	        if (typeof updated === 'string') {
	            let text = updated.replace(/ /g, '');
	            let index = text.search(/[+-]/);
	            if (index == 0) {
	                return current + Number.parseInt(text);
	            }
	            else if (index == -1) {
	                if (text.search(/[a-zA-Z]/) == 0) {
	                    const tile = this._getTile(text);
	                    if (!tile)
	                        throw new Error('Failed to find tile for priority - ' + text + '.');
	                    return tile.priority;
	                }
	                else {
	                    return Number.parseInt(text);
	                }
	            }
	            else {
	                const id = text.substring(0, index);
	                const delta = Number.parseInt(text.substring(index));
	                const tile = this._getTile(id);
	                if (!tile)
	                    throw new Error('Failed to find tile for priority - ' + id + '.');
	                return tile.priority + delta;
	            }
	        }
	        else if (updated !== undefined) {
	            return updated;
	        }
	        return current;
	    }
	}
	// export const tileIds: Record<string, number> = {};
	// export const allTiles: TileInfo[] = [];
	const default_tiles = {
	    NONE: {
	        blocksDiagonal: true,
	        priority: 0,
	        ch: '',
	    },
	    NOTHING: 'NONE',
	    NULL: 'NONE',
	    FLOOR: { priority: 10, ch: '.' },
	    WALL: {
	        blocksMove: true,
	        blocksVision: true,
	        blocksDiagonal: true,
	        priority: 50,
	        ch: '#',
	    },
	    DOOR: {
	        blocksVision: true,
	        door: true,
	        priority: 60,
	        ch: '+',
	    },
	    SECRET_DOOR: {
	        blocksMove: true,
	        secretDoor: true,
	        priority: 70,
	        ch: '%',
	    },
	    UP_STAIRS: {
	        stairs: true,
	        priority: 80,
	        ch: '>',
	    },
	    DOWN_STAIRS: {
	        stairs: true,
	        priority: 80,
	        ch: '<',
	    },
	    LAKE: {
	        priority: 40,
	        liquid: true,
	        ch: '~',
	    },
	    DEEP: 'LAKE',
	    SHALLOW: { priority: 30, ch: '`' },
	    BRIDGE: { priority: 45, ch: '=' }, // layers help here
	    IMPREGNABLE: {
	        priority: 200,
	        ch: '%',
	        impregnable: true,
	        blocksMove: true,
	        blocksVision: true,
	        blocksDiagonal: true,
	    },
	};
	// TODO - make this a let and don't export it?  Then add: 'use(factory)' to set it from outside.
	const tileFactory = new TileFactory(true);
	function installTile(...args) {
	    if (args.length == 1) {
	        return tileFactory.install(args[0]);
	    }
	    return tileFactory.install(args[0], args[1]);
	}
	function installField(name, fn) {
	    tileFactory.installField(name, fn);
	}
	function installFields(fields) {
	    tileFactory.installFields(fields);
	}
	function getTile(name) {
	    return tileFactory.getTile(name);
	}
	function tileId(name) {
	    return tileFactory.tileId(name);
	}
	function blocksMove(name) {
	    return tileFactory.blocksMove(name);
	}

	const features = {};
	function install$3(name, fn) {
	    if (typeof fn !== 'function') {
	        fn = make$1(fn);
	    }
	    features[name] = fn;
	}
	const types = {};
	function installType(name, fn) {
	    types[name] = fn;
	}
	// FEATURE TYPE
	function feature(id) {
	    if (Array.isArray(id))
	        id = id[0];
	    if (id && typeof id !== 'string') {
	        id = id.id;
	    }
	    if (!id || !id.length)
	        throw new Error('Feature effect needs ID');
	    return featureFeature.bind(undefined, id);
	}
	function featureFeature(id, site, x, y) {
	    const feat = features[id];
	    if (!feat) {
	        throw new Error('Failed to find feature: ' + id);
	    }
	    return feat(site, x, y);
	}
	installType('feature', feature);
	installType('effect', feature);
	installType('id', feature);
	function make$1(id, config) {
	    if (!id)
	        return FALSE;
	    if (typeof id === 'string') {
	        if (!id.length)
	            throw new Error('Cannot create effect from empty string.');
	        if (!config) {
	            const parts = id.split(':');
	            id = parts.shift().toLowerCase();
	            config = parts;
	        }
	        // string with no parameters is interpreted as id of registered feature
	        if (config.length === 0) {
	            config = id;
	            id = 'feature';
	        }
	        const handler = types[id];
	        if (!handler)
	            throw new Error('Failed to find effect - ' + id);
	        return handler(config || {});
	    }
	    let steps;
	    if (Array.isArray(id)) {
	        steps = id
	            .map((config) => make$1(config))
	            .filter((a) => a !== null);
	    }
	    else if (typeof id === 'function') {
	        return id;
	    }
	    else {
	        steps = Object.entries(id)
	            .map(([key, config]) => make$1(key, config))
	            .filter((a) => a !== null);
	    }
	    if (steps.length === 1) {
	        return steps[0];
	    }
	    return (site, x, y) => {
	        return steps.every((step) => step(site, x, y));
	    };
	}
	function makeArray(cfg) {
	    if (!cfg)
	        return [];
	    if (Array.isArray(cfg)) {
	        return cfg
	            .map((c) => make$1(c))
	            .filter((fn) => fn !== null);
	    }
	    if (typeof cfg === 'string') {
	        if (!cfg.length)
	            throw new Error('Cannot create effect from empty string.');
	        const parts = cfg.split(':');
	        cfg = parts.shift().toLowerCase();
	        const handler = types[cfg];
	        if (!handler)
	            return [];
	        return [handler(parts)];
	    }
	    else if (typeof cfg === 'function') {
	        return [cfg];
	    }
	    const steps = Object.entries(cfg).map(([key, config]) => make$1(key, config));
	    return steps.filter((s) => s !== null);
	}

	function tile(src) {
	    if (!src)
	        throw new Error('Tile effect needs configuration.');
	    if (typeof src === 'string') {
	        src = { id: src };
	    }
	    else if (Array.isArray(src)) {
	        src = { id: src[0] };
	    }
	    else if (!src.id) {
	        throw new Error('Tile effect needs configuration with id.');
	    }
	    const opts = src;
	    if (opts.id.includes('!')) {
	        opts.superpriority = true;
	    }
	    if (opts.id.includes('~')) {
	        opts.blockedByActors = true;
	        opts.blockedByItems = true;
	    }
	    // if (opts.id.includes('+')) {
	    //     opts.protected = true;
	    // }
	    opts.id = opts.id.replace(/[!~+]*/g, '');
	    return tileAction.bind(undefined, opts);
	}
	function tileAction(cfg, site, x, y) {
	    cfg.machine = 0; // >???<
	    if (site.setTile(x, y, cfg.id, cfg)) {
	        return true;
	    }
	    return false;
	}
	installType('tile', tile);

	//////////////////////////////////////////////
	// chance
	function chance(opts) {
	    if (Array.isArray(opts)) {
	        opts = opts[0];
	    }
	    if (typeof opts === 'object') {
	        opts = opts.chance;
	    }
	    if (typeof opts === 'string') {
	        if (opts.endsWith('%')) {
	            opts = Number.parseFloat(opts) * 100;
	        }
	        else {
	            opts = Number.parseInt(opts || '10000');
	        }
	    }
	    if (typeof opts !== 'number') {
	        throw new Error('Chance effect config must be number or string that can be a number.');
	    }
	    return chanceAction.bind(undefined, opts);
	}
	function chanceAction(cfg, site) {
	    return site.rng.chance(cfg, 10000);
	}
	installType('chance', chance);

	const Fl$2 = fl;
	///////////////////////////////////////////////////////
	// TILE EVENT
	var Flags$2;
	(function (Flags) {
	    // E_ALWAYS_FIRE = Fl(10), // Fire even if the cell is marked as having fired this turn
	    // E_NEXT_ALWAYS = Fl(0), // Always fire the next effect, even if no tiles changed.
	    // E_NEXT_EVERYWHERE = Fl(1), // next effect spawns in every cell that this effect spawns in, instead of only the origin
	    // E_FIRED = Fl(2), // has already been fired once
	    // E_NO_MARK_FIRED = Fl(3), // Do not mark this cell as having fired an effect (so can log messages multiple times)
	    // MUST_REPLACE_LAYER
	    // NEEDS_EMPTY_LAYER
	    // E_PROTECTED = Fl(4),
	    // E_NO_REDRAW_CELL = Fl(),
	    Flags[Flags["E_TREAT_AS_BLOCKING"] = Fl$2(5)] = "E_TREAT_AS_BLOCKING";
	    Flags[Flags["E_PERMIT_BLOCKING"] = Fl$2(6)] = "E_PERMIT_BLOCKING";
	    Flags[Flags["E_ABORT_IF_BLOCKS_MAP"] = Fl$2(7)] = "E_ABORT_IF_BLOCKS_MAP";
	    Flags[Flags["E_BLOCKED_BY_ITEMS"] = Fl$2(8)] = "E_BLOCKED_BY_ITEMS";
	    Flags[Flags["E_BLOCKED_BY_ACTORS"] = Fl$2(9)] = "E_BLOCKED_BY_ACTORS";
	    Flags[Flags["E_BLOCKED_BY_OTHER_LAYERS"] = Fl$2(10)] = "E_BLOCKED_BY_OTHER_LAYERS";
	    Flags[Flags["E_SUPERPRIORITY"] = Fl$2(11)] = "E_SUPERPRIORITY";
	    Flags[Flags["E_IGNORE_FOV"] = Fl$2(12)] = "E_IGNORE_FOV";
	    // E_SPREAD_CIRCLE = Fl(13), // Spread in a circle around the spot (using FOV), radius calculated using spread+decrement
	    // E_SPREAD_LINE = Fl(14), // Spread in a line in one random direction
	    Flags[Flags["E_EVACUATE_CREATURES"] = Fl$2(15)] = "E_EVACUATE_CREATURES";
	    Flags[Flags["E_EVACUATE_ITEMS"] = Fl$2(16)] = "E_EVACUATE_ITEMS";
	    Flags[Flags["E_BUILD_IN_WALLS"] = Fl$2(17)] = "E_BUILD_IN_WALLS";
	    Flags[Flags["E_MUST_TOUCH_WALLS"] = Fl$2(18)] = "E_MUST_TOUCH_WALLS";
	    Flags[Flags["E_NO_TOUCH_WALLS"] = Fl$2(19)] = "E_NO_TOUCH_WALLS";
	    Flags[Flags["E_CLEAR_GROUND"] = Fl$2(21)] = "E_CLEAR_GROUND";
	    Flags[Flags["E_CLEAR_SURFACE"] = Fl$2(22)] = "E_CLEAR_SURFACE";
	    Flags[Flags["E_CLEAR_LIQUID"] = Fl$2(23)] = "E_CLEAR_LIQUID";
	    Flags[Flags["E_CLEAR_GAS"] = Fl$2(24)] = "E_CLEAR_GAS";
	    Flags[Flags["E_CLEAR_TILE"] = Fl$2(25)] = "E_CLEAR_TILE";
	    Flags[Flags["E_CLEAR_CELL"] = Flags.E_CLEAR_GROUND |
	        Flags.E_CLEAR_SURFACE |
	        Flags.E_CLEAR_LIQUID |
	        Flags.E_CLEAR_GAS] = "E_CLEAR_CELL";
	    Flags[Flags["E_ONLY_IF_EMPTY"] = Flags.E_BLOCKED_BY_ITEMS | Flags.E_BLOCKED_BY_ACTORS] = "E_ONLY_IF_EMPTY";
	    // E_NULLIFY_CELL = E_NULL_SURFACE | E_NULL_LIQUID | E_NULL_GAS,
	    // These should be effect types
	    // E_ACTIVATE_DORMANT_MONSTER = Fl(27), // Dormant monsters on this tile will appear -- e.g. when a statue bursts to reveal a monster.
	    // E_AGGRAVATES_MONSTERS = Fl(28), // Will act as though an aggravate monster scroll of effectRadius radius had been read at that point.
	    // E_RESURRECT_ALLY = Fl(29), // Will bring back to life your most recently deceased ally.
	})(Flags$2 || (Flags$2 = {}));
	function spread(...args) {
	    let config = {};
	    if (!args.length) {
	        throw new Error('Must have config to create spread.');
	    }
	    if (args.length === 1) {
	        if (typeof args[0] === 'string') {
	            args = args[0].split(':').map((t) => t.trim());
	        }
	        else if (Array.isArray(args[0])) {
	            args = args[0];
	        }
	        else {
	            Object.assign(config, args[0]);
	            args = [config];
	        }
	    }
	    if (args.length >= 3) {
	        Object.assign(config, args[3] || {});
	        config.grow = Number.parseInt(args[0]);
	        config.decrement = Number.parseInt(args[1]);
	        config.features = args[2];
	    }
	    else if (args.length === 2) {
	        throw new Error('Must have actions to run for spread.');
	    }
	    if (typeof config.grow !== 'number')
	        config.grow = Number.parseInt(config.grow || 0);
	    if (typeof config.decrement !== 'number')
	        config.decrement = Number.parseInt(config.decrement || 100);
	    config.flags = from$1(Flags$2, config.flags || 0);
	    config.matchTile = config.matchTile || '';
	    if (typeof config.features === 'string' &&
	        // @ts-ignore
	        config.features.indexOf(':') < 0) {
	        if (tileId(config.features) >= 0) {
	            // @ts-ignore
	            config.features = 'TILE:' + config.features;
	        }
	    }
	    const action = makeArray(config.features);
	    if (!action)
	        throw new Error('Failed to make action for spread.');
	    config.features = action;
	    const fn = spreadFeature.bind(undefined, config);
	    fn.config = config;
	    return fn;
	}
	installType('spread', spread);
	function spreadFeature(cfg, site, x, y) {
	    const abortIfBlocking = !!(cfg.flags & Flags$2.E_ABORT_IF_BLOCKS_MAP);
	    const map = site;
	    let didSomething = false;
	    const spawnMap = alloc(map.width, map.height);
	    if (!computeSpawnMap(cfg, spawnMap, site, x, y)) {
	        free(spawnMap);
	        return false;
	    }
	    if (abortIfBlocking && mapDisruptedBy(map, spawnMap)) {
	        free(spawnMap);
	        return false;
	    }
	    if (cfg.flags & Flags$2.E_EVACUATE_CREATURES) {
	        // first, evacuate creatures, so that they do not re-trigger the tile.
	        if (evacuateCreatures(map, spawnMap)) {
	            didSomething = true;
	        }
	    }
	    if (cfg.flags & Flags$2.E_EVACUATE_ITEMS) {
	        // first, evacuate items, so that they do not re-trigger the tile.
	        if (evacuateItems(map, spawnMap)) {
	            didSomething = true;
	        }
	    }
	    if (cfg.flags & Flags$2.E_CLEAR_CELL) {
	        // first, clear other tiles (not base/ground)
	        if (clearCells(map, spawnMap, cfg.flags)) {
	            didSomething = true;
	        }
	    }
	    spawnMap.update((v) => {
	        if (!v)
	            return 0;
	        return 1;
	    });
	    cfg.features.forEach((fn, i) => {
	        spawnMap.forEach((v, x, y) => {
	            if (v !== i + 1)
	                return;
	            if (fn(site, x, y)) {
	                didSomething = true;
	                spawnMap.increment(x, y);
	            }
	        });
	    });
	    if (didSomething) {
	        didSomething = true;
	    }
	    free(spawnMap);
	    return didSomething;
	}
	function mapDisruptedBy(map, blockingGrid, blockingToMapX = 0, blockingToMapY = 0) {
	    const walkableGrid = alloc(map.width, map.height);
	    let disrupts = false;
	    // Get all walkable locations after lake added
	    forRect(map.width, map.height, (i, j) => {
	        const lakeX = i + blockingToMapX;
	        const lakeY = j + blockingToMapY;
	        if (blockingGrid.get(lakeX, lakeY)) {
	            if (map.isStairs(i, j)) {
	                disrupts = true;
	            }
	        }
	        else if (!map.blocksMove(i, j)) {
	            walkableGrid.set(i, j, 1);
	        }
	    });
	    let first = true;
	    for (let i = 0; i < walkableGrid.width && !disrupts; ++i) {
	        for (let j = 0; j < walkableGrid.height && !disrupts; ++j) {
	            if (walkableGrid.get(i, j) == 1) {
	                if (first) {
	                    walkableGrid.floodFill(i, j, 1, 2);
	                    first = false;
	                }
	                else {
	                    disrupts = true;
	                }
	            }
	        }
	    }
	    // console.log('WALKABLE GRID');
	    // walkableGWU.grid.dump();
	    free(walkableGrid);
	    return disrupts;
	}
	// Spread
	function cellIsOk(effect, map, x, y, isStart) {
	    if (!map.hasXY(x, y))
	        return false;
	    if (map.isProtected(x, y))
	        return false;
	    if (map.blocksEffects(x, y) && !effect.matchTile && !isStart) {
	        return false;
	    }
	    if (effect.flags & Flags$2.E_BUILD_IN_WALLS) {
	        if (!map.isWall(x, y))
	            return false;
	    }
	    else if (effect.flags & Flags$2.E_MUST_TOUCH_WALLS) {
	        let ok = false;
	        eachNeighbor(x, y, (i, j) => {
	            if (map.isWall(i, j)) {
	                ok = true;
	            }
	        }, true);
	        if (!ok)
	            return false;
	    }
	    else if (effect.flags & Flags$2.E_NO_TOUCH_WALLS) {
	        let ok = true;
	        if (map.isWall(x, y))
	            return false; // or on wall
	        eachNeighbor(x, y, (i, j) => {
	            if (map.isWall(i, j)) {
	                ok = false;
	            }
	        }, true);
	        if (!ok)
	            return false;
	    }
	    // if (ctx.bounds && !ctx.bounds.containsXY(x, y)) return false;
	    if (effect.matchTile && !isStart && !map.hasTile(x, y, effect.matchTile)) {
	        return false;
	    }
	    return true;
	}
	function computeSpawnMap(effect, spawnMap, site, x, y) {
	    let i, j, dir, t, x2, y2;
	    let madeChange;
	    // const bounds = ctx.bounds || null;
	    // if (bounds) {
	    //   // Activation.debug('- bounds', bounds);
	    // }
	    const map = site;
	    let startProb = effect.grow || 0;
	    let probDec = effect.decrement || 0;
	    spawnMap.fill(0);
	    if (!cellIsOk(effect, map, x, y, true)) {
	        return false;
	    }
	    spawnMap.set(x, y, 1);
	    t = 1; // incremented before anything else happens
	    let count = 1;
	    if (startProb) {
	        madeChange = true;
	        if (startProb >= 100) {
	            probDec = probDec || 100;
	        }
	        if (probDec <= 0) {
	            probDec = startProb;
	        }
	        while (madeChange && startProb > 0) {
	            madeChange = false;
	            t++;
	            for (i = 0; i < map.width; i++) {
	                for (j = 0; j < map.height; j++) {
	                    if (spawnMap.get(i, j) == t - 1) {
	                        for (dir = 0; dir < 4; dir++) {
	                            x2 = i + DIRS$4[dir][0];
	                            y2 = j + DIRS$4[dir][1];
	                            if (spawnMap.hasXY(x2, y2) &&
	                                !spawnMap.get(x2, y2) &&
	                                map.rng.chance(startProb) &&
	                                cellIsOk(effect, map, x2, y2, false)) {
	                                spawnMap.set(x2, y2, t);
	                                madeChange = true;
	                                ++count;
	                            }
	                        }
	                    }
	                }
	            }
	            startProb -= probDec;
	        }
	    }
	    return count > 0;
	}
	function clearCells(map, spawnMap, _flags = 0) {
	    let didSomething = false;
	    // const clearAll = (flags & Flags.E_CLEAR_CELL) === Flags.E_CLEAR_CELL;
	    spawnMap.forEach((v, i, j) => {
	        if (!v)
	            return;
	        // if (clearAll) {
	        map.clearTile(i, j);
	        // } else {
	        //     if (flags & Flags.E_CLEAR_GAS) {
	        //         cell.clearDepth(Flags.Depth.GAS);
	        //     }
	        //     if (flags & Flags.E_CLEAR_LIQUID) {
	        //         cell.clearDepth(Flags.Depth.LIQUID);
	        //     }
	        //     if (flags & Flags.E_CLEAR_SURFACE) {
	        //         cell.clearDepth(Flags.Depth.SURFACE);
	        //     }
	        //     if (flags & Flags.E_CLEAR_GROUND) {
	        //         cell.clearDepth(Flags.Depth.GROUND);
	        //     }
	        // }
	        didSomething = true;
	    });
	    return didSomething;
	}
	function evacuateCreatures(map, blockingMap) {
	    let didSomething = false;
	    map.eachActor((a) => {
	        if (!blockingMap.get(a.x, a.y))
	            return;
	        const loc = map.rng.matchingLocNear(a.x, a.y, (x, y) => {
	            if (!map.hasXY(x, y))
	                return false;
	            if (blockingMap.get(x, y))
	                return false;
	            return !map.forbidsActor(x, y, a);
	        });
	        if (loc && loc[0] >= 0 && loc[1] >= 0) {
	            a.y = loc[0];
	            a.y = loc[1];
	            // map.redrawXY(loc[0], loc[1]);
	            didSomething = true;
	        }
	    });
	    return didSomething;
	}
	function evacuateItems(map, blockingMap) {
	    let didSomething = false;
	    map.eachItem((i) => {
	        if (!blockingMap.get(i.x, i.y))
	            return;
	        const loc = map.rng.matchingLocNear(i.x, i.y, (x, y) => {
	            if (!map.hasXY(x, y))
	                return false;
	            if (blockingMap.get(x, y))
	                return false;
	            return !map.forbidsItem(x, y, i);
	        });
	        if (loc && loc[0] >= 0 && loc[1] >= 0) {
	            i.x = loc[0];
	            i.y = loc[1];
	            // map.redrawXY(loc[0], loc[1]);
	            didSomething = true;
	        }
	    });
	    return didSomething;
	}

	var index$4 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		get Flags () { return Flags$2; },
		chance: chance,
		chanceAction: chanceAction,
		clearCells: clearCells,
		computeSpawnMap: computeSpawnMap,
		evacuateCreatures: evacuateCreatures,
		evacuateItems: evacuateItems,
		feature: feature,
		featureFeature: featureFeature,
		features: features,
		install: install$3,
		installType: installType,
		make: make$1,
		makeArray: makeArray,
		mapDisruptedBy: mapDisruptedBy,
		spread: spread,
		spreadFeature: spreadFeature,
		tile: tile,
		tileAction: tileAction,
		types: types
	});

	const hordes = [];
	function installHorde(config) {
	    const info = {};
	    info.id = config.id || config.leader;
	    info.leader = config.leader;
	    info.make = config.make || {};
	    info.members = {};
	    if (config.members) {
	        Object.entries(config.members).forEach(([key, value]) => {
	            let member = {};
	            if (typeof value === 'object' &&
	                ('count' in value || 'make' in value)) {
	                member.count = make$6(value.count || 1);
	                member.make = value.make || {};
	            }
	            else {
	                // @ts-ignore
	                member.count = make$6(value);
	            }
	            info.members[key] = member;
	        });
	    }
	    info.tags = [];
	    if (config.tags) {
	        if (typeof config.tags === 'string') {
	            config.tags = config.tags.split(/[:|,]/g).map((t) => t.trim());
	        }
	        info.tags = config.tags;
	    }
	    info.frequency = make$2(config.frequency);
	    info.flags = 0;
	    info.requiredTile = config.requiredTile || null;
	    info.feature = config.feature ? make$1(config.feature) : null;
	    info.blueprint = config.blueprint || null;
	    hordes.push(info);
	    return info;
	}
	function pickHorde(depth, rules, rng) {
	    rng = rng || random$1;
	    let tagMatch;
	    if (typeof rules === 'string') {
	        tagMatch = makeMatch(rules);
	    }
	    else if ('id' in rules) {
	        return hordes.find((h) => h.id === rules.id) || null;
	    }
	    else {
	        tagMatch = makeMatch(rules);
	    }
	    const choices = hordes.filter((horde) => tagMatch(horde.tags));
	    if (choices.length == 0)
	        return null;
	    const freq = choices.map((info) => info.frequency(depth));
	    const choice = rng.weighted(freq);
	    return choices[choice] || null;
	}
	function spawnHorde(info, map, x = -1, y = -1, opts = {}) {
	    // Leader info
	    opts.canSpawn = opts.canSpawn || TRUE;
	    opts.rng = opts.rng || map.rng;
	    opts.machine = opts.machine || 0;
	    const leader = _spawnLeader(info, map, x, y, opts);
	    if (!leader)
	        return null;
	    _spawnMembers(info, leader, map, opts);
	    return leader;
	}
	function _spawnLeader(info, map, x, y, opts) {
	    const leader = {
	        id: info.leader,
	        make: info.make,
	        x,
	        y,
	        machine: opts.machine || 0,
	    };
	    if (x >= 0 && y >= 0) {
	        if (!map.canSpawnActor(x, y, leader))
	            return null;
	    }
	    else {
	        [x, y] = _pickLeaderLoc(leader, map, opts) || [-1, -1];
	        if (x < 0 || y < 0) {
	            return null;
	        }
	    }
	    // pre-placement stuff?  machine? effect?
	    if (!_addLeader(leader, map, x, y)) {
	        return null;
	    }
	    return leader;
	}
	function _addLeader(leader, map, x, y, _opts) {
	    return map.addActor(x, y, leader);
	}
	function _addMember(member, map, x, y, leader, _opts) {
	    member.leader = leader;
	    return map.addActor(x, y, member);
	}
	function _spawnMembers(horde, leader, map, opts) {
	    const entries = Object.entries(horde.members);
	    if (entries.length == 0)
	        return 0;
	    let count = 0;
	    entries.forEach(([kindId, config]) => {
	        const count = config.count.value(opts.rng);
	        for (let i = 0; i < count; ++i) {
	            _spawnMember(kindId, config, map, leader, opts);
	        }
	    });
	    return count;
	}
	function _spawnMember(id, member, map, leader, opts) {
	    const instance = {
	        id,
	        make: member.make,
	        x: -1,
	        y: -1,
	        machine: leader.machine,
	    };
	    const [x, y] = _pickMemberLoc(instance, map, leader, opts) || [-1, -1];
	    if (x < 0 || y < 0) {
	        return null;
	    }
	    // pre-placement stuff?  machine? effect?
	    if (!_addMember(instance, map, x, y, leader)) {
	        return null;
	    }
	    return instance;
	}
	function _pickLeaderLoc(leader, map, opts) {
	    let loc = opts.rng.matchingLoc(map.width, map.height, (x, y) => {
	        if (!map.hasXY(x, y))
	            return false;
	        if (map.hasActor(x, y))
	            return false; // Brogue kills existing actors, but lets do this instead
	        if (!opts.canSpawn(x, y))
	            return false;
	        if (!map.canSpawnActor(x, y, leader))
	            return false;
	        // const cell = map.cell(x, y);
	        // if (leader.avoidsCell(cell)) return false;
	        // if (Map.isHallway(map, x, y)) {
	        //     return false;
	        // }
	        return true;
	    });
	    return loc;
	}
	function _pickMemberLoc(actor, map, leader, opts) {
	    let loc = opts.rng.matchingLocNear(leader.x, leader.y, (x, y) => {
	        if (!map.hasXY(x, y))
	            return false;
	        if (map.hasActor(x, y))
	            return false;
	        // if (map.fov.isAnyKindOfVisible(x, y)) return false;
	        if (!map.canSpawnActor(x, y, actor))
	            return false;
	        if (!opts.canSpawn(x, y))
	            return false;
	        return true;
	    });
	    return loc;
	}

	const items = [];
	function installItem(config, cfg) {
	    const info = {};
	    if (typeof config === 'string') {
	        info.id = config;
	        if (!cfg)
	            throw new Error('Need a configuration.');
	        config = cfg;
	    }
	    else {
	        info.id = config.id;
	    }
	    info.make = config.make || {};
	    info.tags = [];
	    if (config.tags) {
	        if (typeof config.tags === 'string') {
	            config.tags = config.tags.split(/[:|,]/g).map((t) => t.trim());
	        }
	        info.tags = config.tags;
	    }
	    info.frequency = make$2(config.frequency || 100);
	    info.flags = 0;
	    info.requiredTile = config.requiredTile || null;
	    info.feature = config.feature || null;
	    info.blueprint = config.blueprint || null;
	    items.push(info);
	    return info;
	}
	function pickItem(depth, tagRules, rng) {
	    rng = rng || random$1;
	    if (typeof tagRules !== 'string' && 'id' in tagRules) {
	        // @ts-ignore
	        return items.find((i) => i.id === tagRules.id) || null;
	    }
	    tagRules = typeof tagRules === 'string' ? tagRules : tagRules.tags;
	    const tagMatch = makeMatch(tagRules);
	    const choices = items.filter((item) => tagMatch(item.tags));
	    if (choices.length == 0)
	        return null;
	    const freq = choices.map((info) => info.frequency(depth));
	    const choice = rng.weighted(freq);
	    return choices[choice] || null;
	}
	function makeItem(info) {
	    return {
	        id: info.id,
	        make: info.make,
	        x: -1,
	        y: -1,
	    };
	}
	function getItemInfo(id) {
	    return items.find((i) => i.id === id);
	}

	const DIRS$1 = DIRS$4;
	function loadSite(site, cells, tiles) {
	    const w = site.width;
	    const h = site.height;
	    cells.forEach((line, j) => {
	        if (j >= h)
	            return;
	        for (let i = 0; i < w && i < line.length; ++i) {
	            const ch = line[i];
	            const tile = tiles[ch] || 'FLOOR';
	            site.setTile(i, j, tile);
	        }
	    });
	}
	// export function attachRoom(
	//     map: GWU.grid.NumGrid,
	//     roomGrid: GWU.grid.NumGrid,
	//     room: TYPES.Room,
	//     opts: TYPES.DigInfo
	// ) {
	//     // console.log('attachRoom');
	//     const doorSites = room.hall ? room.hall.doors : room.doors;
	//     const site = new SITE.GridSite(map);
	//     // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
	//     for (let i = 0; i < SITE.SEQ.length; i++) {
	//         const x = Math.floor(SITE.SEQ[i] / map.height);
	//         const y = SITE.SEQ[i] % map.height;
	//         if (!(map.get(x, y) == SITE.NOTHING)) continue;
	//         const dir = directionOfDoorSite(site, x, y);
	//         if (dir != GWU.xy.NO_DIRECTION) {
	//             const oppDir = (dir + 2) % 4;
	//             const door = doorSites[oppDir];
	//             if (!door) continue;
	//             const offsetX = x - door[0];
	//             const offsetY = y - door[1];
	//             if (door[0] != -1 && roomFitsAt(map, roomGrid, offsetX, offsetY)) {
	//                 // TYPES.Room fits here.
	//                 GWU.grid.offsetZip(
	//                     map,
	//                     roomGrid,
	//                     offsetX,
	//                     offsetY,
	//                     (_d, _s, i, j) => {
	//                         map[i][j] = opts.room.tile || SITE.FLOOR;
	//                     }
	//                 );
	//                 attachDoor(map, room, opts, x, y, oppDir);
	//                 // door[0] = -1;
	//                 // door[1] = -1;
	//                 room.translate(offsetX, offsetY);
	//                 return true;
	//             }
	//         }
	//     }
	//     return false;
	// }
	// export function attachDoor(
	//     map: GWU.grid.NumGrid,
	//     room: TYPES.Room,
	//     opts: TYPES.DigInfo,
	//     x: number,
	//     y: number,
	//     dir: number
	// ) {
	//     if (opts.door === 0) return; // no door at all
	//     const tile = opts.door || SITE.DOOR;
	//     map[x][y] = tile; // Door site.
	//     // most cases...
	//     if (!room.hall || !(room.hall.width > 1) || room.hall.dir !== dir) {
	//         return;
	//     }
	//     if (dir === GWU.utils.UP || dir === GWU.utils.DOWN) {
	//         let didSomething = true;
	//         let k = 1;
	//         while (didSomething) {
	//             didSomething = false;
	//             if (map.get(x - k, y) === 0) {
	//                 if (map.get(x - k, y - 1) && map.get(x - k, y + 1)) {
	//                     map[x - k][y] = tile;
	//                     didSomething = true;
	//                 }
	//             }
	//             if (map.get(x + k, y) === 0) {
	//                 if (map.get(x + k, y - 1) && map.get(x + k, y + 1)) {
	//                     map[x + k][y] = tile;
	//                     didSomething = true;
	//                 }
	//             }
	//             ++k;
	//         }
	//     } else {
	//         let didSomething = true;
	//         let k = 1;
	//         while (didSomething) {
	//             didSomething = false;
	//             if (map.get(x, y - k) === 0) {
	//                 if (map.get(x - 1, y - k) && map.get(x + 1, y - k)) {
	//                     map[x][y - k] = opts.door;
	//                     didSomething = true;
	//                 }
	//             }
	//             if (map.get(x, y + k) === 0) {
	//                 if (map.get(x - 1, y + k) && map.get(x + 1, y + k)) {
	//                     map[x][y + k] = opts.door;
	//                     didSomething = true;
	//                 }
	//             }
	//             ++k;
	//         }
	//     }
	// }
	// export function roomFitsAt(
	//     map: GWU.grid.NumGrid,
	//     roomGrid: GWU.grid.NumGrid,
	//     roomToSiteX: number,
	//     roomToSiteY: number
	// ) {
	//     let xRoom, yRoom, xSite, ySite, i, j;
	//     // console.log('roomFitsAt', roomToSiteX, roomToSiteY);
	//     for (xRoom = 0; xRoom < roomGrid.width; xRoom++) {
	//         for (yRoom = 0; yRoom < roomGrid.height; yRoom++) {
	//             if (roomGrid[xRoom][yRoom]) {
	//                 xSite = xRoom + roomToSiteX;
	//                 ySite = yRoom + roomToSiteY;
	//                 for (i = xSite - 1; i <= xSite + 1; i++) {
	//                     for (j = ySite - 1; j <= ySite + 1; j++) {
	//                         if (
	//                             !map.hasXY(i, j) ||
	//                             map.isBoundaryXY(i, j) ||
	//                             !(map.get(i, j) === SITE.NOTHING)
	//                         ) {
	//                             // console.log('- NO');
	//                             return false;
	//                         }
	//                     }
	//                 }
	//             }
	//         }
	//     }
	//     // console.log('- YES');
	//     return true;
	// }
	// If the indicated tile is a wall on the room stored in grid, and it could be the site of
	// a door out of that room, then return the outbound direction that the door faces.
	// Otherwise, return def.NO_DIRECTION.
	function directionOfDoorSite(site, x, y) {
	    let dir, solutionDir;
	    let newX, newY, oppX, oppY;
	    solutionDir = NO_DIRECTION;
	    for (dir = 0; dir < 4; dir++) {
	        newX = x + DIRS$1[dir][0];
	        newY = y + DIRS$1[dir][1];
	        oppX = x - DIRS$1[dir][0];
	        oppY = y - DIRS$1[dir][1];
	        if (site.hasXY(oppX, oppY) &&
	            site.hasXY(newX, newY) &&
	            site.isFloor(oppX, oppY)) {
	            // This grid cell would be a valid tile on which to place a door that, facing outward, points dir.
	            if (solutionDir != NO_DIRECTION) {
	                // Already claimed by another direction; no doors here!
	                return NO_DIRECTION;
	            }
	            solutionDir = dir;
	        }
	    }
	    return solutionDir;
	}
	function chooseRandomDoorSites(site) {
	    let i, j, k, newX, newY;
	    let dir;
	    let doorSiteFailed;
	    const DOORS = [[], [], [], []];
	    // const grid = GWU.grid.alloc(sourceGrid.width, sourceGrid.height);
	    // grid.copy(sourceGrid);
	    const h = site.height;
	    const w = site.width;
	    for (i = 0; i < w; i++) {
	        for (j = 0; j < h; j++) {
	            if (site.isDiggable(i, j)) {
	                dir = directionOfDoorSite(site, i, j);
	                if (dir != NO_DIRECTION) {
	                    // Trace a ray 10 spaces outward from the door site to make sure it doesn't intersect the room.
	                    // If it does, it's not a valid door site.
	                    newX = i + DIRS$4[dir][0];
	                    newY = j + DIRS$4[dir][1];
	                    doorSiteFailed = false;
	                    for (k = 0; k < 10 && site.hasXY(newX, newY) && !doorSiteFailed; k++) {
	                        if (site.isSet(newX, newY)) {
	                            doorSiteFailed = true;
	                        }
	                        newX += DIRS$4[dir][0];
	                        newY += DIRS$4[dir][1];
	                    }
	                    if (!doorSiteFailed) {
	                        DOORS[dir].push([i, j]);
	                    }
	                }
	            }
	        }
	    }
	    let doorSites = [];
	    // Pick four doors, one in each direction, and store them in doorSites[dir].
	    for (dir = 0; dir < 4; dir++) {
	        const loc = site.rng.item(DOORS[dir]) || [-1, -1];
	        doorSites[dir] = [loc[0], loc[1]];
	    }
	    // GWU.grid.free(grid);
	    return doorSites;
	}
	// export function forceRoomAtMapLoc(
	//     map: GWU.grid.NumGrid,
	//     xy: GWU.xy.Loc,
	//     roomGrid: GWU.grid.NumGrid,
	//     room: TYPES.Room,
	//     opts: TYPES.DigConfig
	// ) {
	//     // console.log('forceRoomAtMapLoc', xy);
	//     const site = new SITE.GridSite(map);
	//     // Slide room across map, in a random but predetermined order, until the room matches up with a wall.
	//     for (let i = 0; i < SITE.SEQ.length; i++) {
	//         const x = Math.floor(SITE.SEQ[i] / map.height);
	//         const y = SITE.SEQ[i] % map.height;
	//         if (roomGrid[x][y]) continue;
	//         const dir = directionOfDoorSite(site, x, y);
	//         if (dir != GWU.xy.NO_DIRECTION) {
	//             const dx = xy[0] - x;
	//             const dy = xy[1] - y;
	//             if (roomFitsAt(map, roomGrid, dx, dy)) {
	//                 GWU.grid.offsetZip(map, roomGrid, dx, dy, (_d, _s, i, j) => {
	//                     map[i][j] = opts.room.tile || SITE.FLOOR;
	//                 });
	//                 if (opts.room.door !== false) {
	//                     const door =
	//                         opts.room.door === true || !opts.room.door
	//                             ? SITE.DOOR
	//                             : opts.room.door;
	//                     map[xy[0]][xy[1]] = door; // Door site.
	//                 }
	//                 // TODO - Update doors - we may have to erase one...
	//                 room.translate(dx, dy);
	//                 return true;
	//             }
	//         }
	//     }
	//     return false;
	// }
	// export function attachRoomAtMapDoor(
	//     map: GWU.grid.NumGrid,
	//     mapDoors: GWU.xy.Loc[],
	//     roomGrid: GWU.grid.NumGrid,
	//     room: TYPES.Room,
	//     opts: TYPES.DigInfo
	// ): boolean | GWU.xy.Loc[] {
	//     const doorIndexes = site.rng.sequence(mapDoors.length);
	//     // console.log('attachRoomAtMapDoor', mapDoors.join(', '));
	//     // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
	//     for (let i = 0; i < doorIndexes.length; i++) {
	//         const index = doorIndexes[i];
	//         const door = mapDoors[index];
	//         if (!door) continue;
	//         const x = door[0];
	//         const y = door[1];
	//         if (attachRoomAtXY(map, x, y, roomGrid, room, opts)) {
	//             return true;
	//         }
	//     }
	//     return false;
	// }
	// function attachRoomAtXY(
	//     map: GWU.grid.NumGrid,
	//     x: number,
	//     y: number,
	//     roomGrid: GWU.grid.NumGrid,
	//     room: TYPES.Room,
	//     opts: TYPES.DigInfo
	// ): boolean | GWU.xy.Loc[] {
	//     const doorSites = room.hall ? room.hall.doors : room.doors;
	//     const dirs = site.rng.sequence(4);
	//     // console.log('attachRoomAtXY', x, y, doorSites.join(', '));
	//     for (let dir of dirs) {
	//         const oppDir = (dir + 2) % 4;
	//         const door = doorSites[oppDir];
	//         if (!door) continue;
	//         if (
	//             door[0] != -1 &&
	//             roomFitsAt(map, roomGrid, x - door[0], y - door[1])
	//         ) {
	//             // dungeon.debug("attachRoom: ", x, y, oppDir);
	//             // TYPES.Room fits here.
	//             const offX = x - door[0];
	//             const offY = y - door[1];
	//             GWU.grid.offsetZip(map, roomGrid, offX, offY, (_d, _s, i, j) => {
	//                 map[i][j] = opts.room.tile || SITE.FLOOR;
	//             });
	//             attachDoor(map, room, opts, x, y, oppDir);
	//             room.translate(offX, offY);
	//             // const newDoors = doorSites.map((site) => {
	//             //     const x0 = site[0] + offX;
	//             //     const y0 = site[1] + offY;
	//             //     if (x0 == x && y0 == y) return [-1, -1] as GWU.xy.Loc;
	//             //     return [x0, y0] as GWU.xy.Loc;
	//             // });
	//             return true;
	//         }
	//     }
	//     return false;
	// }
	function fillCostGrid(source, costGrid) {
	    costGrid.update((_v, x, y) => source.isPassable(x, y) ? 1 : OBSTRUCTION);
	}
	function siteDisruptedByXY(site, x, y, options = {}) {
	    options.offsetX ??= 0;
	    options.offsetY ??= 0;
	    options.machine ??= 0;
	    if (arcCount(x, y, (i, j) => {
	        return site.isPassable(i, j);
	    }) <= 1)
	        return false;
	    const blockingGrid = alloc(site.width, site.height);
	    blockingGrid.set(x, y, 1);
	    const result = siteDisruptedBy(site, blockingGrid, options);
	    free(blockingGrid);
	    return result;
	}
	function siteDisruptedBy(site, blockingGrid, options = {}) {
	    options.offsetX ??= 0;
	    options.offsetY ??= 0;
	    options.machine ??= 0;
	    const walkableGrid = alloc(site.width, site.height);
	    let disrupts = false;
	    // Get all walkable locations after lake added
	    forRect(site.width, site.height, (i, j) => {
	        const blockingX = i + options.offsetX;
	        const blockingY = j + options.offsetY;
	        if (blockingGrid.get(blockingX, blockingY)) {
	            if (site.isStairs(i, j)) {
	                disrupts = true;
	            }
	        }
	        else if (site.isPassable(i, j) &&
	            (site.getMachine(i, j) == 0 ||
	                site.getMachine(i, j) == options.machine)) {
	            walkableGrid.set(i, j, 1);
	        }
	    });
	    if (options.updateWalkable) {
	        if (!options.updateWalkable(walkableGrid)) {
	            return true;
	        }
	    }
	    let first = true;
	    for (let i = 0; i < walkableGrid.width && !disrupts; ++i) {
	        for (let j = 0; j < walkableGrid.height && !disrupts; ++j) {
	            if (walkableGrid.get(i, j) == 1) {
	                if (first) {
	                    walkableGrid.floodFill(i, j, 1, 2);
	                    first = false;
	                }
	                else {
	                    disrupts = true;
	                }
	            }
	        }
	    }
	    // console.log('WALKABLE GRID');
	    // walkableGrid.dump();
	    free(walkableGrid);
	    return disrupts;
	}
	function siteDisruptedSize(site, blockingGrid, blockingToMapX = 0, blockingToMapY = 0) {
	    const walkableGrid = alloc(site.width, site.height);
	    let disrupts = 0;
	    // Get all walkable locations after lake added
	    forRect(site.width, site.height, (i, j) => {
	        const lakeX = i + blockingToMapX;
	        const lakeY = j + blockingToMapY;
	        if (blockingGrid.get(lakeX, lakeY)) {
	            if (site.isStairs(i, j)) {
	                disrupts = site.width * site.height;
	            }
	        }
	        else if (site.isPassable(i, j)) {
	            walkableGrid.set(i, j, 1);
	        }
	    });
	    if (disrupts)
	        return disrupts;
	    let first = true;
	    let nextId = 2;
	    let minSize = site.width * site.height;
	    for (let i = 0; i < walkableGrid.width; ++i) {
	        for (let j = 0; j < walkableGrid.height; ++j) {
	            if (walkableGrid.get(i, j) == 1) {
	                const disrupted = walkableGrid.floodFill(i, j, 1, nextId++);
	                minSize = Math.min(minSize, disrupted);
	                if (first) {
	                    first = false;
	                }
	                else {
	                    disrupts = minSize;
	                }
	            }
	        }
	    }
	    // console.log('WALKABLE GRID');
	    // walkableGrid.dump();
	    free(walkableGrid);
	    return disrupts;
	}
	function computeDistanceMap(site, distanceMap, originX, originY, _maxDistance) {
	    distanceMap.reset(site.width, site.height);
	    distanceMap.setGoal(originX, originY);
	    distanceMap.calculate((x, y) => {
	        if (!site.hasXY(x, y))
	            return OBSTRUCTION;
	        if (site.isPassable(x, y))
	            return OK;
	        if (site.blocksDiagonal(x, y))
	            return OBSTRUCTION;
	        return BLOCKED;
	    }, false);
	}
	function clearInteriorFlag(site, machine) {
	    for (let i = 0; i < site.width; i++) {
	        for (let j = 0; j < site.height; j++) {
	            if (site.getMachine(i, j) == machine && !site.needsMachine(i, j)) {
	                site.setMachine(i, j, 0);
	            }
	        }
	    }
	}

	function analyze(map, updateChokeCounts = true) {
	    updateLoopiness(map);
	    updateChokepoints(map, updateChokeCounts);
	}
	/////////////////////////////////////////////////////
	/////////////////////////////////////////////////////
	// TODO - Move to Map?
	function updateChokepoints(map, updateCounts) {
	    const blockMap = alloc(map.width, map.height);
	    const grid = alloc(map.width, map.height);
	    for (let i = 0; i < map.width; i++) {
	        for (let j = 0; j < map.height; j++) {
	            if (map.blocksDiagonal(i, j)) {
	                blockMap.set(i, j, 2);
	            }
	            else if ((map.blocksPathing(i, j) || map.blocksMove(i, j)) &&
	                !map.isSecretDoor(i, j)) {
	                // cell.flags &= ~Flags.Cell.IS_IN_LOOP;
	                blockMap.set(i, j, 1);
	            }
	            else {
	                // cell.flags |= Flags.Cell.IS_IN_LOOP;
	                blockMap.set(i, j, 0);
	            }
	        }
	    }
	    let passableArcCount;
	    // done finding loops; now flag chokepoints
	    for (let i = 1; i < blockMap.width - 1; i++) {
	        for (let j = 1; j < blockMap.height - 1; j++) {
	            map.clearChokepoint(i, j);
	            if (!blockMap.get(i, j)) {
	                if (!map.isInLoop(i, j)) {
	                    passableArcCount = 0;
	                    for (let dir = 0; dir < 8; dir++) {
	                        const oldX = i + CLOCK_DIRS[(dir + 7) % 8][0];
	                        const oldY = j + CLOCK_DIRS[(dir + 7) % 8][1];
	                        const newX = i + CLOCK_DIRS[dir][0];
	                        const newY = j + CLOCK_DIRS[dir][1];
	                        if ((map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
	                            blockMap.get(newX, newY) > 0) !=
	                            (map.hasXY(oldX, oldY) && // RUT.Map.makeValidXy(map, oldXy) &&
	                                blockMap.get(oldX, oldY) > 0)) {
	                            if (++passableArcCount > 2) {
	                                if ((blockMap.get(i - 1, j) &&
	                                    blockMap.get(i + 1, j)) ||
	                                    (blockMap.get(i, j - 1) &&
	                                        blockMap.get(i, j + 1))) {
	                                    map.setChokepoint(i, j);
	                                }
	                                break;
	                            }
	                        }
	                    }
	                }
	                const left = i - 1;
	                const right = i + 1;
	                const up = j - 1;
	                const down = j + 1;
	                if (blockMap.get(i, up) && blockMap.get(i, down)) {
	                    if (!blockMap.get(left, j) && !blockMap.get(right, j)) {
	                        if (!blockMap.get(left, up) ||
	                            !blockMap.get(left, down) ||
	                            !blockMap.get(right, up) ||
	                            !blockMap.get(right, down)) {
	                            map.setGateSite(i, j);
	                        }
	                    }
	                }
	                else if (blockMap.get(left, j) && blockMap.get(right, j)) {
	                    if (!blockMap.get(i, up) && !blockMap.get(i, down)) {
	                        if (!blockMap.get(left, up) ||
	                            !blockMap.get(left, down) ||
	                            !blockMap.get(right, up) ||
	                            !blockMap.get(right, down)) {
	                            map.setGateSite(i, j);
	                        }
	                    }
	                }
	            }
	        }
	    }
	    if (updateCounts) {
	        // Done finding chokepoints; now create a chokepoint map.
	        // The chokepoint map is a number for each passable tile. If the tile is a chokepoint,
	        // then the number indicates the number of tiles that would be rendered unreachable if the
	        // chokepoint were blocked. If the tile is not a chokepoint, then the number indicates
	        // the number of tiles that would be rendered unreachable if the nearest exit chokepoint
	        // were blocked.
	        // The cost of all of this is one depth-first flood-fill per open point that is adjacent to a chokepoint.
	        // Start by setting the chokepoint values really high, and roping off room machines.
	        for (let i = 0; i < map.width; i++) {
	            for (let j = 0; j < map.height; j++) {
	                map.setChokeCount(i, j, 30000);
	                // Not sure why this was done in Brogue
	                // if (map.cell(i, j).flags.cell & Flags.Cell.IS_IN_ROOM_MACHINE) {
	                //     passMap[i][j] = 0;
	                // }
	            }
	        }
	        // Scan through and find a chokepoint next to an open point.
	        for (let i = 0; i < map.width; i++) {
	            for (let j = 0; j < map.height; j++) {
	                if (!blockMap.get(i, j) && map.isChokepoint(i, j)) {
	                    for (let dir = 0; dir < 4; dir++) {
	                        const newX = i + DIRS$4[dir][0];
	                        const newY = j + DIRS$4[dir][1];
	                        if (map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
	                            !blockMap.get(newX, newY) &&
	                            !map.isChokepoint(newX, newY)) {
	                            // OK, (newX, newY) is an open point and (i, j) is a chokepoint.
	                            // Pretend (i, j) is blocked by changing passMap, and run a flood-fill cell count starting on (newX, newY).
	                            // Keep track of the flooded region in grid[][].
	                            grid.fill(0);
	                            blockMap.set(i, j, 1);
	                            let cellCount = floodFillCount(map, grid, blockMap, newX, newY);
	                            blockMap.set(i, j, 0);
	                            // CellCount is the size of the region that would be obstructed if the chokepoint were blocked.
	                            // CellCounts less than 4 are not useful, so we skip those cases.
	                            if (cellCount >= 4) {
	                                // Now, on the chokemap, all of those flooded cells should take the lesser of their current value or this resultant number.
	                                for (let i2 = 0; i2 < grid.width; i2++) {
	                                    for (let j2 = 0; j2 < grid.height; j2++) {
	                                        if (grid.get(i2, j2) &&
	                                            cellCount <
	                                                map.getChokeCount(i2, j2)) {
	                                            map.setChokeCount(i2, j2, cellCount);
	                                            // map.clearGateSite(i2, j2);
	                                        }
	                                    }
	                                }
	                                // The chokepoint itself should also take the lesser of its current value or the flood count.
	                                if (cellCount < map.getChokeCount(i, j)) {
	                                    map.setChokeCount(i, j, cellCount);
	                                    // map.setGateSite(i, j);
	                                }
	                            }
	                        }
	                    }
	                }
	            }
	        }
	    }
	    free(blockMap);
	    free(grid);
	}
	// Assumes it is called with respect to a passable (startX, startY), and that the same is not already included in results.
	// Returns 10000 if the area included an area machine.
	function floodFillCount(map, results, blockMap, startX, startY) {
	    function getCount(x, y) {
	        let count = 1;
	        if (map.isAreaMachine(x, y)) {
	            // huh?
	            count = 10000;
	        }
	        return count;
	    }
	    let count = 0;
	    const todo = [[startX, startY]];
	    const free = [];
	    while (todo.length) {
	        const item = todo.pop();
	        free.push(item);
	        const x = item[0];
	        const y = item[1];
	        if (results.get(x, y))
	            continue;
	        results.set(x, y, 1);
	        count += getCount(x, y);
	        for (let dir = 0; dir < 4; dir++) {
	            const newX = x + DIRS$4[dir][0];
	            const newY = y + DIRS$4[dir][1];
	            if (map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
	                !blockMap.get(newX, newY) &&
	                !results.get(newX, newY)) {
	                const item = free.pop() || [-1, -1];
	                item[0] = newX;
	                item[1] = newY;
	                todo.push(item);
	            }
	        }
	    }
	    return Math.min(count, 10000);
	}
	////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////
	function updateLoopiness(map) {
	    resetLoopiness(map);
	    checkLoopiness(map);
	    cleanLoopiness(map);
	}
	function resetLoopiness(map) {
	    forRect(map.width, map.height, (x, y) => {
	        if ((map.blocksPathing(x, y) || map.blocksMove(x, y)) &&
	            !map.isSecretDoor(x, y)) {
	            map.clearInLoop(x, y);
	            // cell.flags.cell &= ~Flags.Cell.IS_IN_LOOP;
	            // passMap[i][j] = false;
	        }
	        else {
	            map.setInLoop(x, y);
	            // cell.flags.cell |= Flags.Cell.IS_IN_LOOP;
	            // passMap[i][j] = true;
	        }
	    });
	}
	function checkLoopiness(map) {
	    let inString;
	    let newX, newY, dir, sdir;
	    let numStrings, maxStringLength, currentStringLength;
	    const todo = alloc(map.width, map.height, 1);
	    let tryAgain = true;
	    while (tryAgain) {
	        tryAgain = false;
	        todo.forEach((v, x, y) => {
	            if (!v)
	                return;
	            // const cell = map.cell(x, y);
	            todo.set(x, y, 0);
	            if (!map.isInLoop(x, y)) {
	                return;
	            }
	            // find an unloopy neighbor to start on
	            for (sdir = 0; sdir < 8; sdir++) {
	                newX = x + CLOCK_DIRS[sdir][0];
	                newY = y + CLOCK_DIRS[sdir][1];
	                if (!map.hasXY(newX, newY))
	                    continue;
	                // const cell = map.cell(newX, newY);
	                if (!map.isInLoop(newX, newY)) {
	                    break;
	                }
	            }
	            if (sdir == 8) {
	                // no unloopy neighbors
	                return; // leave cell loopy
	            }
	            // starting on this unloopy neighbor,
	            // work clockwise and count up:
	            // (a) the number of strings of loopy neighbors, and
	            // (b) the length of the longest such string.
	            numStrings = maxStringLength = currentStringLength = 0;
	            inString = false;
	            for (dir = sdir; dir < sdir + 8; dir++) {
	                newX = x + CLOCK_DIRS[dir % 8][0];
	                newY = y + CLOCK_DIRS[dir % 8][1];
	                if (!map.hasXY(newX, newY))
	                    continue;
	                // const newCell = map.cell(newX, newY);
	                if (map.isInLoop(newX, newY)) {
	                    currentStringLength++;
	                    if (!inString) {
	                        numStrings++;
	                        inString = true;
	                        if (numStrings > 1) {
	                            break; // more than one string here; leave loopy
	                        }
	                    }
	                }
	                else if (inString) {
	                    if (currentStringLength > maxStringLength) {
	                        maxStringLength = currentStringLength;
	                    }
	                    currentStringLength = 0;
	                    inString = false;
	                }
	            }
	            if (inString && currentStringLength > maxStringLength) {
	                maxStringLength = currentStringLength;
	            }
	            if (numStrings == 1 && maxStringLength <= 4) {
	                map.clearInLoop(x, y);
	                // cell.clearCellFlag(Flags.Cell.IS_IN_LOOP);
	                // console.log(x, y, numStrings, maxStringLength);
	                // map.dump((c) =>
	                //     c.hasCellFlag(Flags.Cell.IS_IN_LOOP) ? '*' : ' '
	                // );
	                for (dir = 0; dir < 8; dir++) {
	                    newX = x + CLOCK_DIRS[dir][0];
	                    newY = y + CLOCK_DIRS[dir][1];
	                    if (map.hasXY(newX, newY) && map.isInLoop(newX, newY)) {
	                        todo.set(newX, newY, 1);
	                        tryAgain = true;
	                    }
	                }
	            }
	        });
	    }
	}
	function fillInnerLoopGrid(map, grid) {
	    for (let x = 0; x < map.width; ++x) {
	        for (let y = 0; y < map.height; ++y) {
	            // const cell = map.cell(x, y);
	            if (map.isInLoop(x, y)) {
	                grid.set(x, y, 1);
	            }
	            else if (x > 0 && y > 0) {
	                // const up = map.cell(x, y - 1);
	                // const left = map.cell(x - 1, y);
	                if (map.isInLoop(x, y - 1) &&
	                    map.isInLoop(x - 1, y)
	                // up.flags.cell & Flags.Cell.IS_IN_LOOP &&
	                // left.flags.cell & Flags.Cell.IS_IN_LOOP
	                ) {
	                    grid.set(x, y, 1);
	                }
	            }
	        }
	    }
	}
	function cleanLoopiness(map) {
	    // remove extraneous loop markings
	    const grid = alloc(map.width, map.height);
	    fillInnerLoopGrid(map, grid);
	    // const xy = { x: 0, y: 0 };
	    let designationSurvives;
	    for (let i = 0; i < grid.width; i++) {
	        for (let j = 0; j < grid.height; j++) {
	            // const cell = map.cell(i, j);
	            if (map.isInLoop(i, j)) {
	                designationSurvives = false;
	                for (let dir = 0; dir < 8; dir++) {
	                    let newX = i + CLOCK_DIRS[dir][0];
	                    let newY = j + CLOCK_DIRS[dir][1];
	                    if (map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, xy, newX, newY) &&
	                        !grid.get(newX, newY) &&
	                        !map.isInLoop(newX, newY)) {
	                        designationSurvives = true;
	                        break;
	                    }
	                }
	                if (!designationSurvives) {
	                    grid.set(i, j, 1);
	                    map.clearInLoop(i, j);
	                    // map.cell(i, j).flags.cell &= ~Flags.Cell.IS_IN_LOOP;
	                }
	            }
	        }
	    }
	    free(grid);
	}
	////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////

	const Flags$1 = make$4([
	    'CHOKEPOINT',
	    'GATE_SITE',
	    'IN_LOOP',
	    'IN_MACHINE',
	    'IN_AREA_MACHINE',
	    'IMPREGNABLE',
	]);
	class Site {
	    constructor(width, height, opts = {}) {
	        this.rng = random$1;
	        this.items = [];
	        this.actors = [];
	        this.depth = 0;
	        this.machineCount = 0;
	        this.tileFactory = opts.tiles || tileFactory;
	        this._tiles = alloc(width, height);
	        this._doors = alloc(width, height);
	        this._flags = alloc(width, height);
	        this._machine = alloc(width, height);
	        this._chokeCounts = alloc(width, height);
	        if (opts.rng) {
	            this.rng = opts.rng;
	        }
	    }
	    free() {
	        free(this._tiles);
	        free(this._doors);
	        free(this._flags);
	        free(this._machine);
	        free(this._chokeCounts);
	    }
	    clear() {
	        this._tiles.fill(0);
	        this._doors.fill(0);
	        this._flags.fill(0);
	        this._machine.fill(0);
	        this._chokeCounts.fill(0);
	        // this.depth = 0;
	        this.machineCount = 0;
	    }
	    dump(fmt) {
	        if (fmt) {
	            return this._tiles.dump(fmt);
	        }
	        this._tiles.dump((c) => this.tileFactory.getTile(c).ch || '?');
	    }
	    // drawInto(buffer: GWU.canvas.Buffer): void {
	    //     buffer.blackOut();
	    //     this.tiles.forEach((t, x, y) => {
	    //         const tile = GWM.tile.get(t);
	    //         buffer.drawSprite(x, y, tile.sprite);
	    //     });
	    // }
	    copy(other) {
	        this.depth = other.depth;
	        this.machineCount = other.machineCount;
	        this._tiles.copy(other._tiles);
	        this._doors.copy(other._doors);
	        this._machine.copy(other._machine);
	        this._flags.copy(other._flags);
	        this._chokeCounts.copy(other._chokeCounts);
	        this.rng = other.rng;
	        this.items = other.items.slice();
	        this.actors = other.actors.slice();
	    }
	    copyTiles(other, offsetX = 0, offsetY = 0) {
	        forRect(this.width, this.height, (x, y) => {
	            const otherX = x - offsetX;
	            const otherY = y - offsetY;
	            const v = other._tiles.get(otherX, otherY);
	            if (!v)
	                return;
	            this._tiles.set(x, y, v);
	        });
	    }
	    setSeed(seed) {
	        this.rng.seed(seed);
	    }
	    get width() {
	        return this._tiles.width;
	    }
	    get height() {
	        return this._tiles.height;
	    }
	    hasXY(x, y) {
	        return this._tiles.hasXY(x, y);
	    }
	    isBoundaryXY(x, y) {
	        return this._tiles.isBoundaryXY(x, y);
	    }
	    isPassable(x, y) {
	        return (this.isFloor(x, y) ||
	            this.isDoor(x, y) ||
	            this.isBridge(x, y) ||
	            this.isStairs(x, y) ||
	            this.isShallow(x, y));
	    }
	    isNothing(x, y) {
	        return this.hasTile(x, y, 'NOTHING');
	    }
	    isDiggable(x, y) {
	        return this.hasTile(x, y, 'NOTHING') || this.hasTile(x, y, 'WALL');
	    }
	    isProtected(_x, _y) {
	        return false;
	    }
	    isFloor(x, y) {
	        return this.hasTile(x, y, 'FLOOR');
	    }
	    isDoor(x, y) {
	        return this.hasTile(x, y, 'DOOR');
	    }
	    isSecretDoor(x, y) {
	        return this.hasTile(x, y, 'SECRET_DOOR');
	    }
	    isBridge(x, y) {
	        return this.hasTile(x, y, 'BRIDGE');
	    }
	    isWall(x, y) {
	        return this.blocksMove(x, y) && this.blocksVision(x, y);
	    }
	    blocksMove(x, y) {
	        return (this.tileFactory.getTile(this._tiles.get(x, y)).blocksMove ||
	            false);
	    }
	    blocksDiagonal(x, y) {
	        return (this.tileFactory.getTile(this._tiles.get(x, y)).blocksDiagonal ||
	            false);
	    }
	    blocksPathing(x, y) {
	        return (this.isNothing(x, y) ||
	            this.isWall(x, y) ||
	            this.isDeep(x, y) ||
	            this.isStairs(x, y));
	    }
	    blocksVision(x, y) {
	        return (this.tileFactory.getTile(this._tiles.get(x, y)).blocksVision ||
	            false);
	    }
	    blocksItems(x, y) {
	        return (this.blocksPathing(x, y) ||
	            this.isChokepoint(x, y) ||
	            this.isInLoop(x, y) ||
	            this.isInMachine(x, y));
	        // site.hasCellFlag(
	        //     x,
	        //     y,
	        //     GWM.flags.Cell.IS_CHOKEPOINT |
	        //         GWM.flags.Cell.IS_IN_LOOP |
	        //         GWM.flags.Cell.IS_IN_MACHINE
	        // );
	    }
	    blocksEffects(x, y) {
	        return this.isWall(x, y);
	    }
	    isStairs(x, y) {
	        return (this.hasTile(x, y, 'UP_STAIRS') || this.hasTile(x, y, 'DOWN_STAIRS'));
	    }
	    isDeep(x, y) {
	        return this.hasTile(x, y, 'DEEP');
	    }
	    isShallow(x, y) {
	        return this.hasTile(x, y, 'SHALLOW');
	    }
	    isAnyLiquid(x, y) {
	        return this.isDeep(x, y) || this.isShallow(x, y);
	    }
	    isSet(x, y) {
	        return (this._tiles.get(x, y) || 0) > 0;
	    }
	    tileBlocksMove(tile) {
	        return this.tileFactory.blocksMove(tile);
	    }
	    setTile(x, y, tile, _opts = {}) {
	        // if (tile instanceof GWM.tile.Tile) {
	        //     tile = tile.index;
	        // }
	        if (!this._tiles.hasXY(x, y))
	            return false;
	        if (typeof tile === 'string') {
	            tile = this.tileFactory.tileId(tile);
	        }
	        // priority checks...
	        this._tiles.set(x, y, tile);
	        return true;
	    }
	    clearTile(x, y) {
	        if (this.hasXY(x, y)) {
	            this._tiles.set(x, y, 0);
	        }
	    }
	    getTile(x, y) {
	        const id = this._tiles.get(x, y) || 0;
	        return this.tileFactory.getTile(id);
	    }
	    makeImpregnable(x, y) {
	        this._flags._data[x][y] |= Flags$1.IMPREGNABLE;
	        // site.setCellFlag(x, y, GWM.flags.Cell.IMPREGNABLE);
	    }
	    isImpregnable(x, y) {
	        return !!(this._flags.get(x, y) & Flags$1.IMPREGNABLE);
	    }
	    hasTile(x, y, tile) {
	        if (typeof tile === 'string') {
	            tile = this.tileFactory.tileId(tile);
	        }
	        return this.hasXY(x, y) && this._tiles.get(x, y) == tile;
	    }
	    getChokeCount(x, y) {
	        return this._chokeCounts.get(x, y) || 0;
	    }
	    setChokeCount(x, y, count) {
	        this._chokeCounts.set(x, y, count);
	    }
	    getFlags(x, y) {
	        return this._flags.get(x, y) || 0;
	    }
	    setChokepoint(x, y) {
	        this._flags._data[x][y] |= Flags$1.CHOKEPOINT;
	    }
	    isChokepoint(x, y) {
	        return !!(this._flags.get(x, y) & Flags$1.CHOKEPOINT);
	    }
	    clearChokepoint(x, y) {
	        this._flags._data[x][y] &= ~Flags$1.CHOKEPOINT;
	    }
	    setGateSite(x, y) {
	        this._flags._data[x][y] |= Flags$1.GATE_SITE;
	    }
	    isGateSite(x, y) {
	        return !!(this._flags.get(x, y) & Flags$1.GATE_SITE);
	    }
	    clearGateSite(x, y) {
	        this._flags._data[x][y] &= ~Flags$1.GATE_SITE;
	    }
	    setInLoop(x, y) {
	        this._flags._data[x][y] |= Flags$1.IN_LOOP;
	    }
	    isInLoop(x, y) {
	        return !!(this._flags.get(x, y) & Flags$1.IN_LOOP);
	    }
	    clearInLoop(x, y) {
	        this._flags._data[x][y] &= ~Flags$1.IN_LOOP;
	    }
	    analyze(updateChokeCounts = true) {
	        analyze(this, updateChokeCounts);
	    }
	    snapshot() {
	        const other = new Site(this.width, this.height);
	        other.copy(this);
	        return other;
	    }
	    restore(snapshot) {
	        this.copy(snapshot);
	    }
	    nextMachineId() {
	        this.machineCount += 1;
	        return this.machineCount;
	    }
	    setMachine(x, y, id, isRoom) {
	        this._machine.set(x, y, id);
	        const flag = isRoom ? Flags$1.IN_MACHINE : Flags$1.IN_AREA_MACHINE;
	        this._flags._data[x][y] |= flag;
	    }
	    isAreaMachine(x, y) {
	        return !!(this._machine.get(x, y) & Flags$1.IN_AREA_MACHINE);
	    }
	    isInMachine(x, y) {
	        return this._machine.get(x, y) > 0;
	    }
	    getMachine(x, y) {
	        return this._machine.get(x, y) || 0;
	    }
	    needsMachine(_x, _y) {
	        // site.hasCellFlag(
	        //     i,
	        //     j,
	        //     GWM.flags.Cell.IS_WIRED | GWM.flags.Cell.IS_CIRCUIT_BREAKER
	        // );
	        return false;
	    }
	    updateDoorDirs() {
	        this._doors.update((_v, x, y) => {
	            return directionOfDoorSite(this, x, y);
	        });
	    }
	    getDoorDir(x, y) {
	        return this._doors.get(x, y) || 0;
	    }
	    // tileBlocksMove(tile: number): boolean {
	    //     return (
	    //         tile === WALL ||
	    //         tile === DEEP ||
	    //         tile === IMPREGNABLE ||
	    //         tile === DIG.NOTHING
	    //     );
	    // }
	    isOccupied(x, y) {
	        return this.hasActor(x, y) || this.hasItem(x, y);
	    }
	    canSpawnActor(x, y, _actor) {
	        // const cell = map.cell(x, y);
	        // if (actor.avoidsCell(cell)) return false;
	        // if (Map.isHallway(map, x, y)) {
	        //     return false;
	        // }
	        return this.isFloor(x, y);
	    }
	    eachActor(cb) {
	        this.actors.forEach(cb);
	    }
	    addActor(x, y, a) {
	        a.x = x;
	        a.y = y;
	        this.actors.push(a);
	        return this.actors.length;
	    }
	    getActor(i) {
	        return this.actors[i];
	    }
	    // removeActor(a: HORDE.ActorInstance): void {
	    //     GWU.arrayDelete(this.actors, a);
	    // }
	    forbidsActor(x, y, _a) {
	        return !this.isFloor(x, y);
	    }
	    hasActor(x, y) {
	        return this.actors.some((a) => a.x === x && a.y === y);
	    }
	    eachItem(cb) {
	        this.items.forEach(cb);
	    }
	    addItem(x, y, i) {
	        i.x = x;
	        i.y = y;
	        this.items.push(i);
	        return this.items.length;
	    }
	    getItem(i) {
	        return this.items[i];
	    }
	    // removeItem(i: ITEM.ItemInstance): void {
	    //     GWU.arrayDelete(this.items, i);
	    // }
	    forbidsItem(x, y, _i) {
	        return !this.isFloor(x, y);
	    }
	    hasItem(x, y) {
	        return this.items.some((i) => i.x === x && i.y === y);
	    }
	}

	class NullLogger {
	    onDigFirstRoom() { }
	    onRoomCandidate() { }
	    onRoomFailed() { }
	    onRoomSuccess() { }
	    onLoopsAdded() { }
	    onLakesAdded() { }
	    onBridgesAdded() { }
	    onStairsAdded() { }
	    onBuildError() { }
	    onBlueprintPick() { }
	    onBlueprintCandidates() { }
	    onBlueprintStart() { }
	    onBlueprintInterior() { }
	    onBlueprintFail() { }
	    onBlueprintSuccess() { }
	    onStepStart() { }
	    onStepCandidates() { }
	    onStepInstanceSuccess() { }
	    onStepInstanceFail() { }
	    onStepSuccess() { }
	    onStepFail() { }
	}

	const Fl$1 = fl;
	var StepFlags;
	(function (StepFlags) {
	    StepFlags[StepFlags["BS_OUTSOURCE_ITEM_TO_MACHINE"] = Fl$1(1)] = "BS_OUTSOURCE_ITEM_TO_MACHINE";
	    StepFlags[StepFlags["BS_BUILD_VESTIBULE"] = Fl$1(2)] = "BS_BUILD_VESTIBULE";
	    StepFlags[StepFlags["BS_ADOPT_ITEM"] = Fl$1(3)] = "BS_ADOPT_ITEM";
	    StepFlags[StepFlags["BS_BUILD_AT_ORIGIN"] = Fl$1(4)] = "BS_BUILD_AT_ORIGIN";
	    StepFlags[StepFlags["BS_PERMIT_BLOCKING"] = Fl$1(5)] = "BS_PERMIT_BLOCKING";
	    StepFlags[StepFlags["BS_TREAT_AS_BLOCKING"] = Fl$1(6)] = "BS_TREAT_AS_BLOCKING";
	    StepFlags[StepFlags["BS_NEAR_ORIGIN"] = Fl$1(7)] = "BS_NEAR_ORIGIN";
	    StepFlags[StepFlags["BS_FAR_FROM_ORIGIN"] = Fl$1(8)] = "BS_FAR_FROM_ORIGIN";
	    StepFlags[StepFlags["BS_IN_VIEW_OF_ORIGIN"] = Fl$1(9)] = "BS_IN_VIEW_OF_ORIGIN";
	    StepFlags[StepFlags["BS_IN_PASSABLE_VIEW_OF_ORIGIN"] = Fl$1(10)] = "BS_IN_PASSABLE_VIEW_OF_ORIGIN";
	    StepFlags[StepFlags["BS_HORDE_TAKES_ITEM"] = Fl$1(11)] = "BS_HORDE_TAKES_ITEM";
	    StepFlags[StepFlags["BS_HORDE_SLEEPING"] = Fl$1(12)] = "BS_HORDE_SLEEPING";
	    StepFlags[StepFlags["BS_HORDE_FLEEING"] = Fl$1(13)] = "BS_HORDE_FLEEING";
	    StepFlags[StepFlags["BS_HORDES_DORMANT"] = Fl$1(14)] = "BS_HORDES_DORMANT";
	    StepFlags[StepFlags["BS_ITEM_IS_KEY"] = Fl$1(15)] = "BS_ITEM_IS_KEY";
	    StepFlags[StepFlags["BS_ITEM_IDENTIFIED"] = Fl$1(16)] = "BS_ITEM_IDENTIFIED";
	    StepFlags[StepFlags["BS_ITEM_PLAYER_AVOIDS"] = Fl$1(17)] = "BS_ITEM_PLAYER_AVOIDS";
	    StepFlags[StepFlags["BS_EVERYWHERE"] = Fl$1(18)] = "BS_EVERYWHERE";
	    StepFlags[StepFlags["BS_ALTERNATIVE"] = Fl$1(19)] = "BS_ALTERNATIVE";
	    StepFlags[StepFlags["BS_ALTERNATIVE_2"] = Fl$1(20)] = "BS_ALTERNATIVE_2";
	    StepFlags[StepFlags["BS_BUILD_IN_WALLS"] = Fl$1(21)] = "BS_BUILD_IN_WALLS";
	    StepFlags[StepFlags["BS_BUILD_ANYWHERE_ON_LEVEL"] = Fl$1(22)] = "BS_BUILD_ANYWHERE_ON_LEVEL";
	    StepFlags[StepFlags["BS_REPEAT_UNTIL_NO_PROGRESS"] = Fl$1(23)] = "BS_REPEAT_UNTIL_NO_PROGRESS";
	    StepFlags[StepFlags["BS_IMPREGNABLE"] = Fl$1(24)] = "BS_IMPREGNABLE";
	    StepFlags[StepFlags["BS_NO_BLOCK_ORIGIN"] = Fl$1(25)] = "BS_NO_BLOCK_ORIGIN";
	    // TODO - BS_ALLOW_IN_HALLWAY instead?
	    StepFlags[StepFlags["BS_NOT_IN_HALLWAY"] = Fl$1(27)] = "BS_NOT_IN_HALLWAY";
	    StepFlags[StepFlags["BS_ALLOW_BOUNDARY"] = Fl$1(28)] = "BS_ALLOW_BOUNDARY";
	    StepFlags[StepFlags["BS_SKELETON_KEY"] = Fl$1(29)] = "BS_SKELETON_KEY";
	    StepFlags[StepFlags["BS_KEY_DISPOSABLE"] = Fl$1(30)] = "BS_KEY_DISPOSABLE";
	})(StepFlags || (StepFlags = {}));
	class BuildStep {
	    // next: null = null;
	    // id = 'n/a';
	    constructor(cfg = {}) {
	        this.tile = null;
	        this.flags = 0;
	        this.pad = 0;
	        this.item = null;
	        this.horde = null;
	        this.feature = null;
	        this.chance = 0;
	        this.index = -1;
	        this.tile = cfg.tile || null;
	        if (cfg.flags) {
	            this.flags = from$1(StepFlags, cfg.flags);
	        }
	        if (cfg.pad) {
	            this.pad = cfg.pad;
	        }
	        this.count = make$6(cfg.count || 1);
	        if (typeof cfg.item === 'string') {
	            this.item = { tags: cfg.item };
	        }
	        else if (cfg.item) {
	            // @ts-ignore
	            this.item = Object.assign({ tags: '' }, cfg.item);
	            if (this.item.feature) {
	                this.item.feature = make$1(this.item.feature);
	            }
	        }
	        else {
	            this.item = null;
	        }
	        if (cfg.horde) {
	            if (cfg.horde === true) {
	                this.horde = { tags: '' };
	            }
	            else if (typeof cfg.horde === 'string') {
	                this.horde = { tags: cfg.horde };
	            }
	            else {
	                // @ts-ignore
	                this.horde = Object.assign({ tags: '' }, cfg.horde);
	                if (this.horde.feature) {
	                    this.horde.feature = make$1(this.horde.feature);
	                }
	            }
	        }
	        else {
	            this.horde = null;
	        }
	        if (cfg.feature) {
	            this.feature = make$1(cfg.feature);
	        }
	        else {
	            this.feature = null;
	        }
	        if (this.item && this.flags & StepFlags.BS_ADOPT_ITEM) {
	            throw new Error('Cannot have blueprint step with item and BS_ADOPT_ITEM.');
	        }
	        if (this.buildAtOrigin && this.count.hi > 1) {
	            throw new Error('Cannot have count > 1 for step with BS_BUILD_AT_ORIGIN.');
	        }
	        if (this.buildAtOrigin && this.repeatUntilNoProgress) {
	            throw new Error('Cannot have BS_BUILD_AT_ORIGIN and BS_REPEAT_UNTIL_NO_PROGRESS together in a build step.');
	        }
	        if (this.hordeTakesItem && !this.horde) {
	            throw new Error('Cannot have BS_HORDE_TAKES_ITEM without a horde configured.');
	        }
	    }
	    get allowBoundary() {
	        return !!(this.flags & StepFlags.BS_ALLOW_BOUNDARY);
	    }
	    get notInHallway() {
	        return !!(this.flags & StepFlags.BS_NOT_IN_HALLWAY);
	    }
	    get buildInWalls() {
	        return !!(this.flags & StepFlags.BS_BUILD_IN_WALLS);
	    }
	    get buildAnywhere() {
	        return !!(this.flags & StepFlags.BS_BUILD_ANYWHERE_ON_LEVEL);
	    }
	    get repeatUntilNoProgress() {
	        return !!(this.flags & StepFlags.BS_REPEAT_UNTIL_NO_PROGRESS);
	    }
	    get permitBlocking() {
	        return !!(this.flags & StepFlags.BS_PERMIT_BLOCKING);
	    }
	    get treatAsBlocking() {
	        return !!(this.flags &
	            (StepFlags.BS_TREAT_AS_BLOCKING | StepFlags.BS_NO_BLOCK_ORIGIN));
	    }
	    get noBlockOrigin() {
	        return !!(this.flags & StepFlags.BS_NO_BLOCK_ORIGIN);
	    }
	    get adoptItem() {
	        return !!(this.flags & StepFlags.BS_ADOPT_ITEM);
	    }
	    get itemIsKey() {
	        return !!(this.flags & StepFlags.BS_ITEM_IS_KEY);
	    }
	    get keyIsDisposable() {
	        return !!(this.flags & StepFlags.BS_KEY_DISPOSABLE);
	    }
	    get outsourceItem() {
	        return !!(this.flags & StepFlags.BS_OUTSOURCE_ITEM_TO_MACHINE);
	    }
	    get impregnable() {
	        return !!(this.flags & StepFlags.BS_IMPREGNABLE);
	    }
	    get buildVestibule() {
	        return !!(this.flags & StepFlags.BS_BUILD_VESTIBULE);
	    }
	    get hordeTakesItem() {
	        return !!(this.flags & StepFlags.BS_HORDE_TAKES_ITEM);
	    }
	    get generateEverywhere() {
	        return !!(this.flags &
	            StepFlags.BS_EVERYWHERE &
	            ~StepFlags.BS_BUILD_AT_ORIGIN);
	    }
	    get buildAtOrigin() {
	        return !!(this.flags & StepFlags.BS_BUILD_AT_ORIGIN);
	    }
	    get buildsInstances() {
	        return !!(this.feature ||
	            this.tile ||
	            this.item ||
	            this.horde ||
	            this.adoptItem);
	    }
	    // makeItem(data: BuildData): ITEM.ItemInfo | null {
	    //     if (!this.item) return null;
	    //     return ITEM.pick(data.depth, this.item);
	    // }
	    // cellIsCandidate(
	    //     builder: BuildData,
	    //     blueprint: Blueprint,
	    //     x: number,
	    //     y: number,
	    //     distanceBound: [number, number]
	    // ) {
	    //     return cellIsCandidate(builder, blueprint, this, x, y, distanceBound);
	    // }
	    // distanceBound(builder: BuildData): [number, number] {
	    //     return calcDistanceBound(builder, this);
	    // }
	    // updateViewMap(builder: BuildData): void {
	    //     updateViewMap(builder, this);
	    // }
	    // build(
	    //     builder: BuildData,
	    //     blueprint: Blueprint,
	    //     adoptedItem: GWM.item.Item | null
	    // ): boolean {
	    //     return buildStep(builder, blueprint, this, adoptedItem);
	    // }
	    markCandidates(data, candidates, distanceBound = [0, 10000]) {
	        updateViewMap(data, this);
	        const blueprint = data.blueprint;
	        let count = 0;
	        candidates.update((_v, i, j) => {
	            const candidateType = cellIsCandidate(data, blueprint, this, i, j, distanceBound);
	            if (candidateType === CandidateType.OK) {
	                count++;
	            }
	            return candidateType;
	        });
	        return count;
	    }
	    makePersonalSpace(_data, x, y, candidates) {
	        let count = 0;
	        if (this.pad < 1)
	            return 0; // do not mark occupied
	        // or...
	        // if (this.buildEverywhere) return 0;  // do not mark occupied
	        for (let i = x - this.pad; i <= x + this.pad; i++) {
	            for (let j = y - this.pad; j <= y + this.pad; j++) {
	                if (candidates.hasXY(i, j)) {
	                    if (candidates.get(i, j) == 1) {
	                        candidates.set(i, j, 0);
	                        ++count;
	                    }
	                    // builder.occupied[i][j] = 1;
	                }
	            }
	        }
	        return count;
	    }
	    toString() {
	        let parts = [];
	        if (this.tile) {
	            parts.push('tile: ' + this.tile);
	        }
	        if (this.feature) {
	            parts.push('effect: ' + JSON.stringify(this.feature));
	        }
	        if (this.item) {
	            parts.push('item: ' + JSON.stringify(this.item));
	        }
	        if (this.horde) {
	            parts.push('horde: ' + JSON.stringify(this.horde));
	        }
	        if (this.pad > 1) {
	            parts.push('pad: ' + this.pad);
	        }
	        if (this.count.lo > 1 || this.count.hi > 1) {
	            parts.push('count: ' + this.count.toString());
	        }
	        if (this.chance) {
	            parts.push('chance: ' + this.chance);
	        }
	        if (this.flags) {
	            parts.push('flags: ' + toString(StepFlags, this.flags));
	        }
	        return '{ ' + parts.join(', ') + ' }';
	    }
	}
	function updateViewMap(builder, buildStep) {
	    if (buildStep.flags &
	        (StepFlags.BS_IN_VIEW_OF_ORIGIN |
	            StepFlags.BS_IN_PASSABLE_VIEW_OF_ORIGIN)) {
	        const site = builder.site;
	        if (buildStep.flags & StepFlags.BS_IN_PASSABLE_VIEW_OF_ORIGIN) {
	            const fov = new FOV({
	                isBlocked: (x, y) => {
	                    return site.blocksPathing(x, y) || site.blocksVision(x, y);
	                },
	                hasXY: (x, y) => {
	                    return site.hasXY(x, y);
	                },
	            });
	            fov.calculate(builder.originX, builder.originY, 50, (x, y) => {
	                builder.viewMap.set(x, y, 1);
	            });
	        }
	        else {
	            const fov = new FOV({
	                isBlocked: (x, y) => {
	                    return site.blocksVision(x, y);
	                },
	                hasXY: (x, y) => {
	                    return site.hasXY(x, y);
	                },
	            });
	            fov.calculate(builder.originX, builder.originY, 50, (x, y) => {
	                builder.viewMap.set(x, y, 1);
	            });
	        }
	        builder.viewMap.set(builder.originX, builder.originY, 1);
	    }
	}
	function calcDistanceBound(builder, buildStep) {
	    const distanceBound = [0, 10000];
	    if (buildStep.flags & StepFlags.BS_NEAR_ORIGIN) {
	        distanceBound[1] = builder.distance25;
	    }
	    if (buildStep.flags & StepFlags.BS_FAR_FROM_ORIGIN) {
	        distanceBound[0] = builder.distance75;
	    }
	    return distanceBound;
	}
	var CandidateType;
	(function (CandidateType) {
	    CandidateType[CandidateType["NOT_CANDIDATE"] = 0] = "NOT_CANDIDATE";
	    CandidateType[CandidateType["OK"] = 1] = "OK";
	    CandidateType[CandidateType["IN_HALLWAY"] = 2] = "IN_HALLWAY";
	    CandidateType[CandidateType["ON_BOUNDARY"] = 3] = "ON_BOUNDARY";
	    CandidateType[CandidateType["MUST_BE_ORIGIN"] = 4] = "MUST_BE_ORIGIN";
	    CandidateType[CandidateType["NOT_ORIGIN"] = 5] = "NOT_ORIGIN";
	    CandidateType[CandidateType["OCCUPIED"] = 6] = "OCCUPIED";
	    CandidateType[CandidateType["NOT_IN_VIEW"] = 7] = "NOT_IN_VIEW";
	    CandidateType[CandidateType["TOO_FAR"] = 8] = "TOO_FAR";
	    CandidateType[CandidateType["TOO_CLOSE"] = 9] = "TOO_CLOSE";
	    CandidateType[CandidateType["INVALID_WALL"] = 10] = "INVALID_WALL";
	    CandidateType[CandidateType["BLOCKED"] = 11] = "BLOCKED";
	    CandidateType[CandidateType["FAILED"] = 12] = "FAILED";
	})(CandidateType || (CandidateType = {}));
	function cellIsCandidate(builder, blueprint, buildStep, x, y, distanceBound) {
	    const site = builder.site;
	    // No building in the hallway if it's prohibited.
	    // This check comes before the origin check, so an area machine will fail altogether
	    // if its origin is in a hallway and the feature that must be built there does not permit as much.
	    if (buildStep.notInHallway &&
	        arcCount(x, y, (i, j) => site.hasXY(i, j) && site.isPassable(i, j)) > 1) {
	        return CandidateType.IN_HALLWAY;
	    }
	    // if (buildStep.noBlockOrigin) {
	    //     let ok = true;
	    //     GWU.xy.eachNeighbor(
	    //         x,
	    //         y,
	    //         (nx, ny) => {
	    //             if (nx === builder.originX && ny === builder.originY) {
	    //                 ok = false;
	    //             }
	    //         },
	    //         true
	    //     );
	    //     if (!ok) return false;
	    // }
	    // No building along the perimeter of the level if it's prohibited.
	    if ((x == 0 || x == site.width - 1 || y == 0 || y == site.height - 1) &&
	        !buildStep.allowBoundary) {
	        return CandidateType.ON_BOUNDARY;
	    }
	    // The origin is a candidate if the feature is flagged to be built at the origin.
	    // If it's a room, the origin (i.e. doorway) is otherwise NOT a candidate.
	    if (buildStep.buildAtOrigin) {
	        if (x == builder.originX && y == builder.originY)
	            return CandidateType.OK;
	        return CandidateType.MUST_BE_ORIGIN;
	    }
	    else if (blueprint.isRoom &&
	        x == builder.originX &&
	        y == builder.originY) {
	        return CandidateType.NOT_ORIGIN;
	    }
	    // No building in another feature's personal space!
	    if (builder.occupied.get(x, y)) {
	        return CandidateType.OCCUPIED;
	    }
	    // Must be in the viewmap if the appropriate flag is set.
	    if (buildStep.flags &
	        (StepFlags.BS_IN_VIEW_OF_ORIGIN |
	            StepFlags.BS_IN_PASSABLE_VIEW_OF_ORIGIN) &&
	        !builder.viewMap.get(x, y)) {
	        return CandidateType.NOT_IN_VIEW;
	    }
	    // Do a distance check if the feature requests it.
	    let distance = 10000;
	    if (site.isWall(x, y)) {
	        // Distance is calculated for walls too.
	        eachNeighbor(x, y, (i, j) => {
	            if (!builder.distanceMap.hasXY(i, j))
	                return;
	            if (!site.blocksPathing(i, j) &&
	                distance > builder.distanceMap.getDistance(i, j) + 1) {
	                distance = builder.distanceMap.getDistance(i, j) + 1;
	            }
	        }, true);
	    }
	    else {
	        distance = builder.distanceMap.getDistance(x, y);
	    }
	    if (distance > distanceBound[1])
	        return CandidateType.TOO_FAR; // distance exceeds max
	    if (distance < distanceBound[0])
	        return CandidateType.TOO_CLOSE;
	    if (buildStep.buildInWalls) {
	        // If we're supposed to build in a wall...
	        const cellMachine = site.getMachine(x, y);
	        if (!builder.interior.get(x, y) &&
	            (!cellMachine || cellMachine == builder.machineNumber) &&
	            site.isWall(x, y)) {
	            let ok = false;
	            let failed = false;
	            // ...and this location is a wall that's not already machined...
	            eachNeighbor(x, y, (newX, newY) => {
	                if (failed)
	                    return;
	                if (!site.hasXY(newX, newY))
	                    return;
	                if (!builder.interior.get(newX, newY) &&
	                    !buildStep.buildAnywhere) {
	                    return;
	                }
	                // ...and it's next to an interior spot or permitted elsewhere and next to passable spot...
	                const neighborMachine = site.getMachine(newX, newY);
	                if (!site.blocksPathing(newX, newY) &&
	                    (!neighborMachine ||
	                        neighborMachine == builder.machineNumber) &&
	                    !(newX == builder.originX && newY == builder.originY)) {
	                    if (buildStep.notInHallway &&
	                        arcCount(newX, newY, (i, j) => site.hasXY(i, j) && site.isPassable(i, j)) > 1) {
	                        // return CandidateType.IN_HALLWAY;
	                        failed = true;
	                        ok = false;
	                    }
	                    else {
	                        ok = true;
	                    }
	                }
	            }, true);
	            return ok ? CandidateType.OK : CandidateType.INVALID_WALL;
	        }
	        return CandidateType.NOT_CANDIDATE;
	    }
	    else if (site.isWall(x, y)) {
	        // Can't build in a wall unless instructed to do so.
	        return CandidateType.INVALID_WALL;
	    }
	    else if (buildStep.buildAnywhere) {
	        if (buildStep.item && site.blocksItems(x, y)) {
	            return CandidateType.BLOCKED;
	        }
	        else {
	            return CandidateType.OK;
	        }
	    }
	    else if (builder.interior.get(x, y)) {
	        return CandidateType.OK;
	    }
	    return CandidateType.FAILED;
	}
	// export function buildStep(
	//     builder: BuildData,
	//     blueprint: Blueprint,
	//     buildStep: BuildStep,
	//     adoptedItem: GWM.item.Item | null
	// ): boolean {
	//     let wantCount = 0;
	//     let builtCount = 0;
	//     const site = builder.site;
	//     const candidates = GWU.grid.alloc(site.width, site.height);
	//     // Figure out the distance bounds.
	//     const distanceBound = calcDistanceBound(builder, buildStep);
	//     buildStep.updateViewMap(builder);
	//     // If the StepFlags.BS_REPEAT_UNTIL_NO_PROGRESS flag is set, repeat until we fail to build the required number of instances.
	//     // Make a master map of candidate locations for this feature.
	//     let qualifyingTileCount = markCandidates(
	//         candidates,
	//         builder,
	//         blueprint,
	//         buildStep,
	//         distanceBound
	//     );
	//     if (!buildStep.generateEverywhere) {
	//         wantCount = buildStep.count.value();
	//     }
	//     if (!qualifyingTileCount || qualifyingTileCount < buildStep.count.lo) {
	//         console.log(
	//             ' - Only %s qualifying tiles - want at least %s.',
	//             qualifyingTileCount,
	//             buildStep.count.lo
	//         );
	//         GWU.grid.free(candidates);
	//         return false;
	//     }
	//     let x = 0,
	//         y = 0;
	//     let success = true;
	//     let didSomething = false;
	//     do {
	//         success = true;
	//         // Find a location for the feature.
	//         if (buildStep.buildAtOrigin) {
	//             // Does the feature want to be at the origin? If so, put it there. (Just an optimization.)
	//             x = builder.originX;
	//             y = builder.originY;
	//         } else {
	//             // Pick our candidate location randomly, and also strike it from
	//             // the candidates map so that subsequent instances of this same feature can't choose it.
	//             [x, y] = site.rng.matchingLoc(
	//                 candidates.width,
	//                 candidates.height,
	//                 (x, y) => candidates[x][y] > 0
	//             );
	//         }
	//         // Don't waste time trying the same place again whether or not this attempt succeeds.
	//         candidates[x][y] = 0;
	//         qualifyingTileCount--;
	//         // Try to build the DF first, if any, since we don't want it to be disrupted by subsequently placed terrain.
	//         if (buildStep.effect) {
	//             success = site.fireEffect(buildStep.effect, x, y);
	//             didSomething = success;
	//         }
	//         // Now try to place the terrain tile, if any.
	//         if (success && buildStep.tile !== -1) {
	//             const tile = GWM.tile.get(buildStep.tile);
	//             if (
	//                 !(buildStep.flags & StepFlags.BS_PERMIT_BLOCKING) &&
	//                 (tile.blocksMove() ||
	//                     buildStep.flags & StepFlags.BS_TREAT_AS_BLOCKING)
	//             ) {
	//                 // Yes, check for blocking.
	//                 success = !SITE.siteDisruptedByXY(site, x, y, {
	//                     machine: site.machineCount,
	//                 });
	//             }
	//             if (success) {
	//                 success = site.setTile(x, y, tile);
	//                 didSomething = didSomething || success;
	//             }
	//         }
	//         // Generate an actor, if necessary
	//         // Generate an item, if necessary
	//         if (success && buildStep.item) {
	//             const item = site.makeRandomItem(buildStep.item);
	//             if (!item) {
	//                 success = false;
	//             }
	//             if (buildStep.flags & StepFlags.BS_ITEM_IS_KEY) {
	//                 item.key = GWM.entity.makeKeyInfo(
	//                     x,
	//                     y,
	//                     !!(buildStep.flags & StepFlags.BS_KEY_DISPOSABLE)
	//                 );
	//             }
	//             if (buildStep.flags & StepFlags.BS_OUTSOURCE_ITEM_TO_MACHINE) {
	//                 success = builder.buildRandom(
	//                     Flags.BP_ADOPT_ITEM,
	//                     -1,
	//                     -1,
	//                     item
	//                 );
	//                 if (success) {
	//                     didSomething = true;
	//                 }
	//             } else {
	//                 success = site.addItem(x, y, item);
	//                 didSomething = didSomething || success;
	//             }
	//         } else if (success && buildStep.flags & StepFlags.BS_ADOPT_ITEM) {
	//             // adopt item if necessary
	//             if (!adoptedItem) {
	//                 GWU.grid.free(candidates);
	//                 throw new Error(
	//                     'Failed to build blueprint because there is no adopted item.'
	//                 );
	//             }
	//             if (buildStep.flags & StepFlags.BS_TREAT_AS_BLOCKING) {
	//                 // Yes, check for blocking.
	//                 success = !SITE.siteDisruptedByXY(site, x, y);
	//             }
	//             if (success) {
	//                 success = site.addItem(x, y, adoptedItem);
	//                 if (success) {
	//                     didSomething = true;
	//                 } else {
	//                     console.log('- failed to add item', x, y);
	//                 }
	//             } else {
	//                 // console.log('- blocks map', x, y);
	//             }
	//         }
	//         if (success && didSomething) {
	//             // OK, if placement was successful, clear some personal space around the feature so subsequent features can't be generated too close.
	//             qualifyingTileCount -= makePersonalSpace(
	//                 builder,
	//                 x,
	//                 y,
	//                 candidates,
	//                 buildStep.pad
	//             );
	//             builtCount++; // we've placed an instance
	//             // Mark the feature location as part of the machine, in case it is not already inside of it.
	//             if (!(blueprint.flags & Flags.BP_NO_INTERIOR_FLAG)) {
	//                 site.setMachine(x, y, builder.machineNumber, blueprint.isRoom);
	//             }
	//             // Mark the feature location as impregnable if requested.
	//             if (buildStep.flags & StepFlags.BS_IMPREGNABLE) {
	//                 site.setCellFlag(x, y, GWM.flags.Cell.IMPREGNABLE);
	//             }
	//         }
	//         // Finished with this instance!
	//     } while (
	//         qualifyingTileCount > 0 &&
	//         (buildStep.generateEverywhere ||
	//             builtCount < wantCount ||
	//             buildStep.flags & StepFlags.BS_REPEAT_UNTIL_NO_PROGRESS)
	//     );
	//     if (success && buildStep.flags & StepFlags.BS_BUILD_VESTIBULE) {
	//         // Generate a door guard machine.
	//         // Try to create a sub-machine that qualifies.
	//         success = builder.buildRandom(
	//             Flags.BP_VESTIBULE,
	//             builder.originX,
	//             builder.originY
	//         );
	//         if (!success) {
	//             // console.log(
	//             //     `Depth ${builder.depth}: Failed to place blueprint ${blueprint.id} because it requires a vestibule and we couldn't place one.`
	//             // );
	//             // failure! abort!
	//             GWU.grid.free(candidates);
	//             return false;
	//         }
	//         ++builtCount;
	//     }
	//     //DEBUG printf("\nFinished feature %i. Here's the candidates map:", feat);
	//     //DEBUG logBuffer(candidates);
	//     success = builtCount > 0;
	//     GWU.grid.free(candidates);
	//     return success;
	// }

	class ConsoleLogger {
	    onDigFirstRoom(site) {
	        console.group('dig first room');
	        site.dump();
	        console.groupEnd();
	    }
	    onRoomCandidate(room, roomSite) {
	        console.group('room candidate: ' + room.toString());
	        roomSite.dump();
	        console.groupEnd();
	    }
	    onRoomFailed(_site, _room, _roomSite, error) {
	        console.log('Room Failed - ', error);
	    }
	    onRoomSuccess(site, room) {
	        console.group('Added Room - ' + room.toString());
	        site.dump();
	        console.groupEnd();
	    }
	    onLoopsAdded(_site) {
	        console.log('loops added');
	    }
	    onLakesAdded(_site) {
	        console.log('lakes added');
	    }
	    onBridgesAdded(_site) {
	        console.log('bridges added');
	    }
	    onStairsAdded(_site) {
	        console.log('stairs added');
	    }
	    //
	    onBuildError(error) {
	        console.log(`onBuildError - error: ${error}`);
	    }
	    onBlueprintPick(data, flags, depth) {
	        console.log(`onBlueprintPick - ${data.blueprint.id}, depth = ${depth}, matchingFlags = ${toString(StepFlags, flags)}`);
	    }
	    onBlueprintCandidates(data) {
	        const label = `onBlueprintCandidates - ${data.blueprint.id}`;
	        console.group(label);
	        data.candidates.dump();
	        console.groupEnd();
	    }
	    onBlueprintStart(data) {
	        console.group(`onBlueprintStart - ${data.blueprint.id} @ ${data.originX},${data.originY} : stepCount: ${data.blueprint.steps.length}, size: [${data.blueprint.size.toString()}], flags: ${toString(StepFlags, data.blueprint.flags)}`);
	    }
	    onBlueprintInterior(data) {
	        console.group(`onBlueprintInterior - ${data.blueprint.id}`);
	        data.interior.dump();
	        console.groupEnd();
	    }
	    onBlueprintFail(data, error) {
	        console.log(`onBlueprintFail - ${data.blueprint.id} @ ${data.originX},${data.originY} : error: ${error}`);
	        console.groupEnd();
	    }
	    onBlueprintSuccess(data) {
	        console.log(`onBlueprintSuccess - ${data.blueprint.id} @ ${data.originX},${data.originY}`);
	        console.groupEnd();
	    }
	    onStepStart(data, step) {
	        console.group(`onStepStart - ${data.blueprint.id}[${data.blueprint.steps.indexOf(step) + 1}/${data.blueprint.steps.length}] @ ${data.originX},${data.originY} : count: [${step.count.toString()}], flags: ${toString(StepFlags, step.flags)}`);
	        console.log(step.toString());
	    }
	    onStepCandidates(data, step, candidates, wantCount) {
	        const haveCount = candidates.count((v) => v == 1);
	        console.log(`onStepCandidates - ${data.blueprint.id}[${data.blueprint.steps.indexOf(step) + 1}/${data.blueprint.steps.length}] @ ${data.originX},${data.originY} : wantCount: ${wantCount}, have: ${haveCount}`);
	        candidates.dump();
	        if (haveCount == 0) {
	            console.log('No candidates - check interior');
	            data.interior.dump();
	        }
	    }
	    onStepInstanceSuccess(_data, _step, x, y) {
	        console.log(`onStepInstance @ ${x},${y}`);
	    }
	    onStepInstanceFail(_data, _step, x, y, error) {
	        console.log(`onStepInstanceFail @ ${x},${y} - error: ${error}`);
	    }
	    onStepSuccess(data, step) {
	        console.log(`onStepSuccess - ${data.blueprint.id}[${data.blueprint.steps.indexOf(step) + 1}/${data.blueprint.steps.length}] @ ${data.originX},${data.originY} : count: [${step.count.toString()}], flags: ${toString(StepFlags, step.flags)}`);
	        console.groupEnd();
	    }
	    onStepFail(data, step, error) {
	        console.log(`onStepFail - ${data.blueprint.id}[${data.blueprint.steps.indexOf(step) + 1}/${data.blueprint.steps.length}] @ ${data.originX},${data.originY} : error : ${error}`);
	        console.groupEnd();
	    }
	}

	// export * from './visualizer';

	var index$3 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		ConsoleLogger: ConsoleLogger,
		NullLogger: NullLogger
	});

	var index$2 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Flags: Flags$1,
		Site: Site,
		TileFactory: TileFactory,
		analyze: analyze,
		blocksMove: blocksMove,
		checkLoopiness: checkLoopiness,
		chooseRandomDoorSites: chooseRandomDoorSites,
		cleanLoopiness: cleanLoopiness,
		clearInteriorFlag: clearInteriorFlag,
		computeDistanceMap: computeDistanceMap,
		default_tiles: default_tiles,
		directionOfDoorSite: directionOfDoorSite,
		fillCostGrid: fillCostGrid,
		fillInnerLoopGrid: fillInnerLoopGrid,
		floodFillCount: floodFillCount,
		getItemInfo: getItemInfo,
		getTile: getTile,
		hordes: hordes,
		installField: installField,
		installFields: installFields,
		installHorde: installHorde,
		installItem: installItem,
		installTile: installTile,
		items: items,
		loadSite: loadSite,
		log: index$3,
		makeItem: makeItem,
		pickHorde: pickHorde,
		pickItem: pickItem,
		resetLoopiness: resetLoopiness,
		siteDisruptedBy: siteDisruptedBy,
		siteDisruptedByXY: siteDisruptedByXY,
		siteDisruptedSize: siteDisruptedSize,
		spawnHorde: spawnHorde,
		tileFactory: tileFactory,
		tileId: tileId,
		updateChokepoints: updateChokepoints,
		updateLoopiness: updateLoopiness
	});

	class Hall extends Bounds {
	    constructor(x, y, width, height) {
	        super(x, y, width, height);
	        this.doors = [];
	    }
	    translate(dx, dy) {
	        this.x += dx;
	        this.y += dy;
	        if (this.doors) {
	            this.doors.forEach((d) => {
	                if (!d)
	                    return;
	                if (d[0] < 0 || d[1] < 0)
	                    return;
	                d[0] += dx;
	                d[1] += dy;
	            });
	        }
	    }
	}
	function makeHall(loc, dirIndex, hallLength, hallWidth = 1) {
	    const dir = DIRS$4[dirIndex];
	    const x = Math.min(loc[0], loc[0] + dir[0] * (hallLength - 1));
	    const y = Math.min(loc[1], loc[1] + dir[1] * (hallLength - 1));
	    const width = Math.abs(dir[0] * hallLength) || hallWidth;
	    const height = Math.abs(dir[1] * hallLength) || hallWidth;
	    return new Hall(x, y, width, height);
	}
	class Room extends Bounds {
	    constructor(x, y, width, height) {
	        super(x, y, width, height);
	        this.doors = [];
	        this.hall = null;
	    }
	    get cx() {
	        return this.x + Math.floor(this.width / 2);
	    }
	    get cy() {
	        return this.y + Math.floor(this.height / 2);
	    }
	    translate(dx, dy) {
	        this.x += dx;
	        this.y += dy;
	        if (this.doors) {
	            this.doors.forEach((d) => {
	                if (!d)
	                    return;
	                if (d[0] < 0 || d[1] < 0)
	                    return;
	                d[0] += dx;
	                d[1] += dy;
	            });
	        }
	        if (this.hall) {
	            this.hall.translate(dx, dy);
	        }
	    }
	}
	// export interface DigInfo {
	//     room: RoomData;
	//     hall: HallData | null;
	//     tries: number;
	//     locs: GWU.xy.Loc[] | null;
	//     door: number;
	// }

	function checkConfig(config, expected = {}) {
	    config = config || {};
	    expected = expected || {};
	    Object.entries(expected).forEach(([key, expect]) => {
	        let have = config[key];
	        if (key === 'tile') {
	            if (have === undefined) {
	                config[key] = expect;
	            }
	            return;
	        }
	        if (expect === true) {
	            // needs to be present
	            if (!have) {
	                throw new Error('Missing required config for room digger: ' + key);
	            }
	        }
	        else if (typeof expect === 'number') {
	            // needs to be a number, this is the default
	            have = have || expect;
	        }
	        else if (Array.isArray(expect)) {
	            have = have || expect;
	        }
	        else {
	            // just set the value
	            have = have || expect;
	        }
	        const range = make$6(have); // throws if invalid
	        config[key] = range;
	    });
	    return config;
	}
	class RoomDigger {
	    constructor(config, expected = {}) {
	        this.options = {};
	        this.doors = [];
	        this._setOptions(config, expected);
	    }
	    _setOptions(config, expected = {}) {
	        this.options = checkConfig(config, expected);
	    }
	    create(site) {
	        const result = this.carve(site);
	        if (result) {
	            if (!result.doors ||
	                result.doors.length == 0 ||
	                result.doors.every((loc) => !loc || loc[0] == -1)) {
	                result.doors = chooseRandomDoorSites(site);
	            }
	        }
	        return result;
	    }
	}
	var rooms = {};
	class ChoiceRoom extends RoomDigger {
	    constructor(config = {}) {
	        super(config, {
	            choices: ['DEFAULT'],
	        });
	    }
	    _setOptions(config, expected = {}) {
	        const choices = config.choices || expected.choices;
	        if (Array.isArray(choices)) {
	            this.randomRoom = (rng) => rng.item(choices);
	        }
	        else if (typeof choices == 'object') {
	            this.randomRoom = (rng) => rng.weighted(choices);
	        }
	        else {
	            throw new Error('Expected choices to be either array of room ids or weighted map - ex: { ROOM_ID: weight }');
	        }
	    }
	    carve(site) {
	        let id = this.randomRoom(site.rng);
	        const room = rooms[id];
	        if (!room) {
	            ERROR('Missing room digger choice: ' + id);
	        }
	        // debug('Chose room: ', id);
	        return room.create(site);
	    }
	}
	function choiceRoom(config, site) {
	    // grid.fill(0);
	    const digger = new ChoiceRoom(config);
	    return digger.create(site);
	}
	class Cavern extends RoomDigger {
	    constructor(config = {}) {
	        super(config, {
	            width: 12,
	            height: 8,
	        });
	    }
	    carve(site) {
	        const width = this.options.width.value(site.rng);
	        const height = this.options.height.value(site.rng);
	        const tile = this.options.tile || 'FLOOR';
	        const blobGrid = alloc(site.width, site.height, 0);
	        const minWidth = Math.floor(0.5 * width); // 6
	        const maxWidth = width;
	        const minHeight = Math.floor(0.5 * height); // 4
	        const maxHeight = height;
	        const blob = new Blob({
	            rng: site.rng,
	            rounds: 5,
	            minWidth: minWidth,
	            minHeight: minHeight,
	            maxWidth: maxWidth,
	            maxHeight: maxHeight,
	            percentSeeded: 55,
	            birthParameters: 'ffffftttt',
	            survivalParameters: 'ffffttttt',
	        });
	        const bounds = blob.carve(blobGrid.width, blobGrid.height, (x, y) => blobGrid.set(x, y, 1));
	        // Position the new cave in the middle of the grid...
	        const destX = Math.floor((site.width - bounds.width) / 2);
	        const dx = destX - bounds.x;
	        const destY = Math.floor((site.height - bounds.height) / 2);
	        const dy = destY - bounds.y;
	        // ...and copy it to the destination.
	        blobGrid.forEach((v, x, y) => {
	            if (v)
	                site.setTile(x + dx, y + dy, tile);
	        });
	        free(blobGrid);
	        return new Room(destX, destY, bounds.width, bounds.height);
	    }
	}
	function cavern(config, site) {
	    // grid.fill(0);
	    const digger = new Cavern(config);
	    return digger.create(site);
	}
	// From BROGUE => This is a special room that appears at the entrance to the dungeon on depth 1.
	class BrogueEntrance extends RoomDigger {
	    constructor(config = {}) {
	        super(config, {
	            width: 20,
	            height: 10,
	        });
	    }
	    carve(site) {
	        const width = this.options.width.value(site.rng);
	        const height = this.options.height.value(site.rng);
	        const tile = this.options.tile || 'FLOOR';
	        const roomWidth = Math.floor(0.4 * width); // 8
	        const roomHeight = height;
	        const roomWidth2 = width;
	        const roomHeight2 = Math.floor(0.5 * height); // 5
	        // ALWAYS start at bottom+center of map
	        const roomX = Math.floor(site.width / 2 - roomWidth / 2 - 1);
	        const roomY = site.height - roomHeight - 2;
	        const roomX2 = Math.floor(site.width / 2 - roomWidth2 / 2 - 1);
	        const roomY2 = site.height - roomHeight2 - 2;
	        forRect(roomX, roomY, roomWidth, roomHeight, (x, y) => site.setTile(x, y, tile));
	        forRect(roomX2, roomY2, roomWidth2, roomHeight2, (x, y) => site.setTile(x, y, tile));
	        const room = new Room(Math.min(roomX, roomX2), Math.min(roomY, roomY2), Math.max(roomWidth, roomWidth2), Math.max(roomHeight, roomHeight2));
	        room.doors[DOWN] = [Math.floor(site.width / 2), site.height - 2];
	        return room;
	    }
	}
	function brogueEntrance(config, site) {
	    // grid.fill(0);
	    const digger = new BrogueEntrance(config);
	    return digger.create(site);
	}
	class Cross extends RoomDigger {
	    constructor(config = {}) {
	        super(config, { width: 12, height: 20 });
	    }
	    carve(site) {
	        const width = this.options.width.value(site.rng);
	        const height = this.options.height.value(site.rng);
	        const tile = this.options.tile || 'FLOOR';
	        const roomWidth = width;
	        const roomWidth2 = Math.max(3, Math.floor((width * site.rng.range(25, 75)) / 100)); // [4,20]
	        const roomHeight = Math.max(3, Math.floor((height * site.rng.range(25, 75)) / 100)); // [2,5]
	        const roomHeight2 = height;
	        const roomX = Math.floor((site.width - roomWidth) / 2);
	        const roomX2 = roomX + site.rng.range(2, Math.max(2, roomWidth - roomWidth2 - 2));
	        const roomY2 = Math.floor((site.height - roomHeight2) / 2);
	        const roomY = roomY2 +
	            site.rng.range(2, Math.max(2, roomHeight2 - roomHeight - 2));
	        forRect(roomX, roomY, roomWidth, roomHeight, (x, y) => site.setTile(x, y, tile));
	        forRect(roomX2, roomY2, roomWidth2, roomHeight2, (x, y) => site.setTile(x, y, tile));
	        return new Room(roomX, roomY2, Math.max(roomWidth, roomWidth2), Math.max(roomHeight, roomHeight2));
	    }
	}
	function cross(config, site) {
	    // grid.fill(0);
	    const digger = new Cross(config);
	    return digger.create(site);
	}
	class SymmetricalCross extends RoomDigger {
	    constructor(config = {}) {
	        super(config, { width: 7, height: 7 });
	    }
	    carve(site) {
	        const width = this.options.width.value(site.rng);
	        const height = this.options.height.value(site.rng);
	        const tile = this.options.tile || 'FLOOR';
	        let minorWidth = Math.max(3, Math.floor((width * site.rng.range(25, 50)) / 100)); // [2,4]
	        // if (height % 2 == 0 && minorWidth > 2) {
	        //     minorWidth -= 1;
	        // }
	        let minorHeight = Math.max(3, Math.floor((height * site.rng.range(25, 50)) / 100)); // [2,3]?
	        // if (width % 2 == 0 && minorHeight > 2) {
	        //     minorHeight -= 1;
	        // }
	        const x = Math.floor((site.width - width) / 2);
	        const y = Math.floor((site.height - minorHeight) / 2);
	        forRect(x, y, width, minorHeight, (x, y) => site.setTile(x, y, tile));
	        const x2 = Math.floor((site.width - minorWidth) / 2);
	        const y2 = Math.floor((site.height - height) / 2);
	        forRect(x2, y2, minorWidth, height, (x, y) => site.setTile(x, y, tile));
	        return new Room(Math.min(x, x2), Math.min(y, y2), Math.max(width, minorWidth), Math.max(height, minorHeight));
	    }
	}
	function symmetricalCross(config, site) {
	    // grid.fill(0);
	    const digger = new SymmetricalCross(config);
	    return digger.create(site);
	}
	class Rectangular extends RoomDigger {
	    constructor(config = {}) {
	        super(config, {
	            width: [3, 6],
	            height: [3, 6],
	        });
	    }
	    carve(site) {
	        const width = this.options.width.value(site.rng);
	        const height = this.options.height.value(site.rng);
	        const tile = this.options.tile || 'FLOOR';
	        const x = Math.floor((site.width - width) / 2);
	        const y = Math.floor((site.height - height) / 2);
	        forRect(x, y, width, height, (x, y) => site.setTile(x, y, tile));
	        return new Room(x, y, width, height);
	    }
	}
	function rectangular(config, site) {
	    // grid.fill(0);
	    const digger = new Rectangular(config);
	    return digger.create(site);
	}
	class Circular extends RoomDigger {
	    constructor(config = {}) {
	        super(config, {
	            radius: [3, 4],
	        });
	    }
	    carve(site) {
	        const radius = this.options.radius.value(site.rng);
	        const tile = this.options.tile || 'FLOOR';
	        const x = Math.floor(site.width / 2);
	        const y = Math.floor(site.height / 2);
	        if (radius > 1) {
	            forCircle(x, y, radius, (x, y) => site.setTile(x, y, tile));
	        }
	        return new Room(x - radius, y - radius, radius * 2 + 1, radius * 2 + 1);
	    }
	}
	function circular(config, site) {
	    // grid.fill(0);
	    const digger = new Circular(config);
	    return digger.create(site);
	}
	class BrogueDonut extends RoomDigger {
	    constructor(config = {}) {
	        super(config, {
	            radius: [5, 10],
	            ringMinWidth: 3,
	            holeMinSize: 3,
	            holeChance: 50,
	        });
	    }
	    carve(site) {
	        const radius = this.options.radius.value(site.rng);
	        const ringMinWidth = this.options.ringMinWidth.value(site.rng);
	        const holeMinSize = this.options.holeMinSize.value(site.rng);
	        const tile = this.options.tile || 'FLOOR';
	        const x = Math.floor(site.width / 2);
	        const y = Math.floor(site.height / 2);
	        forCircle(x, y, radius, (x, y) => site.setTile(x, y, tile));
	        if (radius > ringMinWidth + holeMinSize &&
	            site.rng.chance(this.options.holeChance.value(site.rng))) {
	            forCircle(x, y, site.rng.range(holeMinSize, radius - holeMinSize), (x, y) => site.clearTile(x, y));
	        }
	        return new Room(x - radius, y - radius, radius * 2 + 1, radius * 2 + 1);
	    }
	}
	function brogueDonut(config, site) {
	    // grid.fill(0);
	    const digger = new BrogueDonut(config);
	    return digger.create(site);
	}
	class ChunkyRoom extends RoomDigger {
	    constructor(config = {}) {
	        super(config, {
	            count: [2, 12],
	            width: [5, 20],
	            height: [5, 20],
	        });
	    }
	    carve(site) {
	        let i, x, y;
	        let chunkCount = this.options.count.value(site.rng);
	        const width = this.options.width.value(site.rng);
	        const height = this.options.height.value(site.rng);
	        const tile = this.options.tile || 'FLOOR';
	        const minX = Math.floor(site.width / 2) - Math.floor(width / 2);
	        const maxX = Math.floor(site.width / 2) + Math.floor(width / 2);
	        const minY = Math.floor(site.height / 2) - Math.floor(height / 2);
	        const maxY = Math.floor(site.height / 2) + Math.floor(height / 2);
	        let left = Math.floor(site.width / 2);
	        let right = left;
	        let top = Math.floor(site.height / 2);
	        let bottom = top;
	        forCircle(left, top, 2, (x, y) => site.setTile(x, y, tile));
	        left -= 2;
	        right += 2;
	        top -= 2;
	        bottom += 2;
	        for (i = 0; i < chunkCount;) {
	            x = site.rng.range(minX, maxX);
	            y = site.rng.range(minY, maxY);
	            if (site.isSet(x, y)) {
	                if (x - 2 < minX)
	                    continue;
	                if (x + 2 > maxX)
	                    continue;
	                if (y - 2 < minY)
	                    continue;
	                if (y + 2 > maxY)
	                    continue;
	                left = Math.min(x - 2, left);
	                right = Math.max(x + 2, right);
	                top = Math.min(y - 2, top);
	                bottom = Math.max(y + 2, bottom);
	                forCircle(x, y, 2, (x, y) => site.setTile(x, y, tile));
	                i++;
	            }
	        }
	        return new Room(left, top, right - left + 1, bottom - top + 1);
	    }
	}
	function chunkyRoom(config, site) {
	    // grid.fill(0);
	    const digger = new ChunkyRoom(config);
	    return digger.create(site);
	}
	function install$2(id, room) {
	    rooms[id] = room;
	    return room;
	}
	install$2('DEFAULT', new Rectangular());

	var room = /*#__PURE__*/Object.freeze({
		__proto__: null,
		BrogueDonut: BrogueDonut,
		BrogueEntrance: BrogueEntrance,
		Cavern: Cavern,
		ChoiceRoom: ChoiceRoom,
		ChunkyRoom: ChunkyRoom,
		Circular: Circular,
		Cross: Cross,
		Rectangular: Rectangular,
		RoomDigger: RoomDigger,
		SymmetricalCross: SymmetricalCross,
		brogueDonut: brogueDonut,
		brogueEntrance: brogueEntrance,
		cavern: cavern,
		checkConfig: checkConfig,
		choiceRoom: choiceRoom,
		chunkyRoom: chunkyRoom,
		circular: circular,
		cross: cross,
		install: install$2,
		rectangular: rectangular,
		rooms: rooms,
		symmetricalCross: symmetricalCross
	});

	const DIRS = DIRS$4;
	function isDoorLoc(site, loc, dir) {
	    if (!site.hasXY(loc[0], loc[1]))
	        return false;
	    // TODO - boundary?
	    if (!site.isDiggable(loc[0], loc[1]))
	        return false; // must be a wall/diggable space
	    const room = [loc[0] - dir[0], loc[1] - dir[1]];
	    if (!site.hasXY(room[0], room[1]))
	        return false;
	    // TODO - boundary?
	    if (!site.isFloor(room[0], room[1]))
	        return false; // must have floor in opposite direction
	    return true;
	}
	function pickWidth(width, rng) {
	    return clamp(_pickWidth(width, rng), 1, 3);
	}
	function _pickWidth(width, rng) {
	    if (!width)
	        return 1;
	    if (typeof width === 'number')
	        return width;
	    rng = rng ?? random$1;
	    if (Array.isArray(width)) {
	        width = rng.weighted(width) + 1;
	    }
	    else if (typeof width === 'string') {
	        width = make$6(width).value(rng);
	    }
	    else if (width instanceof Range) {
	        width = width.value(rng);
	    }
	    else {
	        const weights = width;
	        width = Number.parseInt(rng.weighted(weights));
	    }
	    return width;
	}
	function pickLength(dir, lengths, rng) {
	    if (dir == UP || dir == DOWN) {
	        return lengths[1].value(rng);
	    }
	    else {
	        return lengths[0].value(rng);
	    }
	}
	function pickHallDirection(site, doors, lengths) {
	    // Pick a direction.
	    let dir = NO_DIRECTION;
	    if (dir == NO_DIRECTION) {
	        const dirs = site.rng.sequence(4);
	        for (let i = 0; i < 4; i++) {
	            dir = dirs[i];
	            const length = lengths[(i + 1) % 2].hi; // biggest measurement
	            const door = doors[dir];
	            if (door && door[0] != -1 && door[1] != -1) {
	                const dx = door[0] + Math.floor(DIRS[dir][0] * length);
	                const dy = door[1] + Math.floor(DIRS[dir][1] * length);
	                if (site.hasXY(dx, dy)) {
	                    break; // That's our direction!
	                }
	            }
	            dir = NO_DIRECTION;
	        }
	    }
	    return dir;
	}
	function pickHallExits(site, x, y, dir, obliqueChance) {
	    let newX, newY;
	    const allowObliqueHallwayExit = site.rng.chance(obliqueChance);
	    const hallDoors = [
	    // [-1, -1],
	    // [-1, -1],
	    // [-1, -1],
	    // [-1, -1],
	    ];
	    for (let dir2 = 0; dir2 < 4; dir2++) {
	        newX = x + DIRS[dir2][0];
	        newY = y + DIRS[dir2][1];
	        if ((dir2 != dir && !allowObliqueHallwayExit) ||
	            !site.hasXY(newX, newY) ||
	            site.isSet(newX, newY)) ;
	        else {
	            hallDoors[dir2] = [newX, newY];
	        }
	    }
	    return hallDoors;
	}
	class HallDigger {
	    constructor(options = {}) {
	        this.config = {
	            width: 1,
	            length: [make$6('2-15'), make$6('2-9')],
	            tile: 'FLOOR',
	            obliqueChance: 15,
	            chance: 100,
	        };
	        this._setOptions(options);
	    }
	    _setOptions(options = {}) {
	        if (options.width) {
	            this.config.width = options.width;
	        }
	        if (options.length) {
	            if (typeof options.length === 'number') {
	                const l = make$6(options.length);
	                this.config.length = [l, l];
	            }
	        }
	        if (options.tile) {
	            this.config.tile = options.tile;
	        }
	        if (options.chance) {
	            this.config.chance = options.chance;
	        }
	    }
	    create(site, doors = []) {
	        doors = doors || chooseRandomDoorSites(site);
	        if (!site.rng.chance(this.config.chance))
	            return null;
	        const dir = pickHallDirection(site, doors, this.config.length);
	        if (dir === NO_DIRECTION)
	            return null;
	        if (!doors[dir])
	            return null;
	        const width = pickWidth(this.config.width, site.rng);
	        const length = pickLength(dir, this.config.length, site.rng);
	        const doorLoc = doors[dir];
	        if (width == 1) {
	            return this.dig(site, dir, doorLoc, length);
	        }
	        else {
	            return this.digWide(site, dir, doorLoc, length, width);
	        }
	    }
	    _digLine(site, door, dir, length) {
	        let x = door[0];
	        let y = door[1];
	        const tile = this.config.tile;
	        for (let i = 0; i < length; i++) {
	            site.setTile(x, y, tile);
	            x += dir[0];
	            y += dir[1];
	        }
	        x -= dir[0];
	        y -= dir[1];
	        return [x, y];
	    }
	    dig(site, dir, door, length) {
	        const DIR = DIRS[dir];
	        const [x, y] = this._digLine(site, door, DIR, length);
	        const hall = makeHall(door, dir, length);
	        hall.doors = pickHallExits(site, x, y, dir, this.config.obliqueChance);
	        return hall;
	    }
	    digWide(site, dir, door, length, width) {
	        const DIR = DIRS$4[dir];
	        const lower = [door[0] - DIR[1], door[1] - DIR[0]];
	        const higher = [door[0] + DIR[1], door[1] + DIR[0]];
	        this._digLine(site, door, DIR, length);
	        let actual = 1;
	        let startX = door[0];
	        let startY = door[1];
	        if (actual < width && isDoorLoc(site, lower, DIR)) {
	            this._digLine(site, lower, DIR, length);
	            startX = Math.min(lower[0], startX);
	            startY = Math.min(lower[1], startY);
	            ++actual;
	        }
	        if (actual < width && isDoorLoc(site, higher, DIR)) {
	            this._digLine(site, higher, DIR, length);
	            startX = Math.min(higher[0], startX);
	            startY = Math.min(higher[1], startY);
	            ++actual;
	        }
	        const hall = makeHall([startX, startY], dir, length, width);
	        hall.doors = [];
	        hall.doors[dir] = [
	            door[0] + length * DIR[0],
	            door[1] + length * DIR[1],
	        ];
	        // hall.width = width;
	        return hall;
	    }
	}
	function dig(config, site, doors) {
	    const digger = new HallDigger(config);
	    return digger.create(site, doors);
	}
	var halls = {};
	function install$1(id, hall) {
	    // @ts-ignore
	    halls[id] = hall;
	    return hall;
	}
	install$1('DEFAULT', new HallDigger({ chance: 15 }));

	var hall = /*#__PURE__*/Object.freeze({
		__proto__: null,
		HallDigger: HallDigger,
		dig: dig,
		halls: halls,
		install: install$1,
		isDoorLoc: isDoorLoc,
		pickHallDirection: pickHallDirection,
		pickHallExits: pickHallExits,
		pickLength: pickLength,
		pickWidth: pickWidth
	});

	class Lakes {
	    constructor(options = {}) {
	        this.options = {
	            height: 15,
	            width: 30,
	            minSize: 5,
	            tries: 20,
	            count: 1,
	            canDisrupt: false,
	            wreathTile: 'SHALLOW',
	            wreathChance: 50,
	            wreathSize: 1,
	            tile: 'DEEP',
	        };
	        assignObject(this.options, options);
	    }
	    create(site) {
	        let i, j, k;
	        let x, y;
	        let lakeMaxHeight, lakeMaxWidth, lakeMinSize, tries, maxCount, canDisrupt;
	        let count = 0;
	        lakeMaxHeight = this.options.height || 15; // TODO - Make this a range "5-15"
	        lakeMaxWidth = this.options.width || 30; // TODO - Make this a range "5-30"
	        lakeMinSize = this.options.minSize || 5;
	        tries = this.options.tries || 20;
	        maxCount = this.options.count || 1;
	        canDisrupt = this.options.canDisrupt || false;
	        const hasWreath = site.rng.chance(this.options.wreathChance)
	            ? true
	            : false;
	        const wreathTile = this.options.wreathTile || 'SHALLOW';
	        const wreathSize = this.options.wreathSize || 1; // TODO - make this a range "0-2" or a weighted choice { 0: 50, 1: 40, 2" 10 }
	        const tile = this.options.tile || 'DEEP';
	        const lakeGrid = alloc(site.width, site.height, 0);
	        let attempts = 0;
	        while (attempts < maxCount && count < maxCount) {
	            // lake generations
	            const width = Math.round(((lakeMaxWidth - lakeMinSize) * (maxCount - attempts)) /
	                maxCount) + lakeMinSize;
	            const height = Math.round(((lakeMaxHeight - lakeMinSize) * (maxCount - attempts)) /
	                maxCount) + lakeMinSize;
	            const blob = new Blob({
	                rng: site.rng,
	                rounds: 5,
	                minWidth: 4,
	                minHeight: 4,
	                maxWidth: width,
	                maxHeight: height,
	                percentSeeded: 55,
	                // birthParameters: 'ffffftttt',
	                // survivalParameters: 'ffffttttt',
	            });
	            lakeGrid.fill(0);
	            const bounds = blob.carve(lakeGrid.width, lakeGrid.height, (x, y) => lakeGrid.set(x, y, 1));
	            // console.log('LAKE ATTEMPT');
	            // lakeGrid.dump();
	            let success = false;
	            for (k = 0; k < tries && !success; k++) {
	                // placement attempts
	                // propose a position for the top-left of the lakeGrid in the dungeon
	                x = site.rng.range(1 - bounds.x, lakeGrid.width - bounds.width - bounds.x - 2);
	                y = site.rng.range(1 - bounds.y, lakeGrid.height - bounds.height - bounds.y - 2);
	                if (canDisrupt || !this.isDisruptedBy(site, lakeGrid, -x, -y)) {
	                    // level with lake is completely connected
	                    //   dungeon.debug("Placed a lake!", x, y);
	                    success = true;
	                    // copy in lake
	                    for (i = 0; i < bounds.width; i++) {
	                        // skip boundary
	                        for (j = 0; j < bounds.height; j++) {
	                            // skip boundary
	                            if (lakeGrid.get(i + bounds.x, j + bounds.y)) {
	                                const sx = i + bounds.x + x;
	                                const sy = j + bounds.y + y;
	                                site.setTile(sx, sy, tile);
	                                if (hasWreath) {
	                                    // if (site.hasTile(sx, sy, wreathTile)) {
	                                    //     site.clearTile(sx, sy, wreathTile);
	                                    // }
	                                    forCircle(sx, sy, wreathSize, (i2, j2) => {
	                                        if (site.isPassable(i2, j2) &&
	                                            !lakeGrid.get(i2 - x, j2 - y)
	                                        // SITE.isFloor(map, i, j) ||
	                                        // SITE.isDoor(map, i, j)
	                                        ) {
	                                            site.setTile(i2, j2, wreathTile);
	                                        }
	                                    });
	                                }
	                            }
	                        }
	                    }
	                    break;
	                }
	            }
	            if (success) {
	                ++count;
	                attempts = 0;
	            }
	            else {
	                ++attempts;
	            }
	        }
	        free(lakeGrid);
	        return count;
	    }
	    isDisruptedBy(site, lakeGrid, lakeToMapX = 0, lakeToMapY = 0) {
	        const walkableGrid = alloc(site.width, site.height);
	        let disrupts = false;
	        // Get all walkable locations after lake added
	        forRect(site.width, site.height, (i, j) => {
	            const lakeX = i + lakeToMapX;
	            const lakeY = j + lakeToMapY;
	            if (lakeGrid.get(lakeX, lakeY)) {
	                if (site.isStairs(i, j)) {
	                    disrupts = true;
	                }
	            }
	            else if (site.isPassable(i, j)) {
	                walkableGrid.set(i, j, 1);
	            }
	        });
	        let first = true;
	        for (let i = 0; i < walkableGrid.width && !disrupts; ++i) {
	            for (let j = 0; j < walkableGrid.height && !disrupts; ++j) {
	                if (walkableGrid.get(i, j) == 1) {
	                    if (first) {
	                        walkableGrid.floodFill(i, j, 1, 2);
	                        first = false;
	                    }
	                    else {
	                        disrupts = true;
	                    }
	                }
	            }
	        }
	        // console.log('WALKABLE GRID');
	        // walkableGrid.dump();
	        free(walkableGrid);
	        return disrupts;
	    }
	}

	var lake = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Lakes: Lakes
	});

	class Bridges {
	    constructor(options = {}) {
	        this.options = {
	            minDistance: 20,
	            maxLength: 5,
	        };
	        GWU__namespace.object.assignObject(this.options, options);
	    }
	    create(site) {
	        let count = 0;
	        let newX, newY;
	        let i, j, d, x, y;
	        const maxLength = this.options.maxLength;
	        const minDistance = this.options.minDistance;
	        const pathGrid = new GWU__namespace.path.DijkstraMap();
	        // const costGrid = GWU.grid.alloc(site.width, site.height);
	        const dirCoords = [
	            [1, 0],
	            [0, 1],
	        ];
	        const seq = site.rng.sequence(site.width * site.height);
	        for (i = 0; i < seq.length; i++) {
	            x = Math.floor(seq[i] / site.height);
	            y = seq[i] % site.height;
	            if (
	            // map.hasXY(x, y) &&
	            // map.get(x, y) &&
	            site.isPassable(x, y) &&
	                (site.isBridge(x, y) || !site.isAnyLiquid(x, y))) {
	                for (d = 0; d <= 1; d++) {
	                    // Try right, then down
	                    const bridgeDir = dirCoords[d];
	                    newX = x + bridgeDir[0];
	                    newY = y + bridgeDir[1];
	                    j = maxLength;
	                    // if (!map.hasXY(newX, newY)) continue;
	                    // check for line of lake tiles
	                    // if (isBridgeCandidate(newX, newY, bridgeDir)) {
	                    if (site.isAnyLiquid(newX, newY) &&
	                        !site.isBridge(newX, newY)) {
	                        for (j = 0; j < maxLength; ++j) {
	                            newX += bridgeDir[0];
	                            newY += bridgeDir[1];
	                            // if (!isBridgeCandidate(newX, newY, bridgeDir)) {
	                            if (site.isBridge(newX, newY) ||
	                                !site.isAnyLiquid(newX, newY)) {
	                                break;
	                            }
	                        }
	                    }
	                    if (
	                    // map.get(newX, newY) &&
	                    site.isPassable(newX, newY) &&
	                        j < maxLength) {
	                        computeDistanceMap(site, pathGrid, newX, newY);
	                        if (pathGrid.getDistance(x, y) > minDistance &&
	                            pathGrid.getDistance(x, y) < GWU__namespace.path.BLOCKED) {
	                            // and if the pathing distance between the two flanking floor tiles exceeds minDistance,
	                            // dungeon.debug(
	                            //     'Adding Bridge',
	                            //     x,
	                            //     y,
	                            //     ' => ',
	                            //     newX,
	                            //     newY
	                            // );
	                            while (x !== newX || y !== newY) {
	                                if (this.isBridgeCandidate(site, x, y, bridgeDir)) {
	                                    site.setTile(x, y, 'BRIDGE'); // map[x][y] = SITE.BRIDGE;
	                                    // costGrid[x][y] = 1; // (Cost map also needs updating.)
	                                }
	                                else {
	                                    site.setTile(x, y, 'FLOOR'); // map[x][y] = SITE.FLOOR;
	                                    // costGrid[x][y] = 1;
	                                }
	                                x += bridgeDir[0];
	                                y += bridgeDir[1];
	                            }
	                            ++count;
	                            break;
	                        }
	                    }
	                }
	            }
	        }
	        // GWU.grid.free(costGrid);
	        return count;
	    }
	    isBridgeCandidate(site, x, y, _bridgeDir) {
	        if (site.isBridge(x, y))
	            return true;
	        if (!site.isAnyLiquid(x, y))
	            return false;
	        // if (!site.isAnyLiquid(x + bridgeDir[1], y + bridgeDir[0])) return false;
	        // if (!site.isAnyLiquid(x - bridgeDir[1], y - bridgeDir[0])) return false;
	        return true;
	    }
	}

	var bridge = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Bridges: Bridges
	});

	class Stairs {
	    constructor(options = {}) {
	        this.options = {
	            up: true,
	            down: true,
	            minDistance: 10,
	            start: false,
	            upTile: 'UP_STAIRS',
	            downTile: 'DOWN_STAIRS',
	            wall: 'IMPREGNABLE',
	        };
	        assignObject(this.options, options);
	    }
	    create(site) {
	        let needUp = this.options.up !== false;
	        let needDown = this.options.down !== false;
	        const minDistance = this.options.minDistance ||
	            Math.floor(Math.max(site.width, site.height) / 2);
	        const locations = {};
	        let upLoc = null;
	        let downLoc = null;
	        const isValidLoc = this.isStairXY.bind(this, site);
	        if (this.options.start && typeof this.options.start !== 'string') {
	            let start = this.options.start;
	            if (start === true) {
	                start = site.rng.matchingLoc(site.width, site.height, isValidLoc);
	            }
	            else {
	                start = site.rng.matchingLocNear(x(start), y(start), isValidLoc);
	            }
	            locations.start = start;
	        }
	        if (Array.isArray(this.options.up) &&
	            Array.isArray(this.options.down)) {
	            const up = this.options.up;
	            upLoc = site.rng.matchingLocNear(x(up), y(up), isValidLoc);
	            const down = this.options.down;
	            downLoc = site.rng.matchingLocNear(x(down), y(down), isValidLoc);
	        }
	        else if (Array.isArray(this.options.up) &&
	            !Array.isArray(this.options.down)) {
	            const up = this.options.up;
	            upLoc = site.rng.matchingLocNear(x(up), y(up), isValidLoc);
	            if (needDown) {
	                downLoc = site.rng.matchingLoc(site.width, site.height, (x, y) => {
	                    if (
	                    // @ts-ignore
	                    distanceBetween(x, y, upLoc[0], upLoc[1]) <
	                        minDistance)
	                        return false;
	                    return isValidLoc(x, y);
	                });
	            }
	        }
	        else if (Array.isArray(this.options.down) &&
	            !Array.isArray(this.options.up)) {
	            const down = this.options.down;
	            downLoc = site.rng.matchingLocNear(x(down), y(down), isValidLoc);
	            if (needUp) {
	                upLoc = site.rng.matchingLoc(site.width, site.height, (x, y) => {
	                    if (distanceBetween(x, y, downLoc[0], downLoc[1]) < minDistance)
	                        return false;
	                    return isValidLoc(x, y);
	                });
	            }
	        }
	        else if (needUp) {
	            upLoc = site.rng.matchingLoc(site.width, site.height, isValidLoc);
	            if (needDown) {
	                downLoc = site.rng.matchingLoc(site.width, site.height, (x, y) => {
	                    if (
	                    // @ts-ignore
	                    distanceBetween(x, y, upLoc[0], upLoc[1]) <
	                        minDistance)
	                        return false;
	                    return isValidLoc(x, y);
	                });
	            }
	        }
	        else if (needDown) {
	            downLoc = site.rng.matchingLoc(site.width, site.height, isValidLoc);
	        }
	        if (upLoc) {
	            locations.up = upLoc.slice();
	            this.setupStairs(site, upLoc[0], upLoc[1], this.options.upTile, this.options.wall);
	            if (this.options.start === 'up') {
	                locations.start = locations.up;
	            }
	            else {
	                locations.end = locations.up;
	            }
	        }
	        if (downLoc) {
	            locations.down = downLoc.slice();
	            this.setupStairs(site, downLoc[0], downLoc[1], this.options.downTile, this.options.wall);
	            if (this.options.start === 'down') {
	                locations.start = locations.down;
	            }
	            else {
	                locations.end = locations.down;
	            }
	        }
	        return upLoc || downLoc ? locations : null;
	    }
	    hasXY(site, x, y) {
	        if (x < 0 || y < 0)
	            return false;
	        if (x >= site.width || y >= site.height)
	            return false;
	        return true;
	    }
	    isStairXY(site, x, y) {
	        let count = 0;
	        if (!this.hasXY(site, x, y) || !site.isDiggable(x, y))
	            return false;
	        for (let i = 0; i < 4; ++i) {
	            const dir = DIRS$4[i];
	            if (!this.hasXY(site, x + dir[0], y + dir[1]))
	                return false;
	            if (!this.hasXY(site, x - dir[0], y - dir[1]))
	                return false;
	            if (site.isFloor(x + dir[0], y + dir[1])) {
	                count += 1;
	                if (!site.isDiggable(x - dir[0] + dir[1], y - dir[1] + dir[0]))
	                    return false;
	                if (!site.isDiggable(x - dir[0] - dir[1], y - dir[1] - dir[0]))
	                    return false;
	            }
	            else if (!site.isDiggable(x + dir[0], y + dir[1])) {
	                return false;
	            }
	        }
	        return count == 1;
	    }
	    setupStairs(site, x, y, tile, wallTile) {
	        const indexes = site.rng.sequence(4);
	        let dir = null;
	        for (let i = 0; i < indexes.length; ++i) {
	            dir = DIRS$4[i];
	            const x0 = x + dir[0];
	            const y0 = y + dir[1];
	            if (site.isFloor(x0, y0)) {
	                if (site.isDiggable(x - dir[0], y - dir[1]))
	                    break;
	            }
	            dir = null;
	        }
	        if (!dir)
	            ERROR('No stair direction found!');
	        site.setTile(x, y, tile);
	        const dirIndex = CLOCK_DIRS.findIndex(
	        // @ts-ignore
	        (d) => d[0] == dir[0] && d[1] == dir[1]);
	        for (let i = 0; i < CLOCK_DIRS.length; ++i) {
	            const l = i ? i - 1 : 7;
	            const r = (i + 1) % 8;
	            if (i == dirIndex || l == dirIndex || r == dirIndex)
	                continue;
	            const d = CLOCK_DIRS[i];
	            site.setTile(x + d[0], y + d[1], wallTile);
	            // map.setCellFlags(x + d[0], y + d[1], Flags.Cell.IMPREGNABLE);
	        }
	        // dungeon.debug('setup stairs', x, y, tile);
	        return true;
	    }
	}

	var stairs = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Stairs: Stairs
	});

	class LoopDigger {
	    constructor(options = {}) {
	        this.options = {
	            minDistance: 100,
	            maxLength: 1,
	            doorChance: 50,
	        };
	        assignObject(this.options, options);
	    }
	    create(site) {
	        let startX, startY, endX, endY;
	        let i, j, d, x, y;
	        const minDistance = Math.min(this.options.minDistance, Math.floor(Math.max(site.width, site.height) / 2));
	        const maxLength = this.options.maxLength;
	        const pathGrid = new DijkstraMap();
	        // const costGrid = GWU.grid.alloc(site.width, site.height);
	        const dirCoords = [
	            [1, 0],
	            [0, 1],
	        ];
	        // SITE.fillCostGrid(site, costGrid);
	        function isValidTunnelStart(x, y, dir) {
	            if (!site.hasXY(x, y))
	                return false;
	            if (!site.hasXY(x + dir[1], y + dir[0]))
	                return false;
	            if (!site.hasXY(x - dir[1], y - dir[0]))
	                return false;
	            if (site.isSet(x, y))
	                return false;
	            if (site.isSet(x + dir[1], y + dir[0]))
	                return false;
	            if (site.isSet(x - dir[1], y - dir[0]))
	                return false;
	            return true;
	        }
	        function isValidTunnelEnd(x, y, dir) {
	            if (!site.hasXY(x, y))
	                return false;
	            if (!site.hasXY(x + dir[1], y + dir[0]))
	                return false;
	            if (!site.hasXY(x - dir[1], y - dir[0]))
	                return false;
	            if (site.isSet(x, y))
	                return true;
	            if (site.isSet(x + dir[1], y + dir[0]))
	                return true;
	            if (site.isSet(x - dir[1], y - dir[0]))
	                return true;
	            return false;
	        }
	        let count = 0;
	        const seq = site.rng.sequence(site.width * site.height);
	        for (i = 0; i < seq.length; i++) {
	            x = Math.floor(seq[i] / site.height);
	            y = seq[i] % site.height;
	            if (!site.isSet(x, y)) {
	                for (d = 0; d <= 1; d++) {
	                    // Try a horizontal door, and then a vertical door.
	                    let dir = dirCoords[d];
	                    if (!isValidTunnelStart(x, y, dir))
	                        continue;
	                    j = maxLength;
	                    // check up/left
	                    if (site.hasXY(x + dir[0], y + dir[1]) &&
	                        site.isPassable(x + dir[0], y + dir[1])) {
	                        // just can't build directly into a door
	                        if (!site.hasXY(x - dir[0], y - dir[1]) ||
	                            site.isDoor(x - dir[0], y - dir[1])) {
	                            continue;
	                        }
	                    }
	                    else if (site.hasXY(x - dir[0], y - dir[1]) &&
	                        site.isPassable(x - dir[0], y - dir[1])) {
	                        if (!site.hasXY(x + dir[0], y + dir[1]) ||
	                            site.isDoor(x + dir[0], y + dir[1])) {
	                            continue;
	                        }
	                        dir = dir.map((v) => -1 * v);
	                    }
	                    else {
	                        continue; // not valid start for tunnel
	                    }
	                    startX = x + dir[0];
	                    startY = y + dir[1];
	                    endX = x;
	                    endY = y;
	                    for (j = 0; j < maxLength; ++j) {
	                        endX -= dir[0];
	                        endY -= dir[1];
	                        // if (site.hasXY(endX, endY) && !grid.cell(endX, endY).isNull()) {
	                        if (isValidTunnelEnd(endX, endY, dir)) {
	                            break;
	                        }
	                    }
	                    if (j < maxLength) {
	                        computeDistanceMap(site, pathGrid, startX, startY);
	                        // pathGrid.fill(30000);
	                        // pathGrid[startX][startY] = 0;
	                        // dijkstraScan(pathGrid, costGrid, false);
	                        if (pathGrid.getDistance(endX, endY) > minDistance &&
	                            pathGrid.getDistance(endX, endY) < BLOCKED) {
	                            // and if the pathing distance between the two flanking floor tiles exceeds minDistance,
	                            // dungeon.debug(
	                            //     'Adding Loop',
	                            //     startX,
	                            //     startY,
	                            //     ' => ',
	                            //     endX,
	                            //     endY,
	                            //     ' : ',
	                            //     pathGrid[endX][endY]
	                            // );
	                            while (endX !== startX || endY !== startY) {
	                                if (site.isNothing(endX, endY)) {
	                                    site.setTile(endX, endY, 'FLOOR');
	                                    // costGrid[endX][endY] = 1; // (Cost map also needs updating.)
	                                }
	                                endX += dir[0];
	                                endY += dir[1];
	                            }
	                            // TODO - Door is optional
	                            const tile = site.rng.chance(this.options.doorChance)
	                                ? 'DOOR'
	                                : 'FLOOR';
	                            site.setTile(x, y, tile); // then turn the tile into a doorway.
	                            ++count;
	                            break;
	                        }
	                    }
	                }
	            }
	        }
	        // pathGrid.free();
	        // GWU.grid.free(costGrid);
	        return count;
	    }
	}
	// Add some loops to the otherwise simply connected network of rooms.
	function digLoops(site, opts = {}) {
	    const digger = new LoopDigger(opts);
	    return digger.create(site);
	}

	var loop = /*#__PURE__*/Object.freeze({
		__proto__: null,
		LoopDigger: LoopDigger,
		digLoops: digLoops
	});

	class Digger {
	    constructor(options = {}, tiles) {
	        this.seed = 0;
	        this.rooms = { fails: 20 };
	        this.doors = { chance: 15 };
	        this.halls = { chance: 15 };
	        this.loops = {};
	        this.lakes = {};
	        this.bridges = {};
	        this.stairs = {};
	        this.boundary = true;
	        // startLoc: GWU.xy.Loc = [-1, -1];
	        // endLoc: GWU.xy.Loc = [-1, -1];
	        this.locations = {};
	        this._locs = {};
	        this.goesUp = false;
	        this.seed = options.seed || 0;
	        this.tiles = tiles || tileFactory;
	        if (typeof options.rooms === 'number') {
	            options.rooms = { count: options.rooms };
	        }
	        setOptions(this.rooms, options.rooms);
	        this.goesUp = options.goesUp || false;
	        if (options.startLoc) {
	            this._locs.start = options.startLoc;
	        }
	        if (options.endLoc) {
	            this._locs.end = options.endLoc;
	        }
	        // Doors
	        if (options.doors === false) {
	            options.doors = { chance: 0 };
	        }
	        else if (options.doors === true) {
	            options.doors = { chance: 100 };
	        }
	        setOptions(this.doors, options.doors);
	        // Halls
	        if (options.halls === false) {
	            options.halls = { chance: 0 };
	        }
	        else if (options.halls === true) {
	            options.halls = {};
	        }
	        setOptions(this.halls, options.halls);
	        // Loops
	        if (options.loops === false) {
	            this.loops = null;
	        }
	        else {
	            if (options.loops === true)
	                options.loops = {};
	            else if (typeof options.loops === 'number') {
	                options.loops = { maxLength: options.loops };
	            }
	            options.loops = options.loops || {};
	            options.loops.doorChance =
	                options.loops.doorChance ?? options.doors?.chance;
	            // @ts-ignore
	            setOptions(this.loops, options.loops);
	        }
	        // Lakes
	        if (options.lakes === false) {
	            this.lakes = null;
	        }
	        else {
	            if (options.lakes === true)
	                options.lakes = {};
	            else if (typeof options.lakes === 'number') {
	                options.lakes = { count: options.lakes };
	            }
	            options.lakes = options.lakes || {};
	            // @ts-ignore
	            setOptions(this.lakes, options.lakes);
	        }
	        // Bridges
	        if (options.bridges === false) {
	            this.bridges = null;
	        }
	        else {
	            if (typeof options.bridges === 'number') {
	                options.bridges = { maxLength: options.bridges };
	            }
	            if (options.bridges === true)
	                options.bridges = {};
	            // @ts-ignore
	            setOptions(this.bridges, options.bridges);
	        }
	        // Stairs
	        if (options.stairs === false) {
	            this.stairs = null;
	        }
	        else {
	            if (typeof options.stairs !== 'object')
	                options.stairs = {};
	            // @ts-ignore
	            setOptions(this.stairs, options.stairs);
	            this.stairs.start = this.goesUp ? 'down' : 'up';
	        }
	        // this.startLoc = options.startLoc || [-1, -1];
	        // this.endLoc = options.endLoc || [-1, -1];
	        if (options.log === true) {
	            this.log = new ConsoleLogger();
	        }
	        else if (options.log) {
	            this.log = options.log;
	        }
	        else {
	            this.log = new NullLogger();
	        }
	    }
	    _makeRoomSite(width, height) {
	        const site = new Site(width, height);
	        site.rng = this.site.rng;
	        return site;
	    }
	    _createSite(width, height) {
	        this.site = new Site(width, height);
	    }
	    create(...args) {
	        let needsFree = true;
	        if (args.length == 1) {
	            const dest = args[0];
	            if (dest instanceof Site) {
	                this.site = dest;
	                needsFree = false;
	            }
	            else {
	                this._createSite(dest.width, dest.height);
	            }
	        }
	        else {
	            this._createSite(args[0], args[1]);
	        }
	        const result = this._create(this.site);
	        const cb = args[2] || null;
	        if (cb) {
	            forRect(this.site.width, this.site.height, (x, y) => {
	                const t = this.site._tiles.get(x, y);
	                if (t)
	                    cb(x, y, t);
	            });
	        }
	        else if (args.length == 1 && needsFree) {
	            const dest = args[0];
	            dest.copy(this.site._tiles);
	        }
	        needsFree && this.site.free();
	        return result;
	    }
	    _create(site) {
	        this.start(site);
	        this.addRooms(site);
	        if (this.loops) {
	            this.addLoops(site, this.loops);
	            this.log.onLoopsAdded(site);
	        }
	        if (this.lakes) {
	            this.addLakes(site, this.lakes);
	            this.log.onLakesAdded(site);
	        }
	        if (this.bridges) {
	            this.addBridges(site, this.bridges);
	            this.log.onBridgesAdded(site);
	        }
	        if (this.stairs) {
	            this.addStairs(site, this.stairs);
	            this.log.onStairsAdded(site);
	        }
	        this.finish(site);
	        return true;
	    }
	    start(site) {
	        this.site = site;
	        const seed = this.seed || random$1.number();
	        site.setSeed(seed);
	        site.clear();
	        this.seq = site.rng.sequence(site.width * site.height);
	        this.locations = Object.assign({}, this._locs);
	        if (!this.locations.start || this.locations.start[0] < 0) {
	            const stair = this.goesUp ? 'down' : 'up';
	            if (this.stairs && Array.isArray(this.stairs[stair])) {
	                this.locations.start = this.stairs[stair];
	            }
	            else {
	                this.locations.start = [
	                    Math.floor(site.width / 2),
	                    site.height - 2,
	                ];
	                if (this.stairs && this.stairs[stair]) {
	                    this.stairs[stair] = this.locations.start;
	                }
	            }
	        }
	        if (!this.locations.end || this.locations.end[0] < 0) {
	            const stair = this.goesUp ? 'up' : 'down';
	            if (this.stairs && Array.isArray(this.stairs[stair])) {
	                this.locations.end = this.stairs[stair];
	            }
	        }
	        // if (this.startLoc[0] < 0 && this.startLoc[0] < 0) {
	        //     this.startLoc[0] = Math.floor(site.width / 2);
	        //     this.startLoc[1] = site.height - 2;
	        // }
	    }
	    getDigger(id) {
	        if (!id)
	            throw new Error('Missing digger!');
	        if (id instanceof RoomDigger)
	            return id;
	        if (typeof id === 'string') {
	            const digger = rooms[id];
	            if (!digger) {
	                throw new Error('Failed to find digger - ' + id);
	            }
	            return digger;
	        }
	        return new ChoiceRoom(id);
	    }
	    addRooms(site) {
	        let tries = 20;
	        while (--tries) {
	            if (this.addFirstRoom(site))
	                break;
	        }
	        if (!tries)
	            throw new Error('Failed to place first room!');
	        site.updateDoorDirs();
	        this.log.onDigFirstRoom(site);
	        // site.dump();
	        // console.log('- rng.number', site.rng.number());
	        let fails = 0;
	        let count = 1;
	        const maxFails = this.rooms.fails || 20;
	        while (fails < maxFails) {
	            if (this.addRoom(site)) {
	                fails = 0;
	                site.updateDoorDirs();
	                site.rng.shuffle(this.seq);
	                // site.dump();
	                // console.log('- rng.number', site.rng.number());
	                if (this.rooms.count && ++count >= this.rooms.count) {
	                    break; // we are done
	                }
	            }
	            else {
	                ++fails;
	            }
	        }
	    }
	    addFirstRoom(site) {
	        const roomSite = this._makeRoomSite(site.width, site.height);
	        let digger = this.getDigger(this.rooms.first || this.rooms.digger || 'DEFAULT');
	        let room = digger.create(roomSite);
	        if (room &&
	            !this._attachRoomAtLoc(site, roomSite, room, this.locations.start)) {
	            room = null;
	        }
	        roomSite.free();
	        // Should we add the starting stairs now too?
	        return room;
	    }
	    addRoom(site) {
	        const roomSite = this._makeRoomSite(site.width, site.height);
	        let digger = this.getDigger(this.rooms.digger || 'DEFAULT');
	        let room = digger.create(roomSite);
	        // attach hall?
	        if (room && this.halls.chance) {
	            let hall$1 = dig(this.halls, roomSite, room.doors);
	            if (hall$1) {
	                room.hall = hall$1;
	            }
	        }
	        // console.log('potential room');
	        // roomSite.dump();
	        if (room) {
	            this.log.onRoomCandidate(room, roomSite);
	            if (this._attachRoom(site, roomSite, room)) {
	                this.log.onRoomSuccess(site, room);
	            }
	            else {
	                this.log.onRoomFailed(site, room, roomSite, 'Did not fit.');
	                room = null;
	            }
	        }
	        roomSite.free();
	        return room;
	    }
	    _attachRoom(site, roomSite, room) {
	        // console.log('attachRoom');
	        const doorSites = room.hall ? room.hall.doors : room.doors;
	        let i = 0;
	        const len = this.seq.length;
	        // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
	        for (i = 0; i < len; i++) {
	            const x = Math.floor(this.seq[i] / site.height);
	            const y = this.seq[i] % site.height;
	            const dir = site.getDoorDir(x, y);
	            if (dir != NO_DIRECTION) {
	                const oppDir = (dir + 2) % 4;
	                const door = doorSites[oppDir];
	                if (!door)
	                    continue;
	                const offsetX = x - door[0];
	                const offsetY = y - door[1];
	                if (door[0] != -1 &&
	                    this._roomFitsAt(site, roomSite, room, offsetX, offsetY)) {
	                    // TYPES.Room fits here.
	                    site.copyTiles(roomSite, offsetX, offsetY);
	                    this._attachDoor(site, room, x, y, oppDir);
	                    // door[0] = -1;
	                    // door[1] = -1;
	                    room.translate(offsetX, offsetY);
	                    return true;
	                }
	            }
	        }
	        return false;
	    }
	    _attachRoomAtLoc(site, roomSite, room, attachLoc) {
	        const [x, y] = attachLoc;
	        const doorSites = room.hall ? room.hall.doors : room.doors;
	        const dirs = site.rng.sequence(4);
	        // console.log('attachRoomAtXY', x, y, doorSites.join(', '));
	        for (let dir of dirs) {
	            const oppDir = (dir + 2) % 4;
	            const door = doorSites[oppDir];
	            if (!door || door[0] == -1)
	                continue;
	            const offX = x - door[0];
	            const offY = y - door[1];
	            if (this._roomFitsAt(site, roomSite, room, offX, offY)) {
	                // dungeon.debug("attachRoom: ", x, y, oppDir);
	                // TYPES.Room fits here.
	                site.copyTiles(roomSite, offX, offY);
	                // this._attachDoor(site, room, x, y, oppDir);  // No door on first room!
	                room.translate(offX, offY);
	                // const newDoors = doorSites.map((site) => {
	                //     const x0 = site[0] + offX;
	                //     const y0 = site[1] + offY;
	                //     if (x0 == x && y0 == y) return [-1, -1] as GWU.xy.Loc;
	                //     return [x0, y0] as GWU.xy.Loc;
	                // });
	                return true;
	            }
	        }
	        return false;
	    }
	    _roomFitsAt(map, roomGrid, room, roomToSiteX, roomToSiteY) {
	        let xRoom, yRoom, xSite, ySite, i, j;
	        // console.log('roomFitsAt', roomToSiteX, roomToSiteY);
	        const hall = room.hall || room;
	        const left = Math.min(room.left, hall.left);
	        const top = Math.min(room.top, hall.top);
	        const right = Math.max(room.right, hall.right);
	        const bottom = Math.max(room.bottom, hall.bottom);
	        for (xRoom = left; xRoom <= right; xRoom++) {
	            for (yRoom = top; yRoom <= bottom; yRoom++) {
	                if (roomGrid.isSet(xRoom, yRoom)) {
	                    xSite = xRoom + roomToSiteX;
	                    ySite = yRoom + roomToSiteY;
	                    if (!map.hasXY(xSite, ySite) ||
	                        map.isBoundaryXY(xSite, ySite)) {
	                        return false;
	                    }
	                    for (i = xSite - 1; i <= xSite + 1; i++) {
	                        for (j = ySite - 1; j <= ySite + 1; j++) {
	                            if (!map.isNothing(i, j)) {
	                                // console.log('- NO');
	                                return false;
	                            }
	                        }
	                    }
	                }
	            }
	        }
	        // console.log('- YES');
	        return true;
	    }
	    _attachDoor(site, room, x, y, dir) {
	        const opts = this.doors;
	        let isDoor = false;
	        if (opts.chance && site.rng.chance(opts.chance)) {
	            isDoor = true;
	        }
	        const tile = isDoor ? opts.tile || 'DOOR' : 'FLOOR';
	        site.setTile(x, y, tile); // Door site.
	        // most cases...
	        if (!room.hall || room.hall.width == 1 || room.hall.height == 1) {
	            return;
	        }
	        if (dir === UP || dir === DOWN) {
	            let didSomething = true;
	            let k = 1;
	            while (didSomething) {
	                didSomething = false;
	                if (site.isNothing(x - k, y)) {
	                    if (site.isSet(x - k, y - 1) && site.isSet(x - k, y + 1)) {
	                        site.setTile(x - k, y, tile);
	                        didSomething = true;
	                    }
	                }
	                if (site.isNothing(x + k, y)) {
	                    if (site.isSet(x + k, y - 1) && site.isSet(x + k, y + 1)) {
	                        site.setTile(x + k, y, tile);
	                        didSomething = true;
	                    }
	                }
	                ++k;
	            }
	        }
	        else {
	            let didSomething = true;
	            let k = 1;
	            while (didSomething) {
	                didSomething = false;
	                if (site.isNothing(x, y - k)) {
	                    if (site.isSet(x - 1, y - k) && site.isSet(x + 1, y - k)) {
	                        site.setTile(x, y - k, tile);
	                        didSomething = true;
	                    }
	                }
	                if (site.isNothing(x, y + k)) {
	                    if (site.isSet(x - 1, y + k) && site.isSet(x + 1, y + k)) {
	                        site.setTile(x, y + k, tile);
	                        didSomething = true;
	                    }
	                }
	                ++k;
	            }
	        }
	    }
	    addLoops(site, opts) {
	        const digger = new LoopDigger(opts);
	        return digger.create(site);
	    }
	    addLakes(site, opts) {
	        const digger = new Lakes(opts);
	        return digger.create(site);
	    }
	    addBridges(site, opts) {
	        const digger = new Bridges(opts);
	        return digger.create(site);
	    }
	    addStairs(site, opts) {
	        const digger = new Stairs(opts);
	        const locs = digger.create(site);
	        if (locs)
	            Object.assign(this.locations, locs);
	        return !!locs;
	    }
	    finish(site) {
	        this._removeDiagonalOpenings(site);
	        this._finishWalls(site);
	        this._finishDoors(site);
	    }
	    _removeDiagonalOpenings(site) {
	        let i, j, k, x1, y1;
	        let diagonalCornerRemoved;
	        do {
	            diagonalCornerRemoved = false;
	            for (i = 0; i < site.width - 1; i++) {
	                for (j = 0; j < site.height - 1; j++) {
	                    for (k = 0; k <= 1; k++) {
	                        if (!site.blocksMove(i + k, j) &&
	                            site.blocksMove(i + (1 - k), j) &&
	                            site.blocksDiagonal(i + (1 - k), j) &&
	                            site.blocksMove(i + k, j + 1) &&
	                            site.blocksDiagonal(i + k, j + 1) &&
	                            !site.blocksMove(i + (1 - k), j + 1)) {
	                            if (site.rng.chance(50)) {
	                                x1 = i + (1 - k);
	                                y1 = j;
	                            }
	                            else {
	                                x1 = i + k;
	                                y1 = j + 1;
	                            }
	                            diagonalCornerRemoved = true;
	                            site.setTile(x1, y1, 'FLOOR'); // todo - pick one of the passable tiles around it...
	                        }
	                    }
	                }
	            }
	        } while (diagonalCornerRemoved == true);
	    }
	    _finishDoors(site) {
	        forRect(site.width, site.height, (x, y) => {
	            if (site.isBoundaryXY(x, y))
	                return;
	            // todo - isDoorway...
	            if (site.isDoor(x, y)) {
	                // if (
	                //     // TODO - isPassable
	                //     (site.isPassable(x + 1, y) || site.isPassable(x - 1, y)) &&
	                //     (site.isPassable(x, y + 1) || site.isPassable(x, y - 1))
	                // ) {
	                //     // If there's passable terrain to the left or right, and there's passable terrain
	                //     // above or below, then the door is orphaned and must be removed.
	                //     site.setTile(x, y, SITE.FLOOR); // todo - take passable neighbor value
	                // } else
	                if ((site.isWall(x + 1, y) ? 1 : 0) +
	                    (site.isWall(x - 1, y) ? 1 : 0) +
	                    (site.isWall(x, y + 1) ? 1 : 0) +
	                    (site.isWall(x, y - 1) ? 1 : 0) !=
	                    2) {
	                    // If the door has three or more pathing blocker neighbors in the four cardinal directions,
	                    // then the door is orphaned and must be removed.
	                    site.setTile(x, y, 'FLOOR', { superpriority: true }); // todo - take passable neighbor
	                }
	            }
	        });
	    }
	    _finishWalls(site) {
	        const boundaryTile = this.boundary ? 'IMPREGNABLE' : 'WALL';
	        forRect(site.width, site.height, (x, y) => {
	            if (site.isNothing(x, y)) {
	                if (site.isBoundaryXY(x, y)) {
	                    site.setTile(x, y, boundaryTile);
	                }
	                else {
	                    site.setTile(x, y, 'WALL');
	                }
	            }
	        });
	    }
	}
	// export function digMap(map: GWM.map.Map, options: Partial<DiggerOptions> = {}) {
	//     const digger = new Digger(options);
	//     return digger.create(map);
	// }

	class Dungeon {
	    constructor(options) {
	        // @ts-ignore
	        this.config = {
	            levels: 1,
	            width: 80,
	            height: 34,
	            rooms: { fails: 20 },
	            // rooms: { count: 20, digger: 'DEFAULT' },
	            // halls: {},
	            // loops: {},
	            // lakes: {},
	            // bridges: {},
	            // stairs: {},
	            boundary: true,
	        };
	        this.seeds = [];
	        this.stairLocs = [];
	        setOptions(this.config, options);
	        if (this.config.seed) {
	            random$1.seed(this.config.seed);
	        }
	        if (typeof this.config.stairs === 'boolean' || !this.config.stairs) {
	            this.config.stairs = {};
	        }
	        if (!this.config.rooms) {
	            this.config.rooms = {};
	        }
	        else if (typeof this.config.rooms === 'number') {
	            this.config.rooms = { count: this.config.rooms };
	        }
	        this._initSeeds();
	        this._initStairLocs();
	    }
	    get length() {
	        return this.config.levels;
	    }
	    _initSeeds() {
	        for (let i = 0; i < this.config.levels; ++i) {
	            this.seeds[i] = random$1.number(2 ** 32);
	        }
	    }
	    _initStairLocs() {
	        let startLoc = this.config.startLoc || [
	            Math.floor(this.config.width / 2),
	            this.config.height - 2,
	        ];
	        const minDistance = this.config.stairDistance ||
	            Math.floor(Math.max(this.config.width / 2, this.config.height / 2));
	        let needUpdate = false;
	        for (let i = 0; i < this.config.levels; ++i) {
	            let endLoc;
	            if (this.stairLocs[i] &&
	                this.stairLocs[i][1] &&
	                this.stairLocs[i][1][0] > 0) {
	                endLoc = this.stairLocs[i][1];
	                needUpdate =
	                    distanceBetween(startLoc[0], startLoc[1], endLoc[0], endLoc[1]) < minDistance;
	            }
	            else {
	                endLoc = random$1.matchingLoc(this.config.width, this.config.height, (x, y) => {
	                    return (distanceBetween(startLoc[0], startLoc[1], x, y) > minDistance);
	                });
	            }
	            this.stairLocs[i] = [
	                [startLoc[0], startLoc[1]],
	                [endLoc[0], endLoc[1]],
	            ];
	            startLoc = endLoc;
	        }
	        if (needUpdate) {
	            // loop does not go all the way to level 0
	            for (let i = this.config.levels - 1; i > 0; --i) {
	                let [startLoc, endLoc] = this.stairLocs[i];
	                if (distanceBetween(startLoc[0], startLoc[1], endLoc[0], endLoc[1]) > minDistance) {
	                    break;
	                }
	                startLoc = random$1.matchingLoc(this.config.width, this.config.height, (x, y) => {
	                    return (distanceBetween(endLoc[0], endLoc[1], x, y) >
	                        minDistance);
	                });
	                this.stairLocs[i][0] = startLoc;
	                this.stairLocs[i - 1][1] = startLoc;
	            }
	        }
	    }
	    getLevel(id, cb) {
	        if (id < 0 || id > this.config.levels)
	            throw new Error('Invalid level id: ' + id);
	        // Generate the level
	        const [startLoc, endLoc] = this.stairLocs[id];
	        const stairOpts = Object.assign({}, this.config.stairs);
	        if (this.config.goesUp) {
	            stairOpts.down = startLoc;
	            stairOpts.up = endLoc;
	            if (id == 0 && this.config.startTile) {
	                stairOpts.downTile = this.config.startTile;
	            }
	            if (id == this.config.levels - 1 && this.config.endTile) {
	                stairOpts.upTile = this.config.endTile;
	            }
	        }
	        else {
	            stairOpts.down = endLoc;
	            stairOpts.up = startLoc;
	            if (id == 0 && this.config.startTile) {
	                stairOpts.upTile = this.config.startTile;
	            }
	            if (id == this.config.levels - 1 && this.config.endTile) {
	                stairOpts.downTile = this.config.endTile;
	            }
	        }
	        const rooms = Object.assign({}, this.config.rooms);
	        if (id === 0 && this.config.entrance) {
	            rooms.first = this.config.entrance;
	        }
	        let width = this.config.width, height = this.config.height;
	        // if (cb instanceof GWM.map.Map) {
	        //     width = cb.width;
	        //     height = cb.height;
	        // }
	        const levelOpts = {
	            seed: this.seeds[id],
	            loops: this.config.loops,
	            lakes: this.config.lakes,
	            bridges: this.config.bridges,
	            rooms: rooms,
	            stairs: stairOpts,
	            boundary: this.config.boundary,
	            goesUp: this.config.goesUp,
	            width,
	            height,
	        };
	        return this._makeLevel(id, levelOpts, cb);
	        // TODO - Update startLoc, endLoc
	    }
	    _makeLevel(id, opts, cb) {
	        const digger = new Digger(opts);
	        let result = false;
	        // if (cb instanceof GWM.map.Map) {
	        //     result = digger.create(cb);
	        // } else {
	        result = digger.create(this.config.width, this.config.height, cb);
	        // }
	        this.stairLocs[id] = [digger.locations.start, digger.locations.end];
	        // if (cb instanceof GWM.map.Map) {
	        //     const locs = this.stairLocs[id];
	        //     if (this.config.goesUp) {
	        //         cb.locations.down = cb.locations.start = locs[0];
	        //         cb.locations.up = cb.locations.end = locs[1];
	        //     } else {
	        //         cb.locations.down = cb.locations.start = locs[1];
	        //         cb.locations.up = cb.locations.end = locs[0];
	        //     }
	        // }
	        return result;
	    }
	}

	class BuildData {
	    // depth = 0;
	    // seed = 0;
	    constructor(site, blueprint, machine = 0) {
	        this.originX = -1;
	        this.originY = -1;
	        this.distance25 = -1;
	        this.distance75 = -1;
	        this.site = site;
	        this.blueprint = blueprint;
	        this.interior = alloc(site.width, site.height);
	        this.occupied = alloc(site.width, site.height);
	        this.viewMap = alloc(site.width, site.height);
	        this.distanceMap = new DijkstraMap(site.width, site.height);
	        this.candidates = alloc(site.width, site.height);
	        this.machineNumber = machine;
	    }
	    free() {
	        free(this.interior);
	        free(this.occupied);
	        free(this.viewMap);
	        free(this.candidates);
	    }
	    get rng() {
	        return this.site.rng;
	    }
	    reset(originX, originY) {
	        this.interior.fill(0);
	        this.occupied.fill(0);
	        this.viewMap.fill(0);
	        this.distanceMap.reset(this.site.width, this.site.height);
	        // this.candidates.fill(0);
	        this.originX = originX;
	        this.originY = originY;
	        this.distance25 = 0;
	        this.distance75 = 0;
	        // if (this.seed) {
	        //     this.site.setSeed(this.seed);
	        // }
	    }
	    calcDistances(maxDistance) {
	        computeDistanceMap(this.site, this.distanceMap, this.originX, this.originY);
	        let qualifyingTileCount = 0;
	        const distances = new Array(100).fill(0);
	        this.interior.forEach((v, x, y) => {
	            if (!v)
	                return;
	            const dist = Math.round(this.distanceMap.getDistance(x, y));
	            if (dist < 100) {
	                distances[dist]++; // create a histogram of distances -- poor man's sort function
	                qualifyingTileCount++;
	            }
	        });
	        let distance25 = Math.round(qualifyingTileCount / 4);
	        let distance75 = Math.round((3 * qualifyingTileCount) / 4);
	        for (let i = 0; i < 100; i++) {
	            if (distance25 <= distances[i]) {
	                distance25 = i;
	                break;
	            }
	            else {
	                distance25 -= distances[i];
	            }
	        }
	        for (let i = 0; i < 100; i++) {
	            if (distance75 <= distances[i]) {
	                distance75 = i;
	                break;
	            }
	            else {
	                distance75 -= distances[i];
	            }
	        }
	        this.distance25 = distance25;
	        this.distance75 = distance75;
	    }
	}

	const Fl = fl;
	var Flags;
	(function (Flags) {
	    Flags[Flags["BP_ROOM"] = Fl(0)] = "BP_ROOM";
	    Flags[Flags["BP_VESTIBULE"] = Fl(1)] = "BP_VESTIBULE";
	    Flags[Flags["BP_REWARD"] = Fl(2)] = "BP_REWARD";
	    Flags[Flags["BP_ADOPT_ITEM"] = Fl(3)] = "BP_ADOPT_ITEM";
	    Flags[Flags["BP_PURGE_PATHING_BLOCKERS"] = Fl(4)] = "BP_PURGE_PATHING_BLOCKERS";
	    Flags[Flags["BP_PURGE_INTERIOR"] = Fl(5)] = "BP_PURGE_INTERIOR";
	    Flags[Flags["BP_PURGE_LIQUIDS"] = Fl(6)] = "BP_PURGE_LIQUIDS";
	    Flags[Flags["BP_SURROUND_WITH_WALLS"] = Fl(7)] = "BP_SURROUND_WITH_WALLS";
	    Flags[Flags["BP_IMPREGNABLE"] = Fl(8)] = "BP_IMPREGNABLE";
	    Flags[Flags["BP_OPEN_INTERIOR"] = Fl(9)] = "BP_OPEN_INTERIOR";
	    Flags[Flags["BP_MAXIMIZE_INTERIOR"] = Fl(10)] = "BP_MAXIMIZE_INTERIOR";
	    Flags[Flags["BP_REDESIGN_INTERIOR"] = Fl(11)] = "BP_REDESIGN_INTERIOR";
	    Flags[Flags["BP_TREAT_AS_BLOCKING"] = Fl(12)] = "BP_TREAT_AS_BLOCKING";
	    Flags[Flags["BP_REQUIRE_BLOCKING"] = Fl(13)] = "BP_REQUIRE_BLOCKING";
	    Flags[Flags["BP_NO_INTERIOR_FLAG"] = Fl(14)] = "BP_NO_INTERIOR_FLAG";
	    Flags[Flags["BP_NOT_IN_HALLWAY"] = Fl(15)] = "BP_NOT_IN_HALLWAY";
	})(Flags || (Flags = {}));
	class Blueprint {
	    constructor(opts = {}) {
	        this.tags = [];
	        this.flags = 0;
	        this.steps = [];
	        this.id = 'n/a';
	        if (opts.tags) {
	            if (typeof opts.tags === 'string') {
	                opts.tags = opts.tags.split(/[,|]/).map((v) => v.trim());
	            }
	            this.tags = opts.tags;
	        }
	        this.frequency = make$2(opts.frequency || 100);
	        if (opts.size) {
	            this.size = make$6(opts.size);
	            if (this.size.lo <= 0)
	                this.size.lo = 1;
	            if (this.size.hi < this.size.lo)
	                this.size.hi = this.size.lo;
	        }
	        else {
	            this.size = make$6([1, 1]); // Anything bigger makes weird things happen
	        }
	        if (opts.flags) {
	            this.flags = from$1(Flags, opts.flags);
	        }
	        if (opts.steps) {
	            this.steps = opts.steps.map((cfg) => new BuildStep(cfg));
	            this.steps.forEach((s, i) => (s.index = i));
	        }
	        if (opts.id) {
	            this.id = opts.id;
	        }
	        if (this.flags & Flags.BP_ADOPT_ITEM) {
	            if (!this.steps.some((step) => {
	                if (step.adoptItem)
	                    return true;
	                if (step.hordeTakesItem && !step.item)
	                    return true;
	                return false;
	            })) {
	                throw new Error('Blueprint calls for BP_ADOPT_ITEM, but has no adoptive step.');
	            }
	        }
	    }
	    get isRoom() {
	        return !!(this.flags & Flags.BP_ROOM);
	    }
	    get isReward() {
	        return !!(this.flags & Flags.BP_REWARD);
	    }
	    get isVestiblue() {
	        return !!(this.flags & Flags.BP_VESTIBULE);
	    }
	    get adoptsItem() {
	        return !!(this.flags & Flags.BP_ADOPT_ITEM);
	    }
	    get treatAsBlocking() {
	        return !!(this.flags & Flags.BP_TREAT_AS_BLOCKING);
	    }
	    get requireBlocking() {
	        return !!(this.flags & Flags.BP_REQUIRE_BLOCKING);
	    }
	    get purgeInterior() {
	        return !!(this.flags & Flags.BP_PURGE_INTERIOR);
	    }
	    get purgeBlockers() {
	        return !!(this.flags & Flags.BP_PURGE_PATHING_BLOCKERS);
	    }
	    get purgeLiquids() {
	        return !!(this.flags & Flags.BP_PURGE_LIQUIDS);
	    }
	    get surroundWithWalls() {
	        return !!(this.flags & Flags.BP_SURROUND_WITH_WALLS);
	    }
	    get makeImpregnable() {
	        return !!(this.flags & Flags.BP_IMPREGNABLE);
	    }
	    get maximizeInterior() {
	        return !!(this.flags & Flags.BP_MAXIMIZE_INTERIOR);
	    }
	    get openInterior() {
	        return !!(this.flags & Flags.BP_OPEN_INTERIOR);
	    }
	    get noInteriorFlag() {
	        return !!(this.flags & Flags.BP_NO_INTERIOR_FLAG);
	    }
	    get notInHallway() {
	        return !!(this.flags & Flags.BP_NOT_IN_HALLWAY);
	    }
	    qualifies(requiredFlags, tags) {
	        if (tags && tags.length) {
	            if (typeof tags === 'string') {
	                tags = tags.split(/[,|]/).map((v) => v.trim());
	            }
	            // Must match all tags!
	            if (!tags.every((want) => this.tags.includes(want)))
	                return false;
	        }
	        if (
	        // Must have the required flags:
	        ~this.flags & requiredFlags ||
	            // May NOT have BP_ADOPT_ITEM unless that flag is required:
	            this.flags & Flags.BP_ADOPT_ITEM & ~requiredFlags ||
	            // May NOT have BP_VESTIBULE unless that flag is required:
	            this.flags & Flags.BP_VESTIBULE & ~requiredFlags) {
	            return false;
	        }
	        return true;
	    }
	    pickComponents(rng) {
	        const alternativeFlags = [
	            StepFlags.BS_ALTERNATIVE,
	            StepFlags.BS_ALTERNATIVE_2,
	        ];
	        const keepFeature = new Array(this.steps.length).fill(true);
	        for (let j = 0; j <= 1; j++) {
	            let totalFreq = 0;
	            for (let i = 0; i < keepFeature.length; i++) {
	                if (this.steps[i].flags & alternativeFlags[j]) {
	                    keepFeature[i] = false;
	                    totalFreq++;
	                }
	            }
	            if (totalFreq > 0) {
	                let randIndex = rng.range(1, totalFreq);
	                for (let i = 0; i < keepFeature.length; i++) {
	                    if (this.steps[i].flags & alternativeFlags[j]) {
	                        if (randIndex == 1) {
	                            keepFeature[i] = true; // This is the alternative that gets built. The rest do not.
	                            break;
	                        }
	                        else {
	                            randIndex--;
	                        }
	                    }
	                }
	            }
	        }
	        return this.steps.filter((_f, i) => keepFeature[i]);
	    }
	    fillInterior(builder) {
	        const interior = builder.interior;
	        const site = builder.site;
	        interior.fill(0);
	        // Find a location and map out the machine interior.
	        if (this.isRoom) {
	            // If it's a room machine, count up the gates of appropriate
	            // choke size and remember where they are. The origin of the room will be the gate location.
	            // Now map out the interior into interior[][].
	            // Start at the gate location and do a depth-first floodfill to grab all adjoining tiles with the
	            // same or lower choke value, ignoring any tiles that are already part of a machine.
	            // If we get false from this, try again. If we've tried too many times already, abort.
	            return addTileToInteriorAndIterate(builder, builder.originX, builder.originY);
	        }
	        else if (this.isVestiblue) {
	            return computeVestibuleInterior(builder, this);
	            // success
	        }
	        else {
	            // Find a location and map out the interior for a non-room machine.
	            // The strategy here is simply to pick a random location on the map,
	            // expand it along a pathing map by one space in all directions until the size reaches
	            // the chosen size, and then make sure the resulting space qualifies.
	            // If not, try again. If we've tried too many times already, abort.
	            let distanceMap = builder.distanceMap;
	            computeDistanceMap(site, distanceMap, builder.originX, builder.originY, this.size.hi);
	            const seq = site.rng.sequence(site.width * site.height);
	            let qualifyingTileCount = 0; // Keeps track of how many interior cells we've added.
	            let goalSize = this.size.value(); // Keeps track of the goal size.
	            for (let k = 0; k < 1000 && qualifyingTileCount < goalSize; k++) {
	                for (let n = 0; n < seq.length && qualifyingTileCount < goalSize; n++) {
	                    const i = Math.floor(seq[n] / site.height);
	                    const j = seq[n] % site.height;
	                    if (Math.round(distanceMap.getDistance(i, j)) == k) {
	                        interior.set(i, j, 1);
	                        qualifyingTileCount++;
	                        const machine = site.getMachine(i, j);
	                        if (site.isOccupied(i, j) ||
	                            (machine > 0 && machine !== builder.machineNumber) // in different machine
	                        ) {
	                            // Abort if we've entered another machine or engulfed another machine's item or monster.
	                            return 0;
	                        }
	                    }
	                }
	            }
	            // If locationFailsafe runs out, tryAgain will still be true, and we'll try a different machine.
	            // If we're not choosing the blueprint, then don't bother with the locationFailsafe; just use the higher-level failsafe.
	            return qualifyingTileCount;
	        }
	    }
	}
	function markCandidates(buildData) {
	    const site = buildData.site;
	    const candidates = buildData.candidates;
	    const blueprint = buildData.blueprint;
	    candidates.fill(0);
	    // Find a location and map out the machine interior.
	    if (blueprint.isRoom) {
	        // If it's a room machine, count up the gates of appropriate
	        // choke size and remember where they are. The origin of the room will be the gate location.
	        candidates.update((_v, x, y) => {
	            return site.isGateSite(x, y) &&
	                blueprint.size.contains(site.getChokeCount(x, y))
	                ? 1
	                : 0;
	        });
	    }
	    else if (blueprint.isVestiblue) {
	        //  Door machines must have locations passed in. We can't pick one ourselves.
	        throw new Error('ERROR: Attempted to build a vestiblue without a location being provided.');
	    }
	    else {
	        candidates.update((_v, x, y) => {
	            if (!site.isPassable(x, y))
	                return 0;
	            if (blueprint.notInHallway) {
	                const count = arcCount(x, y, (i, j) => site.isPassable(i, j));
	                return count <= 1 ? 1 : 0;
	            }
	            return 1;
	        });
	    }
	    return candidates.count((v) => v == 1);
	}
	function pickCandidateLoc(buildData) {
	    const site = buildData.site;
	    const candidates = buildData.candidates;
	    const randSite = site.rng.matchingLoc(site.width, site.height, (x, y) => candidates.get(x, y) == 1);
	    if (!randSite || randSite[0] < 0 || randSite[1] < 0) {
	        // If no suitable sites, abort.
	        return null;
	    }
	    return randSite;
	}
	// // Assume site has been analyzed (aka GateSites and ChokeCounts set)
	// export function computeInterior(
	//     builder: BuildData,
	//     blueprint: Blueprint
	// ): boolean {
	//     let failsafe = blueprint.isRoom ? 10 : 20;
	//     let tryAgain;
	//     const interior = builder.interior;
	//     const site = builder.site;
	//     do {
	//         tryAgain = false;
	//         if (--failsafe <= 0) {
	//             // console.log(
	//             //     `Failed to build blueprint ${blueprint.id}; failed repeatedly to find a suitable blueprint location.`
	//             // );
	//             return false;
	//         }
	//         let count = fillInterior(builder, blueprint);
	//         // Now make sure the interior map satisfies the machine's qualifications.
	//         if (!count) {
	//             console.debug('- no interior');
	//             tryAgain = true;
	//         } else if (!blueprint.size.contains(count)) {
	//             console.debug('- too small');
	//             tryAgain = true;
	//         } else if (
	//             blueprint.treatAsBlocking &&
	//             SITE.siteDisruptedBy(site, interior, { machine: site.machineCount })
	//         ) {
	//             console.debug('- blocks');
	//             tryAgain = true;
	//         } else if (
	//             blueprint.requireBlocking &&
	//             SITE.siteDisruptedSize(site, interior) < 100
	//         ) {
	//             console.debug('- does not block');
	//             tryAgain = true;
	//         }
	//         // Now loop if necessary.
	//     } while (tryAgain);
	//     // console.log(tryAgain, failsafe);
	//     return true;
	// }
	function computeVestibuleInterior(builder, blueprint) {
	    let success = true;
	    const site = builder.site;
	    const interior = builder.interior;
	    interior.fill(0);
	    if (blueprint.size.hi == 1) {
	        interior.set(builder.originX, builder.originY, 1);
	        return 1;
	    }
	    // If this is a wall - it is really an error (maybe manually trying a build location?)
	    const doorChokeCount = site.getChokeCount(builder.originX, builder.originY);
	    if (doorChokeCount > 10000) {
	        return 0;
	    }
	    const vestibuleLoc = [-1, -1];
	    let vestibuleChokeCount = doorChokeCount;
	    eachNeighbor(builder.originX, builder.originY, (x, y) => {
	        const count = site.getChokeCount(x, y);
	        if (count == doorChokeCount)
	            return;
	        if (count > 10000)
	            return;
	        if (count < 0)
	            return;
	        vestibuleLoc[0] = x;
	        vestibuleLoc[1] = y;
	        vestibuleChokeCount = count;
	    }, true);
	    const roomSize = vestibuleChokeCount - doorChokeCount;
	    if (blueprint.size.contains(roomSize)) {
	        // The room entirely fits within the vestibule desired size
	        const count = interior.floodFill(vestibuleLoc[0], vestibuleLoc[1], (_v, i, j) => {
	            if (site.isOccupied(i, j)) {
	                success = false;
	            }
	            return site.getChokeCount(i, j) === vestibuleChokeCount;
	        }, 1);
	        if (success && blueprint.size.contains(count))
	            return roomSize;
	    }
	    let qualifyingTileCount = 0; // Keeps track of how many interior cells we've added.
	    const wantSize = blueprint.size.value(site.rng); // Keeps track of the goal size.
	    const distMap = builder.distanceMap;
	    computeDistanceMap(site, distMap, builder.originX, builder.originY, blueprint.size.hi);
	    const cells = site.rng.sequence(site.width * site.height);
	    success = true;
	    for (let k = 0; k < 1000 && qualifyingTileCount < wantSize; k++) {
	        for (let i = 0; i < cells.length && qualifyingTileCount < wantSize; ++i) {
	            const x = Math.floor(cells[i] / site.height);
	            const y = cells[i] % site.height;
	            const dist = Math.round(distMap.getDistance(x, y));
	            if (dist != k)
	                continue;
	            if (site.isOccupied(x, y)) {
	                success = false;
	                qualifyingTileCount = wantSize;
	            }
	            if (site.getChokeCount(x, y) <= doorChokeCount)
	                continue;
	            interior.set(x, y, 1);
	            qualifyingTileCount += 1;
	        }
	    }
	    return qualifyingTileCount;
	}
	// Assumes (startX, startY) is in the machine.
	// Returns true if everything went well, and false if we ran into a machine component
	// that was already there, as we don't want to build a machine around it.
	function addTileToInteriorAndIterate(builder, startX, startY) {
	    let goodSoFar = true;
	    const interior = builder.interior;
	    const site = builder.site;
	    let count = 1;
	    interior.set(startX, startY, 1);
	    const startChokeCount = site.getChokeCount(startX, startY);
	    for (let dir = 0; dir < 4 && goodSoFar; dir++) {
	        const newX = startX + DIRS$4[dir][0];
	        const newY = startY + DIRS$4[dir][1];
	        if (!site.hasXY(newX, newY))
	            continue;
	        if (interior.get(newX, newY))
	            continue; // already done
	        if (site.isOccupied(newX, newY) ||
	            (site.getMachine(newX, newY) && !site.isGateSite(newX, newY))) {
	            // Abort if there's an item in the room.
	            // Items haven't been populated yet, so the only way this could happen is if another machine
	            // previously placed an item here.
	            // Also abort if we're touching another machine at any point other than a gate tile.
	            return 0;
	        }
	        if (site.getChokeCount(newX, newY) <= startChokeCount && // don't have to worry about walls since they're all 30000
	            !site.getMachine(newX, newY)) {
	            let additional = addTileToInteriorAndIterate(builder, newX, newY);
	            if (additional <= 0)
	                return 0;
	            count += additional;
	        }
	    }
	    return count;
	}
	function maximizeInterior(data, minimumInteriorNeighbors = 1) {
	    const interior = data.interior;
	    const site = data.site;
	    let interiorNeighborCount = 0;
	    // let openNeighborCount = 0;
	    let madeChange = true;
	    let interiorCount = 0;
	    let maxInteriorCount = data.blueprint.size.hi;
	    let gen = 0;
	    while (madeChange && interiorCount < maxInteriorCount) {
	        madeChange = false;
	        interiorCount = 0;
	        ++gen;
	        interior.forEach((i, x, y) => {
	            if (!i)
	                return;
	            ++interiorCount;
	            if (i != gen)
	                return;
	            eachNeighbor(x, y, (i, j) => {
	                if (!interior.hasXY(i, j) || interior.get(i, j))
	                    return;
	                if (interior.isBoundaryXY(i, j))
	                    return;
	                interiorNeighborCount = 0;
	                let ok = true;
	                eachNeighbor(i, j, (x2, y2) => {
	                    if (interior.get(x2, y2)) {
	                        ++interiorNeighborCount;
	                    }
	                    else if (!site.isWall(x2, y2)) {
	                        ok = false; // non-interior and not wall
	                    }
	                    else if (site.getMachine(x2, y2)) {
	                        ok = false; // in another machine
	                    }
	                }, false // 8 dirs
	                );
	                if (!ok || interiorNeighborCount < minimumInteriorNeighbors)
	                    return;
	                interior.set(i, j, gen + 1);
	                ++interiorCount;
	                if (site.blocksPathing(i, j)) {
	                    site.setTile(i, j, 'FLOOR');
	                }
	                madeChange = true;
	            }, true // 4 dirs
	            );
	        });
	    }
	    interior.update((v) => (v > 0 ? 1 : 0));
	}
	function prepareInterior(builder) {
	    const interior = builder.interior;
	    const site = builder.site;
	    const blueprint = builder.blueprint;
	    // If requested, clear and expand the room as far as possible until either it's convex or it bumps into surrounding rooms
	    if (blueprint.maximizeInterior) {
	        maximizeInterior(builder, 1);
	    }
	    else if (blueprint.openInterior) {
	        maximizeInterior(builder, 4);
	    }
	    // If requested, cleanse the interior -- no interesting terrain allowed.
	    if (blueprint.purgeInterior) {
	        interior.forEach((v, x, y) => {
	            if (v)
	                site.setTile(x, y, 'FLOOR');
	        });
	    }
	    else {
	        if (blueprint.purgeBlockers) {
	            // If requested, purge pathing blockers -- no traps allowed.
	            interior.forEach((v, x, y) => {
	                if (!v)
	                    return;
	                if (site.blocksPathing(x, y)) {
	                    site.setTile(x, y, 'FLOOR');
	                }
	            });
	        }
	        // If requested, purge the liquid layer in the interior -- no liquids allowed.
	        if (blueprint.purgeLiquids) {
	            interior.forEach((v, x, y) => {
	                if (v && site.isAnyLiquid(x, y)) {
	                    site.setTile(x, y, 'FLOOR');
	                }
	            });
	        }
	    }
	    // Surround with walls if requested.
	    if (blueprint.surroundWithWalls) {
	        interior.forEach((v, x, y) => {
	            if (!v || site.isGateSite(x, y))
	                return;
	            eachNeighbor(x, y, (i, j) => {
	                if (!interior.hasXY(i, j))
	                    return; // Not valid x,y
	                if (interior.get(i, j))
	                    return; // is part of machine
	                if (site.isWall(i, j))
	                    return; // is already a wall (of some sort)
	                if (site.isGateSite(i, j))
	                    return; // is a door site
	                if (site.getMachine(i, j))
	                    return; // is part of a machine
	                if (site.blocksPathing(i, j))
	                    return; // is a blocker for the player (water?)
	                site.setTile(i, j, 'WALL');
	            }, false // all 8 directions
	            );
	        });
	    }
	    // Completely clear the interior, fill with granite, and cut entirely new rooms into it from the gate site.
	    // Then zero out any portion of the interior that is still wall.
	    // if (flags & BPFlags.BP_REDESIGN_INTERIOR) {
	    //     RUT.Map.Blueprint.redesignInterior(map, interior, originX, originY, dungeonProfileIndex);
	    // }
	    // Reinforce surrounding tiles and interior tiles if requested to prevent tunneling in or through.
	    if (blueprint.makeImpregnable) {
	        interior.forEach((v, x, y) => {
	            if (!v || site.isGateSite(x, y))
	                return;
	            site.makeImpregnable(x, y);
	            eachNeighbor(x, y, (i, j) => {
	                if (!interior.hasXY(i, j))
	                    return;
	                if (interior.get(i, j))
	                    return;
	                if (site.isGateSite(i, j))
	                    return;
	                site.makeImpregnable(i, j);
	            }, false);
	        });
	    }
	    // If necessary, label the interior as IS_IN_AREA_MACHINE or IS_IN_ROOM_MACHINE and mark down the number.
	    const machineNumber = builder.machineNumber;
	    interior.forEach((v, x, y) => {
	        if (!v)
	            return;
	        if (!blueprint.noInteriorFlag) {
	            site.setMachine(x, y, machineNumber, blueprint.isRoom);
	        }
	        // secret doors mess up machines
	        // TODO - is this still true?
	        if (site.isSecretDoor(x, y)) {
	            site.setTile(x, y, 'DOOR');
	        }
	    });
	}
	// export function expandMachineInterior(
	//     builder: BuildData,
	//     minimumInteriorNeighbors = 1
	// ) {
	//     let madeChange;
	//     const interior = builder.interior;
	//     const site = builder.site;
	//     do {
	//         madeChange = false;
	//         interior.forEach((_v, x, y) => {
	//             // if (v && site.isDoor(x, y)) {
	//             //     site.setTile(x, y, SITE.FLOOR); // clean out the doors...
	//             //     return;
	//             // }
	//             if (site.hasCellFlag(x, y, GWM.flags.Cell.IS_IN_MACHINE)) return;
	//             if (!site.blocksPathing(x, y)) return;
	//             let nbcount = 0;
	//             GWU.xy.eachNeighbor(
	//                 x,
	//                 y,
	//                 (i, j) => {
	//                     if (!interior.hasXY(i, j)) return; // Not in map
	//                     if (interior.isBoundaryXY(i, j)) return; // Not on boundary
	//                     if (interior.get(i,j) && !site.blocksPathing(i, j)) {
	//                         ++nbcount; // in machine and open tile
	//                     }
	//                 },
	//                 false
	//             );
	//             if (nbcount < minimumInteriorNeighbors) return;
	//             nbcount = 0;
	//             GWU.xy.eachNeighbor(
	//                 x,
	//                 y,
	//                 (i, j) => {
	//                     if (!interior.hasXY(i, j)) return; // not on map
	//                     if (interior.get(i,j)) return; // already part of machine
	//                     if (
	//                         !site.isWall(i, j) ||
	//                         site.hasCellFlag(i, j, GWM.flags.Cell.IS_IN_MACHINE)
	//                     ) {
	//                         ++nbcount; // tile is not a wall or is in a machine
	//                     }
	//                 },
	//                 false
	//             );
	//             if (nbcount) return;
	//             // Eliminate this obstruction; welcome its location into the machine.
	//             madeChange = true;
	//             interior[x][y] = 1;
	//             if (site.blocksPathing(x, y)) {
	//                 site.setTile(x, y, SITE.FLOOR);
	//             }
	//             GWU.xy.eachNeighbor(x, y, (i, j) => {
	//                 if (!interior.hasXY(i, j)) return;
	//                 if (site.isSet(i, j)) return;
	//                 site.setTile(i, j, SITE.WALL);
	//             });
	//         });
	//     } while (madeChange);
	// }
	///////////////////////////
	// INSTALL
	const blueprints = {};
	function install(id, blueprint) {
	    if (!(blueprint instanceof Blueprint)) {
	        blueprint = new Blueprint(blueprint);
	    }
	    blueprints[id] = blueprint;
	    blueprint.id = id;
	    return blueprint;
	}
	function random(requiredFlags, depth, rng) {
	    const matches = Object.values(blueprints).filter((b) => b.qualifies(requiredFlags) && b.frequency(depth));
	    rng = rng || random$1;
	    return rng.item(matches);
	}
	function get(id) {
	    if (id instanceof Blueprint)
	        return id;
	    return blueprints[id];
	}
	function make(config) {
	    // if (!config.id) throw new Error('id is required to make Blueprint.');
	    return new Blueprint(config);
	}

	class Builder {
	    constructor(options = {}) {
	        this.blueprints = null;
	        if (options.blueprints) {
	            if (!Array.isArray(options.blueprints)) {
	                options.blueprints = Object.values(options.blueprints);
	            }
	            this.blueprints = options.blueprints.map((v) => get(v));
	        }
	        if (options.log === true) {
	            this.log = new ConsoleLogger();
	        }
	        else {
	            this.log = options.log || new NullLogger();
	        }
	        if (options.seed) {
	            this.seed = options.seed;
	        }
	        else {
	            this.seed = 0;
	        }
	    }
	    _pickRandom(requiredFlags, depth, rng) {
	        rng = rng || random$1;
	        const blueprints$1 = this.blueprints || Object.values(blueprints);
	        const weights = blueprints$1.map((b) => {
	            if (!b.qualifies(requiredFlags))
	                return 0;
	            return b.frequency(depth);
	        });
	        const index = rng.weighted(weights);
	        return blueprints$1[index] || null;
	    }
	    buildRandom(site, requiredMachineFlags = Flags.BP_ROOM, x = -1, y = -1, adoptedItem = null) {
	        const depth = site.depth;
	        let tries = 0;
	        while (tries < 10) {
	            const blueprint = this._pickRandom(requiredMachineFlags, depth, site.rng);
	            if (!blueprint) {
	                this.log.onBuildError(`Failed to find matching blueprint: requiredMachineFlags : ${toString(Flags, requiredMachineFlags)}, depth: ${depth}`);
	                return null;
	            }
	            const data = new BuildData(site, blueprint);
	            site.analyze();
	            this.log.onBlueprintPick(data, requiredMachineFlags, depth);
	            if (this._buildAt(data, x, y, adoptedItem)) {
	                return { x, y };
	            }
	            ++tries;
	        }
	        // console.log(
	        //     'Failed to build random blueprint matching flags: ' +
	        //         GWU.flag.toString(BLUE.Flags, requiredMachineFlags) +
	        //         ' tried : ' +
	        //         tries.join(', ')
	        // );
	        return null;
	    }
	    build(site, blueprint, x = -1, y = -1, adoptedItem = null) {
	        if (typeof blueprint === 'string') {
	            const id = blueprint;
	            blueprint = blueprints[id];
	            if (!blueprint)
	                throw new Error('Failed to find blueprint - ' + id);
	        }
	        if (this.seed) {
	            site.rng.seed(this.seed);
	        }
	        const data = new BuildData(site, blueprint);
	        site.analyze();
	        return this._buildAt(data, x, y, adoptedItem);
	    }
	    _buildAt(data, x = -1, y = -1, adoptedItem = null) {
	        if (x >= 0 && y >= 0) {
	            return this._build(data, x, y, adoptedItem);
	        }
	        let count = this._markCandidates(data);
	        if (!count) {
	            return null;
	        }
	        let tries = 20; // TODO - Make property of Blueprint
	        while (count-- && tries--) {
	            const loc = pickCandidateLoc(data) || false;
	            if (loc) {
	                if (this._build(data, loc[0], loc[1], adoptedItem)) {
	                    return { x: loc[0], y: loc[1] };
	                }
	            }
	        }
	        this.log.onBlueprintFail(data, 'No suitable locations found to build blueprint.');
	        return null;
	    }
	    //////////////////////////////////////////
	    // Returns true if the machine got built; false if it was aborted.
	    // If empty array spawnedItems or spawnedMonsters is given, will pass those back for deletion if necessary.
	    _build(data, originX, originY, adoptedItem = null) {
	        data.reset(originX, originY);
	        this.log.onBlueprintStart(data, adoptedItem);
	        if (!this._computeInterior(data)) {
	            return null;
	        }
	        // This is the point of no return. Back up the level so it can be restored if we have to abort this machine after this point.
	        const snapshot = data.site.snapshot();
	        data.machineNumber = data.site.nextMachineId(); // Reserve this machine number, starting with 1.
	        // Perform any transformations to the interior indicated by the blueprint flags, including expanding the interior if requested.
	        prepareInterior(data);
	        // Calculate the distance map (so that features that want to be close to or far from the origin can be placed accordingly)
	        // and figure out the 33rd and 67th percentiles for features that want to be near or far from the origin.
	        data.calcDistances(data.blueprint.size.hi);
	        // Now decide which features will be skipped -- of the features marked MF_ALTERNATIVE, skip all but one, chosen randomly.
	        // Then repeat and do the same with respect to MF_ALTERNATIVE_2, to provide up to two independent sets of alternative features per machine.
	        const components = data.blueprint.pickComponents(data.site.rng);
	        // Zero out occupied[][], and use it to keep track of the personal space around each feature that gets placed.
	        // Now tick through the features and build them.
	        for (let index = 0; index < components.length; index++) {
	            const component = components[index];
	            // console.log('BUILD COMPONENT', component);
	            if (!this._buildStep(data, component, adoptedItem)) {
	                // failure! abort!
	                // Restore the map to how it was before we touched it.
	                this.log.onBlueprintFail(data, `Failed to build step ${component.index + 1}/${data.blueprint.steps.length}.`);
	                data.site.restore(snapshot);
	                snapshot.free();
	                // abortItemsAndMonsters(spawnedItems, spawnedMonsters);
	                return null;
	            }
	        }
	        // Clear out the interior flag for all non-wired cells, if requested.
	        if (data.blueprint.noInteriorFlag) {
	            clearInteriorFlag(data.site, data.machineNumber);
	        }
	        // if (torchBearer && torch) {
	        // 	if (torchBearer->carriedItem) {
	        // 		deleteItem(torchBearer->carriedItem);
	        // 	}
	        // 	removeItemFromChain(torch, floorItems);
	        // 	torchBearer->carriedItem = torch;
	        // }
	        this.log.onBlueprintSuccess(data);
	        snapshot.free();
	        // console.log('Built a machine from blueprint:', originX, originY);
	        return { x: originX, y: originY };
	    }
	    _markCandidates(data) {
	        const count = markCandidates(data);
	        if (count <= 0) {
	            this.log.onBlueprintFail(data, 'No suitable candidate locations found.');
	            return 0;
	        }
	        this.log.onBlueprintCandidates(data);
	        return count;
	    }
	    _computeInterior(data) {
	        let fail = null;
	        let count = data.blueprint.fillInterior(data);
	        // Now make sure the interior map satisfies the machine's qualifications.
	        if (!count) {
	            fail = 'Interior error.';
	        }
	        else if (!data.blueprint.size.contains(count)) {
	            fail = `Interior wrong size - have: ${count}, want: ${data.blueprint.size.toString()}`;
	        }
	        else if (data.blueprint.treatAsBlocking &&
	            siteDisruptedBy(data.site, data.interior, {
	                machine: data.site.machineCount,
	            })) {
	            fail = 'Interior blocks map.';
	        }
	        else if (data.blueprint.requireBlocking &&
	            siteDisruptedSize(data.site, data.interior) < 100) {
	            fail = 'Interior does not block enough cells.';
	        }
	        if (!fail) {
	            this.log.onBlueprintInterior(data);
	            return true;
	        }
	        this.log.onBlueprintFail(data, fail);
	        return false;
	    }
	    _buildStep(data, buildStep, adoptedItem) {
	        let wantCount = 0;
	        let builtCount = 0;
	        const site = data.site;
	        this.log.onStepStart(data, buildStep, adoptedItem);
	        // console.log(
	        //     'buildComponent',
	        //     blueprint.id,
	        //     blueprint.steps.indexOf(buildStep)
	        // );
	        // Figure out the distance bounds.
	        const distanceBound = calcDistanceBound(data, buildStep);
	        // If the StepFlags.BS_REPEAT_UNTIL_NO_PROGRESS flag is set, repeat until we fail to build the required number of instances.
	        // Make a master map of candidate locations for this feature.
	        let qualifyingTileCount = 0;
	        if (buildStep.buildVestibule) {
	            // Generate a door guard machine.
	            // Try to create a sub-machine that qualifies.
	            let success = this.buildRandom(data.site, Flags.BP_VESTIBULE, data.originX, data.originY);
	            if (!success) {
	                this.log.onStepFail(data, buildStep, 'Failed to build vestibule');
	                return false;
	            }
	        }
	        // If we are just building a vestibule, then we can exit here...
	        if (!buildStep.buildsInstances) {
	            this.log.onStepSuccess(data, buildStep);
	            return true;
	        }
	        const candidates = alloc(site.width, site.height);
	        let didSomething = false;
	        do {
	            didSomething = false;
	            if (buildStep.buildAtOrigin) {
	                candidates.set(data.originX, data.originY, 1);
	                qualifyingTileCount = 1;
	                wantCount = 1;
	            }
	            else {
	                qualifyingTileCount = buildStep.markCandidates(data, candidates, distanceBound);
	                if (buildStep.generateEverywhere ||
	                    buildStep.repeatUntilNoProgress) {
	                    wantCount = qualifyingTileCount;
	                }
	                else {
	                    wantCount = buildStep.count.value(site.rng);
	                }
	                this.log.onStepCandidates(data, buildStep, candidates, wantCount);
	                // get rid of all error/invalid codes
	                candidates.update((v) => (v == 1 ? 1 : 0));
	                if (!qualifyingTileCount ||
	                    qualifyingTileCount < buildStep.count.lo) {
	                    this.log.onStepFail(data, buildStep, `Only ${qualifyingTileCount} qualifying tiles - want ${buildStep.count.toString()}.`);
	                    return false;
	                }
	            }
	            let x = 0, y = 0;
	            while (qualifyingTileCount > 0 && builtCount < wantCount) {
	                // Find a location for the feature.
	                if (buildStep.buildAtOrigin) {
	                    // Does the feature want to be at the origin? If so, put it there. (Just an optimization.)
	                    x = data.originX;
	                    y = data.originY;
	                }
	                else {
	                    // Pick our candidate location randomly, and also strike it from
	                    // the candidates map so that subsequent instances of this same feature can't choose it.
	                    [x, y] = data.rng.matchingLoc(candidates.width, candidates.height, (x, y) => candidates.get(x, y) == 1);
	                }
	                // Don't waste time trying the same place again whether or not this attempt succeeds.
	                candidates.set(x, y, 0);
	                qualifyingTileCount--;
	                const snapshot = data.site.snapshot();
	                if (this._buildStepInstance(data, buildStep, x, y, adoptedItem)) {
	                    // OK, if placement was successful, clear some personal space around the feature so subsequent features can't be generated too close.
	                    qualifyingTileCount -= buildStep.makePersonalSpace(data, x, y, candidates);
	                    builtCount++; // we've placed an instance
	                    didSomething = true;
	                    snapshot.free(); // This snapshot is useless b/c we made changes...
	                }
	                else {
	                    data.site.restore(snapshot); // need to undo any changes...
	                    snapshot.free();
	                }
	                // Finished with this instance!
	            }
	        } while (didSomething && buildStep.repeatUntilNoProgress);
	        free(candidates);
	        if (!buildStep.count.contains(builtCount) &&
	            !buildStep.generateEverywhere &&
	            !buildStep.repeatUntilNoProgress) {
	            this.log.onStepFail(data, buildStep, `Failed to build enough instances - want: ${buildStep.count.toString()}, built: ${builtCount}`);
	            return false;
	        }
	        this.log.onStepSuccess(data, buildStep);
	        return true;
	    }
	    _buildStepInstance(data, buildStep, x, y, adoptedItem = null) {
	        let success = true;
	        let didSomething = true;
	        const site = data.site;
	        if (success && buildStep.treatAsBlocking) {
	            // Yes, check for blocking.
	            const options = {
	                machine: site.machineCount,
	            };
	            if (buildStep.noBlockOrigin) {
	                options.updateWalkable = (g) => {
	                    g.set(data.originX, data.originY, 1);
	                    return true;
	                };
	            }
	            if (siteDisruptedByXY(site, x, y, options)) {
	                this.log.onStepInstanceFail(data, buildStep, x, y, 'instance blocks map');
	                success = false;
	            }
	        }
	        // Try to build the DF first, if any, since we don't want it to be disrupted by subsequently placed terrain.
	        if (success && buildStep.feature) {
	            success = buildStep.feature(site, x, y);
	            didSomething = success;
	            if (!success) {
	                this.log.onStepInstanceFail(data, buildStep, x, y, 'Failed to build effect - ' +
	                    JSON.stringify(buildStep.feature));
	            }
	        }
	        // Now try to place the terrain tile, if any.
	        if (success && buildStep.tile) {
	            if (!buildStep.permitBlocking &&
	                site.tileBlocksMove(buildStep.tile) &&
	                !buildStep.treatAsBlocking // already did treatAsBlocking
	            ) {
	                if (siteDisruptedByXY(site, x, y, {
	                    machine: site.machineCount,
	                })) {
	                    this.log.onStepInstanceFail(data, buildStep, x, y, 'tile blocks site');
	                    success = false;
	                }
	            }
	            if (success) {
	                success = site.setTile(x, y, buildStep.tile);
	                didSomething = didSomething || success;
	                if (!success) {
	                    this.log.onStepInstanceFail(data, buildStep, x, y, 'failed to set tile - ' + buildStep.tile);
	                }
	            }
	        }
	        let torch = adoptedItem;
	        // Generate an item, if necessary
	        if (success && buildStep.item) {
	            const itemInfo = pickItem(data.site.depth, buildStep.item);
	            if (!itemInfo) {
	                success = false;
	                this.log.onStepInstanceFail(data, buildStep, x, y, 'Failed to make random item - ' +
	                    JSON.stringify(buildStep.item));
	            }
	            else {
	                const item = makeItem(itemInfo);
	                if (buildStep.itemIsKey) {
	                    item.key = {
	                        x,
	                        y,
	                        disposable: !!buildStep.keyIsDisposable,
	                    };
	                }
	                if (buildStep.outsourceItem) {
	                    const result = this.buildRandom(data.site, Flags.BP_ADOPT_ITEM, -1, -1, item);
	                    if (result) {
	                        didSomething = true;
	                    }
	                    else {
	                        this.log.onStepInstanceFail(data, buildStep, x, y, 'Failed to build machine to adopt item - ' + item.id);
	                        success = false;
	                    }
	                }
	                else if (buildStep.hordeTakesItem) {
	                    torch = item;
	                }
	                else {
	                    success = site.addItem(x, y, item) > 0;
	                    didSomething = didSomething || success;
	                    if (!success) {
	                        this.log.onStepInstanceFail(data, buildStep, x, y, 'Failed to add item to site - ' + item.id);
	                    }
	                }
	            }
	        }
	        else if (success && buildStep.adoptItem) {
	            // adopt item if necessary
	            if (!adoptedItem) {
	                throw new Error('Failed to build blueprint because there is no adopted item.');
	            }
	            if (success) {
	                success = site.addItem(x, y, adoptedItem) > 0;
	                if (success) {
	                    didSomething = true;
	                }
	                else {
	                    this.log.onStepInstanceFail(data, buildStep, x, y, 'Failed to add adopted item to site - ' + adoptedItem.id);
	                }
	            }
	        }
	        let torchBearer = null;
	        if (success && buildStep.horde) {
	            let horde = pickHorde(data.site.depth, buildStep.horde, site.rng);
	            // if (buildStep.horde.random) {
	            //     horde = GWM.horde.random({ rng: site.rng });
	            // } else if (buildStep.horde.id) {
	            //     horde = GWM.horde.from(buildStep.horde.id);
	            // } else {
	            //     buildStep.horde.rng = site.rng;
	            //     horde = GWM.horde.random(buildStep.horde);
	            // }
	            if (!horde) {
	                success = false;
	                this.log.onStepInstanceFail(data, buildStep, x, y, 'Failed to pick horde - ' + JSON.stringify(buildStep.horde));
	            }
	            else {
	                if (horde.blueprint) {
	                    const blueprint = get(horde.blueprint);
	                    const newData = new BuildData(data.site, blueprint, data.machineNumber);
	                    const result = this._build(newData, x, y, null);
	                    newData.free();
	                    if (!result) {
	                        return false;
	                    }
	                }
	                const leader = spawnHorde(horde, site, x, y, {
	                    machine: site.machineCount,
	                });
	                if (!leader) {
	                    success = false;
	                    this.log.onStepInstanceFail(data, buildStep, x, y, 'Failed to build horde - ' + horde);
	                }
	                else {
	                    // What to do now?
	                    didSomething = true;
	                    // leader adopts item...
	                    if (torch && buildStep.hordeTakesItem) {
	                        torchBearer = leader;
	                        torchBearer.item = torch;
	                        torch.x = -1;
	                        torch.y = -1;
	                    }
	                    if (horde.feature) {
	                        horde.feature(site, x, y);
	                    }
	                    if (buildStep.horde.feature) {
	                        buildStep.horde.feature(site, x, y);
	                    }
	                }
	            }
	        }
	        if (success && didSomething) {
	            // Mark the feature location as part of the machine, in case it is not already inside of it.
	            if (!data.blueprint.noInteriorFlag) {
	                site.setMachine(x, y, data.machineNumber, data.blueprint.isRoom);
	            }
	            // Mark the feature location as impregnable if requested.
	            if (buildStep.impregnable) {
	                site.makeImpregnable(x, y);
	            }
	            this.log.onStepInstanceSuccess(data, buildStep, x, y);
	        }
	        return success && didSomething;
	    }
	}
	////////////////////////////////////////////////////
	// TODO - Change this!!!
	// const blue = BLUE.get(id | blue);
	// const result =  blue.buildAt(map, x, y);
	//
	function build(blueprint, site, x, y, opts) {
	    const builder = new Builder(opts);
	    return builder.build(site, blueprint, x, y);
	}

	var index$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Blueprint: Blueprint,
		BuildData: BuildData,
		BuildStep: BuildStep,
		Builder: Builder,
		get CandidateType () { return CandidateType; },
		get Flags () { return Flags; },
		get StepFlags () { return StepFlags; },
		blueprints: blueprints,
		build: build,
		calcDistanceBound: calcDistanceBound,
		cellIsCandidate: cellIsCandidate,
		computeVestibuleInterior: computeVestibuleInterior,
		get: get,
		install: install,
		make: make,
		markCandidates: markCandidates,
		maximizeInterior: maximizeInterior,
		pickCandidateLoc: pickCandidateLoc,
		prepareInterior: prepareInterior,
		random: random,
		updateViewMap: updateViewMap
	});

	function calcNumber(rng, config) {
	    if (typeof config === 'number') {
	        return config;
	    }
	    if (Array.isArray(config)) {
	        if (config.length == 1) {
	            return rng.int(config[0]);
	        }
	        else if (config.length == 2) {
	            return rng.range(config[0], config[1]);
	        }
	    }
	    if (typeof config === 'function') {
	        return config(rng);
	    }
	    throw new Error('Invalid number config: ' + JSON.stringify(config));
	}
	function asPercent(num) {
	    if (num <= 1)
	        return num;
	    return num / 100;
	}
	function blob(site, opts = {}) {
	    const rng = opts.rng || random$1;
	    const width = calcNumber(rng, opts.width || site.width - 2);
	    const height = calcNumber(rng, opts.height || site.height - 2);
	    const blobGrid = alloc(site.width, site.height, 0);
	    const minWidthPct = asPercent(opts.minWidthPct || 50);
	    const minHeightPct = asPercent(opts.minHeightPct || 50);
	    const minWidth = Math.floor(minWidthPct * width);
	    const maxWidth = width;
	    const minHeight = Math.floor(minHeightPct * height);
	    const maxHeight = height;
	    const blobOpts = {
	        rng: rng,
	        rounds: opts.rounds || 5,
	        minWidth: minWidth,
	        minHeight: minHeight,
	        maxWidth: maxWidth,
	        maxHeight: maxHeight,
	        percentSeeded: opts.percentSeeded || 55,
	        birthParameters: opts.birthParameters || 'ffffftttt',
	        survivalParameters: opts.survivalParameters || 'ffffttttt',
	        largestOnly: opts.largestOnly !== false, // true by default
	    };
	    if (opts.seedWidthPct) {
	        blobOpts.seedWidth = Math.floor(blobOpts.maxWidth * asPercent(opts.seedWidthPct));
	    }
	    if (opts.seedHeightPct) {
	        blobOpts.seedHeight = Math.floor(blobOpts.maxHeight * asPercent(opts.seedHeightPct));
	    }
	    const blob = new Blob(blobOpts);
	    const bounds = blob.carve(blobGrid.width, blobGrid.height, (x, y) => blobGrid.set(x, y, 1));
	    // Position the new cave in the middle of the grid...
	    const destX = Math.floor((site.width - bounds.width) / 2);
	    const dx = destX - bounds.x;
	    const destY = Math.floor((site.height - bounds.height) / 2);
	    const dy = destY - bounds.y;
	    // ...and copy it to the destination.
	    blobGrid.forEach((v, x, y) => {
	        if (v)
	            site.set(x + dx, y + dy, 1);
	    });
	    free(blobGrid);
	    bounds.x += dx;
	    bounds.y += dy;
	    return bounds;
	}

	function chunk(site, opts = {}) {
	    const rng = opts.rng || random$1;
	    const chunkGrid = alloc(site.width, site.height, 0);
	    const chunkCount = calcNumber(rng, opts.count || 5);
	    const width = calcNumber(rng, opts.width || Math.floor(site.width / 4));
	    const height = calcNumber(rng, opts.height || Math.floor(site.height / 4));
	    const tile = 1;
	    const minX = Math.floor(site.width / 2) - Math.floor(width / 2);
	    const maxX = Math.floor(site.width / 2) + Math.floor(width / 2);
	    const minY = Math.floor(site.height / 2) - Math.floor(height / 2);
	    const maxY = Math.floor(site.height / 2) + Math.floor(height / 2);
	    let left = Math.floor(site.width / 2);
	    let top = Math.floor(site.height / 2);
	    forCircle(left, top, 2, (x, y) => chunkGrid.set(x, y, tile));
	    left -= 2;
	    top -= 2;
	    for (let i = 0; i < chunkCount;) {
	        const x = rng.range(minX, maxX);
	        const y = rng.range(minY, maxY);
	        if (site.get(x, y) == tile) {
	            if (x - 2 < minX)
	                continue;
	            if (x + 2 > maxX)
	                continue;
	            if (y - 2 < minY)
	                continue;
	            if (y + 2 > maxY)
	                continue;
	            left = Math.min(x - 2, left);
	            top = Math.min(y - 2, top);
	            forCircle(x, y, 2, (x, y) => chunkGrid.set(x, y, tile));
	            i++;
	        }
	    }
	    const bounds = chunkGrid.calcBounds(1);
	    const destX = Math.floor((site.width - bounds.width) / 2);
	    const dx = destX - bounds.x;
	    const destY = Math.floor((site.height - bounds.height) / 2);
	    const dy = destY - bounds.y;
	    // ...and copy it to the destination.
	    chunkGrid.forEach((v, x, y) => {
	        if (v)
	            site.set(x + dx, y + dy, 1);
	    });
	    free(chunkGrid);
	    bounds.x += dx;
	    bounds.y += dy;
	    return bounds;
	}

	function connect(dest, opts = {}) {
	    let connectValue;
	    if (typeof opts.connectValue === 'function') {
	        connectValue = opts.connectValue;
	    }
	    else {
	        let c = opts.connectValue === undefined ? 1 : opts.connectValue;
	        connectValue = (v) => v == c;
	    }
	    const regions = alloc(dest.width, dest.height, 0);
	    dest.forEach((v, i, j) => {
	        if (connectValue(v)) {
	            // an unmarked blob
	            // Mark all the cells and returns the total size:
	            regions.set(i, j, 1);
	        }
	    });
	    let blobNumber = 1;
	    let topBlobSize = 0;
	    let topBlobNumber = 0;
	    let status = [true, true];
	    regions.forEach((v, i, j) => {
	        if (v == 1) {
	            ++blobNumber;
	            status.push(false);
	            let blobSize = regions.floodFill(i, j, 1, blobNumber);
	            if (blobSize > topBlobSize) {
	                topBlobNumber = blobNumber;
	                topBlobSize = blobSize;
	            }
	        }
	    });
	    // empty or 1 region
	    if (blobNumber <= 2) {
	        free(regions);
	        return true;
	    }
	    let maxTunnel = opts.maxTunnel || 5;
	    let tunnelValue = opts.tunnelValue || 1;
	    status[topBlobNumber] = true;
	    regions.randomEach((v, x, y) => {
	        if (status[v] == true)
	            return;
	        DIRS4.forEach((dir) => {
	            // let log = false;
	            for (let i = 1; i <= maxTunnel; ++i) {
	                let nx = x + dir[0] * i;
	                let ny = y + dir[1] * i;
	                if (!regions.hasXY(nx, ny)) {
	                    // log = false;
	                    break;
	                }
	                let v2 = regions.get(nx, ny);
	                if (v2 == 0) ;
	                else if (v2 != v) {
	                    regions.floodFill(x, y, v, v2);
	                    for (let j = 1; j <= i; ++j) {
	                        let tx = x + dir[0] * j;
	                        let ty = y + dir[1] * j;
	                        regions.set(tx, ty, v2);
	                        dest.set(tx, ty, tunnelValue);
	                        // log = false;
	                    }
	                    status[v] = true;
	                    v = v2; // In case we connect in another direction too!
	                    break;
	                }
	                else {
	                    break;
	                }
	            }
	            // if (log) {
	            //     console.log(
	            //         ' - Failed to find tunnel from ' +
	            //             x +
	            //             ',' +
	            //             y +
	            //             ' in dir ' +
	            //             dir
	            //     );
	            //     regions.dump();
	            // }
	        });
	    }, opts.rng);
	    free(regions);
	    return status.every((v) => v);
	}

	var index = /*#__PURE__*/Object.freeze({
		__proto__: null,
		asPercent: asPercent,
		blob: blob,
		calcNumber: calcNumber,
		chunk: chunk,
		connect: connect
	});

	exports.Digger = Digger;
	exports.Dungeon = Dungeon;
	exports.Hall = Hall;
	exports.Room = Room;
	exports.blueprint = index$1;
	exports.bridge = bridge;
	exports.carve = index;
	exports.feature = index$4;
	exports.hall = hall;
	exports.lake = lake;
	exports.loop = loop;
	exports.makeHall = makeHall;
	exports.room = room;
	exports.site = index$2;
	exports.stairs = stairs;

}));
//# sourceMappingURL=gw-dig.js.map
