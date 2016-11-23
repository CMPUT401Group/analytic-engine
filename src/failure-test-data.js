import RLAdapter from './rl-adapater';
import Fiber from 'fibers';

// This will be the main executable.
function main() {
  (new RLAdapter).train(
    new Date(Date.UTC(2016, 9, 10, 11, 1, 0)),
    new Date(Date.UTC(2016, 9, 26, 11, 26, 0))
  );
}

// Here we run the main executable.
// This makes javascript synchronous instead of the asynchronous.
Fiber(main).run();
