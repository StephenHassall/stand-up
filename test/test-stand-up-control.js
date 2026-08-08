/**
 * Test Stand Up Control.
 */
import { StandUpControl } from "../web-dev/stand-up-control.js";
import { StandUpData } from "../web-dev/stand-up-data.js";
import Test from "./test.js";

export default class TestStandUpControl {
    /**
     * Run all the stand up control tests.
     */
    static run() {
        // Set test
        Test.test('StandUpControl');

        // Perform tests
        TestStandUpControl.testCheckSwitch();
        TestStandUpControl.testCheckFixedOne();
        TestStandUpControl.testCheckFixedTwo();
        TestStandUpControl.testSwitchProgressPercentage();
        TestStandUpControl.testFixedProgressPercentageOne();
        TestStandUpControl.testFixedProgressPercentageTwo();
    }

    /**
     * Tick/switch flags
     */
    static _tickFlag = false;
    static _switchFlag = false;

    /**
     * Test check switch.
     */
    static testCheckSwitch() {
        // Set test name
        Test.describe('check switch');

        // Set stand up data
        StandUpData.timerType = 0;
        StandUpData.sitTime = 2;
        StandUpData.standTime = 1;
        StandUpData.currentSit = 120;
        StandUpData.currentStand = 60;
        StandUpData.standing = false;

        // Add events
        StandUpControl.addEventListener('tick', TestStandUpControl._tickEvent);
        StandUpControl.addEventListener('switch', TestStandUpControl._switchEvent);

        // The function StandUpContol._checkSwitch() is called every second and will fire
        // tick, and when needed switch events. Here we fake this happening to make sure
        // it works as required.

        // Sit for 119 seconds
        for (let count = 0; count < 119; count++) {
            // Reset the flags
            TestStandUpControl._tickFlag = false;
            TestStandUpControl._switchFlag = false;

            // Call the check switch function
            StandUpControl._checkSwitch();

            // Test flags
            Test.assertEqual(TestStandUpControl._tickFlag, true);
            Test.assertEqual(TestStandUpControl._switchFlag, false);
            Test.assertEqual(StandUpData.standing, false);
        }

        // The next call should switch from standing to sitting

        // Reset the flags
        TestStandUpControl._tickFlag = false;
        TestStandUpControl._switchFlag = false;

        // Call the check switch function
        StandUpControl._checkSwitch();

        // Test flags
        Test.assertEqual(TestStandUpControl._tickFlag, true);
        Test.assertEqual(TestStandUpControl._switchFlag, true);
        Test.assertEqual(StandUpData.standing, true);

        // Stand for 59 seconds
        for (let count = 0; count < 59; count++) {
            // Reset the flags
            TestStandUpControl._tickFlag = false;
            TestStandUpControl._switchFlag = false;

            // Call the check switch function
            StandUpControl._checkSwitch();

            // Test flags
            Test.assertEqual(TestStandUpControl._tickFlag, true);
            Test.assertEqual(TestStandUpControl._switchFlag, false);
            Test.assertEqual(StandUpData.standing, true);
        }

        // The next call should switch from sitting to standing

        // Reset the flags
        TestStandUpControl._tickFlag = false;
        TestStandUpControl._switchFlag = false;

        // Call the check switch function
        StandUpControl._checkSwitch();

        // Test flags
        Test.assertEqual(TestStandUpControl._tickFlag, true);
        Test.assertEqual(TestStandUpControl._switchFlag, true);
        Test.assertEqual(StandUpData.standing, false);

        // Sit for 119 seconds (again)
        for (let count = 0; count < 119; count++) {
            // Reset the flags
            TestStandUpControl._tickFlag = false;
            TestStandUpControl._switchFlag = false;

            // Call the check switch function
            StandUpControl._checkSwitch();

            // Test flags
            Test.assertEqual(TestStandUpControl._tickFlag, true);
            Test.assertEqual(TestStandUpControl._switchFlag, false);
            Test.assertEqual(StandUpData.standing, false);
        }

        // The next call should switch from standing to sitting (again)

        // Reset the flags
        TestStandUpControl._tickFlag = false;
        TestStandUpControl._switchFlag = false;

        // Call the check switch function
        StandUpControl._checkSwitch();

        // Test flags
        Test.assertEqual(TestStandUpControl._tickFlag, true);
        Test.assertEqual(TestStandUpControl._switchFlag, true);
        Test.assertEqual(StandUpData.standing, true);

        // Remove events
        StandUpControl.removeEventListener('tick', TestStandUpControl._tickEvent);
        StandUpControl.removeEventListener('switch', TestStandUpControl._switchEvent);
    }

