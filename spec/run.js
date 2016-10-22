import Jasmine from 'jasmine';
import Fiber from 'fibers';
import log from 'loglevel';

// Set log level to "error" so anything lower won't be printed.
log.setDefaultLevel("error");

function main() {
    var jasmine = new Jasmine();
    jasmine.loadConfigFile('spec/support/jasmine.json');
    jasmine.execute();
}

// Here we run the main executable.
// This makes javascript synchronous instead of the asynchronous.
Fiber(main).run();