import { Before, setDefaultTimeout } from 'cucumber';

const ONE_SECOND = 1000;
const STEP_TIME_OUT = 10 * ONE_SECOND;
const WAIT_TIMEOUT = STEP_TIME_OUT - ONE_SECOND;

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
        const getNextOutputBlock = () => output.shift() || '';

        let isFound = false;

        do {
          isFound = getNextOutputBlock().includes(text);
        } while (!isFound && output.length > 0);

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
