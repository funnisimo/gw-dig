(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GWU = {}));
})(this, (function (exports) { 'use strict';

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
    function clamp(v, min, max) {
        if (v < min)
            return min;
        if (v > max)
            return max;
        return v;
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
    function arrayDelete(a, b) {
        const index = a.indexOf(b);
        if (index < 0)
            return false;
        a.splice(index, 1);
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
        clone() {
            return new Bounds(this.x, this.y, this.width, this.height);
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
        toString() {
            return `[${this.x},${this.y} -> ${this.right},${this.bottom}]`;
        }
    }
    function copyXY(dest, src) {
        dest.x = x(src);
        dest.y = y(src);
    }
    function addXY(dest, src) {
        dest.x += x(src);
        dest.y += y(src);
    }
    function equalsXY(dest, src) {
        if (!dest && !src)
            return true;
        if (!dest || !src)
            return false;
        return x(dest) == x(src) && y(dest) == y(src);
    }
    function lerpXY(a, b, pct) {
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
            fn(x1, y1);
        }
    }
    async function eachNeighborAsync(x, y, fn, only4dirs = false) {
        const max = only4dirs ? 4 : 8;
        for (let i = 0; i < max; ++i) {
            const dir = DIRS$2[i];
            const x1 = x + dir[0];
            const y1 = y + dir[1];
            await fn(x1, y1);
        }
    }
    function matchingNeighbor(x, y, matchFn, only4dirs = false) {
        const maxIndex = only4dirs ? 4 : 8;
        for (let d = 0; d < maxIndex; ++d) {
            const dir = DIRS$2[d];
            const i = x + dir[0];
            const j = y + dir[1];
            if (matchFn(i, j))
                return [i, j];
        }
        return [-1, -1];
    }
    function straightDistanceBetween(x1, y1, x2, y2) {
        const x = Math.abs(x1 - x2);
        const y = Math.abs(y1 - y2);
        return x + y;
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
            if (stepFn(...currentLoc) === false) {
                return false;
            }
            if (currentLoc[0] === toX && currentLoc[1] === toY)
                return true;
        } while (true);
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
        x: x,
        y: y,
        contains: contains,
        Bounds: Bounds,
        copyXY: copyXY,
        addXY: addXY,
        equalsXY: equalsXY,
        lerpXY: lerpXY,
        eachNeighbor: eachNeighbor,
        eachNeighborAsync: eachNeighborAsync,
        matchingNeighbor: matchingNeighbor,
        straightDistanceBetween: straightDistanceBetween,
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
        else {
            dest[key] = updated;
        }
    }
    function copyObject(dest, src) {
        Object.keys(dest).forEach((key) => {
            assignField(dest, src, key);
        });
    }
    function assignObject(dest, src) {
        Object.keys(src).forEach((key) => {
            assignField(dest, src, key);
        });
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
            if (arg[field] !== undefined) {
                return arg[field];
            }
        }
        return undefined;
    }

    var object = /*#__PURE__*/Object.freeze({
        __proto__: null,
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
            let gauss = u * Math.sqrt(-2 * Math.log(r) / r);
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
            locationCount = 0;
            forRect(width, height, (i, j) => {
                if (matchFn(i, j)) {
                    locationCount++;
                }
            });
            if (locationCount == 0) {
                return [-1, -1];
            }
            else {
                index = this.range(0, locationCount - 1);
            }
            for (i = 0; i < width && index >= 0; i++) {
                for (j = 0; j < height && index >= 0; j++) {
                    if (matchFn(i, j)) {
                        if (index == 0) {
                            return [i, j];
                        }
                        index--;
                    }
                }
            }
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
                        if ((i == x - k ||
                            i == x + k ||
                            j == y - k ||
                            j == y + k) &&
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
            for (k = 0; k < 50; k++) {
                for (i = x - k; i <= x + k; i++) {
                    for (j = y - k; j <= y + k; j++) {
                        if ((i == x - k ||
                            i == x + k ||
                            j == y - k ||
                            j == y + k) &&
                            matchFn(i, j)) {
                            if (--randIndex == 0) {
                                loc[0] = i;
                                loc[1] = j;
                                return loc;
                            }
                        }
                    }
                }
            }
            return [-1, -1]; // should never reach this point
        }
    }
    const random = new Random();
    const cosmetic = new Random();
    function make$c(seed) {
        return new Random(seed);
    }

    var rng = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Alea: Alea,
        configure: configure$1,
        Random: Random,
        random: random,
        cosmetic: cosmetic,
        make: make$c
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
    function make$b(config) {
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
    const from$4 = make$b;
    function asFn(config) {
        const range = make$b(config);
        return () => range.value();
    }

    var range = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Range: Range,
        make: make$b,
        from: from$4,
        asFn: asFn
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
    function make$9(w, h, v) {
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
        make: make$9,
        offsetZip: offsetZip,
        intersection: intersection,
        unite: unite
    });

    function toColorInt(r, g, b, base256) {
        if (base256) {
            r = Math.max(0, Math.min(255, Math.round(r * 2.550001)));
            g = Math.max(0, Math.min(255, Math.round(g * 2.550001)));
            b = Math.max(0, Math.min(255, Math.round(b * 2.550001)));
            return (r << 16) + (g << 8) + b;
        }
        r = Math.max(0, Math.min(15, Math.round((r / 100) * 15)));
        g = Math.max(0, Math.min(15, Math.round((g / 100) * 15)));
        b = Math.max(0, Math.min(15, Math.round((b / 100) * 15)));
        return (r << 8) + (g << 4) + b;
    }
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
            return Math.round(H);
        }
        equals(other) {
            if (typeof other === 'string') {
                if (other.startsWith('#')) {
                    if (other.length == 4) {
                        return this.css() === other;
                    }
                    return this.css(true) === other;
                }
                if (this.name)
                    return this.name === other;
            }
            else if (typeof other === 'number') {
                return this.toInt() === other || this.toInt(true) === other;
            }
            const O = from$2(other);
            if (this.isNull())
                return O.isNull();
            if (O.isNull())
                return false;
            return this._data.every((v, i) => {
                return v == O._data[i];
            });
        }
        toInt(base256 = false) {
            if (this.isNull())
                return -1;
            if (!this._rand || !this.dances) {
                return toColorInt(this._ra, this._ga, this._ba, base256);
            }
            const rand = cosmetic.number(this._rand[0]);
            const redRand = cosmetic.number(this._rand[1]);
            const greenRand = cosmetic.number(this._rand[2]);
            const blueRand = cosmetic.number(this._rand[3]);
            const r = Math.round(((this._r + rand + redRand) * this._a) / 100);
            const g = Math.round(((this._g + rand + greenRand) * this._a) / 100);
            const b = Math.round(((this._b + rand + blueRand) * this._a) / 100);
            return toColorInt(r, g, b, base256);
        }
        toLight() {
            return [this._ra, this._ga, this._ba];
        }
        clamp() {
            if (this.isNull())
                return this;
            return make$8(this._data.map((v) => clamp(v, 0, 100)));
        }
        blend(other) {
            const O = from$2(other);
            if (O.isNull())
                return this;
            if (O.a === 100)
                return O;
            const pct = O.a / 100;
            const keepPct = 1 - pct;
            const newColor = make$8(Math.round(this._data[0] * keepPct + O._data[0] * pct), Math.round(this._data[1] * keepPct + O._data[1] * pct), Math.round(this._data[2] * keepPct + O._data[2] * pct), Math.round(O.a + this._data[3] * keepPct));
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
            const pct = clamp(percent, 0, 100) / 100;
            const keepPct = 1 - pct;
            const newColor = make$8(Math.round(this._data[0] * keepPct + O._data[0] * pct), Math.round(this._data[1] * keepPct + O._data[1] * pct), Math.round(this._data[2] * keepPct + O._data[2] * pct), (this.isNull() ? 100 : this._data[3]) * keepPct + O._data[3] * pct);
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
            return make$8(Math.round(this._data[0] * keepPct + 100 * pct), Math.round(this._data[1] * keepPct + 100 * pct), Math.round(this._data[2] * keepPct + 100 * pct), this._a);
        }
        // Only adjusts r,g,b
        darken(percent) {
            if (this.isNull())
                return this;
            const pct = clamp(percent, 0, 100) / 100;
            const keepPct = 1 - pct;
            return make$8(Math.round(this._data[0] * keepPct + 0 * pct), Math.round(this._data[1] * keepPct + 0 * pct), Math.round(this._data[2] * keepPct + 0 * pct), this._a);
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
            return make$8(this._r + rand + redRand, this._g + rand + greenRand, this._b + rand + blueRand, this._a);
        }
        // Adds a color to this one
        add(other, percent = 100) {
            const O = from$2(other);
            if (O.isNull())
                return this;
            const alpha = (O.a / 100) * (percent / 100);
            return make$8(Math.round(this._data[0] + O._data[0] * alpha), Math.round(this._data[1] + O._data[1] * alpha), Math.round(this._data[2] + O._data[2] * alpha), clamp(Math.round(this._a + alpha * 100), 0, 100));
        }
        scale(percent) {
            if (this.isNull() || percent == 100)
                return this;
            const pct = Math.max(0, percent) / 100;
            return make$8(Math.round(this._data[0] * pct), Math.round(this._data[1] * pct), Math.round(this._data[2] * pct), this._a);
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
            return make$8(Math.round(this._ra * (data[0] / 100) * pct), Math.round(this._ga * (data[1] / 100) * pct), Math.round(this._ba * (data[2] / 100) * pct), 100);
        }
        // scales rgb down to a max of 100
        normalize() {
            if (this.isNull())
                return this;
            const max = Math.max(this._ra, this._ga, this._ba);
            if (max <= 100)
                return this;
            return make$8(Math.round((100 * this._ra) / max), Math.round((100 * this._ga) / max), Math.round((100 * this._ba) / max), 100);
        }
        /**
         * Returns the css code for the current RGB values of the color.
         * @param base256 - Show in base 256 (#abcdef) instead of base 16 (#abc)
         */
        css(base256 = false) {
            const v = this.toInt(base256);
            if (v < 0)
                return 'transparent';
            return '#' + v.toString(16).padStart(base256 ? 6 : 3, '0');
        }
        toString(base256 = false) {
            if (this.name)
                return this.name;
            if (this.isNull())
                return 'null color';
            return this.css(base256);
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
        if (css.length == 4) {
            r = Math.round(((c >> 8) / 15) * 100);
            g = Math.round((((c & 0xf0) >> 4) / 15) * 100);
            b = Math.round(((c & 0xf) / 15) * 100);
        }
        else {
            r = Math.round(((c >> 16) / 255) * 100);
            g = Math.round((((c & 0xff00) >> 8) / 255) * 100);
            b = Math.round(((c & 0xff) / 255) * 100);
        }
        return new Color(r, g, b);
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
    function make$8(...args) {
        let arg = args[0];
        let base256 = args[1];
        if (args.length == 0)
            return new Color();
        if (args.length > 2) {
            arg = args;
            base256 = false; // TODO - Change this!!!
        }
        if (arg === undefined || arg === null)
            return new Color(-1);
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
            return new Color(-1);
        if (typeof arg === 'string') {
            if (!arg.startsWith('#')) {
                return fromName(arg);
            }
        }
        return make$8(arg, args[1]);
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
    function install$3(name, ...args) {
        let info = args;
        if (args.length == 1) {
            info = args[0];
        }
        const c = info instanceof Color ? info : make$8(info);
        // @ts-ignore
        c._const = true;
        colors[name] = c;
        c.name = name;
        return c;
    }
    function installSpread(name, ...args) {
        let c;
        if (args.length == 1) {
            c = install$3(name, args[0]);
        }
        else {
            c = install$3(name, ...args);
        }
        install$3('light_' + name, c.lighten(25));
        install$3('lighter_' + name, c.lighten(50));
        install$3('lightest_' + name, c.lighten(75));
        install$3('dark_' + name, c.darken(25));
        install$3('darker_' + name, c.darken(50));
        install$3('darkest_' + name, c.darken(75));
        return c;
    }
    const NONE = install$3('NONE', -1);
    const BLACK = install$3('black', 0x000);
    const WHITE = install$3('white', 0xfff);
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

    var index$5 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        colors: colors,
        Color: Color,
        fromArray: fromArray,
        fromCss: fromCss,
        fromName: fromName,
        fromNumber: fromNumber,
        make: make$8,
        from: from$2,
        separate: separate,
        relativeLuminance: relativeLuminance,
        distance: distance,
        smoothScalar: smoothScalar,
        install: install$3,
        installSpread: installSpread,
        NONE: NONE,
        BLACK: BLACK,
        WHITE: WHITE
    });

    class Mixer {
        constructor(base) {
            this.ch = first(base === null || base === void 0 ? void 0 : base.ch, -1);
            this.fg = make$8(base === null || base === void 0 ? void 0 : base.fg);
            this.bg = make$8(base === null || base === void 0 ? void 0 : base.bg);
        }
        _changed() {
            return this;
        }
        copy(other) {
            this.ch = other.ch || -1;
            this.fg = from$2(other.fg);
            this.bg = from$2(other.bg);
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
            this.ch = -1;
            this.fg = NONE;
            this.bg = NONE;
            return this._changed();
        }
        blackOut() {
            this.ch = -1;
            this.fg = BLACK;
            this.bg = BLACK;
            return this._changed();
        }
        draw(ch = -1, fg = -1, bg = -1) {
            if (ch && ch !== -1) {
                this.ch = ch;
            }
            if (fg !== -1 && fg !== null) {
                fg = from$2(fg);
                this.fg = this.fg.blend(fg);
            }
            if (bg !== -1 && bg !== null) {
                bg = from$2(bg);
                this.bg = this.bg.blend(bg);
            }
            return this._changed();
        }
        drawSprite(src, opacity) {
            if (src === this)
                return this;
            // @ts-ignore
            if (opacity === undefined)
                opacity = src.opacity;
            if (opacity === undefined)
                opacity = 100;
            if (opacity <= 0)
                return;
            if (src.ch)
                this.ch = src.ch;
            if ((src.fg && src.fg !== -1) || src.fg === 0)
                this.fg = this.fg.mix(src.fg, opacity);
            if ((src.bg && src.bg !== -1) || src.bg === 0)
                this.bg = this.bg.mix(src.bg, opacity);
            return this._changed();
        }
        invert() {
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
            this._changed();
            return {
                ch: this.ch,
                fg: this.fg.toInt(),
                bg: this.bg.toInt(),
            };
        }
        toString() {
            // prettier-ignore
            return `{ ch: ${this.ch}, fg: ${this.fg.toString(true)}, bg: ${this.bg.toString(true)} }`;
        }
    }
    function makeMixer(base) {
        return new Mixer(base);
    }

    var options = {
        colorStart: 'Ω',
        colorEnd: '∆',
        field: '§',
        defaultFg: null,
        defaultBg: null,
    };
    var helpers = {
        default: (_name, _, _value) => {
            return '';
        },
        debug: (name, _, value) => {
            if (value !== undefined)
                return `${value}.!!${name}!!`;
            return `!!${name}!!`;
        },
    };
    function addHelper(name, fn) {
        helpers[name] = fn;
    }

    function compile(template, opts = {}) {
        const F = opts.field || options.field;
        const parts = template.split(F);
        const sections = parts.map((part, i) => {
            if (i % 2 == 0)
                return textSegment(part);
            if (part.length == 0)
                return textSegment(F);
            return makeVariable(part, opts);
        });
        return function (args = {}) {
            if (typeof args === 'string') {
                args = { value: args };
            }
            return sections.map((f) => f(args)).join('');
        };
    }
    function apply(template, args = {}) {
        const fn = compile(template);
        const result = fn(args);
        return result;
    }
    function textSegment(value) {
        return () => value;
    }
    function baseValue(name, debug = false) {
        return function (args) {
            let h = helpers[name];
            if (h) {
                return h(name, args);
            }
            const v = args[name];
            if (v !== undefined)
                return v;
            h = debug ? helpers.debug : helpers.default;
            return h(name, args);
        };
    }
    function fieldValue(name, source, debug = false) {
        const helper = debug ? helpers.debug : helpers.default;
        return function (args) {
            const obj = source(args);
            if (!obj)
                return helper(name, args, obj);
            const value = obj[name];
            if (value === undefined)
                return helper(name, args, obj);
            return value;
        };
    }
    function helperValue(name, source, debug = false) {
        const helper = helpers[name] ||
            (debug ? helpers.debug : helpers.default);
        return function (args) {
            const base = source(args);
            return helper(name, args, base);
        };
    }
    function stringFormat(format, source) {
        const data = /%(-?\d*)s/.exec(format) || [];
        const length = Number.parseInt(data[1] || '0');
        return function (args) {
            let text = '' + source(args);
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
        return function (args) {
            const value = Number.parseInt(source(args) || 0);
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
        return function (args) {
            const value = Number.parseFloat(source(args) || 0);
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
    function makeVariable(pattern, opts = {}) {
        const data = /((\w+) )?(\w+)(\.(\w+))?(%[\+\.\-\d]*[dsf])?/.exec(pattern) || [];
        const helper = data[2];
        const base = data[3];
        const field = data[5];
        const format = data[6];
        let result = baseValue(base, opts.debug);
        if (field && field.length) {
            result = fieldValue(field, result, opts.debug);
        }
        if (helper && helper.length) {
            result = helperValue(helper, result, opts.debug);
        }
        if (format && format.length) {
            if (format.endsWith('s')) {
                result = stringFormat(format, result);
            }
            else if (format.endsWith('d')) {
                result = intFormat(format, result);
            }
            else {
                result = floatFormat(format, result);
            }
        }
        return result;
    }

    function eachChar(text, fn, opts = {}) {
        if (text === null || text === undefined)
            return;
        if (!fn)
            return;
        text = '' + text; // force string
        if (!text.length)
            return;
        const colors = [];
        const colorFn = opts.eachColor || NOOP;
        let fg = opts.fg || options.defaultFg;
        let bg = opts.bg || options.defaultBg;
        const ctx = {
            fg,
            bg,
        };
        const CS = opts.colorStart || options.colorStart;
        const CE = opts.colorEnd || options.colorEnd;
        colorFn(ctx);
        let n = 0;
        for (let i = 0; i < text.length; ++i) {
            const ch = text[i];
            if (ch == CS) {
                let j = i + 1;
                while (j < text.length && text[j] != CS) {
                    ++j;
                }
                if (j == text.length) {
                    console.warn(`Reached end of string while seeking end of color start section.\n- text: ${text}\n- start @: ${i}`);
                    return; // reached end - done (error though)
                }
                if (j == i + 1) {
                    // next char
                    ++i; // fall through
                }
                else {
                    colors.push([ctx.fg, ctx.bg]);
                    const color = text.substring(i + 1, j);
                    const newColors = color.split('|');
                    ctx.fg = newColors[0] || ctx.fg;
                    ctx.bg = newColors[1] || ctx.bg;
                    colorFn(ctx);
                    i = j;
                    continue;
                }
            }
            else if (ch == CE) {
                if (text[i + 1] == CE) {
                    ++i;
                }
                else {
                    const c = colors.pop(); // if you pop too many times colors still revert to what you passed in
                    [ctx.fg, ctx.bg] = c || [fg, bg];
                    // colorFn(ctx);
                    continue;
                }
            }
            fn(ch, ctx.fg, ctx.bg, n, i);
            ++n;
        }
    }

    function length(text) {
        if (!text || text.length == 0)
            return 0;
        let len = 0;
        const CS = options.colorStart;
        const CE = options.colorEnd;
        for (let i = 0; i < text.length; ++i) {
            const ch = text[i];
            if (ch == CS) {
                const end = text.indexOf(CS, i + 1);
                i = end;
            }
            else if (ch == CE) ;
            else {
                ++len;
            }
        }
        return len;
    }
    let inColor = false;
    function advanceChars(text, start, count) {
        const CS = options.colorStart;
        const CE = options.colorEnd;
        inColor = false;
        let i = start;
        while (count > 0 && i < text.length) {
            const ch = text[i];
            if (ch === CS) {
                ++i;
                if (text[i] === CS) {
                    --count;
                }
                else {
                    while (text[i] !== CS)
                        ++i;
                    inColor = true;
                }
                ++i;
            }
            else if (ch === CE) {
                if (text[i + 1] === CE) {
                    --count;
                    ++i;
                }
                else {
                    inColor = false;
                }
                ++i;
            }
            else {
                --count;
                ++i;
            }
        }
        return i;
    }
    function firstChar(text) {
        const CS = options.colorStart;
        const CE = options.colorEnd;
        let i = 0;
        while (i < text.length) {
            const ch = text[i];
            if (ch === CS) {
                if (text[i + 1] === CS)
                    return CS;
                ++i;
                while (text[i] !== CS)
                    ++i;
                ++i;
            }
            else if (ch === CE) {
                if (text[i + 1] === CE)
                    return CE;
                ++i;
            }
            else {
                return ch;
            }
        }
        return null;
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
        const len = length(text);
        if (len <= width)
            return text;
        const index = advanceChars(text, 0, width);
        if (!inColor)
            return text.substring(0, index);
        const CE = options.colorEnd;
        return text.substring(0, index) + CE;
    }
    function capitalize(text) {
        const CS = options.colorStart;
        const CE = options.colorEnd;
        let i = 0;
        while (i < text.length) {
            const ch = text[i];
            if (ch == CS) {
                ++i;
                while (text[i] != CS && i < text.length) {
                    ++i;
                }
                ++i;
            }
            else if (ch == CE) {
                ++i;
                while (text[i] == CE && i < text.length) {
                    ++i;
                }
            }
            else if (/[A-Za-z]/.test(ch)) {
                return (text.substring(0, i) + ch.toUpperCase() + text.substring(i + 1));
            }
            else {
                ++i;
            }
        }
        return text;
    }
    function removeColors(text) {
        const CS = options.colorStart;
        const CE = options.colorEnd;
        let out = '';
        let start = 0;
        for (let i = 0; i < text.length; ++i) {
            const k = text[i];
            if (k === CS) {
                if (text[i + 1] == CS) {
                    ++i;
                    continue;
                }
                out += text.substring(start, i);
                ++i;
                while (text[i] != CS && i < text.length) {
                    ++i;
                }
                start = i + 1;
            }
            else if (k === CE) {
                if (text[i + 1] == CE) {
                    ++i;
                    continue;
                }
                out += text.substring(start, i);
                start = i + 1;
            }
        }
        if (start == 0)
            return text;
        out += text.substring(start);
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

    function nextBreak(text, start) {
        const CS = options.colorStart;
        const CE = options.colorEnd;
        let i = start;
        let l = 0;
        let count = true;
        while (i < text.length) {
            const ch = text[i];
            if (ch == ' ') {
                while (text[i + 1] == ' ') {
                    ++i;
                    ++l; // need to count the extra spaces as part of the word
                }
                return [i, l];
            }
            if (ch == '-') {
                return [i, l];
            }
            if (ch == '\n') {
                return [i, l];
            }
            if (ch == CS) {
                if (text[i + 1] == CS && count) {
                    l += 1;
                    i += 2;
                    continue;
                }
                count = !count;
                ++i;
                continue;
            }
            else if (ch == CE) {
                if (text[i + 1] == CE) {
                    l += 1;
                    ++i;
                }
                i++;
                continue;
            }
            l += count ? 1 : 0;
            ++i;
        }
        return [i, l];
    }
    function splice(text, start, len, add = '') {
        return text.substring(0, start) + add + text.substring(start + len);
    }
    function hyphenate(text, lineWidth, start, end, wordWidth, spaceLeftOnLine) {
        while (start < end) {
            // do not need to hyphenate
            if (spaceLeftOnLine >= wordWidth)
                return [text, end];
            // not much room left and word fits on next line
            if (spaceLeftOnLine < 4 && wordWidth <= lineWidth) {
                text = splice(text, start - 1, 1, '\n');
                return [text, end + 1];
            }
            // if will fit on this line and next...
            if (wordWidth < spaceLeftOnLine + lineWidth) {
                const w = advanceChars(text, start, spaceLeftOnLine - 1);
                text = splice(text, w, 0, '-\n');
                return [text, end + 2];
            }
            if (spaceLeftOnLine < 5) {
                text = splice(text, start - 1, 1, '\n');
                spaceLeftOnLine = lineWidth;
                continue;
            }
            // one hyphen will work...
            const hyphenAt = Math.min(spaceLeftOnLine - 1, Math.floor(wordWidth / 2));
            const w = advanceChars(text, start, hyphenAt);
            text = splice(text, w, 0, '-\n');
            start = w + 2;
            end += 2;
            wordWidth -= hyphenAt;
        }
        return [text, end];
    }
    function wordWrap(text, width, indent = 0) {
        if (!width)
            throw new Error('Need string and width');
        if (text.length < width)
            return text;
        if (length(text) < width)
            return text;
        if (text.indexOf('\n') == -1) {
            return wrapLine(text, width, indent);
        }
        const lines = text.split('\n');
        const split = lines.map((line, i) => wrapLine(line, width, i ? indent : 0));
        return split.join('\n');
    }
    // Returns the number of lines, including the newlines already in the text.
    // Puts the output in "to" only if we receive a "to" -- can make it null and just get a line count.
    function wrapLine(text, width, indent) {
        if (text.length < width)
            return text;
        if (length(text) < width)
            return text;
        let spaceLeftOnLine = width;
        width = width - indent;
        let printString = text;
        // Now go through and replace spaces with newlines as needed.
        // console.log('wordWrap - ', text, width, indent);
        let removeSpace = true;
        let i = -1;
        while (i < printString.length) {
            // wordWidth counts the word width of the next word without color escapes.
            // w indicates the position of the space or newline or null terminator that terminates the word.
            let [w, wordWidth] = nextBreak(printString, i + (removeSpace ? 1 : 0));
            let hyphen = false;
            if (printString[w] == '-') {
                w++;
                wordWidth++;
                hyphen = true;
            }
            // console.log('- w=%d, width=%d, space=%d, word=%s', w, wordWidth, spaceLeftOnLine, printString.substring(i, w));
            if (wordWidth > width) {
                [printString, w] = hyphenate(printString, width, i + 1, w, wordWidth, spaceLeftOnLine);
            }
            else if (wordWidth == spaceLeftOnLine) {
                const nl = w < printString.length ? '\n' : '';
                const remove = hyphen ? 0 : 1;
                printString = splice(printString, w, remove, nl); // [i] = '\n';
                w += 1 - remove; // if we change the length we need to advance our pointer
                spaceLeftOnLine = width;
            }
            else if (wordWidth > spaceLeftOnLine) {
                const remove = removeSpace ? 1 : 0;
                printString = splice(printString, i, remove, '\n'); // [i] = '\n';
                w += 1 - remove; // if we change the length we need to advance our pointer
                const extra = hyphen ? 0 : 1;
                spaceLeftOnLine = width - wordWidth - extra; // line width minus the width of the word we just wrapped and the space
                //printf("\n\n%s", printString);
            }
            else {
                const extra = hyphen ? 0 : 1;
                spaceLeftOnLine -= wordWidth + extra;
            }
            removeSpace = !hyphen;
            i = w; // Advance to the terminator that follows the word.
        }
        return printString;
    }
    // Returns the number of lines, including the newlines already in the text.
    // Puts the output in "to" only if we receive a "to" -- can make it null and just get a line count.
    function splitIntoLines(source, width = 200, indent = 0) {
        const CS = options.colorStart;
        const output = [];
        if (!source)
            return output;
        if (width <= 0)
            width = 200;
        let text = wordWrap(source, width, indent);
        let start = 0;
        let fg0 = null;
        let bg0 = null;
        eachChar(text, (ch, fg, bg, _, n) => {
            if (ch == '\n') {
                let color = fg0 || bg0
                    ? `${CS}${fg0 ? fg0 : ''}${bg0 ? '|' + bg0 : ''}${CS}`
                    : '';
                output.push(color + text.substring(start, n));
                start = n + 1;
                fg0 = fg;
                bg0 = bg;
            }
        });
        let color = fg0 || bg0 ? `${CS}${fg0 ? fg0 : ''}${bg0 ? '|' + bg0 : ''}${CS}` : '';
        if (start < text.length) {
            output.push(color + text.substring(start));
        }
        return output;
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

    var index$4 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        configure: configure,
        compile: compile,
        apply: apply,
        eachChar: eachChar,
        wordWrap: wordWrap,
        splitIntoLines: splitIntoLines,
        addHelper: addHelper,
        options: options,
        length: length,
        advanceChars: advanceChars,
        firstChar: firstChar,
        padStart: padStart,
        padEnd: padEnd,
        center: center,
        truncate: truncate,
        capitalize: capitalize,
        removeColors: removeColors,
        spliceRaw: spliceRaw,
        hash: hash
    });

    class Buffer$1 {
        constructor(width, height) {
            this.changed = false;
            this._width = width;
            this._height = height;
            this._data = this._makeData();
        }
        _makeData() {
            return new Uint32Array(this.width * this.height);
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
        clone() {
            const other = new Buffer$1(this._width, this._height);
            other.copy(this);
            return other;
        }
        resize(width, height) {
            const orig = this._data;
            this._width = width;
            this._height = height;
            if (orig.length < width * height) {
                this._data = new Uint32Array(width * height);
                this._data.set(orig, 0);
            }
            else {
                this._data = orig.slice(width * height);
            }
            this.changed = true;
        }
        _index(x, y) {
            return y * this.width + x;
        }
        get(x, y) {
            if (!this.hasXY(x, y))
                return 0;
            let index = this._index(x, y);
            return this._data[index] || 0;
        }
        info(x, y) {
            const style = this.get(x, y);
            const glyph = style >> 24;
            const bg = (style >> 12) & 0xfff;
            const fg = style & 0xfff;
            return { glyph, fg, bg };
        }
        set(x, y, style) {
            if (!this.hasXY(x, y))
                return;
            let index = this._index(x, y);
            const current = this._data[index];
            if (current !== style) {
                this._data[index] = style;
                return true;
            }
            return false;
        }
        toGlyph(ch) {
            if (typeof ch === 'number')
                return ch;
            if (!ch || !ch.length)
                return -1; // 0 handled elsewhere
            return ch.charCodeAt(0);
        }
        draw(x, y, glyph = -1, fg = -1, // TODO - White?
        bg = -1 // TODO - Black?
        ) {
            if (!this.hasXY(x, y))
                return this;
            const current = this.get(x, y);
            if (typeof glyph !== 'number') {
                glyph = this.toGlyph(glyph);
            }
            glyph = glyph >= 0 ? glyph & 0xff : current >> 24;
            if (typeof fg !== 'number') {
                fg = from$2(current & 0xfff)
                    .blend(fg)
                    .toInt();
            }
            else if (fg < 0) {
                fg = current & 0xfff;
            }
            else {
                fg = fg & 0xfff;
            }
            if (typeof bg !== 'number') {
                bg = from$2((current >> 12) & 0xfff)
                    .blend(bg)
                    .toInt();
            }
            else if (bg < 0) {
                bg = (current >> 12) & 0xfff;
            }
            else {
                bg = bg & 0xfff;
            }
            const style = (glyph << 24) + (bg << 12) + fg;
            this.set(x, y, style);
            if (style !== current)
                this.changed = true;
            return this;
        }
        // This is without opacity - opacity must be done in Mixer
        drawSprite(x, y, sprite) {
            const ch = sprite.ch === null ? -1 : sprite.ch;
            const fg = sprite.fg === null ? -1 : sprite.fg;
            const bg = sprite.bg === null ? -1 : sprite.bg;
            return this.draw(x, y, ch, fg, bg);
        }
        blackOut(...args) {
            if (args.length == 0) {
                return this.fill(0, 0, 0);
            }
            return this.draw(args[0], args[1], 0, 0, 0);
        }
        fill(glyph = 0, fg = 0xfff, bg = 0) {
            if (arguments.length == 1) {
                bg = from$2(glyph);
                glyph = 0;
                fg = 0;
            }
            return this.fillRect(0, 0, this.width, this.height, glyph, fg, bg);
        }
        copy(other) {
            this._width = other._width;
            this._height = other._height;
            this._data.set(other._data);
            this.changed = true;
            return this;
        }
        drawText(x, y, text, fg = 0xfff, bg = -1, maxWidth = 0, align = 'left') {
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
        wrapText(x, y, width, text, fg = 0xfff, bg = -1, indent = 0) {
            // if (!this.hasXY(x, y)) return 0;
            if (typeof fg !== 'number')
                fg = from$2(fg);
            if (typeof bg !== 'number')
                bg = from$2(bg);
            width = Math.min(width, this.width - x);
            text = wordWrap(text, width, indent);
            let lineCount = 0;
            let xi = x;
            eachChar(text, (ch, fg0, bg0) => {
                if (ch == '\n') {
                    while (xi < x + width) {
                        this.draw(xi++, y + lineCount, 0, 0x000, bg0);
                    }
                    ++lineCount;
                    xi = x + indent;
                    return;
                }
                this.draw(xi++, y + lineCount, ch, fg0, bg0);
            }, { fg, bg });
            while (xi < x + width) {
                this.draw(xi++, y + lineCount, 0, 0x000, bg);
            }
            return lineCount + 1;
        }
        fillRect(x, y, w, h, ch = -1, fg = -1, bg = -1) {
            if (ch === null)
                ch = -1;
            if (typeof ch !== 'number')
                ch = this.toGlyph(ch);
            if (typeof fg !== 'number')
                fg = from$2(fg);
            if (typeof bg !== 'number')
                bg = from$2(bg);
            const xw = Math.min(x + w, this.width);
            const yh = Math.min(y + h, this.height);
            for (let i = x; i < xw; ++i) {
                for (let j = y; j < yh; ++j) {
                    this.draw(i, j, ch, fg, bg);
                }
            }
            return this;
        }
        blackOutRect(x, y, w, h, bg = 0) {
            if (typeof bg !== 'number')
                bg = from$2(bg);
            return this.fillRect(x, y, w, h, 0, bg, bg);
        }
        highlight(x, y, color, strength) {
            if (!this.hasXY(x, y))
                return this;
            if (typeof color !== 'number') {
                color = from$2(color);
            }
            const mixer = new Mixer();
            const data = this.info(x, y);
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
                    const data = this.info(i, j);
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
                    const data = this.info(i, j);
                    mixer.drawSprite(data);
                    mixer.fg = mixer.fg.blend(color);
                    mixer.bg = mixer.bg.blend(color);
                    this.drawSprite(i, j, mixer);
                }
            }
            return this;
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
                    const data = this.info(x, y);
                    const glyph = data.glyph;
                    line += String.fromCharCode(glyph || 32);
                }
                data.push(line);
            }
            console.log(data.join('\n'));
        }
    }
    function make$7(width, height) {
        return new Buffer$1(width, height);
    }

    var buffer = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Buffer: Buffer$1,
        make: make$7
    });

    class Event {
        constructor(type, opts) {
            this.target = null;
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
    }
    let IOMAP = {};
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
    ];
    function setKeymap(keymap) {
        IOMAP = keymap;
    }
    function handlerFor(ev, km) {
        let c;
        if (ev.dir) {
            c = km.dir || km.keypress;
        }
        else if (ev.type === KEYPRESS) {
            c = km[ev.key] || km[ev.code] || km.keypress;
        }
        else if (km[ev.type]) {
            c = km[ev.type];
        }
        if (!c) {
            c = km.dispatch;
        }
        return c || null;
    }
    async function dispatchEvent(ev, km) {
        let result;
        km = km || IOMAP;
        if (ev.type === STOP) {
            recycleEvent(ev);
            return true; // Should stop loops, etc...
        }
        const handler = handlerFor(ev, km);
        if (handler) {
            // if (typeof c === 'function') {
            result = await handler.call(km, ev);
            // } else if (commands[c]) {
            //     result = await commands[c](ev);
            // } else {
            //     Utils.WARN('No command found: ' + c);
            // }
        }
        // TODO - what is this here for?
        // if ('next' in km && km.next === false) {
        //     result = false;
        // }
        recycleEvent(ev);
        return result;
    }
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
        let code = e.code.toLowerCase();
        if (e.shiftKey) {
            key = key.toUpperCase();
            code = code.toUpperCase();
        }
        if (e.ctrlKey) {
            key = '^' + key;
            code = '^' + code;
        }
        if (e.metaKey) {
            key = '#' + key;
            code = '#' + code;
        }
        if (e.altKey) {
            code = '/' + code;
        }
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
        ev.type = e.type;
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
    class Loop {
        constructor() {
            this.running = true;
            this.events = [];
            this.mouse = { x: -1, y: -1 };
            this.CURRENT_HANDLER = null;
            this.PAUSED = null;
            this.LAST_CLICK = { x: -1, y: -1 };
            this.interval = 0;
            this.intervalCount = 0;
            this.ended = false;
        }
        hasEvents() {
            return this.events.length;
        }
        clearEvents() {
            while (this.events.length) {
                const ev = this.events.shift();
                DEAD_EVENTS.push(ev);
            }
        }
        _startTicks() {
            ++this.intervalCount;
            if (this.interval)
                return;
            this.interval = setInterval(() => {
                const e = makeTickEvent(16);
                this.pushEvent(e);
            }, 16);
        }
        _stopTicks() {
            if (!this.intervalCount)
                return; // too many calls to stop
            --this.intervalCount;
            if (this.intervalCount)
                return; // still have a loop running
            clearInterval(this.interval);
            this.interval = 0;
        }
        pushEvent(ev) {
            if (this.ended)
                return;
            if (this.PAUSED) {
                console.log('PAUSED EVENT', ev.type);
            }
            if (this.events.length) {
                const last = this.events[this.events.length - 1];
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
                if (this.LAST_CLICK.x == ev.x && this.LAST_CLICK.y == ev.y) {
                    recycleEvent(ev);
                    return;
                }
                this.LAST_CLICK.x = ev.x;
                this.LAST_CLICK.y = ev.y;
            }
            else if (ev.type == MOUSEUP) {
                this.LAST_CLICK.x = -1;
                this.LAST_CLICK.y = -1;
                recycleEvent(ev);
                return;
            }
            if (this.CURRENT_HANDLER) {
                this.CURRENT_HANDLER(ev);
            }
            else if (ev.type === TICK) {
                const first = this.events[0];
                if (first && first.type === TICK) {
                    first.dt += ev.dt;
                    recycleEvent(ev);
                    return;
                }
                this.events.unshift(ev); // ticks go first
            }
            else {
                this.events.push(ev);
            }
        }
        nextEvent(ms = -1, match) {
            match = match || TRUE;
            let elapsed = 0;
            while (this.events.length) {
                const e = this.events.shift();
                if (e.type === MOUSEMOVE) {
                    this.mouse.x = e.x;
                    this.mouse.y = e.y;
                }
                if (match(e)) {
                    return Promise.resolve(e);
                }
                recycleEvent(e);
            }
            let done;
            if (ms == 0 || this.ended)
                return Promise.resolve(null);
            if (this.CURRENT_HANDLER) {
                throw new Error('OVERWRITE HANDLER -- Check for a missing await around Loop function calls.');
            }
            else if (this.events.length) {
                console.warn('SET HANDLER WITH QUEUED EVENTS - nextEvent');
            }
            this.CURRENT_HANDLER = (e) => {
                if (e.type === MOUSEMOVE) {
                    this.mouse.x = e.x;
                    this.mouse.y = e.y;
                }
                if (e.type === TICK && ms > 0) {
                    elapsed += e.dt;
                    if (elapsed < ms) {
                        return;
                    }
                    e.dt = elapsed;
                }
                else if (!match(e))
                    return;
                this.CURRENT_HANDLER = null;
                done(e);
            };
            return new Promise((resolve) => (done = resolve));
        }
        async run(keymap, ms = -1) {
            if (this.ended)
                return;
            this.running = true;
            this.clearEvents(); // ??? Should we do this?
            this._startTicks();
            if (keymap.start && typeof keymap.start === 'function') {
                await keymap.start();
            }
            let running = true;
            while (this.running && running) {
                if (keymap.draw && typeof keymap.draw === 'function') {
                    keymap.draw();
                }
                const ev = await this.nextEvent(ms);
                if (ev && (await dispatchEvent(ev, keymap))) {
                    running = false;
                }
            }
            if (keymap.stop && typeof keymap.stop === 'function') {
                await keymap.stop();
            }
            this._stopTicks();
        }
        stop() {
            this.clearEvents();
            this.running = false;
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = 0;
            }
            if (this.CURRENT_HANDLER) {
                this.pushEvent(makeStopEvent());
            }
            this.CURRENT_HANDLER = null;
        }
        end() {
            this.stop();
            this.ended = true;
        }
        start() {
            this.ended = false;
        }
        pauseEvents() {
            if (this.PAUSED)
                return;
            this.PAUSED = this.CURRENT_HANDLER;
            this.CURRENT_HANDLER = null;
            // io.debug('events paused');
        }
        resumeEvents() {
            if (!this.PAUSED)
                return;
            if (this.CURRENT_HANDLER) {
                console.warn('overwrite CURRENT HANDLER!');
            }
            this.CURRENT_HANDLER = this.PAUSED;
            this.PAUSED = null;
            // io.debug('resuming events');
            if (this.events.length && this.CURRENT_HANDLER) {
                const e = this.events.shift();
                // io.debug('- processing paused event', e.type);
                this.CURRENT_HANDLER(e);
                // io.recycleEvent(e);	// DO NOT DO THIS B/C THE HANDLER MAY PUT IT BACK ON THE QUEUE (see tickMs)
            }
            // io.debug('events resumed');
        }
        // IO
        async tickMs(ms = 1) {
            let done;
            setTimeout(() => done(), ms);
            return new Promise((resolve) => (done = resolve));
        }
        async nextKeyPress(ms, match) {
            if (ms === undefined)
                ms = -1;
            match = match || TRUE;
            function matchingKey(e) {
                if (e.type !== KEYPRESS)
                    return false;
                return match(e);
            }
            return this.nextEvent(ms, matchingKey);
        }
        async nextKeyOrClick(ms, matchFn) {
            if (ms === undefined)
                ms = -1;
            matchFn = matchFn || TRUE;
            function match(e) {
                if (e.type !== KEYPRESS && e.type !== CLICK)
                    return false;
                return matchFn(e);
            }
            return this.nextEvent(ms, match);
        }
        async pause(ms) {
            const e = await this.nextKeyOrClick(ms);
            return e && e.type !== TICK;
        }
        waitForAck() {
            return this.pause(5 * 60 * 1000); // 5 min
        }
        onkeydown(e) {
            if (ignoreKeyEvent(e))
                return;
            if (e.code === 'Escape') {
                this.clearEvents(); // clear all current events, then push on the escape
            }
            const ev = makeKeyEvent(e);
            this.pushEvent(ev);
            e.preventDefault();
        }
    }
    function make$6() {
        return new Loop();
    }
    // Makes a default global loop that you access through these funcitons...
    const loop = make$6();

    var io = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Event: Event,
        KEYPRESS: KEYPRESS,
        MOUSEMOVE: MOUSEMOVE,
        CLICK: CLICK,
        TICK: TICK,
        MOUSEUP: MOUSEUP,
        STOP: STOP,
        setKeymap: setKeymap,
        handlerFor: handlerFor,
        dispatchEvent: dispatchEvent,
        makeStopEvent: makeStopEvent,
        makeCustomEvent: makeCustomEvent,
        makeTickEvent: makeTickEvent,
        makeKeyEvent: makeKeyEvent,
        keyCodeDirection: keyCodeDirection,
        ignoreKeyEvent: ignoreKeyEvent,
        makeMouseEvent: makeMouseEvent,
        Loop: Loop,
        make: make$6,
        loop: loop
    });

    var FovFlags;
    (function (FovFlags) {
        FovFlags[FovFlags["VISIBLE"] = fl(0)] = "VISIBLE";
        FovFlags[FovFlags["WAS_VISIBLE"] = fl(1)] = "WAS_VISIBLE";
        FovFlags[FovFlags["CLAIRVOYANT_VISIBLE"] = fl(2)] = "CLAIRVOYANT_VISIBLE";
        FovFlags[FovFlags["WAS_CLAIRVOYANT_VISIBLE"] = fl(3)] = "WAS_CLAIRVOYANT_VISIBLE";
        FovFlags[FovFlags["TELEPATHIC_VISIBLE"] = fl(4)] = "TELEPATHIC_VISIBLE";
        FovFlags[FovFlags["WAS_TELEPATHIC_VISIBLE"] = fl(5)] = "WAS_TELEPATHIC_VISIBLE";
        FovFlags[FovFlags["ITEM_DETECTED"] = fl(6)] = "ITEM_DETECTED";
        FovFlags[FovFlags["WAS_ITEM_DETECTED"] = fl(7)] = "WAS_ITEM_DETECTED";
        FovFlags[FovFlags["ACTOR_DETECTED"] = fl(8)] = "ACTOR_DETECTED";
        FovFlags[FovFlags["WAS_ACTOR_DETECTED"] = fl(9)] = "WAS_ACTOR_DETECTED";
        FovFlags[FovFlags["REVEALED"] = fl(10)] = "REVEALED";
        FovFlags[FovFlags["MAGIC_MAPPED"] = fl(11)] = "MAGIC_MAPPED";
        FovFlags[FovFlags["IN_FOV"] = fl(12)] = "IN_FOV";
        FovFlags[FovFlags["WAS_IN_FOV"] = fl(13)] = "WAS_IN_FOV";
        FovFlags[FovFlags["ALWAYS_VISIBLE"] = fl(14)] = "ALWAYS_VISIBLE";
        FovFlags[FovFlags["IS_CURSOR"] = fl(15)] = "IS_CURSOR";
        FovFlags[FovFlags["IS_HIGHLIGHTED"] = fl(16)] = "IS_HIGHLIGHTED";
        FovFlags[FovFlags["ANY_KIND_OF_VISIBLE"] = FovFlags.VISIBLE | FovFlags.CLAIRVOYANT_VISIBLE | FovFlags.TELEPATHIC_VISIBLE] = "ANY_KIND_OF_VISIBLE";
        FovFlags[FovFlags["IS_WAS_ANY_KIND_OF_VISIBLE"] = FovFlags.VISIBLE |
            FovFlags.WAS_VISIBLE |
            FovFlags.CLAIRVOYANT_VISIBLE |
            FovFlags.WAS_CLAIRVOYANT_VISIBLE |
            FovFlags.TELEPATHIC_VISIBLE |
            FovFlags.WAS_TELEPATHIC_VISIBLE] = "IS_WAS_ANY_KIND_OF_VISIBLE";
        FovFlags[FovFlags["WAS_ANY_KIND_OF_VISIBLE"] = FovFlags.WAS_VISIBLE |
            FovFlags.WAS_CLAIRVOYANT_VISIBLE |
            FovFlags.WAS_TELEPATHIC_VISIBLE] = "WAS_ANY_KIND_OF_VISIBLE";
        FovFlags[FovFlags["WAS_DETECTED"] = FovFlags.WAS_ITEM_DETECTED | FovFlags.WAS_ACTOR_DETECTED] = "WAS_DETECTED";
        FovFlags[FovFlags["IS_DETECTED"] = FovFlags.ITEM_DETECTED | FovFlags.ACTOR_DETECTED] = "IS_DETECTED";
        FovFlags[FovFlags["PLAYER"] = FovFlags.IN_FOV] = "PLAYER";
        FovFlags[FovFlags["CLAIRVOYANT"] = FovFlags.CLAIRVOYANT_VISIBLE] = "CLAIRVOYANT";
        FovFlags[FovFlags["TELEPATHIC"] = FovFlags.TELEPATHIC_VISIBLE] = "TELEPATHIC";
        FovFlags[FovFlags["VIEWPORT_TYPES"] = FovFlags.PLAYER | FovFlags.VISIBLE |
            FovFlags.CLAIRVOYANT |
            FovFlags.TELEPATHIC |
            FovFlags.ITEM_DETECTED |
            FovFlags.ACTOR_DETECTED] = "VIEWPORT_TYPES";
    })(FovFlags || (FovFlags = {}));

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
            this.flags = make$9(site.width, site.height, flag);
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
            this.flags.update((v) => v |
                (FovFlags.ALWAYS_VISIBLE | FovFlags.REVEALED | FovFlags.VISIBLE));
            // TODO - onFovChange?
            this.changed = true;
        }
        makeCellAlwaysVisible(x, y) {
            this.flags[x][y] |=
                FovFlags.ALWAYS_VISIBLE | FovFlags.REVEALED | FovFlags.VISIBLE;
            // TODO - onFovChange?
            this.changed = true;
        }
        revealAll(makeVisibleToo = true) {
            const flag = FovFlags.REVEALED | (makeVisibleToo ? FovFlags.VISIBLE : 0);
            this.flags.update((v) => v | flag);
            // TODO - onFovChange?
            this.changed = true;
        }
        revealCell(x, y, makeVisibleToo = true) {
            const flag = FovFlags.REVEALED | (makeVisibleToo ? FovFlags.VISIBLE : 0);
            this.flags[x][y] |= flag;
            // TODO - onFovChange?
            this.changed = true;
        }
        hideCell(x, y) {
            this.flags[x][y] &= ~(FovFlags.MAGIC_MAPPED |
                FovFlags.REVEALED |
                FovFlags.ALWAYS_VISIBLE);
            this.flags[x][y] = this.demoteCellVisibility(this.flags[x][y]); // clears visible, etc...
            // TODO - onFovChange?
            this.changed = true;
        }
        magicMapCell(x, y) {
            this.flags[x][y] |= FovFlags.MAGIC_MAPPED;
            this.changed = true;
            // TODO - onFovChange?
        }
        reset() {
            this.flags.fill(0);
            this.changed = true;
            // TODO - onFovChange?
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
            flag &= ~(FovFlags.WAS_ANY_KIND_OF_VISIBLE | FovFlags.WAS_IN_FOV | FovFlags.WAS_DETECTED);
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
            }
            else if (!isVisible && wasVisible) {
                // if the cell ceased being visible this move
                this._callback(x, y, isVisible);
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
            }
            else if (!wasDetect && isDetect) {
                // became detected visible
                this._callback(x, y, isDetect);
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
            this.changed = true; // we updated something...
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
            return true;
        }
    }

    var index$3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        get FovFlags () { return FovFlags; },
        FOV: FOV,
        FovSystem: FovSystem
    });

    const FORBIDDEN = -1;
    const OBSTRUCTION = -2;
    const AVOIDED = 10;
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
        for (i = 0; i < width; i++) {
            for (j = 0; j < height; j++) {
                getLink(DIJKSTRA_MAP, i, j).cost = isBoundaryXY(costMap, i, j)
                    ? OBSTRUCTION
                    : costMap[i][j];
            }
        }
        clear(DIJKSTRA_MAP, maxDistance, eightWays);
        setDistance(DIJKSTRA_MAP, destinationX, destinationY, 0);
        batchOutput(DIJKSTRA_MAP, distanceMap);
        // TODO - Add this where called!
        //   distanceMap.x = destinationX;
        //   distanceMap.y = destinationY;
    }
    // Returns null if there are no beneficial moves.
    // If preferDiagonals is true, we will prefer diagonal moves.
    // Always rolls downhill on the distance map.
    // If monst is provided, do not return a direction pointing to
    // a cell that the monster avoids.
    function nextStep(distanceMap, x, y, isBlocked, useDiagonals = false) {
        let newX, newY, bestScore;
        let dir, bestDir;
        let blocked;
        // brogueAssert(coordinatesAreInMap(x, y));
        bestScore = 0;
        bestDir = NO_DIRECTION;
        for (dir = 0; dir < (useDiagonals ? 8 : 4); ++dir) {
            newX = x + DIRS$2[dir][0];
            newY = y + DIRS$2[dir][1];
            blocked = isBlocked(newX, newY, x, y, distanceMap);
            if (!blocked &&
                distanceMap[x][y] - distanceMap[newX][newY] > bestScore) {
                bestDir = dir;
                bestScore = distanceMap[x][y] - distanceMap[newX][newY];
            }
        }
        return DIRS$2[bestDir] || null;
    }
    function getClosestValidLocationOnMap(distanceMap, x, y) {
        let i, j, dist, closestDistance, lowestMapScore;
        let locX = -1;
        let locY = -1;
        const width = distanceMap.length;
        const height = distanceMap[0].length;
        closestDistance = 10000;
        lowestMapScore = 10000;
        for (i = 1; i < width - 1; i++) {
            for (j = 1; j < height - 1; j++) {
                if (distanceMap[i][j] >= 0 && distanceMap[i][j] < NO_PATH) {
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
    // Populates path[][] with a list of coordinates starting at origin and traversing down the map. Returns the number of steps in the path.
    function getPath(distanceMap, originX, originY, isBlocked, eightWays = false) {
        // actor = actor || GW.PLAYER;
        let x = originX;
        let y = originY;
        let steps = 0;
        if (distanceMap[x][y] < 0 || distanceMap[x][y] >= NO_PATH) {
            const loc = getClosestValidLocationOnMap(distanceMap, x, y);
            if (loc) {
                x = loc[0];
                y = loc[1];
            }
        }
        const path = [[x, y]];
        let dir;
        do {
            dir = nextStep(distanceMap, x, y, isBlocked, eightWays);
            if (dir) {
                x += dir[0];
                y += dir[1];
                // path[steps][0] = x;
                // path[steps][1] = y;
                path.push([x, y]);
                steps++;
                // brogueAssert(coordinatesAreInMap(x, y));
            }
        } while (dir);
        return steps ? path : null;
    }

    var path = /*#__PURE__*/Object.freeze({
        __proto__: null,
        FORBIDDEN: FORBIDDEN,
        OBSTRUCTION: OBSTRUCTION,
        AVOIDED: AVOIDED,
        NO_PATH: NO_PATH,
        calculateDistances: calculateDistances,
        nextStep: nextStep,
        getPath: getPath
    });

    /**
     * Data for an event listener.
     */
    class Listener {
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
    var EVENTS = {};
    /**
     * Add a listener for a given event.
     *
     * @param {String} event The event name.
     * @param {EventFn} fn The listener function.
     * @param {*} context The context to invoke the listener with.
     * @param {boolean} once Specify if the listener is a one-time listener.
     * @returns {Listener}
     */
    function addListener(event, fn, context, once = false) {
        if (typeof fn !== 'function') {
            throw new TypeError('The listener must be a function');
        }
        const listener = new Listener(fn, context || null, once);
        push(EVENTS, event, listener);
        return listener;
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
    function on(event, fn, context, once = false) {
        return addListener(event, fn, context, once);
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
    function once(event, fn, context) {
        return addListener(event, fn, context, true);
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
    function removeListener(event, fn, context, once = false) {
        if (!EVENTS[event])
            return false;
        if (!fn)
            return false;
        let success = false;
        forEach(EVENTS[event], (obj) => {
            if (obj.matches(fn, context, once)) {
                remove(EVENTS, event, obj);
                success = true;
            }
        });
        return success;
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
    function off(event, fn, context, once = false) {
        return removeListener(event, fn, context, once);
    }
    /**
     * Clear event by name.
     *
     * @param {String} evt The Event name.
     */
    function clearEvent(event) {
        if (EVENTS[event]) {
            EVENTS[event] = null;
        }
    }
    /**
     * Remove all listeners, or those of the specified event.
     *
     * @param {(String|Symbol)} [event] The event name.
     * @returns {EventEmitter} `this`.
     * @public
     */
    function removeAllListeners(event) {
        if (event) {
            clearEvent(event);
        }
        else {
            EVENTS = {};
        }
    }
    /**
     * Calls each of the listeners registered for a given event.
     *
     * @param {String} event The event name.
     * @param {...*} args The additional arguments to the event handlers.
     * @returns {boolean} `true` if the event had listeners, else `false`.
     * @public
     */
    async function emit(...args) {
        const event = args[0];
        if (!EVENTS[event])
            return false; // no events to send
        let listener = EVENTS[event];
        while (listener) {
            let next = listener.next;
            if (listener.once)
                remove(EVENTS, event, listener);
            await listener.fn.apply(listener.context, args);
            listener = next;
        }
        return true;
    }

    var events = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Listener: Listener,
        addListener: addListener,
        on: on,
        once: once,
        removeListener: removeListener,
        off: off,
        clearEvent: clearEvent,
        removeAllListeners: removeAllListeners,
        emit: emit
    });

    function make$5(v) {
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
        make: make$5
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
        push(fn, delay = 1) {
            let item;
            if (this.cache) {
                item = this.cache;
                this.cache = item.next;
                item.next = null;
            }
            else {
                item = { fn: null, time: 0, next: null };
            }
            item.fn = fn;
            item.time = this.time + delay;
            if (!this.next) {
                this.next = item;
            }
            else {
                let current = this;
                let next = current.next;
                while (next && next.time <= item.time) {
                    current = next;
                    next = current.next;
                }
                item.next = current.next;
                current.next = item;
            }
            return item;
        }
        pop() {
            const n = this.next;
            if (!n)
                return null;
            this.next = n.next;
            n.next = this.cache;
            this.cache = n;
            this.time = Math.max(n.time, this.time); // so you can schedule -1 as a time uint
            return n.fn;
        }
        remove(item) {
            if (!item || !this.next)
                return;
            if (this.next === item) {
                this.next = item.next;
                return;
            }
            let prev = this.next;
            let current = prev.next;
            while (current && current !== item) {
                prev = current;
                current = current.next;
            }
            if (current === item) {
                prev.next = current.next;
            }
        }
    }
    // export const scheduler = new Scheduler();

    var scheduler = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Scheduler: Scheduler
    });

    class Buffer extends Buffer$1 {
        constructor(canvas) {
            super(canvas.width, canvas.height);
            this._target = canvas;
            canvas.copyTo(this);
        }
        // get canvas() { return this._target; }
        clone() {
            const other = new (this.constructor)(this._target);
            other.copy(this);
            return other;
        }
        toGlyph(ch) {
            return this._target.toGlyph(ch);
        }
        render() {
            this._target.draw(this);
            return this;
        }
        load() {
            this._target.copyTo(this);
            return this;
        }
    }

    class Glyphs {
        constructor(opts = {}) {
            this._tileWidth = 12;
            this._tileHeight = 16;
            this.needsUpdate = true;
            this._map = {};
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
            glyphs._initGlyphs(basicOnly);
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
            return this._map[ch] || -1;
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
                if (this._map[ch] === undefined)
                    this._map[ch] = n;
                this._ctx.fillText(ch, cx, cy);
            }
            this._ctx.restore();
            this.needsUpdate = true;
        }
        _initGlyphs(basicOnly = false) {
            for (let i = 32; i < 127; ++i) {
                this.draw(i, String.fromCharCode(i));
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
                '\u2690',
                '\u2691',
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
                this.draw(i, ch);
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
                    this.draw(i + 127, ch);
                });
            }
        }
    }

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
    class BaseCanvas {
        constructor(width, height, glyphs) {
            this.mouse = { x: -1, y: -1 };
            this._renderRequested = false;
            this._width = 50;
            this._height = 25;
            this._node = this._createNode();
            this._createContext();
            this._configure(width, height, glyphs);
            this._buffer = new Buffer(this);
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
        toGlyph(ch) {
            if (typeof ch === 'number')
                return ch;
            return this._glyphs.forChar(ch);
        }
        get buffer() {
            return this._buffer;
        }
        _createNode() {
            return document.createElement('canvas');
        }
        _configure(width, height, glyphs) {
            this._width = width;
            this._height = height;
            this._setGlyphs(glyphs);
        }
        _setGlyphs(glyphs) {
            if (glyphs === this._glyphs)
                return false;
            this._glyphs = glyphs;
            this.resize(this._width, this._height);
            return true;
        }
        resize(width, height) {
            this._width = width;
            this._height = height;
            if (this._buffer) {
                this._buffer.resize(width, height);
            }
            const node = this.node;
            node.width = this._width * this.tileWidth;
            node.height = this._height * this.tileHeight;
        }
        _requestRender() {
            if (this._renderRequested)
                return;
            this._renderRequested = true;
            requestAnimationFrame(() => this._render());
        }
        copyTo(data) {
            if (!this.buffer)
                return; // startup/constructor
            data.copy(this.buffer);
        }
        render() {
            this.buffer.render();
        }
        hasXY(x, y) {
            return x >= 0 && y >= 0 && x < this.width && y < this.height;
        }
        set onclick(fn) {
            if (fn) {
                this.node.onclick = (e) => {
                    const x = this._toX(e.offsetX);
                    const y = this._toY(e.offsetY);
                    const ev = makeMouseEvent(e, x, y);
                    fn(ev);
                };
            }
            else {
                this.node.onclick = null;
            }
        }
        set onmousemove(fn) {
            if (fn) {
                this.node.onmousemove = (e) => {
                    const x = this._toX(e.offsetX);
                    const y = this._toY(e.offsetY);
                    if (x == this.mouse.x && y == this.mouse.y)
                        return;
                    this.mouse.x = x;
                    this.mouse.y = y;
                    const ev = makeMouseEvent(e, x, y);
                    fn(ev);
                };
            }
            else {
                this.node.onmousemove = null;
            }
        }
        set onmouseup(fn) {
            if (fn) {
                this.node.onmouseup = (e) => {
                    const x = this._toX(e.offsetX);
                    const y = this._toY(e.offsetY);
                    const ev = makeMouseEvent(e, x, y);
                    fn(ev);
                };
            }
            else {
                this.node.onmouseup = null;
            }
        }
        set onkeydown(fn) {
            if (fn) {
                this.node.onkeydown = (e) => {
                    e.stopPropagation();
                    const ev = makeKeyEvent(e);
                    fn(ev);
                };
            }
            else {
                this.node.onkeydown = null;
            }
        }
        _toX(offsetX) {
            return clamp(Math.floor(this.width * (offsetX / this.node.clientWidth)), 0, this.width - 1);
        }
        _toY(offsetY) {
            return clamp(Math.floor(this.height * (offsetY / this.node.clientHeight)), 0, this.height - 1);
        }
    }
    class Canvas2D extends BaseCanvas {
        constructor(width, height, glyphs) {
            super(width, height, glyphs);
        }
        _createContext() {
            const ctx = this.node.getContext('2d');
            if (!ctx) {
                throw new NotSupportedError('2d context not supported!');
            }
            this._ctx = ctx;
        }
        // protected _set(x: number, y: number, style: number) {
        //     const result = super._set(x, y, style);
        //     if (result) {
        //         this._changed[y * this.width + x] = 1;
        //     }
        //     return result;
        // }
        resize(width, height) {
            super.resize(width, height);
            this._data = new Uint32Array(width * height);
            this._changed = new Int8Array(width * height);
        }
        draw(data) {
            // TODO - Remove?
            if (data._data.every((style, i) => style === this._data[i]))
                return false;
            data.changed = false;
            let changed = false;
            const src = data._data;
            const raw = this._data;
            for (let i = 0; i < raw.length; ++i) {
                if (raw[i] !== src[i]) {
                    raw[i] = src[i];
                    this._changed[i] = 1;
                    changed = true;
                }
            }
            if (!changed)
                return false;
            this.buffer.changed = true;
            this._requestRender();
            return true;
        }
        _render() {
            this._renderRequested = false;
            for (let i = 0; i < this._changed.length; ++i) {
                if (this._changed[i])
                    this._renderCell(i);
                this._changed[i] = 0;
            }
            this.buffer.changed = false;
        }
        _renderCell(index) {
            const x = index % this.width;
            const y = Math.floor(index / this.width);
            const style = this._data[index];
            const glyph = (style / (1 << 24)) >> 0;
            const bg = (style >> 12) & 0xfff;
            const fg = style & 0xfff;
            const px = x * this.tileWidth;
            const py = y * this.tileHeight;
            const gx = (glyph % 16) * this.tileWidth;
            const gy = Math.floor(glyph / 16) * this.tileHeight;
            const d = this.glyphs.ctx.getImageData(gx, gy, this.tileWidth, this.tileHeight);
            for (let di = 0; di < d.width * d.height; ++di) {
                const pct = d.data[di * 4] / 255;
                const inv = 1.0 - pct;
                d.data[di * 4 + 0] =
                    pct * (((fg & 0xf00) >> 8) * 17) +
                        inv * (((bg & 0xf00) >> 8) * 17);
                d.data[di * 4 + 1] =
                    pct * (((fg & 0xf0) >> 4) * 17) +
                        inv * (((bg & 0xf0) >> 4) * 17);
                d.data[di * 4 + 2] =
                    pct * ((fg & 0xf) * 17) + inv * ((bg & 0xf) * 17);
                d.data[di * 4 + 3] = 255; // not transparent anymore
            }
            this._ctx.putImageData(d, px, py);
        }
    }
    // export function withImage(image: ImageOptions | HTMLImageElement | string) {
    //     let opts = {} as CanvasOptions;
    //     if (typeof image === 'string') {
    //         opts.glyphs = Glyphs.fromImage(image);
    //     } else if (image instanceof HTMLImageElement) {
    //         opts.glyphs = Glyphs.fromImage(image);
    //     } else {
    //         if (!image.image) throw new Error('You must supply the image.');
    //         Object.assign(opts, image);
    //         opts.glyphs = Glyphs.fromImage(image.image);
    //     }
    //     let canvas;
    //     try {
    //         canvas = new Canvas(opts);
    //     } catch (e) {
    //         if (!(e instanceof NotSupportedError)) throw e;
    //     }
    //     if (!canvas) {
    //         canvas = new Canvas2D(opts);
    //     }
    //     return canvas;
    // }
    // export function withFont(src: FontOptions | string) {
    //     if (typeof src === 'string') {
    //         src = { font: src } as FontOptions;
    //     }
    //     src.glyphs = Glyphs.fromFont(src);
    //     let canvas;
    //     try {
    //         canvas = new Canvas(src);
    //     } catch (e) {
    //         if (!(e instanceof NotSupportedError)) throw e;
    //     }
    //     if (!canvas) {
    //         canvas = new Canvas2D(src);
    //     }
    //     return canvas;
    // }

    // Based on: https://github.com/ondras/fastiles/blob/master/ts/shaders.ts (v2.1.0)
    const VS = `
#version 300 es
in uvec2 position;
in uvec2 uv;
in uint style;
out vec2 fsUv;
flat out uint fsStyle;
uniform highp uvec2 tileSize;
uniform uvec2 viewportSize;
void main() {
	ivec2 positionPx = ivec2(position * tileSize);
	vec2 positionNdc = (vec2(positionPx * 2) / vec2(viewportSize))-1.0;
	positionNdc.y *= -1.0;
	gl_Position = vec4(positionNdc, 0.0, 1.0);
	fsUv = vec2(uv);
	fsStyle = style;
}`.trim();
    const FS = `
#version 300 es
precision highp float;
in vec2 fsUv;
flat in uint fsStyle;
out vec4 fragColor;
uniform sampler2D font;
uniform highp uvec2 tileSize;
void main() {
	uvec2 fontTiles = uvec2(textureSize(font, 0)) / tileSize;

	uint glyph = (fsStyle & uint(0xFF000000)) >> 24;
	uint glyphX = (glyph & uint(0xF));
	uint glyphY = (glyph >> 4);
	uvec2 fontPosition = uvec2(glyphX, glyphY);

	uvec2 fontPx = (tileSize * fontPosition) + uvec2(vec2(tileSize) * fsUv);
	vec3 texel = texelFetch(font, ivec2(fontPx), 0).rgb;

	float s = 15.0;
	uint fr = (fsStyle & uint(0xF00)) >> 8;
	uint fg = (fsStyle & uint(0x0F0)) >> 4;
	uint fb = (fsStyle & uint(0x00F)) >> 0;
	vec3 fgRgb = vec3(fr, fg, fb) / s;
  
	uint br = (fsStyle & uint(0xF00000)) >> 20;
	uint bg = (fsStyle & uint(0x0F0000)) >> 16;
	uint bb = (fsStyle & uint(0x00F000)) >> 12;
	vec3 bgRgb = vec3(br, bg, bb) / s;
  
	fragColor = vec4(mix(bgRgb, fgRgb, texel), 1.0);
}`.trim();

    const VERTICES_PER_TILE = 6;
    // export class BufferGL extends Buffer.Buffer {
    //     constructor(canvas: Buffer.BufferTarget) {
    //         super(canvas);
    //     }
    //     protected _makeData(): Uint32Array {
    //         return new Uint32Array(this.width * this.height * VERTICES_PER_TILE);
    //     }
    //     protected _index(x: number, y: number): number {
    //         let index = y * this.width + x;
    //         index *= VERTICES_PER_TILE;
    //         return index;
    //     }
    //     set(x: number, y: number, style: number): boolean {
    //         let index = this._index(x, y);
    //         const current = this._data[index + 2];
    //         if (current !== style) {
    //             this._data[index + 2] = style;
    //             this._data[index + 5] = style;
    //             this.changed = true;
    //             return true;
    //         }
    //         return false;
    //     }
    //     copy(other: Buffer.DataBuffer): this {
    //         if (this.height !== other.height || this.width !== other.width)
    //             throw new Error('Buffers must be same size!');
    //         if (this._data.length === other._data.length) {
    //             this._data.set(other._data);
    //         } else {
    //             for (let x = 0; x < this.width; ++x) {
    //                 for (let y = 0; y < this.width; ++y) {
    //                     this.set(x, y, other.get(x, y));
    //                 }
    //             }
    //         }
    //         this.changed = true;
    //         return this;
    //     }
    // }
    // Based on: https://github.com/ondras/fastiles/blob/master/ts/scene.ts (v2.1.0)
    class CanvasGL extends BaseCanvas {
        constructor(width, height, glyphs) {
            super(width, height, glyphs);
        }
        // _createBuffer() {
        //     return new BufferGL(this);
        // }
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
            const tileCount = this.width * this.height;
            this._buffers.style && gl.deleteBuffer(this._buffers.style);
            this._data = new Uint32Array(tileCount * VERTICES_PER_TILE);
            const style = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, style);
            gl.vertexAttribIPointer(attribs['style'], 1, gl.UNSIGNED_INT, 0, 0);
            Object.assign(this._buffers, { style });
        }
        _setGlyphs(glyphs) {
            if (!super._setGlyphs(glyphs))
                return false;
            const gl = this._gl;
            const uniforms = this._uniforms;
            gl.uniform2uiv(uniforms['tileSize'], [this.tileWidth, this.tileHeight]);
            this._uploadGlyphs();
            return true;
        }
        _uploadGlyphs() {
            if (!this._glyphs.needsUpdate)
                return;
            const gl = this._gl;
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._glyphs.node);
            this._requestRender();
            this._glyphs.needsUpdate = false;
        }
        resize(width, height) {
            super.resize(width, height);
            const gl = this._gl;
            const uniforms = this._uniforms;
            gl.viewport(0, 0, this.node.width, this.node.height);
            gl.uniform2ui(uniforms['viewportSize'], this.node.width, this.node.height);
            // this._data = new Uint32Array(width * height * VERTICES_PER_TILE);
            this._createGeometry();
            this._createData();
        }
        // protected _set(x: number, y: number, style: number) {
        //     let index = y * this.width + x;
        //     index *= VERTICES_PER_TILE;
        //     const current = this._data[index + 2];
        //     if (current !== style) {
        //         this._data[index + 2] = style;
        //         this._data[index + 5] = style;
        //         this._requestRender();
        //         return true;
        //     }
        //     return false;
        // }
        draw(data) {
            // TODO - remove?
            if (data._data.every((style, i) => {
                const index = 2 + i * VERTICES_PER_TILE;
                return style === this._data[index];
            })) {
                return false;
            }
            data._data.forEach((style, i) => {
                const index = i * VERTICES_PER_TILE;
                this._data[index + 2] = style;
                this._data[index + 5] = style;
            });
            this._requestRender();
            data.changed = false;
            return true;
        }
        copyTo(data) {
            data.changed = false;
            const n = this.width * this.height;
            for (let i = 0; i < n; ++i) {
                const index = i * VERTICES_PER_TILE;
                data._data[i] = this._data[index + 2];
            }
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
            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffers.style);
            gl.bufferData(gl.ARRAY_BUFFER, this._data, gl.DYNAMIC_DRAW);
            gl.drawArrays(gl.TRIANGLES, 0, this._width * this._height * VERTICES_PER_TILE);
            this.buffer.changed = false;
        }
    }
    // Copy of: https://github.com/ondras/fastiles/blob/master/ts/utils.ts (v2.1.0)
    const QUAD = [0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1];
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
    function createGeometry(gl, attribs, width, height) {
        let tileCount = width * height;
        let positionData = new Uint16Array(tileCount * QUAD.length);
        let uvData = new Uint8Array(tileCount * QUAD.length);
        let i = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                QUAD.forEach((value) => {
                    positionData[i] = (i % 2 ? y : x) + value;
                    uvData[i] = value;
                    i++;
                });
            }
        }
        const position = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, position);
        gl.vertexAttribIPointer(attribs['position'], 2, gl.UNSIGNED_SHORT, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
        const uv = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uv);
        gl.vertexAttribIPointer(attribs['uv'], 2, gl.UNSIGNED_BYTE, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, uvData, gl.STATIC_DRAW);
        return { position, uv };
    }

    function make$4(...args) {
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
        let canvas;
        try {
            canvas = new CanvasGL(width, height, glyphs);
        }
        catch (e) {
            if (!(e instanceof NotSupportedError))
                throw e;
        }
        if (!canvas) {
            canvas = new Canvas2D(width, height, glyphs);
        }
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
        if (opts.io || opts.loop) {
            let loop$1 = opts.loop || loop;
            canvas.onclick = (e) => loop$1.pushEvent(e);
            canvas.onmousemove = (e) => loop$1.pushEvent(e);
            canvas.onmouseup = (e) => loop$1.pushEvent(e);
            // canvas.onkeydown = (e) => loop.pushEvent(e); // Keyboard events require tabindex to be set, better to let user do this.
        }
        return canvas;
    }

    var index$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Buffer: Buffer,
        Glyphs: Glyphs,
        NotSupportedError: NotSupportedError,
        BaseCanvas: BaseCanvas,
        Canvas2D: Canvas2D,
        CanvasGL: CanvasGL,
        make: make$4
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
                parts.push('fg: ' + this.fg.toString(true));
            if (!this.bg.isNull())
                parts.push('bg: ' + this.bg.toString(true));
            if (this.opacity !== 100)
                parts.push('opacity: ' + this.opacity);
            return '{ ' + parts.join(', ') + ' }';
        }
    }
    const sprites = {};
    function make$3(...args) {
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
            fg = make$8(fg);
        else if (fg === undefined || fg === null)
            fg = -1;
        if (typeof bg === 'string')
            bg = from$2(bg);
        else if (Array.isArray(bg))
            bg = make$8(bg);
        else if (bg === undefined || bg === null)
            bg = -1;
        return new Sprite(ch, fg, bg, opacity);
    }
    function from$1(...args) {
        if (args.length == 1 && typeof args[0] === 'string') {
            const sprite = sprites[args[0]];
            if (!sprite)
                throw new Error('Failed to find sprite: ' + args[0]);
            return sprite;
        }
        return make$3(args);
    }
    function install$2(name, ...args) {
        let sprite;
        // @ts-ignore
        sprite = make$3(...args);
        sprite.name = name;
        sprites[name] = sprite;
        return sprite;
    }

    var index$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Sprite: Sprite,
        sprites: sprites,
        make: make$3,
        from: from$1,
        install: install$2,
        Mixer: Mixer,
        makeMixer: makeMixer
    });

    var types = /*#__PURE__*/Object.freeze({
        __proto__: null
    });

    const data = {};
    const config$1 = {};
    // export const make: any = {};
    // export const flags: any = {};

    const templates = {};
    config$1.message = config$1.message || {};
    function install$1(id, msg) {
        const template = compile(msg);
        templates[id] = template;
        return template;
    }
    function installAll$1(config) {
        Object.entries(config).forEach(([id, msg]) => install$1(id, msg));
    }
    function get(msgOrId) {
        return templates[msgOrId] || null;
    }
    const handlers = [];
    function add(msg, args) {
        return addAt(-1, -1, msg, args);
    }
    function addAt(x, y, msg, args) {
        const template = templates[msg];
        if (template) {
            msg = template(args);
        }
        else if (args) {
            msg = apply(msg, args);
        }
        handlers.forEach((h) => h.addMessage(x, y, msg));
    }
    function addCombat(x, y, msg, args) {
        const template = templates[msg];
        if (template) {
            msg = template(args);
        }
        else if (args) {
            msg = apply(msg, args);
        }
        handlers.forEach((h) => h.addCombatMessage(x, y, msg));
    }
    class MessageCache {
        constructor(opts = {}) {
            this.ARCHIVE = [];
            this.CONFIRMED = [];
            this.ARCHIVE_LINES = 30;
            this.MSG_WIDTH = 80;
            this.NEXT_WRITE_INDEX = 0;
            this.NEEDS_UPDATE = true;
            this.COMBAT_MESSAGE = null;
            this.matchFn = opts.match || TRUE;
            this.ARCHIVE_LINES = opts.length || 30;
            this.MSG_WIDTH = opts.width || 80;
            for (let i = 0; i < this.ARCHIVE_LINES; ++i) {
                this.ARCHIVE[i] = null;
                this.CONFIRMED[i] = false;
            }
            handlers.push(this);
        }
        get needsUpdate() {
            return this.NEEDS_UPDATE;
        }
        set needsUpdate(needs) {
            this.NEEDS_UPDATE = needs;
        }
        // function messageWithoutCaps(msg, requireAcknowledgment) {
        _addMessageLine(msg) {
            if (!length(msg)) {
                return;
            }
            // Add the message to the archive.
            this.ARCHIVE[this.NEXT_WRITE_INDEX] = msg;
            this.CONFIRMED[this.NEXT_WRITE_INDEX] = false;
            this.NEXT_WRITE_INDEX =
                (this.NEXT_WRITE_INDEX + 1) % this.ARCHIVE_LINES;
        }
        addMessage(x, y, msg) {
            if (!this.matchFn(x, y))
                return;
            this.commitCombatMessage();
            this._addMessage(msg);
        }
        _addMessage(msg) {
            var _a;
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
            const lines = splitIntoLines(msg, this.MSG_WIDTH);
            if ((_a = config$1.message) === null || _a === void 0 ? void 0 : _a.reverseMultiLine) {
                lines.reverse();
            }
            lines.forEach((l) => this._addMessageLine(l));
            // display the message:
            this.NEEDS_UPDATE = true;
            // if (GAME.playbackMode) {
            // 	GAME.playbackDelayThisTurn += GAME.playbackDelayPerTurn * 5;
            // }
        }
        addCombatMessage(x, y, msg) {
            if (!this.matchFn(x, y))
                return;
            this._addCombatMessage(msg);
        }
        _addCombatMessage(msg) {
            if (!this.COMBAT_MESSAGE) {
                this.COMBAT_MESSAGE = msg;
            }
            else {
                this.COMBAT_MESSAGE += ', ' + capitalize(msg);
            }
            this.NEEDS_UPDATE = true;
        }
        commitCombatMessage() {
            if (!this.COMBAT_MESSAGE)
                return false;
            this._addMessage(this.COMBAT_MESSAGE + '.');
            this.COMBAT_MESSAGE = null;
            return true;
        }
        confirmAll() {
            for (let i = 0; i < this.CONFIRMED.length; i++) {
                this.CONFIRMED[i] = true;
            }
            this.NEEDS_UPDATE = true;
        }
        forEach(fn) {
            this.commitCombatMessage();
            for (let i = 0; i < this.ARCHIVE_LINES; ++i) {
                const n = (this.ARCHIVE_LINES - i + this.NEXT_WRITE_INDEX - 1) %
                    this.ARCHIVE_LINES;
                const msg = this.ARCHIVE[n];
                if (!msg)
                    return;
                if (fn(msg, this.CONFIRMED[n], i) === false)
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
        templates: templates,
        install: install$1,
        installAll: installAll$1,
        get: get,
        handlers: handlers,
        add: add,
        addAt: addAt,
        addCombat: addCombat,
        MessageCache: MessageCache
    });

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
    function make$2(opts = {}) {
        return new Blob(opts);
    }

    var blob = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Blob: Blob,
        fillBlob: fillBlob,
        make: make$2
    });

    // const LIGHT_SMOOTHING_THRESHOLD = 150;       // light components higher than this magnitude will be toned down a little
    const config = (config$1.light = {
        INTENSITY_DARK: 20,
        INTENSITY_SHADOW: 50,
    }); // less than 20% for highest color in rgb
    let LIGHT_COMPONENTS = make$8();
    class Light {
        constructor(color, radius = 1, fadeTo = 0, pass = false) {
            this.fadeTo = 0;
            this.passThroughActors = false;
            this.id = null;
            this.color = from$2(color); /* color */
            this.radius = make$b(radius);
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
    function make$1(...args) {
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
        return make$1(arg);
    }
    function install(id, ...args) {
        let source;
        if (args.length == 1) {
            source = make$1(args[0]);
        }
        else {
            source = make$1(args[0], args[1], args[2], args[3]);
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

    var LightFlags;
    (function (LightFlags) {
        LightFlags[LightFlags["LIT"] = fl(0)] = "LIT";
        LightFlags[LightFlags["IN_SHADOW"] = fl(1)] = "IN_SHADOW";
        LightFlags[LightFlags["DARK"] = fl(2)] = "DARK";
        // MAGIC_DARK = Fl(3),
        LightFlags[LightFlags["CHANGED"] = fl(4)] = "CHANGED";
    })(LightFlags || (LightFlags = {}));
    class LightSystem {
        constructor(map, opts = {}) {
            this.staticLights = null;
            this.site = map;
            this.ambient = from$2(opts.ambient || 'white').toLight();
            this.changed = false;
            this.glowLightChanged = false;
            this.dynamicLightChanged = false;
            this.light = make$9(map.width, map.height, () => this.ambient.slice());
            this.glowLight = make$9(map.width, map.height, () => this.ambient.slice());
            this.oldLight = make$9(map.width, map.height, () => this.ambient.slice());
            this.flags = make$9(map.width, map.height);
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

    var index = /*#__PURE__*/Object.freeze({
        __proto__: null,
        config: config,
        Light: Light,
        intensity: intensity,
        isDarkLight: isDarkLight,
        isShadowLight: isShadowLight,
        make: make$1,
        lights: lights,
        from: from,
        install: install,
        installAll: installAll,
        LightSystem: LightSystem
    });

    // Tweeing API based on - http://tweenjs.github.io/tween.js/
    class Tween {
        constructor(src) {
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
            this._startCb = null;
            this._updateCb = null;
            this._repeatCb = null;
            this._finishCb = null;
            this._easing = linear;
            this._interpolate = interpolate;
            this._obj = src;
        }
        isRunning() {
            return this._time < this._duration;
        }
        onStart(cb) {
            this._startCb = cb;
            return this;
        }
        onUpdate(cb) {
            this._updateCb = cb;
            return this;
        }
        onRepeat(cb) {
            this._repeatCb = cb;
            return this;
        }
        onFinish(cb) {
            this._finishCb = cb;
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
        start() {
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
            return this;
        }
        tick(dt) {
            if (!this.isRunning())
                return this;
            this._time += dt;
            if (this._startTime) {
                if (this._startTime > this._time)
                    return this;
                this._time -= this._startTime;
                this._startTime = 0;
            }
            if (this._count === 0) {
                this._count = 1;
                if (this._startCb) {
                    this._startCb.call(this, this._obj, 0);
                }
            }
            const pct = this._easing(this._time / this._duration);
            let madeChange = this._updateProperties(this._obj, this._start, this._goal, pct);
            if (madeChange && this._updateCb) {
                this._updateCb.call(this, this._obj, pct);
            }
            if (this._time >= this._duration) {
                if (this._repeat > this._count) {
                    // reset starting values
                    Object.entries(this._start).forEach(([key, value]) => {
                        this._obj[key] = value;
                    });
                    this._time -= this._duration;
                    this._startTime =
                        this._repeatDelay > -1 ? this._repeatDelay : this._delay;
                    ++this._count;
                    if (this._yoyo) {
                        [this._start, this._goal] = [this._goal, this._start];
                    }
                    if (this._repeatCb)
                        this._repeatCb.call(this, this._obj, this._count);
                }
                else if (this._finishCb)
                    this._finishCb.call(this, this._obj, 1);
            }
            return this;
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
    function make(src) {
        return new Tween(src);
    }
    function linear(pct) {
        return clamp(pct, 0, 1);
    }
    // TODO - string, bool, Color
    function interpolate(start, goal, pct) {
        return Math.floor((goal - start) * pct) + start;
    }

    var tween = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Tween: Tween,
        make: make,
        linear: linear,
        interpolate: interpolate
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
    exports.arrayDelete = arrayDelete;
    exports.arrayFindRight = arrayFindRight;
    exports.arrayIncludesAll = arrayIncludesAll;
    exports.arrayInsert = arrayInsert;
    exports.arrayNext = arrayNext;
    exports.arrayPrev = arrayPrev;
    exports.arraysIntersect = arraysIntersect;
    exports.blob = blob;
    exports.buffer = buffer;
    exports.canvas = index$2;
    exports.clamp = clamp;
    exports.color = index$5;
    exports.colors = colors;
    exports.config = config$1;
    exports.data = data;
    exports.events = events;
    exports.first = first;
    exports.flag = flag;
    exports.fov = index$3;
    exports.frequency = frequency;
    exports.grid = grid;
    exports.io = io;
    exports.light = index;
    exports.list = list;
    exports.loop = loop;
    exports.message = message;
    exports.nextIndex = nextIndex;
    exports.object = object;
    exports.path = path;
    exports.prevIndex = prevIndex;
    exports.range = range;
    exports.rng = rng;
    exports.scheduler = scheduler;
    exports.sprite = index$1;
    exports.sprites = sprites;
    exports.sum = sum;
    exports.text = index$4;
    exports.tween = tween;
    exports.types = types;
    exports.xy = xy;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=gw-utils.js.map
