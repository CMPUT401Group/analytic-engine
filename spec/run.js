import Jasmine from 'jasmine';
import Fiber from 'fibers';

function main() {
    var jasmine = new Jasmine();
    jasmine.loadConfigFile('spec/support/jasmine.json');
    jasmine.execute();
}

// Here we run the main executable.
// This makes javascript synchronous instead of the asynchronous.
Fiber(main).run();