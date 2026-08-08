/**
 * Run all the tests.
 */
import Test from "./test.js";
import TestStandUpControl from "./test-stand-up-control.js";

(() => {
    // Perform tests
    TestStandUpControl.run();

    // Report results
    Test.report();
})();