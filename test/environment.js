// my-custom-environment
const NodeEnvironment = require('jest-environment-node');
const { BufferedConsole } = require('@jest/console');

class CustomEnvironment extends NodeEnvironment {
    constructor(config, context) {
        super(config, context);

        this.console = new BufferedConsole();
        this.realConsole = context.console;
    }

    async setup() {
        await super.setup();
        // jest.mock('console', () => ({
        //     console: this.console,
        // }));
    }

    async teardown() {
        // jest.unmock('console');
        await super.teardown();
    }

    getVmContext() {
        return super.getVmContext();
    }

    async handleTestEvent(event, state) {
        // const messages = this.console._buffer;
        // if (event.name === 'test_fn_start') {
        //     this.global.console = this.console;
        //     console.log(
        //         'fn_start - same console? ',
        //         this.global.console === this.context.console
        //     );
        // } else {
        //     this.global.console = this.realConsole;
        // }
        // if (event.name === 'test_fn_failure') {
        //     if (this.realConsole._buffer) {
        //         messages.forEach((msg) => this.realConsole._buffer.push(msg));
        //     } else if (this.realConsole._log) {
        //         messages.forEach((msg) =>
        //             this.realConsole._log(msg.type, msg.message)
        //         );
        //     }
        // } else if (messages.length) {
        //     messages.splice(0, messages.length); // delete all messages
        // }
    }
}

module.exports = CustomEnvironment;