    /**
     * Test check fixed (one fixed stand).
     */
    static testCheckFixedOne() {
        // Set test name
        Test.describe('check fixed one');

        // |--18 hours--|2h|--4 hours--|

        // Set stand up data
        StandUpData.timerType = 1;
        StandUpData.standTime = 120;
        StandUpData.fixedStandList = [
            new Date(2000,0,1,18,0,0)
        ];
        StandUpData.standing = false;

        // Add events
        StandUpControl.addEventListener('tick', TestStandUpControl._tickEvent);
        StandUpControl.addEventListener('switch', TestStandUpControl._switchEvent);

        // The function StandUpContol._checkFixed(now) is called every second and will fire
        // tick, and when needed switch events. Here we fake this happening to make sure
        // it works as required.

        // From 00:00:00 to 17:59:59 (sitting)
        for (let hour = 0; hour <= 17; hour++) {
            for (let minute = 0; minute <= 59; minute++) {
                for (let second = 0; second <= 59; second++) {
                    // Create date with time
                    const now = new Date(2000, 0, 1, hour, minute, second);

                    // Reset the flags
                    TestStandUpControl._tickFlag = false;
                    TestStandUpControl._switchFlag = false;

                    // Call the check fixed function
                    StandUpControl._checkFixed(now);

                    // Test flags
                    Test.assertEqual(TestStandUpControl._tickFlag, true);
                    Test.assertEqual(TestStandUpControl._switchFlag, false);
                    Test.assertEqual(StandUpData.standing, false);
                }
            }
        }

        // The next call should switch from sitting to standing

        // Reset the flags
        TestStandUpControl._tickFlag = false;
        TestStandUpControl._switchFlag = false;

        // Create date with time
        let now = new Date(2000, 0, 1, 18, 0, 0);

        // Call the check switch function
        StandUpControl._checkSwitch(now);

        // Test flags
        Test.assertEqual(TestStandUpControl._tickFlag, true);
        Test.assertEqual(TestStandUpControl._switchFlag, true);
        Test.assertEqual(StandUpData.standing, true);

        // Set add second
        let secondStart = 1;

        // From 18:00:01 to 19:59:59 (standing)
        for (let hour = 18; hour <= 19; hour++) {
            for (let minute = 0; minute <= 59; minute++) {
                for (let second = secondStart; second <= 59; second++) {
                    // Create date with time
                    const now = new Date(2000, 0, 1, hour, minute, second);

                    // Reset second start
                    secondStart = 0;

                    // Reset the flags
                    TestStandUpControl._tickFlag = false;
                    TestStandUpControl._switchFlag = false;

                    // Call the check fixed function
                    StandUpControl._checkFixed(now);

                    // Test flags
                    Test.assertEqual(TestStandUpControl._tickFlag, true);
                    Test.assertEqual(TestStandUpControl._switchFlag, false);
                    Test.assertEqual(StandUpData.standing, true);
                }
            }
        }

        // The next call should switch from standing to sitting

        // Reset the flags
        TestStandUpControl._tickFlag = false;
        TestStandUpControl._switchFlag = false;

        // Create date with time
        now = new Date(2000, 0, 1, 20, 0, 0);

        // Call the check switch function
        StandUpControl._checkSwitch(now);

        // Test flags
        Test.assertEqual(TestStandUpControl._tickFlag, true);
        Test.assertEqual(TestStandUpControl._switchFlag, true);
        Test.assertEqual(StandUpData.standing, false);

        // Set add second
        secondStart = 1;

        // From 20:00:01 to 23:59:59 (sitting)
        for (let hour = 20; hour <= 23; hour++) {
            for (let minute = 0; minute <= 59; minute++) {
                for (let second = secondStart; second <= 59; second++) {
                    // Create date with time
                    const now = new Date(2000, 0, 1, hour, minute, second);

                    // Reset second start
                    secondStart = 0;

                    // Reset the flags
                    TestStandUpControl._tickFlag = false;
                    TestStandUpControl._switchFlag = false;

                    // Call the check fixed function
                    StandUpControl._checkFixed(now);

                    // Test flags
                    Test.assertEqual(TestStandUpControl._tickFlag, true);
                    Test.assertEqual(TestStandUpControl._switchFlag, false);
                    Test.assertEqual(StandUpData.standing, false);
                }
            }
        }

        // Remove events
        StandUpControl.removeEventListener('tick', TestStandUpControl._tickEvent);
        StandUpControl.removeEventListener('switch', TestStandUpControl._switchEvent);
    }

