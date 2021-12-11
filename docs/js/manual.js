// This is adapted from: https://github.com/ondras/rot.js/blob/master/manual/manual.js

var converter = new showdown.Converter();
converter.setFlavor('github');

var CURRENT_EXAMPLE = null;
document.addEventListener(
    'click',
    function () {
        if (CURRENT_EXAMPLE) {
            CURRENT_EXAMPLE.close();
        }
    },
    false
);

const _st = setTimeout;
const _si = setInterval;

class Example {
    constructor(node, globals) {
        this._globals = globals;
        this._source = $(node);
        this._source.attr('data-syntax', 'js');

        this._node = this._source.parent();
        this._node.addClass('example');

        this._ta = $('<textarea></textarea>').addClass('code');
        this._ta.spellcheck = false;

        this._result = $('<code></code>').addClass(
            'result javascript language-javascript'
        );
        this._time = $('<div></div>').addClass('time');

        this._timers = [];
        this._loop = new GWU.io.Loop();

        this._useCode(node.textContent);
    }

    click(e) {
        e.stopPropagation();
        if (CURRENT_EXAMPLE !== this) {
            this.open();
        }
    }

    open() {
        CURRENT_EXAMPLE = this;

        this.stop();
        const height = this._source.height();
        const width = this._source.width();
        const text = this._source.text();
        this._ta.height(height);
        this._ta.width(width);
        this._ta.text(text);
        this._source.replaceWith(this._ta);
        this._ta.on('click', this.click.bind(this));
        this._ta.focus();
    }

    close() {
        CURRENT_EXAMPLE = null;
        // this._loop.start();
        const code = this._ta.val();
        this._useCode(code);
    }

    stop() {
        this._timers.forEach((t) => clearTimeout(t));
        this._timers = [];
        // this._loop.end();
    }

    /**
     * @param {string} code no html entities, plain code
     */
    _useCode(code) {
        this._node.html('');
        this._result.html('');
        this._source.html('');
        this._node.append(this._source);
        this._node.append('<br>');
        this._node.append(this._result);
        this._node.append(this._time);

        this._source.on('click', this.click.bind(this));

        this._source.text(code);
        hljs.highlightElement(this._source[0]);

        const result = this._result;
        function show() {
            let out = [];

            for (var i = 0; i < arguments.length; i++) {
                var arg = arguments[i];
                if (!arg) {
                    out.push(JSON.stringify(arg));
                } else if (arg.node) {
                    result.append(arg.node);
                } else if (!arg.nodeType) {
                    if (!Array.isArray(arg) && typeof arg == 'object') {
                        if (arg.stack) {
                            arg = arg.stack;
                        } else {
                            arg = JSON.stringify(arg);
                        }
                    }
                    out.push(arg);
                } else {
                    result.append(arg);
                }
            }

            if (out.length) {
                $('<div></div>').html(out.join(', ')).appendTo(result);
            }
        }

        var t1 = Date.now();
        this._eval(code, show);
        var t2 = Date.now();
        this._time.html(`executed in ${t2 - t1}ms`);
    }

    _eval(code, SHOW) {
        const timers = this._timers;
        const setTimeout = (...args) => {
            const r = _st(...args);
            timers.push(r);
            return r;
        };

        const setInterval = (...args) => {
            const r = _si(...args);
            timers.push(r);
            return r;
        };

        const GLOBAL = this._globals;
        const LOOP = this._loop;
        const ELEMENT = this._result.get(0);

        try {
            eval(code);
        } catch (e) {
            SHOW(e);
        }

        this._result.keydown(LOOP.onkeydown.bind(LOOP));
        this._result.attr('tabindex', 1);
    }
}

var Manual = {
    _examples: [],
    _hash: '',
    _global: {},

    _hashChange: function (e) {
        var hash = location.hash || 'intro';
        if (hash.charAt(0) == '#') {
            hash = hash.substring(1);
        }
        if (hash == this._hash) {
            return;
        }
        this._hash = hash;

        this._switchTo(this._hash);
    },

    _switchTo: function (what) {
        $.get(
            'pages/' + what + '.md?' + Math.random(),
            this._response.bind(this)
        ).fail(() => {
            this._switchTo('intro');
        });

        $('#menu a').each(function (i) {
            const $link = $(this);
            const href = $link.prop('href');
            if (href.lastIndexOf(what) == href.length - what.length) {
                $link.addClass('active');
                const $parent = $link.parent().parent().parent();
                if ($parent.is('li')) {
                    $parent.children('a').addClass('active');
                }
            } else {
                $link.removeClass('active');
            }
        });
    },

    _response: function (data, status) {
        // if (status != 'success') {
        //     this._switchTo('intro');
        //     return;
        // }
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        this._examples.forEach((e) => e.stop());

        let html = converter.makeHtml(data);
        $('#content').html(html);

        const GLOBAL = this._global;
        const examples = (this._examples = []);
        $('#content pre code.js').each(function (i) {
            examples.push(new Example(this, GLOBAL));
        });
    },

    init: function () {
        var year = new Date().getFullYear();
        $('#year').html(year);

        $.get('VERSION', function (data, status) {
            if (status != 'success') {
                return;
            }
            $('#version').html(data.trim());
        });

        window.onhashchange = this._hashChange.bind(this);
        this._hashChange();
    },
};

window.onload = () => Manual.init();
