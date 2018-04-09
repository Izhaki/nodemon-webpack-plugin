import * as R from 'ramda';
import { defineSupportCode } from 'cucumber';

const ONE_SECOND = 1000;
const STEP_TIME_OUT = 10 * ONE_SECOND;
const WAIT_TIMEOUT = STEP_TIME_OUT - ONE_SECOND;

defineSupportCode(({ Before, setDefaultTimeout }) => {
  Before(() => {
    setDefaultTimeout(STEP_TIME_OUT);
  });

  Before(function () {
    this.waitForOutputToContain = (text) => {
      const { output } = this;
      return new Promise((resolve, reject) => {
        /* eslint-disable no-use-before-define */
        const intervalID = setInterval(checkOutput, ONE_SECOND);
        setTimeout(onTimeout, WAIT_TIMEOUT);
        /* eslint-enable no-use-before-define */

        function checkOutput() {
          // Note that we shift the output array here.
          const getNextOutputBlock = () => R.defaultTo('', output.shift());

          let isFound = false;

          do {
            isFound = R.contains(text, getNextOutputBlock());
          } while (!isFound && !R.isEmpty(output));

          if (isFound) {
            clearInterval(intervalID);
            resolve();
          }
        }

        function onTimeout() {
          clearInterval(intervalID);
          reject(new Error('Timeout!'));
        }
      });
    };
  });
});