    /**
     * Test check fixed (two fixed stands).
     */
    static testCheckFixedTwo() {
        // Set test name
        Test.describe('check fixed two');

        // |--6 hours--|1h|--12 hours--|1h|--4 hours--|
        // 00:00:00 to 05:59:59 - sitting
        // 06:00:00 to 06:59:59 - standing
        // 07:00:00 to 18:59:59 - sitting
        // 19:00:00 to 19:59:59 - standing
        // 20:00:00 to 23:59:59 - sitting

        // Set stand up data
        StandUpData.timerType = 1;
        StandUpData.standTime = 60;
        StandUpData.fixedStandList = [
            new Date(2000,0,1,6,0,0),
            new Date(2000,0,1,19,0,0)
        ];
        StandUpData.standing = false;

        // Add events
        StandUpControl.addEventListener('tick', TestStandUpControl._tickEvent);
        StandUpControl.addEventListener('switch', TestStandUpControl._switchEvent);

        // The function StandUpContol._checkFixed(now) is called every second and will fire
        // tick, and when needed switch events. Here we fake this happening to make sure
        // it works as required.

        // From 00:00:00 to 05:59:59 (sitting)
        for (let hour = 0; hour <= 5; hour++) {
            for (let minute = 0; minute <= 59; minute++) {
                for (let second = 0; second <= 59; second++) {
                    // Create date with time
                    const now = new Date(2000, 0, 1, hour, minute, second);

                    // Reset the flags
                    TestStandUpControl._tickFlag = false;
                    TestStandUpControl._switchFlag = false;

                    // Call the check fixed function
                    StandUpControl._checkFixed(now);

                    // Test flags
                    Test.assertEqual(TestStandUpControl._tickFlag, true);
                    Test.assertEqual(TestStandUpControl._switchFlag, false);
                    Test.assertEqual(StandUpData.standing, false);
                }
            }
        }

        // The next call should switch from sitting to standing

        // Reset the flags
        TestStandUpControl._tickFlag = false;
        TestStandUpControl._switchFlag = false;

        // Create date with time
        let now = new Date(2000, 0, 1, 6, 0, 0);

        // Call the check switch function
        StandUpControl._checkSwitch(now);

        // Test flags
        Test.assertEqual(TestStandUpControl._tickFlag, true);
        Test.assertEqual(TestStandUpControl._switchFlag, true);
        Test.assertEqual(StandUpData.standing, true);

        // Set add second
        let secondStart = 1;

        // From 06:00:01 to 06:59:59 (standing)
        for (let hour = 6; hour <= 6; hour++) {
            for (let minute = 0; minute <= 59; minute++) {
                for (let second = secondStart; second <= 59; second++) {
                    // Create date with time
                    const now = new Date(2000, 0, 1, hour, minute, second);

                    // Reset second start
                    secondStart = 0;

                    // Reset the flags
                    TestStandUpControl._tickFlag = false;
                    TestStandUpControl._switchFlag = false;

                    // Call the check fixed function
                    StandUpControl._checkFixed(now);

                    // Test flags
                    Test.assertEqual(TestStandUpControl._tickFlag, true);
                    Test.assertEqual(TestStandUpControl._switchFlag, false);
                    Test.assertEqual(StandUpData.standing, true);
                }
            }
        }

        // The next call should switch from standing to sitting

        // Reset the flags
        TestStandUpControl._tickFlag = false;
        TestStandUpControl._switchFlag = false;

        // Create date with time
        now = new Date(2000, 0, 1, 7, 0, 0);

        // Call the check switch function
        StandUpControl._checkSwitch(now);

        // Test flags
        Test.assertEqual(TestStandUpControl._tickFlag, true);
        Test.assertEqual(TestStandUpControl._switchFlag, true);
        Test.assertEqual(StandUpData.standing, false);

        // Set add second
        secondStart = 1;

        // From 07:00:01 to 18:59:59 (sitting)
        for (let hour = 7; hour <= 18; hour++) {
            for (let minute = 0; minute <= 59; minute++) {
                for (let second = secondStart; second <= 59; second++) {
                    // Create date with time
                    const now = new Date(2000, 0, 1, hour, minute, second);

                    // Reset second start
                    secondStart = 0;

                    // Reset the flags
                    TestStandUpControl._tickFlag = false;
                    TestStandUpControl._switchFlag = false;

                    // Call the check fixed function
                    StandUpControl._checkFixed(now);

                    // Test flags
                    Test.assertEqual(TestStandUpControl._tickFlag, true);
                    Test.assertEqual(TestStandUpControl._switchFlag, false);
                    Test.assertEqual(StandUpData.standing, false);
                }
            }
        }

        // The next call should switch from sitting to standing

        // Reset the flags
        TestStandUpControl._tickFlag = false;
        TestStandUpControl._switchFlag = false;

        // Create date with time
        now = new Date(2000, 0, 1, 19, 0, 0);

        // Call the check switch function
        StandUpControl._checkSwitch(now);

        // Test flags
        Test.assertEqual(TestStandUpControl._tickFlag, true);
        Test.assertEqual(TestStandUpControl._switchFlag, true);
        Test.assertEqual(StandUpData.standing, true);

        // Set add second
        secondStart = 1;

        // From 19:00:01 to 19:59:59 (standing)
        for (let hour = 19; hour <= 19; hour++) {
            for (let minute = 0; minute <= 59; minute++) {
                for (let second = secondStart; second <= 59; second++) {
                    // Create date with time
                    const now = new Date(2000, 0, 1, hour, minute, second);

                    // Reset second start
                    secondStart = 0;

                    // Reset the flags
                    TestStandUpControl._tickFlag = false;
                    TestStandUpControl._switchFlag = false;

                    // Call the check fixed function
                    StandUpControl._checkFixed(now);

                    // Test flags
                    Test.assertEqual(TestStandUpControl._tickFlag, true);
                    Test.assertEqual(TestStandUpControl._switchFlag, false);
                    Test.assertEqual(StandUpData.standing, true);
                }
            }
        }

        // The next call should switch from standing to sitting

        // Reset the flags
        TestStandUpControl._tickFlag = false;
        TestStandUpControl._switchFlag = false;

        // Create date with time
        now = new Date(2000, 0, 1, 20, 0, 0);

        // Call the check switch function
        StandUpControl._checkSwitch(now);

        // Test flags
        Test.assertEqual(TestStandUpControl._tickFlag, true);
        Test.assertEqual(TestStandUpControl._switchFlag, true);
        Test.assertEqual(StandUpData.standing, false);

        // Set add second
        secondStart = 1;

        // From 20:00:01 to 23:59:59 (standing)
        for (let hour = 20; hour <= 23; hour++) {
            for (let minute = 0; minute <= 59; minute++) {
                for (let second = secondStart; second <= 59; second++) {
                    // Create date with time
                    const now = new Date(2000, 0, 1, hour, minute, second);

                    // Reset second start
                    secondStart = 0;

                    // Reset the flags
                    TestStandUpControl._tickFlag = false;
                    TestStandUpControl._switchFlag = false;

                    // Call the check fixed function
                    StandUpControl._checkFixed(now);

                    // Test flags
                    Test.assertEqual(TestStandUpControl._tickFlag, true);
                    Test.assertEqual(TestStandUpControl._switchFlag, false);
                    Test.assertEqual(StandUpData.standing, false);
                }
            }
        }

        // Remove events
        StandUpControl.removeEventListener('tick', TestStandUpControl._tickEvent);
        StandUpControl.removeEventListener('switch', TestStandUpControl._switchEvent);
    }

    /**
     * Test switch progress percentage.
     */
    static testSwitchProgressPercentage() {
        // Set test name
        Test.describe('switch progress percentage');

        // Set stand up data
        StandUpData.timerType = 0;
        StandUpData.sitTime = 2;
        StandUpData.standTime = 1;
        StandUpData.currentSit = 120;
        StandUpData.currentStand = 60;
        StandUpData.standing = false;

        // Perform all the different tests

        // Sitting
        StandUpControl._workoutProgressPercentage();
        Test.assertEqual(StandUpData.progressPercentage, 0);
        StandUpData.currentSit = 90;
        StandUpControl._workoutProgressPercentage();
        Test.assertEqual(StandUpData.progressPercentage, 25);
        StandUpData.currentSit = 60;
        StandUpControl._workoutProgressPercentage();
        Test.assertEqual(StandUpData.progressPercentage, 50);
        StandUpData.currentSit = 30;
        StandUpControl._workoutProgressPercentage();
        Test.assertEqual(StandUpData.progressPercentage, 75);
        StandUpData.currentSit = 0;
        StandUpControl._workoutProgressPercentage();
        Test.assertEqual(StandUpData.progressPercentage, 100);

        // Standing
        StandUpData.currentSit = 120;
        StandUpData.standing = true;
        StandUpControl._workoutProgressPercentage();
        Test.assertEqual(StandUpData.progressPercentage, 0);
        StandUpData.currentStand = 45;
        StandUpControl._workoutProgressPercentage();
        Test.assertEqual(StandUpData.progressPercentage, 25);
        StandUpData.currentStand = 30;
        StandUpControl._workoutProgressPercentage();
        Test.assertEqual(StandUpData.progressPercentage, 50);
        StandUpData.currentStand = 15;
        StandUpControl._workoutProgressPercentage();
        Test.assertEqual(StandUpData.progressPercentage, 75);
        StandUpData.currentStand = 0;
        StandUpControl._workoutProgressPercentage();
        Test.assertEqual(StandUpData.progressPercentage, 100);
    }

    /**
     * Test fixed progress percentage (one fixed stand).
     */
    static testFixedProgressPercentageOne() {
        // Set test name
        Test.describe('fixed progress percentage one');

        // |--18 hours--|2h|--4 hours--|

        // Set stand up data
        StandUpData.timerType = 1;
        StandUpData.standTime = 120;
        StandUpData.fixedStandList = [
            new Date(2000,0,1,18,0,0)
        ];
        StandUpData.standing = true;

        // Perform all the different tests

        // Before 00:00 => (4 + 0) / (18 + 4) = 14400 / 79200 = 0.1818
        let now = new Date(2000,0,1,0,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, (4 + 0) / (4 + 18) * 100);

        // Before 02:00 => (4 + 2) / (4 + 18) = 28800 / 79200 = 0.2727
        now = new Date(2000,0,1,2,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, (4 + 2) / (4 + 18) * 100);

        // Before 17:00 => (4 + 17) / (4 + 18) = 75600 / 79200 = 0.9545
        now = new Date(2000,0,1,17,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, (4 + 17) / (4 + 18) * 100);

        // First 18:00 => start of first = 0
        now = new Date(2000,0,1,18,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 0);

        // First 18:30 => near start of first = 0.25
        now = new Date(2000,0,1,18,30,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 25);

        // First 19:00 => middle of first = 0.5
        now = new Date(2000,0,1,19,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 50);

        // First 19:30 => near end of first = 0.75
        now = new Date(2000,0,1,19,30,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 75);

        // After 20:00 => 0 / (4 + 18) = 0 / 79200 = 0.0
        now = new Date(2000,0,1,20,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 0 / (4 + 18) * 100);

        // After 21:00 => 1 / (4 + 18) = 3600 / 79200 = 0.04545
        now = new Date(2000,0,1,21,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 1 / (4 + 18) * 100);

        // After 22:00 => 2 / (4 + 18) = 7200 / 79200 = 0.0909
        now = new Date(2000,0,1,22,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 2 / (4 + 18) * 100);

        // After 23:00 => 3 / (4 + 18) = 10800 / 79200 = 0.1363
        now = new Date(2000,0,1,23,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 3 / (4 + 18) * 100);
    }

    /**
     * Test fixed progress percentage (two fixed stands).
     */
    static testFixedProgressPercentageTwo() {
        // Set test name
        Test.describe('fixed progress percentage two');

        // |--6 hours--|1h|--12 hours--|1h|--4 hours--|

        // Set stand up data
        StandUpData.timerType = 1;
        StandUpData.standTime = 60;
        StandUpData.fixedStandList = [
            new Date(2000,0,1,6,0,0),
            new Date(2000,0,1,19,0,0)
        ];
        StandUpData.standing = true;

        // Perform all the different tests

        // Before 00:00 => (4 + 0) / (4 + 6) = 14400 / 3600 = 0.4
        let now = new Date(2000,0,1,0,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, (4 + 0) / (4 + 6) * 100);

        // Before 02:00 => (4 + 2) / (4 + 6) = 21600 / 3600 = 0.6
        now = new Date(2000,0,1,2,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, (4 + 2) / (4 + 6) * 100);

        // Before 03:00 => (4 + 3) / (4 + 6) = 25200 / 3600 = 0.7
        now = new Date(2000,0,1,3,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, (4 + 3) / (4 + 6) * 100);

        // Before 04:00 => (4 + 4) / (4 + 6) = 28800 / 3600 = 0.8
        now = new Date(2000,0,1,4,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, (4 + 4) / (4 + 6) * 100);

        // Before 05:00 => (4 + 5) / (4 + 6) = 32400 / 3600 = 0.9
        now = new Date(2000,0,1,5,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, (4 + 5) / (4 + 6) * 100);

        // First 04:00 => start of first = 0
        now = new Date(2000,0,1,6,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 0);

        // First 04:15 => near start of first = 0.25
        now = new Date(2000,0,1,6,15,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 25);

        // First 04:30 => middle of first = 0.5
        now = new Date(2000,0,1,6,30,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 50);

        // First 04:45 => near end of first = 0.75
        now = new Date(2000,0,1,6,45,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 75);

        // After first 07:00 => 0 / 12 = 0 / 43200 = 0
        now = new Date(2000,0,1,7,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 0 / 12 * 100);

        // After first 08:00 => 1 / 12 = 3600 / 43200 = 0.0833
        now = new Date(2000,0,1,8,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 1 / 12 * 100);

        // After first 09:00 => 2 / 12 = 7200 / 43200 = 0.166
        now = new Date(2000,0,1,9,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 2 / 12 * 100);

        // After first 10:00 => 3 / 12 = 10800 / 43200 = 0.25
        now = new Date(2000,0,1,10,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 3 / 12 * 100);

        // After first 11:00 => 4 / 12 = 14400 / 43200 = 0.3333
        now = new Date(2000,0,1,11,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 4 / 12 * 100);

        // After first 12:00 => 5 / 12 = 18000 / 43200 = 0.4166
        now = new Date(2000,0,1,12,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 5 / 12 * 100);

        // After first 13:00 => 6 / 12 = 21600 / 43200 = 0.5
        now = new Date(2000,0,1,13,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 6 / 12 * 100);

        // After first 14:00 => 7 / 12 = 25200 / 43200 = 0.5833
        now = new Date(2000,0,1,14,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 7 / 12 * 100);

        // After first 15:00 => 8 / 12 = 28800 / 43200 = 0.6666
        now = new Date(2000,0,1,15,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 8 / 12 * 100);

        // After first 16:00 => 9 / 12 = 32400 / 43200 = 0.75
        now = new Date(2000,0,1,16,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 9 / 12 * 100);

        // After first 17:00 => 10 / 12 = 36000 / 43200 = 0.833
        now = new Date(2000,0,1,17,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 10 / 12 * 100);

        // After first 18:00 => 11 / 12 = 36000 / 43200 = 0.9166
        now = new Date(2000,0,1,18,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 11 / 12 * 100);

        // Second 19:00 => start of second = 0;
        now = new Date(2000,0,1,19,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 0);

        // Second 19:00 => start of second = 0;
        now = new Date(2000,0,1,19,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 0);

        // Second 19:15 => near start of second = 0.25
        now = new Date(2000,0,1,19,15,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 25);

        // Second 19:30 => middle of second = 0.5
        now = new Date(2000,0,1,19,30,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 50);

        // Second 19:45 => near end of second = 0.75
        now = new Date(2000,0,1,19,45,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 75);

        // After second 20:00 => 0 / (4 + 6) = 0 / 36000 = 0
        now = new Date(2000,0,1,20,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 0 / 10 * 100);

        // After second 21:00 => 1 / (4 + 6) = 3600 / 36000 = 0.1
        now = new Date(2000,0,1,21,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 1 / 10 * 100);

        // After second 22:00 => 2 / (4 + 6) = 7200 / 36000 = 0.2
        now = new Date(2000,0,1,22,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 2 / 10 * 100);

        // After second 23:00 => 3 / (4 + 6) = 10800 / 36000 = 0.2
        now = new Date(2000,0,1,23,0,0);
        StandUpControl._workoutProgressPercentage(now);
        Test.assertEqual(StandUpData.progressPercentage, 3 / 10 * 100);
    }

    /**
     * Tick event.
     */
    static _tickEvent() {
        // Set tick flag
        TestStandUpControl._tickFlag = true;
    }

    /**
     * Switch event.
     */
    static _switchEvent() {
        // Set switch flag
        TestStandUpControl._switchFlag = true;
    }
}